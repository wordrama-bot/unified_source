import * as changeKeys from 'change-case/keys';
import moment from 'moment';
import { db } from '../../../models';
import { AddGameResult, CreateCustom } from '../../../schema/game/wordle';
import { enqueue, createMessage } from '../../../utils/gameLoop';

//import playerService from '../../player';
import { awardPrestigeFrames } from '../../prestigeFrames';
import gameUtils from '../../../utils/game';

async function getLast30(
  userId: string,
  gameMode: string,
  wordPack: string,
) {
  const { data, error } = await db
    .from('_wordle_game_result')
    .select('solution, game_was_won')
    .eq('player', userId)
    .eq('type', gameMode)
    .eq('word_pack', wordPack)
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) {
    console.error(error);
    return [];
  }

  return changeKeys.camelCase(data, 10);
}

async function getCustomByShareCode(shareCode: string) {
  const { data, error } = await db
    .from('_wordle_customs')
    .select('share_code, custom_word, hint')
    .eq('share_code', shareCode)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data);
}

type RecentWordleResult = {
  id: string;
  player?: string;
  game_instance_id?: string | null;
  solution?: string;
  guesses: string[];
  game_was_won: boolean | null;
  game_was_hard_mode: boolean | null;
  guess_count: number;
  type?: string;
  word_pack?: string | null;
  share_code?: string | null;
  client_completed_at?: string | null;
};

function timestampsMatch(
  storedTimestamp?: string | null,
  submittedTimestamp?: string,
) {
  if (!storedTimestamp && !submittedTimestamp) return true;
  if (!storedTimestamp || !submittedTimestamp) return false;

  const storedTime = Date.parse(storedTimestamp);
  const submittedTime = Date.parse(submittedTimestamp);

  return (
    Number.isFinite(storedTime) &&
    Number.isFinite(submittedTime) &&
    storedTime === submittedTime
  );
}

function isMatchingWordleResult(
  result: RecentWordleResult,
  userId: string,
  body: AddGameResult,
  gameWasWon: boolean,
  guessCount: number,
) {
  return (
    result.player === userId &&
    (!body.gameInstanceId ||
      result.game_instance_id === body.gameInstanceId) &&
    result.solution === body.solution &&
    result.game_was_won === gameWasWon &&
    result.game_was_hard_mode === body.gameWasHardMode &&
    result.guess_count === guessCount &&
    result.type === body.type &&
    result.word_pack === body.wordPack &&
    (result.share_code ?? '') === (body.shareCode ?? '') &&
    JSON.stringify(result.guesses) === JSON.stringify(body.guesses) &&
    timestampsMatch(
      result.client_completed_at,
      body.clientCompletedAt,
    )
  );
}

type WordleResultAcknowledgement = {
  resultId?: string;
  duplicate?: boolean;
  duplicateInstance?: boolean;
  existingResultId?: string;
};

// The RPC commits XP, coins, custom count, streak and the completion marker
// together. On failure, keep the result in the client's durable outbox.
async function finishWordleResult(
  userId: string,
  resultId: string,
  acknowledgement: Omit<WordleResultAcknowledgement, 'resultId'> = {},
): Promise<WordleResultAcknowledgement> {
  const { data, error } = await db.rpc('finalize_wordle_result', {
    p_player: userId,
    p_result_id: resultId,
  });
  if (error || data?.completed !== true) {
    console.error('[wordle] result effects pending; retaining outbox entry', {
      resultId, error,
    });
    return {};
  }

  if (typeof data.prestige === 'number') {
    try {
      // Entitlement grants are idempotent and can be retried after a lost ack.
      await awardPrestigeFrames(userId, data.prestige);
    } catch (error) {
      console.error('[wordle] prestige rewards pending', { resultId, error });
      return {};
    }
  }

  return { ...acknowledgement, resultId };
}

