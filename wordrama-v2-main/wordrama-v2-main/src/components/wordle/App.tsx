import './App.css'

//import { getAppInsights } from '@/utils/appInsights';
import useSound from 'use-sound';
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useCallback, useEffect, useRef, useState } from 'react'
import Div100vh from 'react-div-100vh'
import { useDispatch } from 'react-redux';
import { isMobile, isTablet } from 'react-device-detect';
import { wordleWordPackConfig } from '../../lib/config';
import Link from 'next/link';
import { AlertContainer } from './components/alerts/AlertContainer'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { getAppearanceTheme } from '@/config/themes';
import { appearanceThemes } from '@/config/themes';
import { KEYBOARD_STYLES, KEYBOARD_STYLE_IDS } from '@/config/keyboardStyles';
import { InfoModal } from './components/modals/InfoModal'
import Loader, { Loading } from '../../sections/loading';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DISCOURAGE_INAPP_BROWSERS,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  WELCOME_INFO_MODAL_MS,
} from './constants/settings'
import {
  CORRECT_WORD_MESSAGE,
  DISCOURAGE_INAPP_BROWSER_TEXT,
  HARD_MODE_ALERT_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WIN_MESSAGES,
  WORD_NOT_FOUND_MESSAGE,
} from './constants/strings'
import { useAlert } from './context/AlertContext'
import {
  useGetLast30WordlesQuery,
  useGetWordleWoTDQuery,
  useGetWordleWordPackQuery,
  useGetWordleSavedStateQuery,
  useUpdateWordleSavedStateMutation,
  useGetUiSavedStateQuery,
  useUpdateUiSavedStateMutation,
  useGetWordleStreakQuery,
  useGetMyWordPacksQuery,
  useGetMyAllTimeWordleStatsByGameModeQuery,
  useGetMyAccountQuery,
  useGetMyEntitlementsQuery,
  useUpdateSettingsMutation,
  useSubmitWordleResultMutation,
} from '../../redux/api/wordrama';

import {
  getPendingWordleResults,
  queueWordleResult,
  removeWordleResult,
  type PendingWordleResult,
} from '@/lib/wordleResultOutbox';

import {
  findFirstUnusedReveal,
  getRandomWord,
  isWinningWord,
  isWordInWordList,
  localeAwareUpperCase,
  unicodeLength,
} from './lib/words'
import { getWordleState } from '../../redux/wordle/helpers';
import { getWordleGameUiState } from '@/redux/ui/helpers';
import {
  setGameMode,
  setGameState,
  setWordLength,
  setWordPack,
  setInitialState
} from '../../redux/wordle/actions';
import {
  setWordleGameUiState,
  setInitialState as setUiState,
} from '../../redux/ui/actions';
import { GameState } from '../../redux/wordle/types';
import { InitialState as UiState } from '../../redux/ui/types'
import { GamepadIcon, InfoIcon, SettingsIcon, HistoryIcon } from 'lucide-react'
import { wordleDefaultState } from '../../redux/wordle/defaultStates';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { ChartBarIcon } from '@heroicons/react/outline'
import { useTheme } from 'next-themes'
import { useAuth } from '@/providers/auth-provider';
import { showChristmas } from '@/lib/config';
import { WinCelebration } from './components/celebrations/WinCelebration';
import { GameThemeLogo } from './components/GameThemeLogo';

function guessesArePrefix(
  prefix: string[],
  complete: string[],
) {
  return (
    prefix.length <= complete.length &&
    prefix.every(
      (guess, index) => guess === complete[index],
    )
  );
}

function reconcileSavedStateWithPendingResults(
  savedState: any,
  pendingResults: PendingWordleResult[],
) {
  if (!savedState || pendingResults.length === 0) {
    return savedState;
  }

  const activeMode = savedState.gameMode;
  const activeWordPack = savedState.wordPack;

  const activeGame =
    activeMode === 'CUSTOM'
      ? savedState.custom
      : savedState.modes?.[activeMode]?.[activeWordPack];

  if (!activeGame?.solution) {
    return savedState;
  }

  const activeGuesses = activeGame.guesses || [];

  // Find the first queued completion that proves the
  // server's currently-active game was completed locally.
  const anchorIndex = pendingResults.findIndex(
    (result) =>
      result.type === activeMode &&
      result.wordPack === activeWordPack &&
      result.solution === activeGame.solution &&
      guessesArePrefix(
        activeGuesses,
        result.guesses,
      ),
  );

  if (anchorIndex < 0) {
    return savedState;
  }

  // Once we establish continuity with the stale server game,
  // advance through later locally-completed games from the
  // same mode/word pack.
  let latestResult = pendingResults[anchorIndex];

  for (
    let index = anchorIndex + 1;
    index < pendingResults.length;
    index += 1
  ) {
    const candidate = pendingResults[index];

    if (
      candidate.type !== activeMode ||
      candidate.wordPack !== activeWordPack
    ) {
      break;
    }

    latestResult = candidate;
  }

  const isGameWon =
    latestResult.guesses.includes(latestResult.solution);

  const reconciledGame = {
    ...activeGame,
    solution: latestResult.solution,
    guesses: latestResult.guesses,
    isGameInProgress: false,
    isGameWon,
    isGameLost:
      !isGameWon &&
      latestResult.guesses.length >= MAX_CHALLENGES,
    resultSave: false,
  };

  console.info(
    '[wordle] reconciled stale saved state from result outbox',
    {
      previousSolution: activeGame.solution,
      restoredSolution: latestResult.solution,
      restoredResultId: latestResult.resultId,
    },
  );

  if (activeMode === 'CUSTOM') {
    return {
      ...savedState,
      custom: {
        ...savedState.custom,
        ...reconciledGame,
      },
    };
  }

  return {
    ...savedState,
    modes: {
      ...savedState.modes,
      [activeMode]: {
        ...savedState.modes?.[activeMode],
        [activeWordPack]: reconciledGame,
      },
    },
  };
}

