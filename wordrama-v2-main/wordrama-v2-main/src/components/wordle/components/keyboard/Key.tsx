import classnames from 'classnames'
import { ReactNode } from 'react'

import { REVEAL_TIME_MS } from '../../constants/settings'
import { getStoredIsHighContrastMode } from '../../lib/localStorage'
import { getWordleGameUiState } from '@/redux/ui/helpers'
import { CharStatus } from '../../lib/statuses'

import { getAppearanceTheme } from '@/config/themes'
import { KEYBOARD_STYLE_IDS } from '@/config/keyboardStyles'

type Props = {
  children?: ReactNode
  value: string
  width?: number
  customColour?: string
  customColourClass?: string
  status?: CharStatus
  onClick: (value: string) => void
  isRevealing?: boolean
  solution: string
}

export const Key = ({
  children,
  status,
  width = 54,
  customColour,
  customColourClass = '',
  value,
  onClick,
  isRevealing,
  solution
}: Props) => {
  const keyDelayMs = REVEAL_TIME_MS * solution.length
  const gameUiState = getWordleGameUiState()

  const appearanceTheme = getAppearanceTheme(
    gameUiState?.appearanceThemeId
  )

  const isHighContrast =
    getStoredIsHighContrastMode() || gameUiState?.colorblindMode === true

  const keyboardStyleId =
    gameUiState?.keyboardStyleId || KEYBOARD_STYLE_IDS.FLAT

  const raisedKeyboardClasses =
    'shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
  
  const absentKeyClasses =
    appearanceTheme.meta.id === 'theme.midnight'
      ? 'bg-[#1e293b] text-white border border-[#334155]'
      : 'bg-slate-400 dark:bg-slate-800 text-white'
  
  const classes = classnames(
    'xxshort:h-8 xxshort:w-8 xxshort:text-xxs xshort:w-10 xshort:h-10 flex short:h-12 h-12 items-center justify-center rounded mx-1 text-xs font-bold cursor-pointer select-none border-2 border-border dark:border-darkBorder',
    {
      'transition ease-in-out': isRevealing,

      [raisedKeyboardClasses]: keyboardStyleId === KEYBOARD_STYLE_IDS.RAISED,

      'bg-pink-200 dark:bg-pink-600 hover:bg-pink-300 active:bg-pink-400':
        !status && customColour && customColour === 'hot-pink',
      'bg-pink-200 dark:bg-pink-300 dark:text-text hover:bg-pink-100 active:bg-pink-200':
        !status && customColour && customColour === 'pink',
      'bg-blue-200 dark:bg-blue-300 dark:text-text hover:bg-blue-100 active:bg-blue-200':
        !status && customColour && customColour === 'light-blue',
      'bg-blue-400 dark:bg-blue-500 dark:text-text hover:bg-blue-300 active:bg-blue-500':
        !status && customColour && customColour === 'mid-blue',
      'bg-blue-700 dark:bg-blue-800 dark:text-white hover:bg-blue-500 active:bg-blue-800':
        !status && customColour && customColour === 'dark-blue',
      '': !status && customColour && customColour.startsWith('multi'),

      [`${appearanceTheme.keyboard.key} ${appearanceTheme.keyboard.keyText}`]:
        !status && !customColour,

      [absentKeyClasses]:
        status === 'absent',

      'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white':
        status === 'correct' && isHighContrast,
      'bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white':
        status === 'present' && isHighContrast,
      'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white':
        status === 'correct' && !isHighContrast,
      'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white':
        status === 'present' && !isHighContrast,
    }
  )

  const styles = {
    transitionDelay: isRevealing ? `${keyDelayMs}ms` : 'unset',
    width: `${width}px`,
  }

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(value)
    event.currentTarget.blur()
  }

  return (
    <button
      style={styles}
      aria-label={`${value}${status ? ' ' + status : ''}`}
      className={`${classes}${customColourClass ? ` ${customColourClass}` : ''}`}
      onClick={handleClick}
    >
      {children || value}
    </button>
  )
}
