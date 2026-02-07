import {
  ChartBarIcon,
  ClockIcon,
  CogIcon,
  InformationCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline'

import { NEW_CUSTOM_WORDLE_GAME_URL } from '../../constants/settings'

const numMap: {
  [key: number]: string
} = {
  5: 'FIVE',
  6: 'SIX',
  7: 'SEVEN',
  8: 'EIGHT',
  9: 'NINE',
  10: 'TEN',
  11: 'ELEVEN',
}

const NumberCircleIcon = ({
  number,
  setWordLength,
  handleResetGame,
}: {
  number: number
  setWordLength: (value: string) => void
  handleResetGame: () => void
}) => {
  let classNames =
    'inline-block relative h-6 w-6 cursor-pointer dark:stroke-white'
  if (number === 11) {
    classNames = `${classNames} mr-12`
  } else {
    classNames = `${classNames} mr-3`
  }
  return (
    <div className={classNames}>
      <a
        href="/wordlegame"
        onClick={(e) => {
          e.preventDefault()
          setWordLength(numMap[number])
          localStorage.setItem('wordLength', numMap[number])
          handleResetGame()
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
            {number}
          </text>
        </svg>
      </a>
    </div>
  )
}

type Props = {
  isDaily: boolean
  setIsDaily: (value: boolean) => void
  setIsInfoModalOpen: (value: boolean) => void
  setIsStatsModalOpen: (value: boolean) => void
  setIsSettingsModalOpen: (value: boolean) => void
  setWordLength: (value: string) => void
  handleResetGame: () => void
  isCustomGame: boolean
  customGameData: {
    hint?: string | null
    customWord: string
  }
}

export const Navbar = ({
  isDaily,
  setIsDaily,
  setIsInfoModalOpen,
  setIsStatsModalOpen,
  setIsSettingsModalOpen,
  setWordLength,
  handleResetGame,
  isCustomGame,
  customGameData,
}: Props) => {
  return (
    <div className="navbar">
      <div className="navbar-content px-5 short:h-auto">
        <div className="flex">
          <p className="text-xl font-bold dark:text-white">
            {isDaily ? 'Daily' : isCustomGame ? 'Custom' : 'Unlimited'}
            {isCustomGame &&
              customGameData?.hint &&
              ` - Hint: ${customGameData.hint}`}
          </p>
        </div>
        <div className="right-icons">
          {!isCustomGame && (
            <>
              <NumberCircleIcon
                number={5}
                setWordLength={setWordLength}
                handleResetGame={handleResetGame}
              />
              <NumberCircleIcon
                number={6}
                setWordLength={setWordLength}
                handleResetGame={handleResetGame}
              />
              <NumberCircleIcon
                number={7}
                setWordLength={setWordLength}
                handleResetGame={handleResetGame}
              />
              <NumberCircleIcon
                number={8}
                setWordLength={setWordLength}
                handleResetGame={handleResetGame}
              />
              <NumberCircleIcon
                number={9}
                setWordLength={setWordLength}
                handleResetGame={handleResetGame}
              />
              <NumberCircleIcon
                number={10}
                setWordLength={setWordLength}
                handleResetGame={handleResetGame}
              />
              <NumberCircleIcon
                number={11}
                setWordLength={setWordLength}
                handleResetGame={handleResetGame}
              />
              <InformationCircleIcon
                className="mr-3 h-6 w-6 cursor-pointer dark:stroke-white"
                onClick={() => setIsInfoModalOpen(true)}
              />
              <ClockIcon
                className="mr-3 h-6 w-6 cursor-pointer dark:stroke-white"
                onClick={() => {
                  setIsDaily(!isDaily)
                  return
                }}
              />
              <ChartBarIcon
                className="mr-3 h-6 w-6 cursor-pointer dark:stroke-white"
                onClick={() => setIsStatsModalOpen(true)}
              />
            </>
          )}
          <PlusCircleIcon
            className="mr-3 h-6 w-6 cursor-pointer dark:stroke-white"
            onClick={() => {
              // @ts-ignore
              window.open(NEW_CUSTOM_WORDLE_GAME_URL, '_blank').focus()
              return
            }}
          />
          <CogIcon
            className="h-6 w-6 cursor-pointer dark:stroke-white"
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </div>
      <hr></hr>
    </div>
  )
}
