import * as changeKeys from 'change-case/keys';
import { db } from '../models';
import {
  AddPlayer,
  UpdatePlayer,
  UpdatePlayerSettings,
} from '../schema/player';
import { enqueue, createMessage } from '../utils/gameLoop';
import generateRandomString from '../utils/random';
import challengeService from './challenge';
import challengeProgressService from './challenge/progress';
import ledgerService from './ledger';
import referralService from './referrals';

const REFERRAL_COIN_REWARD = 500;

async function getPlayerByUserId(userId: string) {
  const { data, error } = await db
    .from('_players')
    .select(
      `
        id,
        first_name,
        last_name,
        profile_image,
        display_name,
        _ledger (
          coin_balance
        ),
        _team_member (
          _teams (
            name,
            id
          )
        ),
        _levels (
          xp,
          xp_to_next_level,
          level,
          prestige
        ),
        _player_settings (
          is_colour_blind,
          is_hard_mode,
          is_dark_mode,
          wordle_word_length,
          is_confetti_enabled
        ),
        _streamer_settings (
          hide_name,
          hide_accounts_page,
          show_streamer_view,
          tiktok_username,
          twitch_username,
          youtube_username,
          hide_from_leaderboard
        ),
        _discord_link (
          code,
          username,
          user_id
        ),
        _referral_codes (
          referral_code
        ),
        _equipt_items (
          id,
          _items (
            id,
            name,
            type,
            rarity,
            item_image
          )
        )
      `,
    )
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.log(error);
    return {};
  }

  const {
    data: { user },
  } = await db.auth.admin.getUserById(userId);

  return changeKeys.camelCase(
    {
      ...data,
      email: user?.email,
    },
    10,
  );
}

