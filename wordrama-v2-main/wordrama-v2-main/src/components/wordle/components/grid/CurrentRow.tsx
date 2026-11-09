import { unicodeSplit } from '../../lib/words'
import { Cell } from './Cell'

type Props = {
  solution: string
  guess: string
  className: string
}

export const CurrentRow = ({ solution, guess, className }: Props) => {
  const splitGuess = unicodeSplit(guess)
  const emptyCells = Array.from({ length: Math.max(0, solution.length - splitGuess.length) })
  const classes = `flex justify-center mb-1 mobile-word-row ${className}`

  return (
    <div className={classes} style={{ ['--word-length' as string]: solution.length }}>
      {splitGuess.map((letter, i) => (
        <Cell key={`filled-${i}`} value={letter} wordLength={solution.length} />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={`empty-${splitGuess.length + i}`} wordLength={solution.length} />
      ))}
    </div>
  )
}
