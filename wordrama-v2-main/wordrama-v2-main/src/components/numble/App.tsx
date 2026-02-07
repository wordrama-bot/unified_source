import './App.css'

import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import Div100vh from 'react-div-100vh'
import { useDispatch } from 'react-redux';

import { AlertContainer } from './components/alerts/AlertContainer'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { InfoModal } from './components/modals/InfoModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { StatsModal } from './components/modals/StatsModal'
import { Navbar } from './components/navbar/Navbar'
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
  useGetWordleSavedStateQuery,
  useUpdateWordleSavedStateMutation,
  useGetWordleStreakQuery
} from '../../redux/api/wordrama';
import {
  findFirstUnusedReveal,
  getRandomWord,
  isWinningWord,
  isWordInWordList,
  unicodeLength,
} from './lib/words'
import { getWordleState } from '../../redux/wordle/helpers';
import {
  setGameMode,
  setGameState,
  setWordLength,
  setWordPack,
  setInitialState
} from '../../redux/wordle/actions';
import { GameState } from '../../redux/wordle/types';

function AApp(){
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } = useAlert();

  // Redux State
  const dispatch = useDispatch();
  const gameState = getWordleState();
  const { gameMode, wordLength, wordPack, modes } = gameState;
  const currentGame = modes[gameMode][wordLength];
  const {
    solution, guesses, isGameWon, isGameLost, isGameInProgress
  } = currentGame;

  // API
  const { data: savedState, isLoading: isLoadingSavedState } = useGetWordleSavedStateQuery();
  const { data: numblePack, isLoading: isLoadingNumblePack  } = useGetNumblePackQuery(numblePack);
  const { data: wordOfTheDay, isLoading: isLoadingWoTD } = useGetWordleWoTDQuery(wordPack);
  const { data: streakData, isLoading: isLoadingStreakData, isError: isErrorStreakData } = useGetNumbleStreakQuery({ gameMode, numberLength });
  const { currentStreak, bestStreak } =
    (isErrorStreakData ? {
      currentStreak: 0,
      bestStreak: 0
    } : streakData?.data) || {
      currentStreak: 0,
      bestStreak: 0
    };

  const [updateRemoteState] = useUpdateNumbleSavedStateMutation();

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

  const isDaily = gameMode === 'DAILY';
  const isInfinite = gameMode === 'INFINITE';
  const isCustom = gameMode === 'CUSTOM';

  // Helper Functions
  function clearCurrentRowClass() {
    return setCurrentRowClass('');
  }

  function enterGameMode(gameMode: string) {
    setShowConfetti(false);
    return dispatch(setGameMode(gameMode.toUpperCase()))
  }

  function useNumberLength(numberLength: number) {
    setShowConfetti(false);
    return dispatch(setWordLength(wordLength));
  }

  // ONLY needed in custom mode
  function useNumblePack(numblePack: string) {
    return dispatch(setNumblePack(numblePack));
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
    updateGameState({
      solution: getRandomNumber(numb),
      guesses: [],
      isGameWon: false,
      isGameLost: false,
      isGameInProgress: false,
      resultSave: false
    })
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

    if (unicodeLength(currentGuess) !== solution.length) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
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

    const winningNumber = solution === currentGuess
    if (
      unicodeLength(currentGuess) === solution.length &&
      guesses.length <= MAX_CHALLENGES &&
      (!isGameWon && !isGameLost)
    ) {

      if (winningNumber) {
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

  // If game is loaded, keep remote state updated
  // This also acts as a trigger for game won/lost
  // functionality on the backend
  useEffect(() => {
    if (gameLoading) return;
    const { isLoading, ...newRemoteState } = gameState;
    updateRemoteState(newRemoteState);
  }, [gameState, gameLoading]);

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
    if (gameLoading && gameMode !== 'DAILY') return;
    if (solution === numberOfTheDay?.data?.todaysNumber) return;
    updateGameState({
      solution: numberOfTheDay?.data?.todaysNumber,
      guesses: [],
      isGameWon: false,
      isGameLost: false,
      isGameInProgress: false,
    })
  }, [gameLoading, gameMode, wordOfTheDay, isLoadingWoTD]);

  // If the game is loaded and the gameMode is infinite
  // and the game was won or lost, start a new game
  useEffect(() => {
    if (gameLoading) return;
    else if (gameMode !== 'INFINITE') return;
    else if (guesses.length < 6) return;
    newInfiniteGame();
  }, [gameLoading, gameMode]);

  // Check if all dependencies are ready and set the game to ready
  useEffect(() => {
    if (gameState.isLoading) return setGameLoading(true);
      else if(isLoadingWoTD) return setGameLoading(true);
        else if (isLoadingNumblePack) return setGameLoading(true);
          else if (isLoadingSavedState) return setGameLoading(true);
    return setGameLoading(false);
  }, [isLoadingWoTD, isLoadingNumblePack, isLoadingSavedState, gameState])

  // If game was won/lost
  // Show end game modal
  // If game was won show modal and confetti
  useEffect(() => {
    if (isGameWon || isGameLost) {
      if (isGameWon) setShowConfetti(true);
      setIsStatsModalOpen(true);
    }
  }, [isGameWon, isGameLost]);

  if (gameLoading) return 'Loading';
  {
  }
  return (
    <Div100vh>
      {
        //TODO; Check if user settings has confetti enabled
        //isConfettiEnabled
      }
      { showConfetti ? <Confetti /> : null}
      <div className="flex h-full flex-col">
        <Navbar
          forfitGame={()=>{}}
          setIsInfoModalOpen={setIsInfoModalOpen}
          setIsStatsModalOpen={setIsStatsModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
          useWordLength={useNumblePack}
          useGameMode={enterGameMode}
          gameMode={gameMode}
          wordLength={wordLength}
        />

        <div className="mx-auto flex w-full grow flex-col px-1 pt-2 pb-8 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
          <div className={`flex flex-col justify-center pb-6 short:pb-2`}>
            <Grid
              solution={solution}
              guesses={guesses}
              currentGuess={currentGuess}
              isRevealing={isRevealing}
              currentRowClassName={currentRowClass}
            />
            {
              isLoadingStreakData || isErrorStreakData || currentStreak === 0 ? null : (
                <div className="pt-2 pb-6 short:pb-2 text-center text-white">
                  Current Streak: { currentStreak }
                </div>
              )
            }
          </div>
          <Keyboard
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}
            solution={solution}
            guesses={guesses || []}
            isRevealing={isRevealing}
            swapEnterAndDelete={false}
          />
          <InfoModal
            isOpen={isInfoModalOpen}
            handleClose={() => setIsInfoModalOpen(false)}
          />
          <StatsModal
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            wordLength={gameState.wordPack}
            isOpen={isStatsModalOpen}
            handleClose={() => setIsStatsModalOpen(false)}
            handleGameReset={() => {}}
            solution={solution}
            guesses={guesses}
            isGameLost={isGameLost}
            isGameWon={isGameWon}
          />
          <AlertContainer />
        </div>
      </div>
    </Div100vh>
  )
}

function App() {
  return (
    <Keyboard
      onChar={()=>{}}
      onDelete={()=>{}}
      onEnter={()=>{}}
      solution={'123456'}
      guesses={[]}
      isRevealing={false}
      swapEnterAndDelete={false}
    />
  );
}

export default App;
