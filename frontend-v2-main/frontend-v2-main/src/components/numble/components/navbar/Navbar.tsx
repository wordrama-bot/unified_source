import {
  ChartBarIcon,
  ClockIcon,
  CogIcon,
  InformationCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline';
import { ReactComponentElement, useState } from 'react';
import Link from "next/link";

type Props = {
  forfitGame: () => void
  setIsInfoModalOpen: (value: boolean) => void
  setIsStatsModalOpen: (value: boolean) => void
  setIsSettingsModalOpen: (value: boolean) => void
  useWordLength: (value: number) => void,
  useGameMode: (value: string) => void,
  gameMode: string,
  wordLength: number
}

export const Navbar = ({
  fofitGame,
  setIsInfoModalOpen,
  setIsStatsModalOpen,
  setIsSettingsModalOpen,
  useWordLength,
  useGameMode,
  gameMode,
  wordLength
}: Props) => {
  const isDaily = gameMode === 'DAILY';
  const isInfinite = gameMode === 'INFINITE';
  const isCustomGame = gameMode === 'CUSTOM';
  return (
    <div className="navbar">
      <div className="navbar-content px-5 short:h-auto">
        <div className="flex">
          <p className="text-xl font-bold dark:text-white">
            {isDaily ? 'Daily' : isCustomGame ? 'Custom' : 'Unlimited'}
            {
            //isCustomGame &&
            //  customGameData?.hint &&
            //  ` - Hint: ${customGameData.hint}`
            }
          </p>
        </div>
        <div className="right-icons">
          {!isCustomGame && (
            <>
              <div className="inline-block relative h-6 w-6 cursor-pointer dark:stroke-white mr-3">
                <Link
                  href="/games/wordle"
                  onClick={e => {
                    e.preventDefault();
                    if (wordLength === 13){
                      wordLength = 1
                    } else {
                      wordLength = wordLength + 1;
                    }
                    return useWordLength(wordLength);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    className="circle-icon h-6 w-6"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" fill="none"></circle>
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dy=".3em"
                      fontSize="12"
                      fill="white"
                    >
                      { wordLength.toString() }
                    </text>
                  </svg>
                </Link>
              </div>
              <InformationCircleIcon
                className="mr-3 h-6 w-6 cursor-pointer dark:stroke-white"
                onClick={() => setIsInfoModalOpen(true)}
              />
              <ClockIcon
                className="mr-3 h-6 w-6 cursor-pointer dark:stroke-white"
                onClick={() => {
                  if (isDaily) return useGameMode('INFINITE');
                  if (isInfinite) return useGameMode('DAILY');
                  if (isCustomGame) return useGameMode('INFINITE');
                  return
                }}
              />
              <ChartBarIcon
                className="mr-3 h-6 w-6 cursor-pointer dark:stroke-white"
                onClick={() => setIsStatsModalOpen(true)}
              />
            </>
          )}
          <Link href="/game/wordle/create-custom">
            <PlusCircleIcon
              className="mr-3 h-6 w-6 cursor-pointer dark:stroke-white"
            />
          </Link>
          <CogIcon
            className="h-6 w-6 cursor-pointer dark:stroke-white"
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </div>
    </div>
  )
}
