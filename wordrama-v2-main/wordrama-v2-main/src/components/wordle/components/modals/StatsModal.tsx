import { Dialog } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/outline';
import Countdown from 'react-countdown';
import { useState } from 'react';
import { Histogram } from '../stats/Histogram';

import {
  CUSTOM_GAME_TITLE,
  GUESS_DISTRIBUTION_TEXT,
  NEW_WORD_TEXT,
  STATISTICS_TITLE,
} from '../../constants/strings';
import { IGameStats, GameStat } from '../../lib/localStorage';
import { StatBar } from '../stats/StatBar';
import { BaseModal } from './BaseModal';
import {
  useGetMyDailyWordleStatsQuery,
  useGetMyWeeklyWordleStatsQuery,
  useGetMyMonthlyWordleStatsQuery,
  useGetMyYearlyWordleStatsQuery
} from '../../../../redux/api/wordrama';


type Props = {
  currentStreak: number
  bestStreak: number
  //isDaily: boolean
  isOpen: boolean
  handleClose: () => void
  //handleGameReset: () => void
  solution: string
  guesses: string[]
  isGameLost: boolean
  isGameWon: boolean
  //isHardMode: boolean
  //isDarkMode: boolean
  ///isHighContrastMode: boolean
  gameMode: string,
  //tomorrow: number
  //solutionGameDate: Date
  //solutionIndex: number
  wordLength: string
  //isCustomGame: boolean
}