async function submitWordleResult(
  userId: string, body: AddGameResult,
): Promise<WordleResultAcknowledgement> {
  const guessCount = body.guesses.length;
  const gameWasWon = body.guesses.includes(body.solution);
  const wordLength = body.solution.length;

  if (body.resultId) {
    const { data: existingResult, error: existingResultError } = await db
      .from('_wordle_game_result')
      .select(
        'id, player, game_instance_id, solution, guesses, game_was_won, game_was_hard_mode, guess_count, type, word_pack, share_code, client_completed_at'
      )
      .eq('id', body.resultId)
      .maybeSingle();

    if (existingResultError) {
      console.error(existingResultError);
      return {};
    }

    if (existingResult) {
      if (
        !isMatchingWordleResult(
          existingResult as RecentWordleResult,
          userId,
          body,
          gameWasWon,
          guessCount,
        )
      ) {
        console.warn(
          '[wordle] result id reused with mismatched payload',
          {
            resultId: body.resultId,
            userId,
          },
        );
        return {};
      }

      return finishWordleResult(userId, existingResult.id, { duplicate: true });
    }
  }

  if (!body.resultId && body.type === 'DAILY') {
    const duplicateWindowStart = new Date(
      Date.now() - 10 * 60 * 1000,
    ).toISOString();

    const { data: recentResults, error: recentResultsError } = await db
      .from('_wordle_game_result')
      .select(
        'id, guesses, game_was_won, game_was_hard_mode, guess_count',
      )
      .eq('player', userId)
      .eq('type', body.type)
      .eq('word_pack', body.wordPack)
      .eq('solution', body.solution)
      .gte('created_at', duplicateWindowStart)
      .order('created_at', { ascending: true });

    if (recentResultsError) {
      console.error(recentResultsError);
      return {};
    }

    const existingResult = (recentResults as RecentWordleResult[] | null)?.find(
      (result) =>
        result.game_was_won === gameWasWon &&
        result.game_was_hard_mode === body.gameWasHardMode &&
        result.guess_count === guessCount &&
        JSON.stringify(result.guesses) === JSON.stringify(body.guesses),
    );

    if (existingResult) {
      return finishWordleResult(userId, existingResult.id, { duplicate: true });
    }
  }

  const {
    resultId,
    gameInstanceId,
    clientCompletedAt,
    ...gameResult
  } = body;

  const { data, error } = await db
    .from('_wordle_game_result')
    .insert(
      changeKeys.snakeCase({
        ...gameResult,
        // NULL is reserved for pre-migration/legacy writers. Only this API
        // explicitly opts new results into transactional effect processing.
        effectsCompleted: false,
        ...(resultId ? { id: resultId } : {}),
        ...(gameInstanceId ? { gameInstanceId } : {}),
        ...(clientCompletedAt
          ? { clientCompletedAt }
          : {}),
        player: userId,
        guessCount,
        gameWasWon,
        day: new Date().getDate(),
        week: moment().week(),
        month: new Date().getMonth() + 1,
        year: new Date().getUTCFullYear(),
        wordLength,
      }),
    )
    .select('id')
    .maybeSingle();

  if (error) {
    if (error.code === '23505' && gameInstanceId) {
      const { data: existingInstance, error: lookupError } = await db
        .from('_wordle_game_result')
        .select(
          'id, player, game_instance_id, type, word_pack, solution, share_code'
        )
        .eq('player', userId)
        .eq('game_instance_id', gameInstanceId)
        .maybeSingle();

      if (lookupError) {
        console.error(
          '[wordle] failed to inspect duplicate game instance',
          lookupError,
        );
        return {};
      }

      if (
        existingInstance &&
        (
          existingInstance.type !== body.type ||
          existingInstance.word_pack !== body.wordPack ||
          existingInstance.solution !== body.solution ||
          (existingInstance.share_code ?? '') !== (body.shareCode ?? '')
        )
      ) {
        console.warn(
          '[wordle] game instance reused for a different game',
          { userId, gameInstanceId },
        );
        return {};
      }

      if (existingInstance && existingInstance.id !== resultId) {
        console.warn(
          '[wordle] duplicate game instance rejected',
          {
            userId,
            gameInstanceId,
            existingResultId: existingInstance.id,
            attemptedResultId: resultId,
          },
        );

        const finalized = await finishWordleResult(userId, existingInstance.id);
        if (!finalized.resultId) return {};
        return {
          resultId: resultId ?? existingInstance.id,
          duplicateInstance: true,
          existingResultId: existingInstance.id,
        };
      }
    }
    if (resultId && error.code === '23505') {
      const { data: existingResult, error: existingResultError } = await db
        .from('_wordle_game_result')
        .select(
          'id, player, game_instance_id, solution, guesses, game_was_won, game_was_hard_mode, guess_count, type, word_pack, share_code, client_completed_at'
        )
        .eq('id', resultId)
        .maybeSingle();

      if (
        !existingResultError &&
        existingResult &&
        isMatchingWordleResult(
          existingResult as RecentWordleResult,
          userId,
          body,
          gameWasWon,
          guessCount,
        )
      ) {
        return finishWordleResult(userId, existingResult.id, { duplicate: true });
      }

      console.warn(
        '[wordle] result id conflict with mismatched payload',
        {
          resultId,
          userId,
        },
      );

      return {};
    }

    console.error(error);
    return {};
  }

  if (!data?.id) {
    console.error(
      '[wordle] result insert returned no result ID',
    );
    return {};
  }

  const finalized = await finishWordleResult(userId, data.id);
  if (!finalized.resultId) return {};

  try {
    await enqueue([
      createMessage('CHECK_WORDLE_CHALLENGES', {
        userId,
        metadata: {
          guessCount,
          gameWasWon,
          wordLength,
          ...body,
        },
      }),
    ]);
  } catch (error) {
    console.warn(
      'Failed to enqueue challenge check message:',
      error instanceof Error ? error.message : String(error),
    );
  }

  return finalized;
}

async function createCustom(userId: string, body: CreateCustom) {
  const { data, error } = await db
    .from('_wordle_customs')
    .insert(
      changeKeys.snakeCase({
        player: userId,
        shareCode: gameUtils.generateWordleShareCode(),
        ...body,
      }),
    )
    .select('custom_word, hint, share_code')
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data);
}

export default {
  getCustomByShareCode,
  submitWordleResult,
  createCustom,
  getLast30,
};
