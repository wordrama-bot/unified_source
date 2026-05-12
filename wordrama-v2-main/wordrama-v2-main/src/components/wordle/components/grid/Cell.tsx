import classnames from 'classnames'

import { REVEAL_TIME_MS } from '../../constants/settings'
import { getStoredIsHighContrastMode } from '../../lib/localStorage'
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
}

export const Cell = ({
  value,
  status,
  customColour,
  isRevealing,
  isCompleted,
  position = 0,
}: Props) => {
  const isFilled = value && !isCompleted
  const shouldReveal = isRevealing && isCompleted
  const animationDelay = `${position * REVEAL_TIME_MS}ms`
  const gameUiState = getWordleGameUiState()
  const appearanceTheme = getAppearanceTheme(gameUiState?.appearanceThemeId)

  const isHighContrast =
    getStoredIsHighContrastMode() || gameUiState?.colorblindMode === true

  const classes = classnames(
    'xxshort:w-11 xxshort:h-11 short:text-2xl short:w-12 short:h-12 w-[56px] h-[56px] border-solid border-2 flex items-center justify-center mx-0.5 text-4xl font-bold rounded dark:text-white',
    {
      'bg-white dark:bg-[#1c1c1c] border-slate-700 dark:border-slate-600':
        !status && !customColour && appearanceTheme.id === 'theme.default',

      'bg-slate-800 border-slate-500 text-slate-100':
        !status && !customColour && appearanceTheme.id === 'theme.midnight',

      'bg-rose-50 border-rose-400 text-rose-950':
        !status && !customColour && appearanceTheme.id === 'theme.rose-gold',

      'border-black dark:border-slate-100':
        value && !status && appearanceTheme.id === 'theme.default',

      'border-slate-200':
        value && !status && appearanceTheme.id === 'theme.midnight',

      'border-rose-700':
        value && !status && appearanceTheme.id === 'theme.rose-gold',

      'absent shadowed bg-slate-400 dark:bg-slate-700 text-white border-slate-700 dark:border-slate-700':
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
    <div className={classes} style={{ animationDelay }}>
      <div className="letter-container" style={{ animationDelay }}>
        {value}
      </div>
    </div>
  )
}