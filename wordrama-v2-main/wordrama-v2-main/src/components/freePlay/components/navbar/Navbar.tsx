import {
  ChartBarIcon,
  ClockIcon,
  CogIcon,
  InformationCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { isMobile } from 'react-device-detect';
import { useGetMyWordPacksQuery, useGetWordleWordPackQuery } from '@/redux/api/wordrama';
import { wordleDefaultState } from '@/redux/wordle/defaultStates';

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
  const { data: wordPacks, isLoading: isLoadingWordPacks } = useGetMyWordPacksQuery();
  const isDaily = gameMode === 'DAILY';
  const isInfinite = gameMode === 'INFINITE';
  const isCustomGame = gameMode === 'CUSTOM';
  const availableWordPacks = Object.keys(wordleDefaultState)?.filter((wordPack) => wordPacks?.data.includes(wordPack));
  return (
    <div className="navbar">
      <div className="navbar-content px-5 short:h-auto">
        <div className="flex">
          <p className="text-xl font-bold dark:text-white">
            <Button
              className="mt-1"
              onClick={() => {
                if (isDaily) return useGameMode('INFINITE');
                if (isInfinite) return useGameMode('DAILY');
                if (isCustomGame) return useGameMode('INFINITE');
                return
              }}
            >
              {isDaily ? 'Daily' : isCustomGame ? 'Custom' : 'Unlimited'}
            </Button>
            {
            //isCustomGame &&
            //  customGameData?.hint &&
            //  ` - Hint: ${customGameData.hint}`
            }
          </p>
        </div>
        <div className="right-icons">
          { !isCustomGame && (
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a WordPack" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>WordPacks</SelectLabel>
                  { !isLoadingWordPacks && availableWordPacks.map(wordPack => (
                    <SelectItem key={wordPack} value={wordPack}>{wordPack}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>


          )}
          {/* !isCustomGame && (
            <>
              <div className="inline-block relative h-6 w-6 cursor-pointer dark:stroke-white mr-3">

                <Link
                  href="/games/wordrama"
                  onClick={e => {
                    e.preventDefault();
                    if (isMobile && wordLength === 7) {
                      wordLength = 4
                    }
                    else if (wordLength === 23) {
                      wordLength = 4
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
              <ChartBarIcon
                className="mr-3 h-6 w-6 cursor-pointer dark:stroke-white"
                onClick={() => setIsStatsModalOpen(true)}
              />
            </>
          )
          */

          // <ClockIcon
          //   className="mr-3 h-6 w-6 cursor-pointer dark:stroke-white"
          //   onClick={() => {
          //     if (isDaily) return useGameMode('INFINITE');
          //     if (isInfinite) return useGameMode('DAILY');
          //     if (isCustomGame) return useGameMode('INFINITE');
          //     return
          //   }}
          // />
          // <Link href="/games/wordrama/custom">
          //   <PlusCircleIcon
          //     className="mr-3 h-6 w-6 cursor-pointer dark:stroke-white"
          //   />
          // </Link>
          // <CogIcon
          //   className="h-6 w-6 cursor-pointer dark:stroke-white"
          //   onClick={() => setIsSettingsModalOpen(true)}
          // />
          }
        </div>
      </div>
    </div>
  )
}