async function getPublicPlayerProfileByUserId(userId: string) {
  const { data: migrate } = await db
    .from('profiles')
    .select('has_migrated')
    .eq('user_id', userId)
    .maybeSingle();

  if (migrate?.has_migrated === false)
    return {
      hasMigrated: migrate.has_migrated,
    };

  const { data, error } = await db
    .from('_players')
    .select(
      `
        id,
        display_name,
        profile_image,
        _ledger (
          coin_balance
        ),
        _levels (
          xp,
          xp_to_next_level,
          level,
          prestige
        ),
        _referral_codes (
          referral_code
        ),
        _streamer_settings (
          tiktok_username,
          twitch_username,
          youtube_username
        ),
        _discord_link (
          username
        ),
        _purchased_items (
          _items (
            name,
            type,
            rarity
          )
        ),
        _equipt_items (
          _items (
            id,
            type,
            rarity
          )
        ),
        _team_member (
          _teams (
            name,
            id
          )
        )
      `,
    )
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    if (error) console.log(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function getPublicPlayerProfileByUsername(username: string) {
  const { data, error } = await db
    .from('_players')
    .select(
      `
        id,
        display_name,
        profile_image,
        _ledger (
          coin_balance
        ),
        _levels (
          xp,
          xp_to_next_level,
          level,
          prestige
        ),
        _team_member (
          _teams (
            name,
            id
          )
        ),
        _referral_codes (
          referral_code
        ),
        _streamer_settings (
          tiktok_username,
          twitch_username,
          youtube_username
        ),
        _discord_link (
          username
        ),
        _purchased_items (
          _items (
            name,
            type,
            rarity
          )
        )
      `,
    )
    .eq('display_name', username)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data, 10);
}

async function addPlayer(userId: string, body: AddPlayer) {
  const { role, username, referralCode, ...player } = body;
  const { error: playerError } = await db
    .from('_players')
    .insert(
      changeKeys.snakeCase({
        id: userId,
        ...player,
        username: username.toLowerCase().replace(/ /g, ''),
        displayName: username,
      }),
    )
    .select('id')
    .maybeSingle();

  await db.auth.admin.updateUserById(userId, {
    user_metadata: {
      role: 'PLAYER',
    },
  });

  const { error: ledgerError } = await db.from('_ledger').insert(
    changeKeys.snakeCase({
      player: userId,
      coinBalance: 0,
    }),
  );
  const { error: levelsError } = await db.from('_levels').insert(
    changeKeys.snakeCase({
      player: userId,
    }),
  );
  const { error: settingsError } = await db.from('_player_settings').insert(
    changeKeys.snakeCase({
      player: userId,
    }),
  );
  const { error: referralCodeError } = await db.from('_referral_codes').insert(
    changeKeys.snakeCase({
      player: userId,
      referralCode: generateRandomString(8),
    }),
  );

  const { error: wordleSavedStateError } = await db
    .from('_wordle_saved_state')
    .insert(
      changeKeys.snakeCase({
        player: userId,
      }),
    );

  const { error: uiSavedStateError } = await db.from('_ui_saved_state').insert(
    changeKeys.snakeCase({
      player: userId,
    }),
  );

  const { error: discordLinkError } = await db.from('_discord_link').insert(
    changeKeys.snakeCase({
      player: userId,
      code: generateRandomString(12),
    }),
  );

  const challenges = await challengeService.getAllChallenges();
  for (let i = 0; i < challenges.length; i++) {
    const challenge = challenges[i];
    await challengeProgressService.insertChallengeProgress({
      playerId: userId,
      challengeId: challenge.id,
      status:
        challenge.unlocksAtLevel === 1 && challenge.coinsToUnlock === 0
          ? 'UNLOCKED'
          : 'LOCKED',
      progress: 0,
    });
  }

  const gameModes = ['DAILY', 'INFINITE'];
  const wordPacks = [
    'FOUR_LETTER',
    'FIVE_LETTER',
    'SIX_LETTER',
    'SEVEN_LETTER',
    'EIGHT_LETTER',
    'NINE_LETTER',
    'TEN_LETTER',
    'ELEVEN_LETTER',
    'TWELVE_LETTER',
    'THIRTEEN_LETTER',
    'FOURTEEN_LETTER',
    'FIFTEEN_LETTER',
    'SIXTEEN_LETTER',
    'SEVENTEEN_LETTER',
    'EIGHTEEN_LETTER',
    'NINETEEN_LETTER',
    'TWENTY_LETTER',
    'TWENTYONE_LETTER',
    'TWENTYTWO_LETTER',
  ];
  for (let i = 0; i < gameModes.length; i++) {
    for (let j = 0; j < wordPacks.length; j++) {
      await db.from('_wordle_streak').insert({
        player: userId,
        type: gameModes[i],
        word_pack: wordPacks[j],
      });
    }
  }

  if (
    playerError ||
    ledgerError ||
    levelsError ||
    settingsError ||
    referralCodeError ||
    wordleSavedStateError ||
    uiSavedStateError ||
    discordLinkError
  ) {
    console.error(
      playerError,
      ledgerError,
      levelsError,
      settingsError,
      wordleSavedStateError,
      uiSavedStateError,
      discordLinkError,
    );
    return {};
  }

  if (referralCode) {
    const referrer = await referralService.getReferralByCode(referralCode);
    await ledgerService.changeBalance(
      referrer.player.id,
      'up',
      REFERRAL_COIN_REWARD,
    );
  }

  await enqueue([
    createMessage('NEW_PLAYER_SIGN_UP', {
      userId,
    }),
  ]);

  return await getPlayerByUserId(userId);
}

async function regenerateReferralCode(userId: string) {
  const { data, error } = await db
    .from('_referral_codes')
    .update(
      changeKeys.snakeCase({
        referralCode: generateRandomString(8),
      }),
    )
    .eq('player', userId)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return await getPlayerByUserId(userId);
}

async function updatePlayer(userId: string, player: UpdatePlayer) {
  const { username, ...body } = player;

  if (username) {
    const playerExists = await getPublicPlayerProfileByUsername(username);
    if (playerExists) return {};

    const { data, error } = await db
      .from('_players')
      .update(
        changeKeys.snakeCase({
          username: username.toLowerCase().replace(/ /g, ''),
          displayName: username,
        }),
      )
      .eq('id', userId)
      .select('id')
      .maybeSingle();

    if (error) {
      console.error(error);
      return {};
    }

    return changeKeys.camelCase(data);
  }

  const { data, error } = await db
    .from('_players')
    .update(changeKeys.snakeCase(body))
    .eq('id', userId)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  if (body?.email) {
    const { data: user } = await db.auth.admin.updateUserById(userId, {
      email: body.email,
    });
  }

  // if (body?.profileImage) {
  //   const { data: user, error } = await db.auth.admin.updateUserById(userId, {
  //     user_metadata: { profileImage: data.profileImage },
  //   });
  // }

  return changeKeys.camelCase(data);
}

async function updatePlayerSettings(
  userId: string,
  body: UpdatePlayerSettings,
) {
  const { data, error } = await db
    .from('_player_settings')
    .update(changeKeys.snakeCase(body))
    .eq('player', userId)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return changeKeys.camelCase(data);
}

async function deletePlayer(userId: string) {
  const { data, error } = await db.from('_players').delete().eq('id', userId);

  if (error) {
    console.error(error);
    return {};
  }

  const { data: authData, authError } = await db.auth.admin.deleteUser(userId);

  if (authError) {
    console.error(authError);
    return {};
  }

  return authData;
}

async function migratePlayer(userId: string) {
  const { data: profileData, error: profileError } = await db
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (profileError) {
    console.error(profileError);
    return {};
  }

  if (profileData?.has_migrated) {
    return await getPlayerByUserId(userId);
  }

  const { data: ledgerData, error: ledgerError } = await db
    .from('ledger')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (ledgerError) {
    console.error(ledgerError);
    return {};
  }

  const { data: wordleSettingsData, error: wordleSettingError } = await db
    .from('wordle_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (wordleSettingError) {
    console.error(wordleSettingError);
    return {};
  }

  const { error: migratedProfileError } = await db
    .from('_players')
    .insert(
      changeKeys.snakeCase({
        id: userId,
        firstName: profileData.firstname,
        lastName: profileData.lastname,
        displayName: profileData.username,
        username: profileData.sanitized_username,
        profileImage: profileData.profile_image,
      }),
    )
    .select('id')
    .maybeSingle();

  if (migratedProfileError) {
    console.error(migratedProfileError);
    await deletePlayer(userId);
    return {};
  }

  const { error: migratedReferralError } = await db
    .from('_referral_codes')
    .insert(
      changeKeys.snakeCase({
        player: userId,
        referralCode: generateRandomString(8),
      }),
    )
    .select('id')
    .maybeSingle();

  if (migratedReferralError) {
    console.error(migratedReferralError);
    await deletePlayer(userId);
    return {};
  }

  const { error: migratedLedgerError } = await db
    .from('_ledger')
    .insert(
      changeKeys.snakeCase({
        player: userId,
        coinBalance: ledgerData.coin_count || 0,
      }),
    )
    .select('id')
    .maybeSingle();

  if (migratedLedgerError) {
    console.error(migratedLedgerError);
    await deletePlayer(userId);
    return {};
  }

  const { error: migratedLevelsError } = await db
    .from('_levels')
    .insert(
      changeKeys.snakeCase({
        player: userId,
        xp: profileData?.xp,
        xpToNextLevel: profileData?.xp_to_next_level,
        level: profileData?.level,
      }),
    )
    .select('id')
    .maybeSingle();

  if (migratedLevelsError) {
    console.error(migratedLevelsError);
    await deletePlayer(userId);
    return {};
  }

  await db
    .from('_ui_saved_state')
    .insert({
      player: userId,
    })
    .select('id')
    .maybeSingle();

  await db
    .from('_wordle_saved_state')
    .insert({
      player: userId,
    })
    .select('id')
    .maybeSingle();

  const { error: migratedWordleSettingsError } = await db
    .from('_player_settings')
    .insert(
      changeKeys.snakeCase({
        player: userId,
        isColourBlind: wordleSettingsData.is_colour_blind,
        isHardMode: wordleSettingsData.is_hard_mode,
        isDarkMode: wordleSettingsData.is_dark_mode,
        wordleWordLength: 5,
        isConfettiEnabled: wordleSettingsData.is_confetti_enabled,
      }),
    )
    .select('id')
    .maybeSingle();

  if (migratedWordleSettingsError) {
    console.error(migratedWordleSettingsError);
    return {};
  }

  const { error: migratedDiscordLinkError } = await db
    .from('_discord_link')
    .insert(
      changeKeys.snakeCase({
        player: userId,
        code: profileData?.discord_link_code,
      }),
    )
    .select('id')
    .maybeSingle();

  if (migratedDiscordLinkError) {
    console.error(migratedDiscordLinkError);
    await deletePlayer(userId);
    return {};
  }

  [
    'FOUR_LETTER',
    'FIVE_LETTER',
    'SIX_LETTER',
    'SEVEN_LETTER',
    'EIGHT_LETTER',
    'NINE_LETTER',
    'TEN_LETTER',
    'ELEVEN_LETTER',
    'TWELVE_LETTER',
    'THIRTEEN_LETTER',
    'FOURTEEN_LETTER',
    'FIFTEEN_LETTER',
    'SIXTEEN_LETTER',
    'SEVENTEEN_LETTER',
    'EIGHTEEN_LETTER',
    'NINETEEN_LETTER',
    'TWENTY_LETTER',
    'TWENTYONE_LETTER',
    'TWENTYTWO_LETTER',
    'TWENTYTHREE_LETTER',
  ].forEach(async (wordPack: string) => {
    await db
      .from('_wordle_streak')
      .insert({
        player: userId,
        type: 'DAILY',
        current_streak: 0,
        best_streak: 0,
        word_pack: wordPack,
      })
      .select('id')
      .maybeSingle();

    await db
      .from('_wordle_streak')
      .insert({
        player: userId,
        type: 'INFINITE',
        current_streak: 0,
        best_streak: 0,
        word_pack: wordPack,
      })
      .select('id')
      .maybeSingle();
  });

  await db
    .from('profiles')
    .update({
      has_migrated: true,
    })
    .eq('user_id', userId)
    .select('id')
    .maybeSingle();

  return await getPlayerByUserId(userId);
}

export default {
  getPlayerByUserId,
  getPublicPlayerProfileByUserId,
  getPublicPlayerProfileByUsername,
  addPlayer,
  updatePlayer,
  updatePlayerSettings,
  deletePlayer,
  migratePlayer,
};
