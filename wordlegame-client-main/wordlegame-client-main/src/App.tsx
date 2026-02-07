import './App.css'

import { ClockIcon } from '@heroicons/react/outline'
import base64 from 'base-64'
import { format } from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import queryString from 'query-string'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import Div100vh from 'react-div-100vh'

import { AlertContainer } from './components/alerts/AlertContainer'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { DatePickerModal } from './components/modals/DatePickerModal'
import { InfoModal } from './components/modals/InfoModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { StatsModal } from './components/modals/StatsModal'
import { Navbar } from './components/navbar/Navbar'
import {
  DATE_LOCALE,
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
import { submitGameSettings, submitGameStats, submitGameWin } from './lib/api'
import { isInAppBrowser } from './lib/browser'
import {
  getStoredIsHighContrastMode,
  getStoredSwapEnterAndDelete,
  getStoredWordLength,
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  setStoredIsConfettiEnabled,
  setStoredIsHighContrastMode,
  setStoredSwapEnterAndDelete,
} from './lib/localStorage'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import {
  findFirstUnusedReveal,
  getGame,
  getGameDate,
  getIsLatestGame,
  isWinningWord,
  isWordInWordList,
  unicodeLength,
} from './lib/words'

function App() {
  const isLatestGame = getIsLatestGame()
  const gameDate = getGameDate()
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [isDaily, setIsDaily] = useState(false)
  const [solution, setSolution] = useState('')
  const [solutionGameDate, setSolutionGameDate] = useState(new Date())
  const [solutionIndex, setSolutionIndex] = useState(0)
  const [tomorrow, setTomorrow] = useState(0)
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isGameLost, setIsGameLost] = useState(false)
  const [isShowingHistoric, setIsShowingHistoric] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
      ? true
      : false
  )
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  )
  const [swapEnterAndDelete, setSwapEnterAndDelete] = useState(
    getStoredSwapEnterAndDelete()
  )
  const [wordLength, setWordLength] = useState(getStoredWordLength())
  const [isCustomGame, setIsCustomGame] = useState(false)
  const [customGameData, setCustomGameData] = useState<{
    hint?: string | null
    customWord: string
  }>({
    customWord: '',
  })
  const [isRevealing, setIsRevealing] = useState(false)
  const [guesses, setGuesses] = useState<string[]>(
    () =>
      loadGameStateFromLocalStorage(true, isDaily, wordLength)?.guesses || []
  )
  const [stats, setStats] = useState(() => loadStats(isDaily))
  const [isHardMode, setIsHardMode] = useState(
    localStorage.getItem('gameMode')
      ? localStorage.getItem('gameMode') === 'hard'
      : false
  )
  const [isConfettiEnabled, setIsConfettiEnabled] = useState(
    localStorage.getItem('confettiEnabled')
      ? localStorage.getItem('confettiEnabled') === 'true'
      : false
  )
  const [showConfetti, setShowConfetti] = useState(false)
  const [isSpeedRunEnabled, setIsSpeedRunEnabled] = useState(
    localStorage.getItem('speedRunEnabled')
      ? localStorage.getItem('speedRunEnabled') === 'true'
      : false
  )

  useEffect(() => {
    // Custom Game ID from query string
    let { cgid } = queryString.parse(window.location.search)
    console.log(cgid)
    if (cgid) {
      cgid = cgid as string
      setIsCustomGame(true)
      const lsStr: string = localStorage.getItem(cgid) as string
      const decodedStr = base64.decode(lsStr)
      const parsedLSStr = lsStr && decodedStr ? JSON.parse(decodedStr) : {}
      setCustomGameData(parsedLSStr || {})
      return
    }
    setIsCustomGame(false)
    setCustomGameData({
      customWord: '',
    })
  }, [isCustomGame])

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (!loadGameStateFromLocalStorage(true, isDaily)) {
      setTimeout(() => {
        setIsInfoModalOpen(true)
      }, WELCOME_INFO_MODAL_MS)
    }
  }, [isDaily])

  useEffect(() => {
    DISCOURAGE_INAPP_BROWSERS &&
      isInAppBrowser() &&
      showErrorAlert(DISCOURAGE_INAPP_BROWSER_TEXT, {
        persist: false,
        durationMs: 7000,
      })
  }, [showErrorAlert])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }

    ;(async () => await submitGameSettings())()
  }, [isDarkMode, isHighContrastMode, wordLength, isConfettiEnabled])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleHardMode = (isHard: boolean) => {
    if (guesses.length === 0 || localStorage.getItem('gameMode') === 'hard') {
      setIsHardMode(isHard)
      localStorage.setItem('gameMode', isHard ? 'hard' : 'normal')
      ;(async () => await submitGameSettings())()
    } else {
      showErrorAlert(HARD_MODE_ALERT_MESSAGE)
    }
  }

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast)
    setStoredIsHighContrastMode(isHighContrast)
  }

  const handleSwapEnterAndDelete = (swapEnterAndDelete: boolean) => {
    setSwapEnterAndDelete(swapEnterAndDelete)
    setStoredSwapEnterAndDelete(swapEnterAndDelete)
  }

  const handleConfettiEnabled = (isEnabled: boolean) => {
    setIsConfettiEnabled(isEnabled)
    setStoredIsConfettiEnabled(isEnabled)
  }

  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

  const handleResetGame = () => {
    const { solution, solutionGameDate, solutionIndex, tomorrow } = getGame(
      isDaily,
      isCustomGame,
      customGameData
    )
    setSolution(solution)
    setSolutionGameDate(solutionGameDate)
    setSolutionIndex(solutionIndex)
    setTomorrow(tomorrow)
    setIsGameLost(false)
    setIsGameWon(false)
    setCurrentRowClass('')
    setCurrentGuess('')
    setGuesses([])
    return
  }

  useEffect(() => {
    const { solution, solutionGameDate, solutionIndex, tomorrow } = getGame(
      isDaily,
      isCustomGame,
      customGameData
    )
    setSolution(solution)
    setSolutionGameDate(solutionGameDate)
    setSolutionIndex(solutionIndex)
    setTomorrow(tomorrow)
    if (!isDaily) {
      setIsShowingHistoric(false)
      setGuesses([])
      setIsGameLost(false)
      setIsGameWon(false)
      setCurrentRowClass('')
      setCurrentGuess('')
    }

    if (isDaily) {
      const loaded = loadGameStateFromLocalStorage(
        isLatestGame,
        isDaily,
        wordLength
      )
      if (solution !== loaded?.solution) {
        setGuesses([])
        setIsGameLost(false)
        setIsGameWon(false)
        setIsShowingHistoric(false)
        setCurrentRowClass('')
        setCurrentGuess('')
        return
      }

      setIsShowingHistoric(true)
      const gameWasWon = loaded?.guesses.includes(solution) || false
      setIsGameWon(gameWasWon)
      setIsGameLost(!gameWasWon)
      if (loaded?.guesses.length === MAX_CHALLENGES && !gameWasWon) {
        setIsShowingHistoric(true)
        showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
          persist: true,
        })
      }
      setGuesses(loaded?.guesses || [])
    }
    setStats(loadStats(isDaily))
  }, [isDaily, isCustomGame])

  useEffect(() => {
    if (!isShowingHistoric && isGameWon) {
      if (!isCustomGame) {
        ;(async () => await submitGameStats(isDaily))()
      }
      if (isConfettiEnabled) {
        setShowConfetti(true)
        if (!isSpeedRunEnabled) {
          setIsStatsModalOpen(true)
        }
        setTimeout(() => {
          setShowConfetti(false)
        }, 3000)
      }

      if (!isConfettiEnabled && !isSpeedRunEnabled) {
        setIsStatsModalOpen(true)
      }
    }

    if (!isShowingHistoric && isGameLost && !isCustomGame) {
      ;(async () => await submitGameStats(isDaily))()
      setIsStatsModalOpen(true)
    }

    if (!isShowingHistoric && isGameWon && !isCustomGame) {
      ;(async () => await submitGameWin(guesses, solution))()
    }

    if (isDaily) {
      if (isGameWon) {
        const winMessage =
          WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
        const delayMs = REVEAL_TIME_MS * solution.length

        showSuccessAlert(winMessage, {
          delayMs,
          onClose: () => setIsStatsModalOpen(true),
        })
      }

      if (isGameLost) {
        setTimeout(
          () => {
            setIsStatsModalOpen(true)
          },
          (solution.length + 1) * REVEAL_TIME_MS
        )
      }
    }

    if (!isCustomGame) {
      saveGameStateToLocalStorage(
        getIsLatestGame(),
        { guesses, solution },
        isDaily,
        wordLength
      )
    }
  }, [isGameWon, isGameLost, showSuccessAlert])

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= solution.length &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon &&
      !isShowingHistoric
    ) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    )
  }

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      if (isCustomGame && isGameWon) return

      if (!isDaily) {
        const { solution, solutionGameDate, solutionIndex, tomorrow } = getGame(
          isDaily,
          isCustomGame,
          customGameData
        )
        setSolution(solution)
        setSolutionGameDate(solutionGameDate)
        setSolutionIndex(solutionIndex)
        setTomorrow(tomorrow)
        setIsGameLost(false)
        setIsGameWon(false)
        setCurrentRowClass('')
        setCurrentGuess('')
        setGuesses([])
        setIsStatsModalOpen(false)
        setShowConfetti(false)
      }
      return
    }

    if (!(unicodeLength(currentGuess) === solution.length)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    if (!isWordInWordList(currentGuess, isCustomGame, customGameData)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    if (isHardMode) {
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

    setIsRevealing(true)
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false)
    }, REVEAL_TIME_MS * solution.length)

    const winningWord = isWinningWord(solution, currentGuess)

    if (
      unicodeLength(currentGuess) === solution.length &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setGuesses([...guesses, currentGuess])
      setCurrentGuess('')

      if (winningWord) {
        if (isLatestGame && !isCustomGame) {
          setStats(
            addStatsForCompletedGame(wordLength, stats, guesses.length, isDaily)
          )
        }
        return setIsGameWon(true)
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        if (isLatestGame) {
          setStats(
            addStatsForCompletedGame(
              wordLength,
              stats,
              guesses.length + 1,
              isDaily
            )
          )
        }
        setIsGameLost(true)
        showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
          persist: false,
          delayMs: REVEAL_TIME_MS * 5 + 1,
          durationMs: 3000,
        })
      }
    }
  }

  return (
    <Div100vh>
      {isConfettiEnabled && showConfetti ? <Confetti /> : null}
      <div className="flex h-full flex-col">
        <Navbar
          isDaily={isDaily}
          setIsDaily={setIsDaily}
          setIsInfoModalOpen={setIsInfoModalOpen}
          setIsStatsModalOpen={setIsStatsModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
          setWordLength={setWordLength}
          handleResetGame={handleResetGame}
          isCustomGame={isCustomGame}
          customGameData={customGameData}
        />

        {!isLatestGame && (
          <div className="flex items-center justify-center">
            <ClockIcon className="h-6 w-6 stroke-gray-600 dark:stroke-gray-300" />
            <p className="text-base text-gray-600 dark:text-gray-300">
              {format(gameDate, 'd MMMM yyyy', { locale: DATE_LOCALE })}
            </p>
          </div>
        )}

        <div className="mx-auto flex w-full grow flex-col px-1 pt-2 pb-8 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
          <div className="flex flex-col justify-center pb-6 short:pb-2">
            <Grid
              solution={solution}
              guesses={guesses}
              currentGuess={currentGuess}
              isRevealing={isRevealing}
              currentRowClassName={currentRowClass}
            />
          </div>
          <Keyboard
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}
            solution={solution}
            guesses={guesses}
            isRevealing={isRevealing}
            swapEnterAndDelete={swapEnterAndDelete}
          />
          <InfoModal
            isOpen={isInfoModalOpen}
            handleClose={() => setIsInfoModalOpen(false)}
          />
          <StatsModal
            isDaily={isDaily}
            isOpen={isStatsModalOpen}
            handleClose={() => setIsStatsModalOpen(false)}
            handleGameReset={() => handleResetGame()}
            solution={solution}
            solutionGameDate={solutionGameDate}
            solutionIndex={solutionIndex}
            tomorrow={tomorrow}
            guesses={guesses}
            gameStats={stats}
            wordLength={wordLength}
            isGameLost={isGameLost}
            isGameWon={isGameWon}
            isHardMode={isHardMode}
            isDarkMode={isDarkMode}
            isHighContrastMode={isHighContrastMode}
            numberOfGuessesMade={guesses.length}
            isCustomGame={isCustomGame}
          />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            handleClose={() => setIsSettingsModalOpen(false)}
            isHardMode={isHardMode}
            handleHardMode={handleHardMode}
            isDarkMode={isDarkMode}
            handleDarkMode={handleDarkMode}
            isHighContrastMode={isHighContrastMode}
            handleHighContrastMode={handleHighContrastMode}
            swapEnterAndDelete={swapEnterAndDelete}
            handleSwapEnterAndDelete={handleSwapEnterAndDelete}
            isConfettiEnabled={isConfettiEnabled}
            handleConfettiEnabled={handleConfettiEnabled}
            isSpeedRunMode={isSpeedRunEnabled}
            handleSpeedRunMode={setIsSpeedRunEnabled}
            isCustomGame={isCustomGame}
          />
          <AlertContainer />
        </div>
      </div>
    </Div100vh>
  )
}

export default App
