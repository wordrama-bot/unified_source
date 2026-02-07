import classnames from 'classnames'

import { REVEAL_TIME_MS } from '../../constants/settings'
import { getStoredIsHighContrastMode } from '../../lib/localStorage'
import { CharStatus } from '../../lib/statuses'

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
  const isHighContrast = getStoredIsHighContrastMode()

  //border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark
  const classes = classnames(
    'xxshort:w-11 xxshort:h-11 short:text-2xl short:w-12 short:h-12 w-[56px] h-[56px] border-solid border-2 flex items-center justify-center mx-0.5 text-4xl font-bold rounded dark:text-white',
    {
      'bg-white dark:bg-[#1c1c1c] border-slate-700 dark:border-slate-600':
        !status && !customColour,
      'border-black dark:border-slate-100': value && !status,
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
