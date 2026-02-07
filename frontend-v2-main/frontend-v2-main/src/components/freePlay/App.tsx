import './App.css'

import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import Div100vh from 'react-div-100vh'
import { useDispatch } from 'react-redux';
import { useParams, redirect } from 'next/navigation';
import { isMobile, isTablet } from 'react-device-detect';
import { wordleWordPackConfig } from '../../lib/config';
import Link from 'next/link'
//import { getAppInsights } from '../../utils/appInsights'
import { AlertContainer } from './components/alerts/AlertContainer'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { InfoModal } from './components/modals/InfoModal'
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
  useGetWordleWoTDQuery,
  useGetWordleWordPackQuery,
} from '../../redux/api/freePlay';

import {
  findFirstUnusedReveal,
  getRandomWord,
  isWinningWord,
  isWordInWordList,
  unicodeLength,
} from './lib/words'
import { getWordleState } from '../../redux/wordleFreePlay/helpers';
import { getWordleGameUiState } from '@/redux/ui/helpers';
import {
  setGameMode,
  setGameState,
  setWordLength,
  setWordPack,
  setInitialState
} from '../../redux/wordle/actions';
import {
  setWordleGameUiState
} from '../../redux/ui/actions';
import { GameState } from '../../redux/wordle/types';
import { Home, SettingsIcon } from 'lucide-react'
import { wordleDefaultState } from '../../redux/wordleFreePlay/defaultStates';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { ChartBarIcon } from '@heroicons/react/outline'
import { useTheme } from 'next-themes'