function App(){
  const { user } = useAuth();
  //const appInsights = getAppInsights();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } = useAlert();
  // Redux State
  const dispatch = useDispatch();
  const gameState = getWordleState();
  const gameUiState = getWordleGameUiState();

  const appearanceTheme = getAppearanceTheme(
    gameUiState?.appearanceThemeId
  );

  const gameSurfaceThemeClasses = appearanceTheme.app.gameSurface
  const gamePanelBackgroundColor = (() => {
    const backgroundClass = appearanceTheme.app.gameSurface
      .split(/\s+/)
      .find((className) => /^bg-\[#[0-9a-fA-F]{3,8}\]$/.test(className));

    return backgroundClass
      ? backgroundClass.slice(4, -1)
      : undefined;
  })();
  const gamePageBackgroundColor = (() => {
    const backgroundClass = appearanceTheme.app.background
      .split(/\s+/)
      .find((className) => /^bg-\[#[0-9a-fA-F]{3,8}\]$/.test(className));

    return backgroundClass
      ? backgroundClass.slice(4, -1)
      : undefined;
  })();
  const gameSurfaceBorderColor = (() => {
    const borderClass = appearanceTheme.app.gameSurface
      .split(/\s+/)
      .find((className) =>
        /^border-\[#[0-9a-fA-F]{3,8}\]$/.test(className)
      );

    if (borderClass) {
      return borderClass.slice(8, -1);
    }

    const namedColors: Record<string, string> = {
      'border-red-500': '#ef4444',
      'border-orange-500': '#f97316',
      'border-yellow-500': '#eab308',
      'border-purple-500': '#a855f7',
      'border-blue-500': '#3b82f6',
      'border-cyan-500': '#06b6d4',
      'border-green-500': '#22c55e',
      'border-pink-500': '#ec4899',
    };

    const namedBorder = appearanceTheme.app.gameSurface
      .split(/\s+/)
      .find((className) => namedColors[className]);

    return namedBorder
      ? namedColors[namedBorder]
      : undefined;
  })();
  const gameActionButtonThemeClasses = appearanceTheme.app.actionButton
  const pageBackgroundThemeClasses =
    appearanceTheme.app.background
  const pageTextThemeClasses =
    appearanceTheme.app.text

  const streamerMode = gameUiState.streamerModeEnabled ?? false;
  const gameSoundEnabled = gameUiState.gameSoundEnabled ?? true;
  const {
    data: myAccount,
    isLoading: isLoadingMyAccount,
    refetch: refetchProfile,
  } = useGetMyAccountQuery();
  const { data: myEntitlements } = useGetMyEntitlementsQuery();

  const activeEntitlements = myEntitlements?.data || [];

  function hasActiveEntitlement(entitlementKey: string) {
    return activeEntitlements.some((entitlement: any) => {
      if (entitlement.entitlement_key !== entitlementKey) return false;
      if (entitlement.status !== 'ACTIVE') return false;
      if (entitlement.revoked_at) return false;

      if (
        entitlement.expires_at &&
        new Date(entitlement.expires_at) <= new Date()
      ) {
        return false;
      }

      return true;
    });
  }

  function canUseAppearanceTheme(theme: any) {
    if (theme.meta.availability === 'free') return true;
    if (!theme.meta.entitlementKey) return false;

    return hasActiveEntitlement(theme.meta.entitlementKey);
  }

  function SettingsToggleLabel({
    htmlFor,
    label,
    tooltip,
  }: {
    htmlFor: string;
    label: React.ReactNode;
    tooltip: string;
  }) {
    return (
      <div className="flex items-center gap-2">
        <Label htmlFor={htmlFor} className="leading-tight">
          {label}
        </Label>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="inline-flex"
              aria-label="Setting help"
            >
              <InfoIcon className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-64 text-sm">
            {tooltip}
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  const [updateSettings] = useUpdateSettingsMutation();
  const { gameMode, wordLength, wordPack, custom } = gameState;
  const isCustom = gameMode === 'CUSTOM' && custom.solution.length > 0;
  const currentGame = isCustom ? gameState.custom : gameState.modes[gameState.gameMode][gameState.wordPack];

  const solution = isCustom ? gameState.custom.solution : gameState.modes[gameState.gameMode][gameState.wordPack].solution;
  const guesses = isCustom ? gameState.custom.guesses : gameState.modes[gameState.gameMode][gameState.wordPack].guesses;
  const isGameWon = isCustom ? gameState.custom.isGameWon : gameState.modes[gameState.gameMode][gameState.wordPack].isGameWon;
  const isGameLost = isCustom ? gameState.custom.isGameLost : gameState.modes[gameState.gameMode][gameState.wordPack].isGameLost;
  const isGameInProgress = isCustom ? gameState.custom.isGameInProgress : gameState.modes[gameState.gameMode][gameState.wordPack].isGameInProgress;

  const {
    data: last30Games,
    isLoading: isLoadingLast30Games,
    isError: isErrorLast30Games,
    refetch: refetchLast30,
  } = useGetLast30WordlesQuery(
    {
      gameMode,
      wordPack,
    },
    {
      skip: gameMode === 'CUSTOM',
    },
  );
  const { data: allTimeStats, isLoading: isLoadingAllTimeStats, refetch: refetchStats } = useGetMyAllTimeWordleStatsByGameModeQuery(gameState.gameMode);
  const wordPackAllTimeStatsMap: { [key: string]: string } = {
    FOUR_LETTER: 'fourLetter',
    FIVE_LETTER: 'fiveLetter',
    FIVE_LETTER_CRAZY: 'fiveLetterCrazy',
    SIX_LETTER: 'sixLetter',
    SEVEN_LETTER: 'sevenLetter',
    EIGHT_LETTER: 'eightLetter',
    NINE_LETTER: 'nineLetter',
    TEN_LETTER: 'tenLetter',
    ELEVEN_LETTER: 'elevenLetter',
    ELEVEN_LETTER_EXTENDED: 'elevenLetterExtended',
    TWELVE_LETTER: 'twelveLetter',
    THIRTEEN_LETTER: 'thirteenLetter',
    FOURTEEN_LETTER: 'fourteenLetter',
    FIFTEEN_LETTER: 'fifteenLetter',
    SIXTEEN_LETTER: 'sixteenLetter',
    SEVENTEEN_LETTER: 'seventeenLetter',
    EIGHTEEN_LETTER: 'eighteenLetter',
    NINETEEN_LETTER: 'nineteenLetter',
    TWENTY_LETTER: 'twentyLetter',
    TWENTYONE_LETTER: 'twentyoneLetter',
    TWENTYTWO_LETTER: 'twentytwoLetter',
    TWENTYTHREE_LETTER: 'twentythreeLetter',
  }

  const statsData = allTimeStats?.data ?? {};
  const selectedWordPackStatsKey = wordPackAllTimeStatsMap[wordPack];

  const gamesWon =
    selectedWordPackStatsKey
      ? statsData[`${selectedWordPackStatsKey}GamesWon`] ?? 0
      : statsData.gamesWon ?? 0;

  const gamesLost =
    selectedWordPackStatsKey
      ? statsData[`${selectedWordPackStatsKey}GamesLost`] ?? 0
      : statsData.gamesLost ?? 0;

  const gamesPlayed = gamesWon + gamesLost;

  const { data: myWordPacks, isLoading: isLoadingWordPacks } = useGetMyWordPacksQuery();
  const availableWordPacks = Object.keys(wordleDefaultState)?.filter((wordPack) => myWordPacks?.data.includes(wordPack));

  const [isUiHydrated, setIsUiHydrated] = useState(false);

  // API
  const {
    data: savedState,
    isLoading: isLoadingSavedState,
    isError: isErrorSavedState,
  } = useGetWordleSavedStateQuery();
  const { data: uiSavedState, isLoading: isLoadingUiSavedState } = useGetUiSavedStateQuery();
  useEffect(() => {
    if (isUiHydrated) return;
    if (isLoadingUiSavedState) return;
    if (isLoadingMyAccount) return;

    const wordleUi = uiSavedState?.data?.wordleGame;

    const accountAppearanceThemeId =
      myAccount?.data?.playerSettings?.appearanceThemeId;

    const accountKeyboardStyleId =
      myAccount?.data?.playerSettings?.keyboardStyleId;

    if (wordleUi) {
      dispatch(setWordleGameUiState({
        ...gameUiState,
        ...wordleUi,
        ...(accountAppearanceThemeId
          ? { appearanceThemeId: accountAppearanceThemeId }
          : {}),
        ...(accountKeyboardStyleId
          ? { keyboardStyleId: accountKeyboardStyleId }
          : {}),
      }));
    }

    setIsUiHydrated(true);
  }, [
    isUiHydrated,
    isLoadingUiSavedState,
    isLoadingMyAccount,
    uiSavedState,
    myAccount,
    dispatch,
  ]);

  // Keep next-themes from getting stuck in "system"
  useEffect(() => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'dark' : 'light');
    }
  }, [theme, resolvedTheme, setTheme]);

  const { data: wordleWordPack, isLoading: isLoadingWordPack, refetch: refetchWordPack  } = useGetWordleWordPackQuery(gameState.wordPack);
  const { data: wordOfTheDay, isLoading: isLoadingWoTD } = useGetWordleWoTDQuery(wordPack);
  const { data: streakData, isLoading: isLoadingStreakData, isError: isErrorStreakData, refetch: refetchStreak } = useGetWordleStreakQuery({ gameMode, wordPack });
  const { currentStreak, bestStreak } =
    (isErrorStreakData ? {
      currentStreak: 0,
      bestStreak: 0
    } : streakData?.data) || {
      currentStreak: 0,
      bestStreak: 0
    };

  const [updateRemoteState] = useUpdateWordleSavedStateMutation();
  const [updateRemoteUiState] = useUpdateUiSavedStateMutation();
  const [submitWordleResult] = useSubmitWordleResultMutation();
  const resultSyncInProgressRef = useRef(false);
  const resultSyncQueueRef =
    useRef<Promise<number>>(Promise.resolve(0));
  const resultSyncRetryTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultSyncRetryDelayRef = useRef(5_000);
  const resultFinalizationInProgressRef = useRef(false);
  const pendingReconciledStateRef = useRef<any | null>(null);
  const shouldPersistGameStateRef = useRef(false);
  const hiddenAtRef = useRef<number | null>(null);
  const gameStateSaveQueueRef = useRef<Promise<void>>(Promise.resolve());

  const [playWinSound] = useSound('/sounds/win.mp3', {
  volume: 0.05,
});

const [playWinSoundChristmas] = useSound('/sounds/christmas-win.mp3', {
  volume: 0.05,
});

const [playLoseSound] = useSound('/sounds/lost.mp3', {
  volume: 0.05,
});

const [playLoseSoundChristmas] = useSound('/sounds/christmas-lost.mp3', {
  volume: 0.2,
});

const activeSolution = isCustom
    ? gameState.custom.solution
    : gameState.modes[gameState.gameMode][gameState.wordPack].solution;

  const isLongWord = activeSolution.length >= 10;

  // Local State
  const [gameLoading, setGameLoading] = useState(true);
  const [isUpdatingRemoteState, setUpdatingRemoteState] = useState(false);
  const [currentRowClass, setCurrentRowClass] = useState('');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameStateHydrated, setIsGameStateHydrated] =
    useState(false);

  useEffect(() => {
    if (!isGameWon && !isGameLost) {
      resultFinalizationInProgressRef.current = false;
    }
  }, [solution, isGameWon, isGameLost]);

  const runPendingWordleResultSync = useCallback(async () => {
    if (!user?.id) return 0;
    if (!isGameStateHydrated) return 0;
    if (resultSyncInProgressRef.current) return 0;

    resultSyncInProgressRef.current = true;

    let syncedCount = 0;

    try {
      const reconciledState =
        pendingReconciledStateRef.current;

      if (reconciledState) {
        try {
          const {
            isLoading,
            ...remoteState
          } = reconciledState;

          await updateRemoteState(remoteState).unwrap();

          pendingReconciledStateRef.current = null;
        } catch (error) {
          console.warn(
            '[wordle] unable to save reconciled game state; continuing result sync',
            error,
          );
        }
      }

      const pendingResults =
        await getPendingWordleResults(user.id);

      for (const pendingResult of pendingResults) {
        const resultPayload = {
          resultId: pendingResult.resultId,
          clientCompletedAt: pendingResult.clientCompletedAt,
          solution: pendingResult.solution,
          guesses: pendingResult.guesses,
          gameWasHardMode: pendingResult.gameWasHardMode,
          type: pendingResult.type,
          wordPack: pendingResult.wordPack,
          ...(pendingResult.shareCode
            ? { shareCode: pendingResult.shareCode }
            : {}),
        };

        try {
          const submission = submitWordleResult(resultPayload);

          const timeoutId = window.setTimeout(() => {
            console.warn(
              '[wordle] result sync request timed out; aborting attempt',
              {
                resultId: pendingResult.resultId,
              },
            );

            submission.abort();
          }, 20_000);

          let response;

          try {
            response = await submission.unwrap();
          } finally {
            window.clearTimeout(timeoutId);
          }

          if (
            response?.data?.resultId !== pendingResult.resultId
          ) {
            console.warn(
              '[wordle] result sync acknowledgement mismatch',
              {
                expectedResultId: pendingResult.resultId,
                acknowledgedResultId: response?.data?.resultId,
              },
            );

            // Never discard the durable local copy unless the
            // server explicitly acknowledges this exact result UUID.
            break;
          }

          await removeWordleResult(pendingResult.resultId);
          syncedCount += 1;
        } catch (error) {
          console.warn(
            '[wordle] pending result sync paused',
            {
              resultId: pendingResult.resultId,
              error,
            },
          );

          // Keep this result and all later results queued.
          // We preserve submission order and retry later.
          break;
        }
      }
    } catch (error) {
      console.error(
        '[wordle] unable to process pending result outbox',
        error,
      );
    } finally {
      resultSyncInProgressRef.current = false;
    }

    return syncedCount;
  }, [
    isGameStateHydrated,
    submitWordleResult,
    updateRemoteState,
    user?.id,
  ]);

  const syncPendingWordleResults = useCallback(() => {
    const queuedSync = resultSyncQueueRef.current.then(
      () => runPendingWordleResultSync(),
      () => runPendingWordleResultSync(),
    );

    resultSyncQueueRef.current = queuedSync;

    return queuedSync;
  }, [runPendingWordleResultSync]);

  const clearPendingWordleResultRetry = useCallback(() => {
    if (resultSyncRetryTimerRef.current !== null) {
      window.clearTimeout(resultSyncRetryTimerRef.current);
      resultSyncRetryTimerRef.current = null;
    }

    resultSyncRetryDelayRef.current = 5_000;
  }, []);

  const schedulePendingWordleResultRetry = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!user?.id) return;
    if (resultSyncRetryTimerRef.current !== null) return;

    const scheduleRetry = (delayMs: number) => {
      if (resultSyncRetryTimerRef.current !== null) return;

      resultSyncRetryTimerRef.current = window.setTimeout(
        async () => {
          resultSyncRetryTimerRef.current = null;

          if (!navigator.onLine) {
            const nextDelay = Math.min(delayMs * 2, 60_000);
            resultSyncRetryDelayRef.current = nextDelay;
            scheduleRetry(nextDelay);
            return;
          }

          try {
            await syncPendingWordleResults();

            const remainingResults =
              await getPendingWordleResults(user.id);

            if (remainingResults.length === 0) {
              resultSyncRetryDelayRef.current = 5_000;
              return;
            }
          } catch (error) {
            console.warn(
              '[wordle] unable to inspect result outbox during retry',
              error,
            );
          }

          const nextDelay = Math.min(delayMs * 2, 60_000);
          resultSyncRetryDelayRef.current = nextDelay;
          scheduleRetry(nextDelay);
        },
        delayMs,
      );
    };

    scheduleRetry(resultSyncRetryDelayRef.current);
  }, [syncPendingWordleResults, user?.id]);

  const syncPendingWordleResultsAndRefresh =
    useCallback(async (forceRefresh = false) => {
      const syncedCount =
        await syncPendingWordleResults();

      if (user?.id) {
        try {
          const remainingResults =
            await getPendingWordleResults(user.id);

          if (remainingResults.length > 0) {
            schedulePendingWordleResultRetry();
          } else {
            clearPendingWordleResultRetry();
          }
        } catch (error) {
          console.warn(
            '[wordle] unable to inspect pending results after sync',
            error,
          );
        }
      }

      // A successful result submission already invalidates and refreshes
      // the mounted Wordle result-dependent queries.
      if (syncedCount > 0) return;

      if (!forceRefresh) return;

      refetchStats();

      if (gameMode !== 'CUSTOM') {
        refetchLast30();
      }

      refetchStreak();
      refetchProfile();
    }, [
      gameMode,
      user?.id,
      syncPendingWordleResults,
      schedulePendingWordleResultRetry,
      clearPendingWordleResultRetry,
      refetchStats,
      refetchLast30,
      refetchStreak,
      refetchProfile,
    ]);

  useEffect(() => {
    return () => {
      if (resultSyncRetryTimerRef.current !== null) {
        window.clearTimeout(resultSyncRetryTimerRef.current);
        resultSyncRetryTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const syncAndRefresh = async (
      forceRefresh = false,
    ) => {
      if (
        typeof navigator !== 'undefined' &&
        !navigator.onLine
      ) {
        return;
      }

      await syncPendingWordleResultsAndRefresh(
        forceRefresh,
      );
    };

    // Recover anything left over from a previous session.
    void syncAndRefresh();

    const handleOnline = () => {
      void syncAndRefresh(true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAtRef.current = Date.now();
        return;
      }

      if (document.visibilityState !== 'visible') return;

      const hiddenAt = hiddenAtRef.current;
      hiddenAtRef.current = null;

      const wasAwayLongEnough =
        hiddenAt !== null &&
        Date.now() - hiddenAt >= 30_000;

      void syncAndRefresh(wasAwayLongEnough);
    };

    window.addEventListener('online', handleOnline);
    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    );

    return () => {
      window.removeEventListener('online', handleOnline);
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );
    };
  }, [
    user?.id,
    syncPendingWordleResultsAndRefresh,
  ]);

  const isDaily = gameMode === 'DAILY';
  const isInfinite = gameMode === 'INFINITE';

  // Helper Functions
  function handlePlayWinSound() {
    if (showChristmas) {
      playWinSoundChristmas();
    } else {
      playWinSound();
    }
  }

  function handlePlayLoseSound() {
    if (showChristmas) {
      playLoseSoundChristmas();
    } else {
      playLoseSound();
    }
  }

  function clearCurrentRowClass() {
    return setCurrentRowClass('');
  }

  function handleSwapDeleteAndEnter(swapDeleteAndEnter: boolean) {
    //appInsights.trackEvent({ name: 'swapDeleteAndEnter', properties: { swapDeleteAndEnter: swapDeleteAndEnter.toString(), player: user.id } });
    return dispatch(setWordleGameUiState({ swapDeleteAndEnter }))
  }

  function handleConfettiEnabled(confettiEnabled: boolean) {
    //appInsights.trackEvent({ name: 'confettiEnabled', properties: { confettiEnabled: confettiEnabled.toString(), player: user.id } });
    return dispatch(setWordleGameUiState({ confettiEnabled }))
  }

  function handleSpeedRunEnabled(speedRunModeEnabled: boolean) {
    //appInsights.trackEvent({ name: 'speedRunModeEnabled', properties: { speedRunModeEnabled: speedRunModeEnabled.toString(), player: user.id } });
    return dispatch(setWordleGameUiState({ speedRunModeEnabled }))
  }

  function handleColorblindModeEnabled(colorblindMode: boolean) {
    return dispatch(setWordleGameUiState({ colorblindMode }))
  }

  function enterGameMode(gameMode: string) {
    setShowConfetti(false);
    //appInsights.trackEvent({ name: 'switchedGameMode', properties: { gameMode, player: user.id } });
    return dispatch(setGameMode(gameMode.toUpperCase()))
  }

  function useWordLength(wordLength: number) {
    setShowConfetti(false);
    return dispatch(setWordLength(wordLength));
  }

  function useWordPack(wordPack: string) {
    setShowConfetti(false);
    //appInsights.trackEvent({ name: 'switchedWordPack', properties: { wordPack, player: user.id } });
    dispatch(setWordPack(wordPack));
    const wordLength = wordleWordPackConfig.solutionLengthByName[wordPack];
    dispatch(setWordLength(wordLength));
    return;
  }

  function updateGameState(
    updatedState: GameState,
    persistRemote = false,
  ) {
    if (persistRemote) {
      shouldPersistGameStateRef.current = true;
    }

    dispatch(setGameState(updatedState));

    if (updatedState.resultSave) {
      setTimeout(() => {
        if (updatedState.isGameWon || updatedState.isGameLost) {
          dispatch(setGameState({
            ...updatedState,
            resultSave: false
          }));
        }
      }, 500)
    }
  }

  function updateUiState(updatedState: UiState) {
    dispatch(setUiState(updatedState));
  
    const {
      appearanceThemeId,
      keyboardStyleId,
      ...uiStateWithoutTheme
    } = updatedState;

    updateRemoteUiState({
      ...(uiSavedState?.data || {}),
      wordleGame: uiStateWithoutTheme,
    });
  }

  function newInfiniteGame(){
    if (isLoadingWordPack) return;
    if (!wordleWordPack?.data?.wordList?.length) return;

    setShowConfetti(false);
    setIsStatsModalOpen(false);
    setCurrentRowClass('');
    setCurrentGuess('');

    const newSolution: string = getRandomWord(wordleWordPack.data.wordList);
    //appInsights.trackEvent({ name: 'newInfiniteGame', properties: { wordPack, solution: newSolution, player: user.id } });
    updateGameState(
      {
        solution: newSolution,
        guesses: [],
        isGameWon: false,
        isGameLost: false,
        isGameInProgress: false,
        resultSave: false,
      },
      true,
    );
  }

  // Called when a user presses a key on the virtual or physical keyboard
  function onChar(value: string) {
    const key = localeAwareUpperCase(value)

    if (!/^[A-Z]$/.test(key)) return

    if (
      unicodeLength(`${currentGuess}${key}`) <= solution.length &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${key}`)
    }
  }

  // Called when a user presses backspace on the virtual or physical keyboard
  function onDelete() {
    setCurrentGuess(new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join(''))
  }

  async function queueCompletedWordleGame(
    completedGuesses: string[],
  ) {
    if (!user?.id) {
      throw new Error('Cannot queue Wordle result without a player');
    }

    const resultId = crypto.randomUUID();
    const clientCompletedAt = new Date().toISOString();

    await queueWordleResult({
      resultId,
      playerId: user.id,
      clientCompletedAt,
      solution,
      guesses: completedGuesses,
      gameWasHardMode: false,
      type: gameMode,
      wordPack,
      ...(isCustom && gameState.custom.joinCode
        ? { shareCode: gameState.custom.joinCode }
        : {}),
    });

    return resultId;
  }

  // Called when a user presses enter on the virtual or physical keyboard
  async function onEnter() {
    if (isGameWon || isGameLost) {
      if (isCustom) return;
      if (isDaily) {
        setCurrentRowClass('');
        setIsStatsModalOpen(true);
        setShowConfetti(false);
        return;
      }

      if (isInfinite) {
        setCurrentRowClass('');
        setIsStatsModalOpen(false);
        setShowConfetti(false);
        setCurrentGuess('');
        return newInfiniteGame();
      }
    }
    // if (isGameWon || isGameLost) {
    //   if (isCustom && isGameWon) return;
    //   if (isDaily) {
    //     setCurrentRowClass('')
    //     //   updateGameState({
    //     //     ...currentGame,
    //     //     guesses: []
    //     //   })
    //     setIsStatsModalOpen(true)
    //     //setShowConfetti(false)
    //   }
    //   return;
    // }
    if (isStatsModalOpen) return;

    if (unicodeLength(currentGuess) !== solution.length) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    if (!isWordInWordList(currentGuess, wordleWordPack?.data?.validGuesses || [], gameMode)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    /*if (isHardMode) {
      const firstMissingReveal = findFirstUnusedReveal(
        solution,
        currentGuess,
        guesses
      )
      if (firstMissingReveal) {
        setCurrentRowClass('jiggle')
        return showErrorAlert(firstMissingReveal, {
          onClose: clearCurrentRowClass,
        })
      }
    }
    */

    setIsRevealing(true)
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false)
    }, REVEAL_TIME_MS * solution.length)

    const winningWord = isWinningWord(solution, currentGuess)
    if (
      unicodeLength(currentGuess) === solution.length &&
      guesses.length <= MAX_CHALLENGES &&
      (!isGameWon && !isGameLost)
    ) {

      if (winningWord) {
        if (resultFinalizationInProgressRef.current) return;
        resultFinalizationInProgressRef.current = true;

        const completedGuesses = [
          ...guesses,
          currentGuess,
        ];

        try {
          await queueCompletedWordleGame(completedGuesses);
        } catch (error) {
          console.error(
            '[wordle] failed to persist completed game locally',
            error,
          );

          resultFinalizationInProgressRef.current = false;

          setIsRevealing(false);

          return showErrorAlert(
            'Your game could not be saved safely. Please try again.',
          );
        }

        showSuccessAlert(
          WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)],
          {
            persist: false,
            delayMs: REVEAL_TIME_MS * 5 + 1,
            durationMs: 3000,
          },
        );

        if (gameSoundEnabled) {
          handlePlayWinSound();
        }

        updateGameState(
          {
            ...currentGame,
            guesses: completedGuesses,
            isGameWon: true,
            resultSave: false,
          },
          true,
        );

        setCurrentGuess('');

        void syncPendingWordleResultsAndRefresh();

        return;
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        if (resultFinalizationInProgressRef.current) return;
        resultFinalizationInProgressRef.current = true;

        const completedGuesses = [
          ...guesses,
          currentGuess,
        ];

        try {
          await queueCompletedWordleGame(completedGuesses);
        } catch (error) {
          console.error(
            '[wordle] failed to persist completed game locally',
            error,
          );

          resultFinalizationInProgressRef.current = false;

          setIsRevealing(false);

          return showErrorAlert(
            'Your game could not be saved safely. Please try again.',
          );
        }

        if (gameSoundEnabled) {
          handlePlayLoseSound();
        }

        updateGameState(
          {
            ...currentGame,
            guesses: completedGuesses,
            isGameLost: true,
            resultSave: false,
          },
          true,
        );

        setCurrentGuess('');

        showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
          persist: false,
          delayMs: REVEAL_TIME_MS * 5 + 1,
          durationMs: 3000,
        });

        void syncPendingWordleResultsAndRefresh();

        return;
      }

      updateGameState(
        {
          ...currentGame,
          guesses: [
            ...guesses,
            currentGuess,
          ],
        },
        true,
      );
      setCurrentGuess('');
    }
  }

  // Persist the game board after each submitted guess.
  // Typing within the active row remains local-only.
  useEffect(() => {
    if (gameLoading) return;
    if (!shouldPersistGameStateRef.current) return;

    shouldPersistGameStateRef.current = false;

    const {
      isLoading,
      ...newRemoteState
    } = gameState;

    gameStateSaveQueueRef.current =
      gameStateSaveQueueRef.current.then(
        async () => {
          try {
            await updateRemoteState(newRemoteState).unwrap();

            // A newer successful checkpoint supersedes any older failed one.
            pendingReconciledStateRef.current = null;
          } catch (error) {
            // Keep only the latest unsaved session checkpoint.
            // Result delivery is independent and may continue.
            pendingReconciledStateRef.current = newRemoteState;

            console.error(
              '[wordle] failed to save game-state checkpoint; queued for recovery',
              error,
            );
          }
        },
      );
  }, [gameState, gameLoading, updateRemoteState]);

  useEffect(() => {
    if (gameLoading) return;
    if (!isUiHydrated) return;

    updateUiState(gameUiState);
  }, [gameUiState, gameLoading, isUiHydrated]);

  // If game is not loaded, load the initial state from the remote state
  useEffect(() => {
    if (gameState.isLoading === false) return;
    if (isLoadingSavedState) return;
    if (isErrorSavedState) return;
    if (!savedState?.data) return;
    if (!user?.id) return;

    let cancelled = false;

    const hydrateGameState = async () => {
      let initialState = savedState?.data;

      try {
        const pendingResults =
          await getPendingWordleResults(user.id);

        const reconciledState =
          reconcileSavedStateWithPendingResults(
            initialState,
            pendingResults,
          );

        if (reconciledState !== initialState) {
          pendingReconciledStateRef.current =
            reconciledState;
        }

        initialState = reconciledState;
      } catch (error) {
        console.error(
          '[wordle] failed to reconcile saved state with result outbox',
          error,
        );
      }

      if (cancelled) return;

      // TODO - Fix types
      // @ts-ignore
      dispatch(setInitialState(initialState));

      setIsGameStateHydrated(true);
    };

    void hydrateGameState();

    return () => {
      cancelled = true;
    };
  }, [
    gameState.isLoading,
    isLoadingSavedState,
    isErrorSavedState,
    savedState,
    user?.id,
    dispatch,
  ]);

  // If the game is loaded and gameMode is daily,
  // load the word of the day
  useEffect(() => {
    if (gameLoading) return;
    if (gameMode !== 'DAILY') return;
    if (!wordOfTheDay?.data?.todaysWord) return;
    if (solution === wordOfTheDay.data.todaysWord) return;

    const newSolution: string = wordOfTheDay.data.todaysWord;

    setShowConfetti(false);
    setIsStatsModalOpen(false);
    setCurrentRowClass('');
    setCurrentGuess('');

    //appInsights.trackEvent({ name: 'newDailyGame', properties: { wordPack, solution: newSolution, player: user.id } });
    updateGameState({
      solution: newSolution,
      guesses: [],
      isGameWon: false,
      isGameLost: false,
      isGameInProgress: false,
      resultSave: false,
    });
  }, [gameLoading, gameMode, wordPack, wordOfTheDay, solution]);

  useEffect(() => {
    if (gameLoading) return;
    if (gameMode !== 'INFINITE') return;
    if (guesses.length >= 1 && guesses.length < 6) return;
    if (!wordleWordPack?.data?.wordList?.length) return;

    const newSolution: string = getRandomWord(wordleWordPack.data.wordList);
    updateGameState({
      solution: newSolution,
      guesses: [],
      isGameWon: false,
      isGameLost: false,
      isGameInProgress: false,
      resultSave: false
    });
  }, [gameLoading, gameMode, wordPack, wordleWordPack])

  // Check if all dependencies are ready and set the game to ready
  useEffect(() => {
    if (isCustom) return setGameLoading(false);
    if (gameState.isLoading) return setGameLoading(true);
    if (isLoadingWoTD) return setGameLoading(true);
    if (isLoadingWordPack) return setGameLoading(true);
    if (isLoadingSavedState) return setGameLoading(true);
    return setGameLoading(false);
  }, [isLoadingWoTD, isLoadingWordPack, isLoadingSavedState, gameState])

  // If game was won/lost
  // Show end game modal
  // If game was won show modal and confetti
  useEffect(() => {
    setShowConfetti(isGameWon);

    if (isGameWon || isGameLost) {
      if (gameUiState.speedRunModeEnabled === true) {
        setIsStatsModalOpen(false);
      } else {
        setIsStatsModalOpen(true);
      }
    }
  }, [isGameWon, isGameLost, gameUiState.speedRunModeEnabled]);

  if (gameLoading) return <Loader />;
  return (
    <Div100vh
      className={`!h-auto min-h-screen transition-colors ${pageBackgroundThemeClasses} ${pageTextThemeClasses}`}
    >
      <TooltipProvider>
        <WinCelebration
          enabled={gameUiState.confettiEnabled ?? false}
          visible={showConfetti}
          themeId={gameUiState.appearanceThemeId}
          christmasEnabled={showChristmas}
        />
        <div className="flex min-h-full flex-col">
          {/*  Game Settings  */}
          <Button className={`fixed top-20 right-4 ${gameActionButtonThemeClasses}`} variant='default' onClick={e => {
            e.preventDefault();
            setIsSettingsModalOpen(!isSettingsModalOpen)
          }}>
            <SettingsIcon className='w-6 h-6' />
          </Button>

          <Sheet open={isSettingsModalOpen} onOpenChange={open => setIsSettingsModalOpen(open)}>
            <SheetContent
              className={appearanceTheme.app.panel}
              style={{ backgroundColor: gamePageBackgroundColor }}
            >
              <SheetHeader>
                <SheetTitle className={appearanceTheme.modal.title}>
                  Game Settings
                </SheetTitle>
                <SheetDescription>
                  Customise your game
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  {gameMode !== 'CUSTOM' && (
                    <>
                      <Label htmlFor="gameMode">Game Mode</Label>
                      <Select defaultValue={gameMode} onValueChange={(value) => enterGameMode(value)}>
                        <SelectTrigger
                          id="gameMode"
                          style={{ backgroundColor: gamePanelBackgroundColor }}
                        >
                          <SelectValue placeholder="Select a game mode" />
                        </SelectTrigger>
                        <SelectContent
                          style={{ backgroundColor: gamePanelBackgroundColor }}
                        >
                          <SelectGroup>
                            <SelectLabel>Game Mode</SelectLabel>
                            <SelectItem key="gm_daily" value="DAILY">
                              Daily
                            </SelectItem>
                            <SelectItem key="gm_infinite" value="INFINITE">
                              Infinite
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  {gameMode !== 'CUSTOM' && (
                    <>
                      <Label htmlFor="wordPack">Word Pack</Label>
                      <Select defaultValue={wordPack} onValueChange={(value) => useWordPack(value)}>
                        <SelectTrigger
                          id="wordPack"
                          style={{ backgroundColor: gamePanelBackgroundColor }}
                        >
                          <SelectValue placeholder="Select a word pack" />
                        </SelectTrigger>
                        <SelectContent
                          className="max-h-[60vh] overflow-y-auto"
                          style={{ backgroundColor: gamePanelBackgroundColor }}
                        >
                          <SelectGroup>
                            <SelectLabel>Word Pack</SelectLabel>
                            {!isLoadingWordPacks &&
                              availableWordPacks.map((wordPack) => (
                                <SelectItem key={wordPack} value={wordPack}>
                                  {wordleWordPackConfig.friendlyNameByName[wordPack]}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appearanceTheme">Theme</Label>

                  <Select
                    value={gameUiState?.appearanceThemeId || 'theme.default'}
                    onValueChange={(value) => {
                      const selectedTheme = appearanceThemes.find(
                        (theme) => theme.meta.id === value
                      );

                      if (!selectedTheme) return;

                      if (!canUseAppearanceTheme(selectedTheme)) {
                        showErrorAlert(
                          'This premium theme is locked. Get it in the Marketplace or upgrade to Wordrama Plus or Creator for access.'
                        );
                        return;
                      }

                      dispatch(setWordleGameUiState({ appearanceThemeId: value }));

                      updateSettings({
                        appearanceThemeId: value,
                      });
                    }}
                  >
                    <SelectTrigger
                      id="appearanceTheme"
                      style={{ backgroundColor: gamePanelBackgroundColor }}
                    >
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>

                    <SelectContent
                      style={{ backgroundColor: gamePanelBackgroundColor }}
                    >
                      <SelectGroup>
                        <SelectLabel>Themes</SelectLabel>

                        {appearanceThemes.map((theme) => (
                          <SelectItem
                            key={theme.meta.id}
                            value={theme.meta.id}
                          >
                            {theme.meta.name}
                            {theme.meta.availability !== 'free'
                              ? canUseAppearanceTheme(theme)
                                ? ' ✨'
                                : ' 🔒'
                              : ''}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keyboardStyle">Keyboard Style</Label>

                  <Select
                    value={gameUiState?.keyboardStyleId || KEYBOARD_STYLE_IDS.FLAT}
                    onValueChange={(value) => {
                      dispatch(setWordleGameUiState({ keyboardStyleId: value }));

                      updateSettings({
                        keyboardStyleId: value,
                      });
                    }}
                  >
                    <SelectTrigger
                      id="keyboardStyle"
                      style={{ backgroundColor: gamePanelBackgroundColor }}
                    >
                      <SelectValue placeholder="Select a keyboard style" />
                    </SelectTrigger>

                    <SelectContent
                      style={{ backgroundColor: gamePanelBackgroundColor }}
                    >
                      <SelectGroup>
                        <SelectLabel>Keyboard Style</SelectLabel>

                        {Object.values(KEYBOARD_STYLES).map((keyboardStyle) => (
                          <SelectItem
                            key={keyboardStyle.meta.id}
                            value={keyboardStyle.meta.id}
                          >
                            {keyboardStyle.meta.name}
                            {keyboardStyle.meta.availability !== 'free'
                              ? ' ✨'
                              : ''}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-x-10 gap-y-6 py-2">
                  <div className="flex items-center justify-between gap-4">
                    <SettingsToggleLabel
                      htmlFor="swapDeleteAndEnter"
                      label={<>Swap<br />Keys</>}
                      tooltip="Swap the delete and enter keys on the on-screen keyboard"
                    />

                    <Switch
                      id="swapDeleteAndEnter"
                      checked={gameUiState.swapDeleteAndEnter || false}
                      onCheckedChange={(checked) => handleSwapDeleteAndEnter(checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <SettingsToggleLabel
                      htmlFor="confettiEnabled"
                      label={<>Show<br />Confetti</>}
                      tooltip="Enable or disable confetti when you win a game"
                    />

                    <Switch
                      id="confettiEnabled"
                      checked={gameUiState.confettiEnabled || false}
                      onCheckedChange={(checked) => handleConfettiEnabled(checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <SettingsToggleLabel
                      htmlFor="speedRunModeEnabled"
                      label={<>Speed<br />Run</>}
                      tooltip="Skip the post-game statistics screen for faster play"
                    />

                    <Switch
                      id="speedRunModeEnabled"
                      checked={gameUiState.speedRunModeEnabled || false}
                      onCheckedChange={(checked) => handleSpeedRunEnabled(checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <SettingsToggleLabel
                      htmlFor="streamerModeEnabled"
                      label={<>Streamer<br />Mode</>}
                      tooltip="Centers post-game stats to better fit livestream layouts"
                    />

                    <Switch
                      id="streamerModeEnabled"
                      checked={gameUiState.streamerModeEnabled || false}
                      onCheckedChange={(checked) =>
                        dispatch(setWordleGameUiState({ streamerModeEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <SettingsToggleLabel
                      htmlFor="theme"
                      label={<>Dark<br />Mode</>}
                      tooltip="Switch between light and dark appearance"
                    />

                    <Switch
                      id="theme"
                      checked={resolvedTheme === 'dark'}
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <SettingsToggleLabel
                      htmlFor="colorblindMode"
                      label={<>Colorblind<br />Mode</>}
                      tooltip="Uses an alternative color palette for improved accessibility"
                    />

                    <Switch
                      id="colorblindMode"
                      checked={gameUiState.colorblindMode || false}
                      onCheckedChange={(checked) => handleColorblindModeEnabled(checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <SettingsToggleLabel
                      htmlFor="gameSoundEnabled"
                      label={<>Game<br />Sound</>}
                      tooltip="Enable or disable Wordrama sound effects"
                    />

                    <Switch
                      id="gameSoundEnabled"
                      checked={gameUiState.gameSoundEnabled || false}
                      onCheckedChange={(checked) =>
                        dispatch(setWordleGameUiState({ gameSoundEnabled: checked }))
                      }
                    />
                  </div>
                </div>

                <Separator />
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger>
              <Button variant='default' className={`fixed top-20 left-4 ${gameActionButtonThemeClasses}`}>
                <HistoryIcon className='w-6 h-6'/>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className={appearanceTheme.app.panel}
              style={{ backgroundColor: gamePageBackgroundColor }}
            >
              <SheetHeader>
                <SheetTitle className={appearanceTheme.modal.title}>
                  Game History
                </SheetTitle>
                <SheetDescription>
                  {
                    !isErrorLast30Games && isLoadingLast30Games && 'Loading...'
                  }
                  {
                    (isErrorLast30Games && !isLoadingLast30Games) && 'No games to show'
                  }
                  {
                    !isErrorLast30Games && last30Games?.count > 0 && `Your last ${last30Games?.count} games`
                  }
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className={`grid ${wordLength < 7 ? 'grid-cols-3' : wordLength > 14 ? 'grid-cols-1' : 'grid-cols-2' } items-center gap-4`}>
                  { !isErrorLast30Games && isLoadingLast30Games  && (
                    <Loading width={50} height={50} />
                  )}
                  { !isErrorLast30Games && !isLoadingLast30Games && last30Games?.count > 0 && last30Games?.data?.map((game, idx) => (
                    <div className="col-span-1">
                      <div className="text-md">{ idx + 1}: {game.solution}</div>
                      <div className="text-sm text-gray-400">{ game.gameWasWon ? 'Game Won' : 'Game Lost'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="mx-auto flex w-full grow flex-col items-center px-1 pt-20 pb-12 sm:px-6 md:max-w-7xl lg:px-8 short:pt-2 short:pb-8">
            <div
              className={`
                flex
                w-full
                self-center
                flex-col
                rounded-2xl
                px-3
                py-4
                transition-colors
                ${
                  isLongWord
                    ? 'max-w-xl md:w-fit md:max-w-none'
                    : 'max-w-xl'
                }
                ${gameSurfaceThemeClasses}
              `}
            >
              <div className="flex justify-center mb-4">
                <GameThemeLogo
                  theme={appearanceTheme}
                  className="h-20 w-auto max-w-full object-contain"
                />
              </div>
              <div className="flex flex-col justify-center pb-6 short:pb-2">
                <Grid
                  solution={isCustom ? gameState.custom.solution : gameState.modes[gameState.gameMode][gameState.wordPack].solution}
                  guesses={isCustom ? gameState.custom.guesses : gameState.modes[gameState.gameMode][gameState.wordPack].guesses || []}
                  currentGuess={currentGuess}
                  isRevealing={isRevealing}
                  currentRowClassName={currentRowClass}
                />
                { isCustom && gameState?.custom?.hint && (
                  <div className="pt-2 pb-6 short:pb-2 text-center text-white">
                    Hint: { gameState.custom.hint }
                  </div>
                )}
              </div>
              <Keyboard
                onChar={onChar}
                onDelete={onDelete}
                onEnter={onEnter}
                solution={isCustom ? gameState.custom.solution : gameState.modes[gameState.gameMode][gameState.wordPack].solution}
                guesses={isCustom ? gameState.custom.guesses : gameState.modes[gameState.gameMode][gameState.wordPack].guesses || []}
                isRevealing={isRevealing}
                swapEnterAndDelete={gameUiState?.swapDeleteAndEnter || false}
                showPlayAgainKey={
                  isInfinite &&
                  (isGameWon || isGameLost) &&
                  !isRevealing
                }
              />
            </div>
            <div className='flex justify-center items-center pt-10'>
              { !isCustom && (
                <Button
                  onClick={e => {
                    e.preventDefault();
                    setIsStatsModalOpen(!isStatsModalOpen)
                  }}
                  variant="default"
                  className={`fixed top-20 right-24 ${gameActionButtonThemeClasses}`}
                >
                  <ChartBarIcon className='w-6 h-6' />
                </Button>
              )}
              <Link href="/games/wordrama/custom">
                <Button
                  variant="default"
                  className={`fixed top-20 left-24 ${gameActionButtonThemeClasses}`}
                >
                  <GamepadIcon className='w-6 h-6' />
                </Button>
              </Link>
            </div>
            {isCustom && (
              <Button
                className={`fixed top-20 right-24 ${gameActionButtonThemeClasses}`}
                onClick={() => {
                  updateGameState({
                    ...currentGame,
                    guesses: [
                      ...guesses
                    ],
                    isGameLost: true,
                    resultSave: false
                  })
                  setIsStatsModalOpen(true)
                }}
              >
                Give Up?
              </Button>
            )}
            { streamerMode || isCustom ? (
              <AlertDialog open={isStatsModalOpen}>
                <AlertDialogContent
                  className={[
                    'max-w-lg',
                    appearanceTheme.app.gameSurface,
                    appearanceTheme.app.text,
                  ].join(' ')}
                  style={{
                    backgroundColor: gamePageBackgroundColor,
                    borderColor: gameSurfaceBorderColor,
                  }}
                >
                  <AlertDialogHeader>
                    <div className="flex justify-center pb-2">
                      <GameThemeLogo
                        theme={appearanceTheme}
                        className="h-16 w-auto"
                      />
                    </div>
                    <AlertDialogTitle className='text-center'>
                      {isCustom
                        ? 'Custom Game'
                        : gameMode === 'DAILY'
                          ? 'Daily Stats'
                          : gameMode === 'INFINITE'
                            ? 'Infinite Stats'
                            : 'Statistics'}
                    </AlertDialogTitle>
                    {!isCustom && (
                      <p className={`text-sm text-center opacity-75 ${appearanceTheme.app.text}`}>
                        Viewing current mode stats
                      </p>
                    )}
                  </AlertDialogHeader>
                  <AlertDialogDescription
                    className={appearanceTheme.app.text}
                  >
                    { isGameWon && (
                      <div className="text-center text-2xl">
                        You won!
                      </div>
                    )}
                    { isGameLost && (
                      <div className="text-center text-2xl">
                        You lost! - The answer was { solution }
                      </div>
                    )}
                  </AlertDialogDescription>
                  {!isCustom && (
                    <div className="py-4">
                      <dl className="grid grid-cols-3 gap-4">
                        <div
                          className="aspect-square w-full max-w-[120px] mx-auto overflow-hidden rounded-lg shadow flex flex-col items-center justify-center p-2"
                          style={{ backgroundColor: gamePanelBackgroundColor }}
                        >
                          <dd
                            className={`text-2xl sm:text-3xl font-semibold tracking-tight ${appearanceTheme.app.text}`}
                          >
                            {gamesPlayed || 0}
                          </dd>
                          <dt
                            className={`mt-1 text-[9px] sm:text-xs font-medium text-center opacity-80 ${appearanceTheme.app.text}`}
                          >
                            🕹️ Games Played
                          </dt>
                        </div>

                        <div
                          className="aspect-square w-full max-w-[120px] mx-auto overflow-hidden rounded-lg shadow flex flex-col items-center justify-center p-2"
                          style={{ backgroundColor: gamePanelBackgroundColor }}
                        >
                          <dd
                            className={`text-2xl sm:text-3xl font-semibold tracking-tight ${appearanceTheme.app.text}`}
                          >
                            {gamesWon || 0}
                          </dd>
                          <dt
                            className={`mt-1 text-[9px] sm:text-xs font-medium text-center opacity-80 ${appearanceTheme.app.text}`}
                          >
                            🏆 Games Won
                          </dt>
                        </div>

                        <div
                          className="aspect-square w-full max-w-[120px] mx-auto overflow-hidden rounded-lg shadow flex flex-col items-center justify-center p-2"
                          style={{ backgroundColor: gamePanelBackgroundColor }}
                        >
                          <dd
                            className={`text-2xl sm:text-3xl font-semibold tracking-tight ${appearanceTheme.app.text}`}
                          >
                            {currentStreak || 0}
                          </dd>
                          <dt
                            className={`mt-1 text-[9px] sm:text-xs font-medium text-center opacity-80 ${appearanceTheme.app.text}`}
                          >
                            🔥 Current Streak
                          </dt>
                        </div>

                        <div
                          className="aspect-square w-full max-w-[120px] mx-auto overflow-hidden rounded-lg shadow flex flex-col items-center justify-center p-2"
                          style={{ backgroundColor: gamePanelBackgroundColor }}
                        >
                          <dd
                            className={`text-2xl sm:text-3xl font-semibold tracking-tight ${appearanceTheme.app.text}`}
                          >
                            {bestStreak || 0}
                          </dd>
                          <dt
                            className={`mt-1 text-[9px] sm:text-xs font-medium text-center opacity-80 ${appearanceTheme.app.text}`}
                          >
                            💎 Best Streak
                          </dt>
                        </div>

                        <div
                          className="aspect-square w-full max-w-[120px] mx-auto overflow-hidden rounded-lg shadow flex flex-col items-center justify-center p-2"
                          style={{ backgroundColor: gamePanelBackgroundColor }}
                        >
                          <dd
                            className={`text-2xl sm:text-3xl font-semibold tracking-tight ${appearanceTheme.app.text}`}
                          >
                            {Math.floor((gamesWon / gamesPlayed) * 100) || 0}%
                          </dd>
                          <dt
                            className={`mt-1 text-[9px] sm:text-xs font-medium text-center opacity-80 ${appearanceTheme.app.text}`}
                          >
                            📈 % of Wins
                          </dt>
                        </div>
                      </dl>
                    </div>
                  )}
                  <AlertDialogFooter className='grid grid-cols-3 gap-5 max-w-full'>
                    {!isCustom && (<AlertDialogAction
                                      className={appearanceTheme.app.actionButton}
                                      onClick={() => setIsStatsModalOpen(false)}
                                    >
                                      Close
                                    </AlertDialogAction>)}
                    {isCustom && (
                      <Link href='/games/wordrama/custom'>
                        <AlertDialogAction
                          className='w-32'
                        >
                          Create custom
                        </AlertDialogAction>
                      </Link>
                    )}
                    {isCustom && (
                      <Link href='/games/wordrama/join'>
                        <AlertDialogAction
                          className='w-32'
                        >
                          Play another
                        </AlertDialogAction>
                      </Link>
                    )}

                    {isCustom && (
                      <AlertDialogAction
                        className='w-32'
                        onClick={() => {
                          enterGameMode('INFINITE');
                          useWordPack('FIVE_LETTER');
                          window.location.reload();
                        }}
                      >
                        Play Infinite
                      </AlertDialogAction>
                    )}
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Drawer
                open={isStatsModalOpen && !isCustom}
                onOpenChange={setIsStatsModalOpen}
              >
                <DrawerContent
                  className={[
                    streamerMode ? 'h-4/5' : '',
                    appearanceTheme.app.gameSurface,
                    appearanceTheme.app.text,
                  ].join(' ')}
                  style={{
                    backgroundColor: gamePageBackgroundColor,
                    borderColor: gameSurfaceBorderColor,
                  }}
                >
                  <div className="mx-auto w-full max-w-screen-lg">
                    <DrawerHeader className="relative">
                      <button
                        type="button"
                        aria-label="Close stats"
                        onClick={() => setIsStatsModalOpen(false)}
                        className={[
                          'absolute right-4 top-4 rounded px-3 py-1 text-2xl font-bold',
                          'transition-opacity hover:opacity-70',
                          appearanceTheme.modal.icon,
                        ].join(' ')}
                      >
                        ×
                      </button>
                       <div className="flex justify-center pb-2">
                        <GameThemeLogo
                          theme={appearanceTheme}
                          className="h-16 w-auto"
                        />
                      </div>
                      <DrawerTitle
                        className={[
                          'text-center text-4xl pr-10',
                          appearanceTheme.modal.title,
                        ].join(' ')}
                      >
                        {gameMode === 'DAILY'
                          ? 'Daily Stats'
                          : gameMode === 'INFINITE'
                          ? 'Infinite Stats'
                          : 'Statistics'}
                      </DrawerTitle>
                      {gameMode !== 'CUSTOM' && (
                        <p
                          className={[
                            'text-sm text-center mb-2 opacity-75',
                            appearanceTheme.app.text,
                          ].join(' ')}
                        >
                          Viewing current mode stats
                        </p>
                      )}
                    </DrawerHeader>
                    <DrawerDescription>
                      { isGameWon && (
                        <div className="text-center text-2xl">
                          You won!
                        </div>
                      )}
                      { isGameLost && (
                        <div className="text-center text-2xl">
                          You lost! - The answer was { solution }
                        </div>
                      )}
                    </DrawerDescription>
                    <DrawerDescription className="text-center text-xl">
                      { isInfinite && 'Swipe down or tap × to close, then type or press Enter to play again' }
                      { isDaily && 'Come back tomorrow to play again or try out infinite mode by clicking the gear to open settings' }
                    </DrawerDescription>
                    {!isCustom && (
                      <div id="fullWidthTabContent" className={`p-4 border-gray-200 dark:border-gray-600 ${streamerMode ? 'ml-64 w-1/2' : ''}`}>
                        <div
                          className={[
                            'p-4 rounded-lg md:p-8',
                            appearanceTheme.app.panel,
                          ].join(' ')}
                          id="stats"
                          role="tabpanel"
                          aria-labelledby="stats-tab"
                        >
                            <dl
                              className={[
                                'grid grid-cols-2 p-4 mx-auto sm:grid-cols-3 sm:p-8',
                                streamerMode
                                  ? 'md:grid-cols-2 gap-8 max-w-md'
                                  : 'xl:grid-cols-5 gap-8 max-w-screen-xl',
                                appearanceTheme.app.text,
                              ].join(' ')}
                            >
                                <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ gamesPlayed || 0}</dt>
                                    <dd className={appearanceTheme.app.text}>🕹️ Games Played</dd>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <dt className="mb-2 text-3xl font-extrabold">{ gamesWon || 0}</dt>
                                    <dd className={appearanceTheme.app.text}>🏆 Games Won</dd>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <dt className="mb-2 text-3xl font-extrabold">{currentStreak || 0}</dt>
                                    <dd className={appearanceTheme.app.text}>🔥 Current Streak</dd>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <dt className="mb-2 text-3xl font-extrabold">{bestStreak || 0}</dt>
                                    <dd className={appearanceTheme.app.text}>💎 Best Streak</dd>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <dt className="mb-2 text-3xl font-extrabold">{ Math.floor((gamesWon / gamesPlayed) * 100) || 0}%</dt>
                                    <dd className={appearanceTheme.app.text}>📈 % of Wins</dd>
                                </div>
                            </dl>
                        </div>
                      </div>
                    )}
                  </div>
                </DrawerContent>
              </Drawer>
            )}
            <InfoModal
              isOpen={isInfoModalOpen}
              handleClose={() => setIsInfoModalOpen(false)}
            />
            <AlertContainer />
          </div>
        </div>
      </TooltipProvider>
    </Div100vh>
  )
}

export default App;