export const StatsModal = ({
  isOpen,
  handleClose,
  //handleGameReset,
  solution,
  wordLength,
  gameMode,
  guesses,
  isGameLost,
  isGameWon,
  currentStreak,
  bestStreak,
}: Props) => {
  const [statsTimeframe, setStatsTimeframe] = useState('DAILY');
  const { data: dailyStatsData, isLoading: isLoadingDailyStats } = useGetMyDailyWordleStatsQuery();
  const { data: weeklyStatsData, isLoading: isLoadingWeeklyStats } = useGetMyWeeklyWordleStatsQuery();
  const { data: monthlyStatsData, isLoading: isLoadingMonthlyStats } = useGetMyMonthlyWordleStatsQuery();
  const { data: yearlyStatsData, isLoading: isLoadingYearlyStats } = useGetMyYearlyWordleStatsQuery();

  function toggleTimeframe() {
    if (statsTimeframe === 'DAILY') return setStatsTimeframe('WEEKLY');
    else if (statsTimeframe === 'WEEKLY') return setStatsTimeframe('MONTHLY');
    else if (statsTimeframe === 'MONTHLY') return setStatsTimeframe('YEARLY');
    //else if (statsTimeframe === 'YEARLY') return setStatsTimeframe('ALL_TIME');
    else if (statsTimeframe === 'YEARLY') return setStatsTimeframe('DAILY');
  }

  type StatsTimeFrame = {
    friendlyText: string,
    gamesPlayed?: number,
    gamesWon?: number
    gamesLost?: number,
    winDistribution?: number[]
  }

  const timeframeData: {
    [key: string]: StatsTimeFrame
  } = {
    DAILY: {
      friendlyText: 'Daily',
      gamesPlayed: dailyStatsData?.data?.gamesPlayed || 0,
      gamesWon: dailyStatsData?.data?.gamesWon,
      gamesLost: dailyStatsData?.data?.gamesLost,
      winDistribution: [
        dailyStatsData?.data?.gamesWonIn_1 || 0,
        dailyStatsData?.data?.gamesWonIn_2 || 0,
        dailyStatsData?.data?.gamesWonIn_3 || 0,
        dailyStatsData?.data?.gamesWonIn_4 || 0,
        dailyStatsData?.data?.gamesWonIn_5 || 0,
        dailyStatsData?.data?.gamesWonIn_6 || 0
      ]
    },
    WEEKLY: {
      friendlyText: 'Weekly',
      gamesPlayed: weeklyStatsData?.data?.gamesPlayed || 0,
      gamesWon: weeklyStatsData?.data?.gamesWon,
      gamesLost: weeklyStatsData?.data?.gamesLost,
      winDistribution: [
        weeklyStatsData?.data?.gamesWonIn_1 || 0,
        weeklyStatsData?.data?.gamesWonIn_2 || 0,
        weeklyStatsData?.data?.gamesWonIn_3 || 0,
        weeklyStatsData?.data?.gamesWonIn_4 || 0,
        weeklyStatsData?.data?.gamesWonIn_5 || 0,
        weeklyStatsData?.data?.gamesWonIn_6 || 0
      ]
    },
    MONTHLY: {
      friendlyText: 'Monthly',
      gamesPlayed: monthlyStatsData?.data?.gamesPlayed || 0,
      gamesWon: monthlyStatsData?.data?.gamesWon,
      gamesLost: monthlyStatsData?.data?.gamesLost,
      winDistribution: [
        monthlyStatsData?.data?.gamesWonIn_1 || 0,
        monthlyStatsData?.data?.gamesWonIn_2 || 0,
        monthlyStatsData?.data?.gamesWonIn_3 || 0,
        monthlyStatsData?.data?.gamesWonIn_4 || 0,
        monthlyStatsData?.data?.gamesWonIn_5 || 0,
        monthlyStatsData?.data?.gamesWonIn_6 || 0
      ]
    },
    YEARLY: {
      friendlyText: 'Yearly',
      gamesPlayed: yearlyStatsData?.data?.gamesPlayed || 0,
      gamesWon: yearlyStatsData?.data?.gamesWon,
      gamesLost: yearlyStatsData?.data?.gamesLost,
      winDistribution: [
        yearlyStatsData?.data?.gamesWonIn_1 || 0,
        yearlyStatsData?.data?.gamesWonIn_2 || 0,
        yearlyStatsData?.data?.gamesWonIn_3 || 0,
        yearlyStatsData?.data?.gamesWonIn_4 || 0,
        yearlyStatsData?.data?.gamesWonIn_5 || 0,
        yearlyStatsData?.data?.gamesWonIn_6 || 0
      ]
    },
    ALL_TIME: {
      friendlyText: ''
    }
  }

  const timeframe = timeframeData[statsTimeframe].friendlyText || '';
  const isCustomGame = gameMode === 'CUSTOM';
  const gameStats: GameStat = {
    winDistribution: timeframeData[statsTimeframe].winDistribution || [],
    gamesFailed: timeframeData[statsTimeframe].gamesLost || 0,
    currentStreak,
    bestStreak,
    totalGames: timeframeData[statsTimeframe].gamesPlayed || 0,
    successRate: Math.ceil(((timeframeData[statsTimeframe].gamesWon || 0) / (timeframeData[statsTimeframe].gamesPlayed || 0)) * 100) || 0,
  }
  if (gameStats.totalGames <= 0) {
    return (
      <BaseModal
        title={isCustomGame ? CUSTOM_GAME_TITLE : timeframe ? `${timeframe} ${STATISTICS_TITLE}` : STATISTICS_TITLE }
        isOpen={isOpen}
        handleClose={handleClose}
        showTimeframe={!isCustomGame}
        toggleTimeFrame={toggleTimeframe}
      >
        <StatBar gameStats={gameStats} />
      </BaseModal>
    )
  }

  const now = new Date();
  const tomorrow = new Date(now.setHours(0, 0, 0, 0)).setDate(now.getDate() + 1);
  return (
    <BaseModal
      title={isCustomGame ? CUSTOM_GAME_TITLE : timeframe ? `${timeframe} ${STATISTICS_TITLE}` : STATISTICS_TITLE }
      isOpen={isOpen}
      handleClose={handleClose}
      showTimeframe={!isCustomGame}
      toggleTimeFrame={toggleTimeframe}
    >
      {!isCustomGame && (
        <>
          <StatBar gameStats={gameStats} />
          <h4 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            {GUESS_DISTRIBUTION_TEXT}
          </h4>
          {
            <Histogram
              gameStats={gameStats}
              isGameWon={isGameWon}
              numberOfGuessesMade={guesses.length}
            />
          }
        </>
      )}
      {(isGameWon || isGameLost) && (
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
            {
            // (gameMode === 'INFINITE') && (
            //   <button
            //     type="button"
            //     className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
            //     onClick={() =>{}}
            //   >
            //     <ChevronRightIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />
            //     New game
            //   </button>
            // )
            }
          </div>
        </>
      )}
      {(isGameLost || isGameWon) && (gameMode === 'DAILY') && (
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
        </div>
      )}
    </BaseModal>
  )
}