function App(){
  const pathParams = useParams();
  const wordPackParam = pathParams.wordPackParam as string;
  //const appInsights = getAppInsights();
  //appInsights.trackPageView({ name: 'Wordle Free Play' });
  const { setTheme, theme } = useTheme();
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } = useAlert();
  // Redux State
  const dispatch = useDispatch();

  useEffect(() => {
    if (!wordPackParam) return;
    const paramMapper: { [key: string]: string } = {
      '5-letter': 'FIVE_LETTER',
      'five-letter': 'FIVE_LETTER',
      'FIVE_LETTER': 'FIVE_LETTER',
      '6-letter': 'SIX_LETTER',
      'six-letter': 'SIX_LETTER',
      'SIX_LETTER': 'SIX_LETTER',
      '7-letter': 'SEVEN_LETTER',
      'seven-letter': 'SEVEN_LETTER',
      'SEVEN_LETTER': 'SEVEN_LETTER',
      '8-letter': 'EIGHT_LETTER',
      'eight-letter': 'EIGHT_LETTER',
      'EIGHT_LETTER': 'EIGHT_LETTER',
      '9-letter': 'NINE_LETTER',
      'nine-letter': 'NINE_LETTER',
      'NINE_LETTER': 'NINE_LETTER',
      '10-letter': 'TEN_LETTER',
      'ten-letter': 'TEN_LETTER',
      'TEN_LETTER': 'TEN_LETTER',
      '11-letter': 'ELEVEN_LETTER',
      'eleven-letter': 'ELEVEN_LETTER',
      'ELEVEN_LETTER': 'ELEVEN_LETTER',
    }
    if (!paramMapper[wordPackParam]) return redirect('/free-play');
    dispatch(setWordPack(paramMapper[wordPackParam]));
  }, [])

  const gameState = getWordleState();
  const gameUiState = getWordleGameUiState();
  const { gameMode, wordLength, wordPack } = gameState;
  const currentGame = gameState.modes[gameState.gameMode][gameState.wordPack];

  const solution = gameState.modes[gameState.gameMode][gameState.wordPack].solution;
  const guesses = gameState.modes[gameState.gameMode][gameState.wordPack].guesses;
  const isGameWon = gameState.modes[gameState.gameMode][gameState.wordPack].isGameWon;
  const isGameLost = gameState.modes[gameState.gameMode][gameState.wordPack].isGameLost;
  const isGameInProgress = gameState.modes[gameState.gameMode][gameState.wordPack].isGameInProgress;

  const availableWordPacks = Object.keys(wordleDefaultState);

  // API
  const { data: wordleWordPack, isLoading: isLoadingWordPack  } = useGetWordleWordPackQuery(gameState.wordPack);
  const { data: wordOfTheDay, isLoading: isLoadingWoTD } = useGetWordleWoTDQuery(wordPack);

  // Local State
  const [counter, setCounter] = useState(1);
  const [gameLoading, setGameLoading] = useState(true);
  const [currentRowClass, setCurrentRowClass] = useState('');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isSignUpCTA, setIsSignUpCTA] = useState(false);

  const isDaily = gameMode === 'DAILY';
  const isInfinite = gameMode === 'INFINITE';
  const isCustom = gameMode === 'CUSTOM';

  // Helper Functions
  function clearCurrentRowClass() {
    return setCurrentRowClass('');
  }

  function handleSwapDeleteAndEnter(swapDeleteAndEnter: boolean) {
    return dispatch(setWordleGameUiState({ swapDeleteAndEnter }))
  }

  function handleConfettiEnabled(confettiEnabled: boolean) {
    return dispatch(setWordleGameUiState({ confettiEnabled }))
  }

  function handleSpeedRunEnabled(speedRunModeEnabled: boolean) {
    return dispatch(setWordleGameUiState({ speedRunModeEnabled }))
  }

  function enterGameMode(gameMode: string) {
    setShowConfetti(false);
    return dispatch(setGameMode(gameMode.toUpperCase()))
  }

  function useWordLength(wordLength: number) {
    setShowConfetti(false);
    return dispatch(setWordLength(wordLength));
  }

  function useWordPack(wordPack: string) {
    setShowConfetti(false);
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

  function newInfiniteGame(){
    if (isLoadingWordPack) return;
    const newSolution: string = getRandomWord(wordleWordPack?.data?.wordList);
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
    //   if (isCustom && isGameWon) return;
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
        newInfiniteGame();
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

  // If the game is loaded and gameMode is daily,
  // load the word of the day
  useEffect(() => {
    if (gameLoading) return;
    if (gameMode !== 'DAILY') return;
    if (solution === wordOfTheDay?.data?.todaysWord) return;
    updateGameState({
      solution: wordOfTheDay?.data?.todaysWord,
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
    return setGameLoading(false);
  }, [isLoadingWoTD, isLoadingWordPack, gameState])

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

      if (isGameLost) {
        setCounter(counter + 1)
      }
      console.log(counter)
      if(isGameWon || counter === 3) {
        setIsSignUpCTA(true);
      }

    }
  }, [isGameWon, isGameLost]);

  if (gameLoading) return 'Loading';
  return (
    <Div100vh>
      { gameUiState.confettiEnabled && showConfetti ? <Confetti className='w-full' /> : null}
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
                { gameMode !== 'CUSTOM' && !wordPackParam && (
                  <Select defaultValue={wordPack} onValueChange={value => useWordPack(value)}>
                    <SelectTrigger className=" col-span-4">
                      <SelectValue placeholder="Select a WordPack" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>WordPacks</SelectLabel>
                        { availableWordPacks.map((wordPack, idx) => {
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

              <Separator />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="swapDeleteAndEnter" className="text-left">
                  Swap Delete/Enter
                </Label>
                <Switch defaultChecked={gameUiState.swapDeleteAndEnter || false} onCheckedChange={checked => handleSwapDeleteAndEnter(checked)}/>
                <Label htmlFor="confetti" className="text-left">
                  Show confetti
                </Label>
                <Switch defaultChecked={gameUiState.confettiEnabled || true} onCheckedChange={checked => handleConfettiEnabled(checked)}  />
                <Label htmlFor="lightDark" className="text-left">
                  Dark Mode
                </Label>
                <Switch checked={theme === 'dark'} onCheckedChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="mx-auto flex w-full grow flex-col px-1 pt-20 pb-8 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
          <div className={`flex flex-col justify-center pb-6 short:pb-2`}>
            <Grid
              solution={gameState.modes[gameState.gameMode][gameState.wordPack].solution}
              guesses={gameState.modes[gameState.gameMode][gameState.wordPack].guesses || []}
              currentGuess={currentGuess}
              isRevealing={isRevealing}
              currentRowClassName={currentRowClass}
            />
          </div>
          {isGameWon || isGameLost && (<p className='text-center mb-5'>Press enter to play again</p>) }
          <Keyboard
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}
            solution={gameState.modes[gameState.gameMode][gameState.wordPack].solution}
            guesses={gameState.modes[gameState.gameMode][gameState.wordPack].guesses || []}
            isRevealing={isRevealing}
            swapEnterAndDelete={gameUiState?.swapDeleteAndEnter || false}
          />
          <ins
            className="adsbygoogle"
            style={{ "display": "block"}}
            data-ad-client="ca-pub-2296158652555597"
            data-ad-slot="8219203779"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />

          {
            isStatsModalOpen && isSignUpCTA && (
              <AlertDialog open={isStatsModalOpen}>
                <AlertDialogContent className="max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle className='text-center'>
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
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogDescription className='text-center'>
                    Sign up to track your game scores, play against friends and climb the leaderboard
                    <br/>

                  </AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogAction onClick={() =>{
                      //appInsights.trackEvent({ name: 'wordelFreePlayCTASignUpClicked', properties: { wordPack, gameMode, isGameWon, isGameLost, counter} });
                      window.location.href = '/signup'
                    }}>
                      Sign Up
                    </AlertDialogAction>
                    <AlertDialogAction onClick={() => {
                        //appInsights.trackEvent({ name: 'wordelFreePlayCTALaterClicked', properties: { wordPack, gameMode, isGameWon, isGameLost, counter} });
                        setIsStatsModalOpen(false);
                    }}>
                      Later
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )
          }

          <Drawer
            open={isStatsModalOpen && !isSignUpCTA}
            onClose={() => setIsStatsModalOpen(false)}
          >
              <DrawerContent className='bg-bg'>
              <div className="mx-auto w-full max-w-screen-lg">
                <DrawerHeader>
                  <DrawerTitle className="text-center text-4xl">
                    { isGameWon && 'You won!' }
                    { isGameLost && `You lost! - The answer was ${solution }` }
                  </DrawerTitle>
                </DrawerHeader>
                <DrawerDescription className="text-center text-xl">
                  { isInfinite && 'Press Enter to play again' }
                  { isDaily && 'Come back tomorrow to play again' }
                </DrawerDescription>
                <DrawerFooter>
                  <DrawerClose asChild>

                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
          <InfoModal
            isOpen={isInfoModalOpen}
            handleClose={() => setIsInfoModalOpen(false)}
          />
          <AlertContainer />
        </div>
      </div>
    </Div100vh>
  )
}

export default App;
