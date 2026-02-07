import { Dialog } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/outline'
import Countdown from 'react-countdown'

import {
  CUSTOM_GAME_TITLE,
  GUESS_DISTRIBUTION_TEXT,
  NEW_WORD_TEXT,
  STATISTICS_TITLE,
} from '../../constants/strings'
import { IGameStats } from '../../lib/localStorage'
import { Histogram } from '../stats/Histogram'
import { StatBar } from '../stats/StatBar'
import { BaseModal } from './BaseModal'

type Props = {
  isDaily: boolean
  isOpen: boolean
  handleClose: () => void
  handleGameReset: () => void
  solution: string
  guesses: string[]
  gameStats: IGameStats
  isGameLost: boolean
  isGameWon: boolean
  isHardMode: boolean
  isDarkMode: boolean
  isHighContrastMode: boolean
  numberOfGuessesMade: number
  tomorrow: number
  solutionGameDate: Date
  solutionIndex: number
  wordLength: string
  isCustomGame: boolean
}

export const StatsModal = ({
  isDaily,
  isOpen,
  handleClose,
  handleGameReset,
  solution,
  gameStats,
  isGameLost,
  isGameWon,
  numberOfGuessesMade,
  tomorrow,
  wordLength,
  isCustomGame,
}: Props) => {
  if (gameStats[wordLength]?.totalGames <= 0) {
    return (
      <BaseModal
        title={STATISTICS_TITLE}
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <StatBar gameStats={gameStats[wordLength]} />
      </BaseModal>
    )
  }
  return (
    <BaseModal
      title={isCustomGame ? CUSTOM_GAME_TITLE : STATISTICS_TITLE}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      {!isCustomGame && (
        <>
          <StatBar gameStats={gameStats[wordLength]} />
          <h4 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            {GUESS_DISTRIBUTION_TEXT}
          </h4>
          <Histogram
            gameStats={gameStats[wordLength]}
            isGameWon={isGameWon}
            numberOfGuessesMade={numberOfGuessesMade}
          />
        </>
      )}
      {isGameWon || isGameLost ? (
        <>
          <br />
          <br />
          <div className="text-center">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
            >
              {isGameWon ? 'Correct' : 'You Lost'}: The word was{' '}
              {solution.toUpperCase()}
            </Dialog.Title>
            {!isDaily && !isCustomGame && (
              <button
                type="button"
                className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
                onClick={() => handleGameReset()}
              >
                <ChevronRightIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />
                New game
              </button>
            )}
          </div>
        </>
      ) : null}
      {(isGameLost || isGameWon) && isDaily && (
        <div className="mt-5 columns-2 items-center items-stretch justify-center text-center dark:text-white sm:mt-6">
          <div className="inline-block w-full text-left">
            <div>
              <h5>{NEW_WORD_TEXT}</h5>
              <Countdown
                className="text-lg font-medium text-gray-900 dark:text-gray-100"
                date={tomorrow}
                daysInHours={true}
              />
            </div>
          </div>
          <div>
            {/* <button
              type="button"
              className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
              onClick={() => {
                shareStatus(
                  solution,
                  solutionIndex,
                  guesses,
                  isGameLost,
                  isHardMode,
                  isDarkMode,
                  isHighContrastMode,
                  handleShareToClipboard,
                  handleShareFailure
                )
              }}
            >
              <ShareIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />
              {SHARE_TEXT}
            </button> */}
          </div>
        </div>
      )}
    </BaseModal>
  )
}
