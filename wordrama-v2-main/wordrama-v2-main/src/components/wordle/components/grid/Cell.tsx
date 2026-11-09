import classnames from 'classnames'

import { REVEAL_TIME_MS } from '../../constants/settings'
import { getWordleGameUiState } from '@/redux/ui/helpers'
import { CharStatus } from '../../lib/statuses'
import { getAppearanceTheme } from '@/config/themes'

type Props = {
  value?: string
  status?: CharStatus
  customColour?: string
  isRevealing?: boolean
  isCompleted?: boolean
  position?: number
  wordLength?: number
}

export const Cell = ({
  value,
  status,
  customColour,
  isRevealing,
  isCompleted,
  position = 0,
  wordLength = 5,
}: Props) => {
  const isFilled = value && !isCompleted
  const shouldReveal = isRevealing && isCompleted
  const animationDelay = `${position * REVEAL_TIME_MS}ms`
  const gameUiState = getWordleGameUiState()
  const appearanceTheme = getAppearanceTheme(gameUiState?.appearanceThemeId)

  const isHighContrast = gameUiState?.colorblindMode === true

  const absentCellClasses =
    appearanceTheme.meta.id === 'theme.default'
      ? 'absent shadowed bg-slate-400 dark:bg-slate-700 text-white border-slate-700 dark:border-slate-700'
      : `absent shadowed ${
          appearanceTheme.board.absentCell || appearanceTheme.board.emptyCell
        }`

  const isLongWord = wordLength >= 11
  const mobileLetterSize = `clamp(8px, calc((100vw - 48px) * ${0.72 / wordLength}), 20px)`

  const classes = classnames(
    'xxshort:w-11 short:text-2xl short:w-12 w-[56px] min-w-0 aspect-square self-start border-solid border-2 flex items-center justify-center mx-0.5 text-4xl font-bold rounded select-none caret-transparent',
    isLongWord && 'max-sm:!text-[var(--long-word-font-size)]',
    {
      'dark:text-white': appearanceTheme.meta.id === 'theme.default',

      [appearanceTheme.board.emptyCell]:
        !value && !status && !customColour,

      [appearanceTheme.board.filledCell]:
        value && !status && !customColour,

      [absentCellClasses]:
        status === 'absent',

      'correct shadowed bg-orange-500 text-white border-slate-700':
        status === 'correct' && isHighContrast,

      'present shadowed bg-cyan-500 text-white border-slate-700':
        status === 'present' && isHighContrast,

      'correct shadowed bg-green-500 text-white border-slate-700':
        status === 'correct' && !isHighContrast,

      'present shadowed bg-yellow-500 text-white border-slate-700':
        status === 'present' && !isHighContrast,

      'cell-fill-animation': isFilled,
      'cell-reveal': shouldReveal,
    }
  )

  return (
    <div className={classes} style={{ animationDelay, ...(isLongWord ? { ['--long-word-font-size' as string]: mobileLetterSize } : {}) }}>
      <div className="letter-container" style={{ animationDelay }}>
        {value}
      </div>
    </div>
  )
}