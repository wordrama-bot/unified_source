import {
  addDays,
  differenceInDays,
  formatISO,
  parseISO,
  startOfDay,
} from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import queryString from 'query-string'

import { ENABLE_ARCHIVED_GAMES } from '../constants/settings'
import { NOT_CONTAINED_MESSAGE, WRONG_SPOT_MESSAGE } from '../constants/strings'
import { getValidGuesses } from '../constants/validGuesses'
import { getWordList } from '../constants/wordlist'
import { getToday } from './dateutils'
import { getStoredWordLength } from './localStorage'
import { getGuessStatuses } from './statuses'

// 1 January 2022 Game Epoch
export const firstGameDate = new Date(2022, 0)
export const periodInDays = 1

const wordLengthTextNumberMap: { [key: string]: number } = {
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
  ELEVEN: 11,
}

const wordLengthNumberTextMap: { [key: number]: string } = {
  5: 'FIVE',
  6: 'SIX',
  7: 'SEVEN',
  8: 'EIGHT',
  9: 'NINE',
  10: 'TEN',
  11: 'ELEVEN',
}

export const isWordInWordList = (
  word: string,
  isCustomGame: boolean,
  customGameData: any
) => {
  let wordLength = getStoredWordLength()
  let customWord = ''
  if (isCustomGame) {
    customWord = localeAwareLowerCase(customGameData.customWord)
    wordLength = wordLengthNumberTextMap[customWord.length]
  }
  const WORDS = getWordList(wordLength)
  const VALID_GUESSES = getValidGuesses(wordLength)
  if (isCustomGame) {
    WORDS.push(customWord)
    VALID_GUESSES.push(customWord)
  }

  return (
    WORDS.includes(localeAwareLowerCase(word)) ||
    VALID_GUESSES.includes(localeAwareLowerCase(word))
  )
}

export const isWinningWord = (solution: string, word: string) => {
  return solution === word
}

// build a set of previously revealed letters - present and correct
// guess must use correct letters in that space and any other revealed letters
// also check if all revealed instances of a letter are used (i.e. two C's)
export const findFirstUnusedReveal = (
  solution: string,
  word: string,
  guesses: string[]
) => {
  if (guesses.length === 0) {
    return false
  }

  const lettersLeftArray = new Array<string>()
  const guess = guesses[guesses.length - 1]
  const statuses = getGuessStatuses(solution, guess)
  const splitWord = unicodeSplit(word)
  const splitGuess = unicodeSplit(guess)

  for (let i = 0; i < splitGuess.length; i++) {
    if (statuses[i] === 'correct' || statuses[i] === 'present') {
      lettersLeftArray.push(splitGuess[i])
    }
    if (statuses[i] === 'correct' && splitWord[i] !== splitGuess[i]) {
      return WRONG_SPOT_MESSAGE(splitGuess[i], i + 1)
    }
  }

  // check for the first unused letter, taking duplicate letters
  // into account - see issue #198
  let n
  for (const letter of splitWord) {
    n = lettersLeftArray.indexOf(letter)
    if (n !== -1) {
      lettersLeftArray.splice(n, 1)
    }
  }

  if (lettersLeftArray.length > 0) {
    return NOT_CONTAINED_MESSAGE(lettersLeftArray[0])
  }
  return false
}

export const unicodeSplit = (word: string) => {
  return new GraphemeSplitter().splitGraphemes(word)
}

export const unicodeLength = (word: string) => {
  return unicodeSplit(word).length
}

export const localeAwareLowerCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleLowerCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toLowerCase()
}

export const localeAwareUpperCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleUpperCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toUpperCase()
}

export const getLastGameDate = (today: Date) => {
  const t = startOfDay(today)
  let daysSinceLastGame = differenceInDays(firstGameDate, t) % periodInDays
  return addDays(t, -daysSinceLastGame)
}

export const getNextGameDate = (today: Date) => {
  return addDays(getLastGameDate(today), periodInDays)
}

export const isValidGameDate = (date: Date) => {
  if (date < firstGameDate || date > getToday()) {
    return false
  }

  return differenceInDays(firstGameDate, date) % periodInDays === 0
}

export const getIndex = (gameDate: Date) => {
  let start = firstGameDate
  let index = -1
  do {
    index++
    start = addDays(start, periodInDays)
  } while (start <= gameDate)

  return index
}

export const getWordOfDay = (index: number) => {
  const WORDS = getWordList(getStoredWordLength())
  if (index < 0) {
    throw new Error('Invalid index')
  }

  return localeAwareUpperCase(WORDS[index % WORDS.length])
}

export const getRandomWord = () => {
  const WORDS = getWordList(getStoredWordLength())
  const randomIndex = Math.floor(Math.random() * WORDS.length) - 1
  if (randomIndex < 0) {
    throw new Error('Invalid index')
  }

  return localeAwareUpperCase(WORDS[randomIndex % WORDS.length])
}

export const getSolution = (
  isDaily: boolean = true,
  gameDate: Date,
  isCustomGame: boolean = false,
  customGameData: any = {}
) => {
  if (isCustomGame) {
    const WORDS = getWordList(customGameData.customWordLength)
    return {
      solution: customGameData.customWord,
      solutionGameDate: getToday(),
      solutionIndex: WORDS.length + 1,
      tomorrow: getNextGameDate(getToday()).valueOf(),
    }
  }

  if (isDaily) {
    const nextGameDate = getNextGameDate(gameDate)
    const index = getIndex(gameDate)
    const wordOfTheDay = getWordOfDay(index)
    return {
      solution: wordOfTheDay,
      solutionGameDate: gameDate,
      solutionIndex: index,
      tomorrow: nextGameDate.valueOf(),
    }
  }

  const word = getRandomWord()
  const WORDS = getWordList(getStoredWordLength())
  return {
    solution: word,
    solutionGameDate: getToday(),
    solutionIndex: WORDS.indexOf(word),
    tomorrow: getNextGameDate(getToday()).valueOf(),
  }
}

export const getGameDate = () => {
  if (getIsLatestGame()) {
    return getToday()
  }

  const parsed = queryString.parse(window.location.search)
  try {
    const d = startOfDay(parseISO(parsed.d!.toString()))
    if (d >= getToday() || d < firstGameDate) {
      setGameDate(getToday())
    }
    return d
  } catch (e) {
    console.log(e)
    return getToday()
  }
}

export const setGameDate = (d: Date) => {
  try {
    if (d < getToday()) {
      window.location.href = '/?d=' + formatISO(d, { representation: 'date' })
      return
    }
  } catch (e) {
    console.log(e)
  }
  window.location.href = '/'
}

export const getIsLatestGame = () => {
  if (!ENABLE_ARCHIVED_GAMES) {
    return true
  }
  const parsed = queryString.parse(window.location.search)
  return parsed === null || !('d' in parsed)
}

export const getGame = (
  isDaily: boolean,
  isCustomGame: boolean = false,
  customGameData: any = {}
) => {
  return getSolution(isDaily, getGameDate(), isCustomGame, customGameData)
}
