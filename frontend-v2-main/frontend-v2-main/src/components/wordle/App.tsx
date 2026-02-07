import './App.css'

//import { getAppInsights } from '@/utils/appInsights';
import useSound from 'use-sound';
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import Div100vh from 'react-div-100vh'
import { useDispatch } from 'react-redux';
import { isMobile, isTablet } from 'react-device-detect';
import { wordleWordPackConfig } from '../../lib/config';
import Link from 'next/link';
import { AlertContainer } from './components/alerts/AlertContainer'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { InfoModal } from './components/modals/InfoModal'
import Loader, { Loading } from '../../sections/loading';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
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
  useUpdateAccountMutation,
  useGetMyAccountQuery,
} from '../../redux/api/wordrama';

import {
  findFirstUnusedReveal,
  getRandomWord,
  isWinningWord,
  isWordInWordList,
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
import Snowflake from '@/components/Snowflake';

function App(){
  const { user } = useAuth();
  //const appInsights = getAppInsights();
  const { theme, setTheme } = useTheme();
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } = useAlert();
  // Redux State
  const dispatch = useDispatch();
  const gameState = getWordleState();
  const gameUiState = getWordleGameUiState();
  const { refetch: refetchProfile } = useGetMyAccountQuery();
  const { gameMode, wordLength, wordPack, custom } = gameState;
  const isCustom = gameMode === 'CUSTOM' && custom.solution.length > 0;
  const currentGame = isCustom ? gameState.custom : gameState.modes[gameState.gameMode][gameState.wordPack];

  const solution = isCustom ? gameState.custom.solution : gameState.modes[gameState.gameMode][gameState.wordPack].solution;
  const guesses = isCustom ? gameState.custom.guesses : gameState.modes[gameState.gameMode][gameState.wordPack].guesses;
  const isGameWon = isCustom ? gameState.custom.isGameWon : gameState.modes[gameState.gameMode][gameState.wordPack].isGameWon;
  const isGameLost = isCustom ? gameState.custom.isGameLost : gameState.modes[gameState.gameMode][gameState.wordPack].isGameLost;
  const isGameInProgress = isCustom ? gameState.custom.isGameInProgress : gameState.modes[gameState.gameMode][gameState.wordPack].isGameInProgress;

  const { data: last30Games, isLoading: isLoadingLast30Games, isError: isErrorLast30Games, error, status, refetch: refetchLast30 } = useGetLast30WordlesQuery(gameState.wordPack);
  const { data: allTimeStats, isLoading: isLoadingAllTimeStats, refetch: refetchStats } = useGetMyAllTimeWordleStatsByGameModeQuery(gameState.gameMode);
  const wordPackAllTimeStatsMap: { [key: string]: string } = {
    FOUR_LETTER: 'fourLetter',
    FIVE_LETTER: 'fiveLetter',
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

  const gamesWon = allTimeStats?.data[`${wordPackAllTimeStatsMap[wordPack]}GamesWon`] || 0;
  const gamesLost = allTimeStats?.data[`${wordPackAllTimeStatsMap[wordPack]}GamesLost`] || 0;
  const gamesPlayed = gamesWon + gamesLost;

  const { data: myWordPacks, isLoading: isLoadingWordPacks } = useGetMyWordPacksQuery();
  const availableWordPacks = Object.keys(wordleDefaultState)?.filter((wordPack) => myWordPacks?.data.includes(wordPack));

  // API
  const { data: savedState, isLoading: isLoadingSavedState } = useGetWordleSavedStateQuery();
  const { data: uiSavedState, isLoading: isLoadingUiSavedState } = useGetUiSavedStateQuery();
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

  const [playWinSound] = useSound('https://stwordramaproduks001.blob.core.windows.net/sounds/win.wav?sp=r&st=2024-11-16T20:09:08Z&se=2099-11-17T04:09:08Z&spr=https&sv=2022-11-02&sr=c&sig=jHLMId1FMqQeSrWjzhTWm9eOC6vBCnCLC3Kx9EYJff0%3D', {
    volume: 0.05,
  });
  const [playWinSoundChristmas] = useSound('https://stwordramaproduks001.blob.core.windows.net/sounds/christmas-win.wav?sp=r&st=2024-11-16T20:09:08Z&se=2099-11-17T04:09:08Z&spr=https&sv=2022-11-02&sr=c&sig=jHLMId1FMqQeSrWjzhTWm9eOC6vBCnCLC3Kx9EYJff0%3D', {
    volume: 0.05,
  });
  const [playLoseSound] = useSound('https://stwordramaproduks001.blob.core.windows.net/sounds/lost.mp3?sp=r&st=2024-11-16T20:09:08Z&se=2099-11-17T04:09:08Z&spr=https&sv=2022-11-02&sr=c&sig=jHLMId1FMqQeSrWjzhTWm9eOC6vBCnCLC3Kx9EYJff0%3D', {
    volume: 0.05,
  });
  const [playLoseSoundChristmas] = useSound('https://stwordramaproduks001.blob.core.windows.net/sounds/christmas-lost.mp3?sp=r&st=2024-11-16T20:09:08Z&se=2099-11-17T04:09:08Z&spr=https&sv=2022-11-02&sr=c&sig=jHLMId1FMqQeSrWjzhTWm9eOC6vBCnCLC3Kx9EYJff0%3D', {
    volume: 0.2,
  });

  // Local State
  const [gameLoading, setGameLoading] = useState(true);
  const [isUpdatingRemoteState, setUpdatingRemoteState] = useState(false);
  const [currentRowClass, setCurrentRowClass] = useState('');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [streamerMode, setStreamerMode] = useState(false);
  const [gameSoundEnabled, setGameSoundEnabled] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');

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

  function updateGameState(updatedState: GameState) {
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
  }

  function newInfiniteGame(){
    if (isLoadingWordPack) return;
    const newSolution: string = getRandomWord(wordleWordPack?.data?.wordList);
    //appInsights.trackEvent({ name: 'newInfiniteGame', properties: { wordPack, solution: newSolution, player: user.id } });
    updateGameState({
      solution: newSolution,
      guesses: [],
      isGameWon: false,
      isGameLost: false,
      isGameInProgress: false,
      resultSave: false
    });
  }

  // Called when a user presses a key on the virtual or physical keyboard
  function onChar(value: string) {
    if (
      unicodeLength(`${currentGuess}${value}`) <= solution.length &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`);
    }
  }

  // Called when a user presses backspace on the virtual or physical keyboard
  function onDelete() {
    setCurrentGuess(new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join(''))
  }

  // Called when a user presses enter on the virtual or physical keyboard
  function onEnter() {
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
        showSuccessAlert(WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)], {
          persist: false,
          delayMs: REVEAL_TIME_MS * 5 + 1,
          durationMs: 3000,
        });
        //appInsights.trackEvent({ name: 'gameWon', properties: { gameMode, wordPack, solution, guesses, player: user.id } });
        if (gameSoundEnabled) {
          handlePlayWinSound();
        }
        updateGameState({
          ...currentGame,
          guesses: [
            ...guesses,
            currentGuess
          ],
          isGameWon: true,
          resultSave: true
        });
        setCurrentGuess('');
        return;
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        //appInsights.trackEvent({ name: 'gameLost', properties: { gameMode, wordPack, solution, guesses, player: user.id } });
        if (gameSoundEnabled) {
          handlePlayLoseSound();
        }
        updateGameState({
          ...currentGame,
          guesses: [
            ...guesses,
            currentGuess
          ],
          isGameLost: true,
          resultSave: true
        })
        setCurrentGuess('');
        showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
          persist: false,
          delayMs: REVEAL_TIME_MS * 5 + 1,
          durationMs: 3000,
        });
        return;
      }

      updateGameState({
        ...currentGame,
        guesses: [
          ...guesses,
          currentGuess
        ]
      })
      setCurrentGuess('');
    }
  }

  // If game is loaded, keep remote state updated
  // This also acts as a trigger for game won/lost
  // functionality on the backend
  useEffect(() => {
    if (gameLoading) return;
    const { isLoading, ...newRemoteState } = gameState;
    updateRemoteState(newRemoteState);
    refetchStats();
    refetchLast30();
    refetchStreak();
    refetchProfile();
  }, [gameState, gameLoading]);

  useEffect(() => {
    if (gameLoading) return;
    updateUiState(gameUiState);
  }, [gameUiState, gameLoading]);

  // If game is not loaded, load the initial state from the remote state
  useEffect(() => {
    if (gameState.isLoading === false || isLoadingSavedState) return;
    // TODO - Fix types
    //@ts-ignore
    dispatch(setInitialState(savedState?.data));
  }, [isLoadingSavedState, savedState]);

  // If the game is loaded and gameMode is daily,
  // load the word of the day
  useEffect(() => {
    if (gameLoading) return;
    if (gameMode !== 'DAILY') return;
    if (solution === wordOfTheDay?.data?.todaysWord) return;
    const newSolution: string = wordOfTheDay?.data?.todaysWord;
    //appInsights.trackEvent({ name: 'newDailyGame', properties: { wordPack, solution: newSolution, player: user.id } });
    updateGameState({
      solution: newSolution,
      guesses: [],
      isGameWon: false,
      isGameLost: false,
      isGameInProgress: false,
    })
  }, [gameLoading, gameMode, wordPack, wordOfTheDay, isLoadingWoTD]);

  useEffect(() => {
    if (gameLoading) return;
    if (gameMode !== 'INFINITE') return;
    if (guesses.length >= 1 && guesses.length < 6) return;
    const newSolution: string = getRandomWord(wordleWordPack?.data?.wordList);
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
    if (isGameWon || isGameLost) {
      if (isGameWon) setShowConfetti(true);
      if (gameUiState.speedRunModeEnabled === true) {
        setIsStatsModalOpen(false);
      } else {
        setIsStatsModalOpen(true);
      }

    }
  }, [isGameWon, isGameLost]);

  if (gameLoading) return <Loader />;
  return (
    <Div100vh>
      <TooltipProvider>
        { gameUiState.confettiEnabled && showConfetti ? (
        showChristmas ? (
          <Snowflake />
        ) : (
          <Confetti className='w-full' />
        )) : null}
        <div className="flex h-full flex-col">
          {/*  Game Settings  */}
          <Button className='fixed top-20 right-4' variant='default' onClick={e => {
            e.preventDefault();
            setIsSettingsModalOpen(!isSettingsModalOpen)
          }}>
            <SettingsIcon className='w-6 h-6' />
          </Button>

          <Sheet open={isSettingsModalOpen} onOpenChange={open => setIsSettingsModalOpen(open)}>
            <SheetContent className='bg-bg'>
              <SheetHeader>
                <SheetTitle>Game Settings</SheetTitle>
                <SheetDescription>
                  Customise your game
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  { gameMode !== 'CUSTOM' && (
                    <Select defaultValue={gameMode} onValueChange={value => enterGameMode(value)}>
                      <SelectTrigger className=" col-span-4">
                        <SelectValue placeholder="Select a Game Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Game Modes</SelectLabel>
                          <SelectItem
                            key="gm_daily"
                            value="DAILY"
                          >
                            Daily
                          </SelectItem>
                          <SelectItem
                            key="gm_infinite"
                            value="INFINITE"
                          >
                            Infinite
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  { gameMode !== 'CUSTOM' && (
                    <Select defaultValue={wordPack} onValueChange={value => useWordPack(value)}>
                      <SelectTrigger className=" col-span-4">
                        <SelectValue placeholder="Select a WordPack" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>WordPacks</SelectLabel>
                          { !isLoadingWordPacks && availableWordPacks.map((wordPack, idx) => {
                            if (!isTablet && isMobile && idx > 4) return;
                            if (isTablet && idx > 12) return;
                            return (
                              <SelectItem
                                key={wordPack}
                                value={wordPack}
                              >
                                { wordleWordPackConfig.friendlyNameByName[wordPack] }
                              </SelectItem>
                            )
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                { gameUiState?.boardColour && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Select>
                      <SelectTrigger className="col-span-4">
                        <SelectValue placeholder="Select a board colour" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Board Colour</SelectLabel>
                          <SelectItem key="bd_blue" value="blue">Blue</SelectItem>
                          <SelectItem key="bd_purple" value="purple">Purple</SelectItem>
                          <SelectItem key="bd_pink" value="pink">Pink</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                { gameUiState?.keyboardColour && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Select>
                    <SelectTrigger className="col-span-4">
                      <SelectValue placeholder="Select a keyboard colour" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Keyboard Colour</SelectLabel>
                        <SelectItem key="kb_blue" value="blue">Blue</SelectItem>
                        <SelectItem key="kb_purple" value="purple">Purple</SelectItem>
                        <SelectItem key="kb_pink" value="pink">Pink</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                )}
                <Separator />
                <div className="grid grid-cols-4 items-center gap-8">
                  <Label htmlFor="swapDeleteAndEnter">
                    <Tooltip>
                      <TooltipTrigger className="text-left grid grid-cols-2 items-center gap-12">
                        Swap Keys
                        <InfoIcon className='w-4 h-4'/>
                      </TooltipTrigger>
                      <TooltipContent>
                        Swap the delete and enter keys on the on-screen keyboard
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Switch defaultChecked={gameUiState.swapDeleteAndEnter || false} onCheckedChange={checked => handleSwapDeleteAndEnter(checked)}/>
                  <Label htmlFor="confetti">
                    <Tooltip>
                      <TooltipTrigger className="text-left grid grid-cols-2 items-center gap-16">
                        Show confetti
                        <InfoIcon className='w-4 h-4'/>
                      </TooltipTrigger>
                      <TooltipContent>
                        Enable or disable confetti when you win a game
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Switch defaultChecked={gameUiState.confettiEnabled || true} onCheckedChange={checked => handleConfettiEnabled(checked)}  />
                  <Label htmlFor="speedRun">
                    <Tooltip>
                      <TooltipTrigger className="text-left grid grid-cols-2 items-center gap-12">
                        Speed Run
                        <InfoIcon className='w-4 h-4'/>
                      </TooltipTrigger>
                      <TooltipContent>
                        Speed run mode, disables the stats popup after a game
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Switch defaultChecked={gameUiState.speedRunModeEnabled || false} onCheckedChange={checked => handleSpeedRunEnabled(checked)}  />
                  <Label htmlFor="streamerMode">
                    <Tooltip>
                      <TooltipTrigger className="text-left grid grid-cols-2 items-center gap-16">
                        Streamer Mode
                        <InfoIcon className='w-4 h-4'/>
                      </TooltipTrigger>
                      <TooltipContent>
                        Speed run mode, disables the stats popup after a game
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Switch defaultChecked={streamerMode || false} onCheckedChange={checked => setStreamerMode(checked)}  />
                  <Label htmlFor="theme" className="text-left">
                    Dark Mode
                  </Label>
                  <Switch checked={theme === 'dark'} onCheckedChange={checked => setTheme(theme === 'dark' ? 'light' : 'dark')}  />
                  <Label htmlFor="gameSound" className="text-left">
                    Game Sound
                  </Label>
                  <Switch checked={gameSoundEnabled} onCheckedChange={checked => setGameSoundEnabled(checked)}  />
                </div>
                <Separator />
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger>
              <Button variant='default' className="fixed top-20 left-4">
                <HistoryIcon className='w-6 h-6'/>
              </Button>
            </SheetTrigger>
            <SheetContent className='bg-bg' side="left">
              <SheetHeader>
                <SheetTitle>Game History</SheetTitle>
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

          <div className="mx-auto flex w-full grow flex-col px-1 pt-20 pb-8 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
            <div className={`flex flex-col justify-center pb-6 short:pb-2`}>
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
            />
            <div className='flex justify-center items-center pt-10'>
              { !isCustom && (
                <Button
                  onClick={e => {
                    e.preventDefault();
                    setIsStatsModalOpen(!isStatsModalOpen)
                  }}
                  variant="default"
                  className='fixed top-20 right-24'
                >
                  <ChartBarIcon className='w-6 h-6' />
                </Button>
              )}
              <Link href="/games/wordrama/custom">
                <Button
                  variant="default"
                  className='fixed top-20 left-24'
                >
                  <GamepadIcon className='w-6 h-6' />
                </Button>
              </Link>
            </div>
            {isCustom && (
              <Button
                className='fixed top-20 right-24'
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
                <AlertDialogContent className="max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle className='text-center'>{ isCustom ? 'Custom Game' : 'Stats'}</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogDescription>
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
                        <div className="aspect-square w-full max-w-[120px] mx-auto overflow-hidden rounded-lg bg-bg dark:bg-gray-800 shadow flex flex-col items-center justify-center p-2">
                          <dd className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{gamesPlayed || 0}</dd>
                          <dt className="mt-1 text-[9px] sm:text-xs font-medium text-gray-500 dark:text-gray-200 text-center">🕹️ Games Played</dt>
                        </div>
                        <div className="aspect-square w-full max-w-[120px] mx-auto overflow-hidden rounded-lg bg-bg dark:bg-gray-800 shadow flex flex-col items-center justify-center p-2">
                          <dd className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{gamesWon || 0}</dd>
                          <dt className="mt-1 text-[9px] sm:text-xs font-medium text-gray-500 dark:text-gray-200 text-center">🏆 Games Won</dt>
                        </div>
                        <div className="aspect-square w-full max-w-[120px] mx-auto overflow-hidden rounded-lg bg-bg dark:bg-gray-800 shadow flex flex-col items-center justify-center p-2">
                          <dd className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{currentStreak || 0}</dd>
                          <dt className="mt-1 text-[9px] sm:text-xs font-medium text-gray-500 dark:text-gray-200 text-center">🔥 Current Streak</dt>
                        </div>
                        <div className="aspect-square w-full max-w-[120px] mx-auto overflow-hidden rounded-lg bg-bg dark:bg-gray-800 shadow flex flex-col items-center justify-center p-2">
                          <dd className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{bestStreak || 0}</dd>
                          <dt className="mt-1 text-[9px] sm:text-xs font-medium text-gray-500 dark:text-gray-200 text-center">💎 Best Streak</dt>
                        </div>
                        <div className="aspect-square w-full max-w-[120px] mx-auto overflow-hidden rounded-lg bg-bg dark:bg-gray-800 shadow flex flex-col items-center justify-center p-2">
                          <dd className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{Math.floor((gamesWon / gamesPlayed) * 100) || 0}%</dd>
                          <dt className="mt-1 text-[9px] sm:text-xs font-medium text-gray-500 dark:text-gray-200 text-center">📈 % of Wins</dt>
                        </div>
                      </dl>
                    </div>
                  )}
                  <AlertDialogFooter className='grid grid-cols-3 gap-5 max-w-full'>
                    {!isCustom && (<AlertDialogAction onClick={() => setIsStatsModalOpen(false)}>Close</AlertDialogAction>)}
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
                onClose={() => setIsStatsModalOpen(false)}
              >
                  <DrawerContent className={streamerMode ? 'h-4/5 bg-bg' : 'bg-bg'}>
                  <div className="mx-auto w-full max-w-screen-lg">
                    <DrawerHeader>
                      <DrawerTitle className="text-center text-4xl">Stats</DrawerTitle>
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
                      { isInfinite && 'Press Enter to play again' }
                      { isDaily && 'Come back tomorrow to play again or try out infinite mode' }
                    </DrawerDescription>
                    { !isCustom && (
                      <div id="fullWidthTabContent" className={`p-4 border-gray-200 dark:border-gray-600 ${streamerMode ? 'ml-64 w-1/2' : ''}`}>
                        <div className="p-4 bg-bg rounded-lg md:p-8 dark:bg-gray-800" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                            <dl className={`grid grid-cols-2 p-4 mx-auto text-gray-900 sm:grid-cols-3 ${streamerMode ? 'md:grid-cols-2 gap-8 max-w-md' : 'xl:grid-cols-5 gap-8 max-w-screen-xl'} dark:text-white sm:p-8`}>
                                <div className="flex flex-col items-center justify-center">
                              <dt className="mb-2 text-3xl font-extrabold">{ gamesPlayed || 0}</dt>
                                    <dd className="text-gray-500 dark:text-gray-400">🕹️ Games Played</dd>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <dt className="mb-2 text-3xl font-extrabold">{ gamesWon || 0}</dt>
                                    <dd className="text-gray-500 dark:text-gray-400">🏆 Games Won</dd>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <dt className="mb-2 text-3xl font-extrabold">{currentStreak || 0}</dt>
                                    <dd className="text-gray-500 dark:text-gray-400">🔥 Current Streak</dd>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <dt className="mb-2 text-3xl font-extrabold">{bestStreak || 0}</dt>
                                    <dd className="text-gray-500 dark:text-gray-400">💎 Best Streak</dd>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <dt className="mb-2 text-3xl font-extrabold">{ Math.floor((gamesWon / gamesPlayed) * 100) || 0}%</dt>
                                    <dd className="text-gray-500 dark:text-gray-400">📈 % of Wins</dd>
                                </div>
                            </dl>
                        </div>
                      </div>
                    )}
                    <DrawerFooter>
                      <DrawerClose asChild>

                      </DrawerClose>
                    </DrawerFooter>
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
