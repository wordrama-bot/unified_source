import { useEffect } from 'react'

import { DELETE_TEXT, ENTER_TEXT } from '../../constants/strings'
import { getStatuses } from '../../lib/statuses'
import { localeAwareUpperCase } from '../../lib/words'
import { Key } from './Key'

type Props = {
  onChar: (value: string) => void
  onDelete: () => void
  onEnter: () => void
  solution: string
  guesses: string[]
  isRevealing?: boolean
  swapEnterAndDelete: boolean
  showPlayAgainKey?: boolean
}

export const Keyboard = ({
  onChar,
  onDelete,
  onEnter,
  solution,
  guesses,
  isRevealing,
  swapEnterAndDelete = false,
  showPlayAgainKey = false,
}: Props) => {
  const charStatuses = getStatuses(solution, guesses)

  const onClick = (value: string) => {
    if (value === 'ENTER') {
      onEnter()
    } else if (value === 'DELETE') {
      onDelete()
    } else {
      onChar(value)
    }
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.isComposing || e.ctrlKey || e.altKey || e.metaKey) return

      if (e.key === 'Enter') {
        onEnter()
        return
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        onDelete()
        return
      }

      const key = localeAwareUpperCase(e.key)

      if (/^[A-Z]$/.test(key)) {
        onChar(key)
      }
    }

    window.addEventListener('keyup', listener)
    return () => window.removeEventListener('keyup', listener)
  }, [onEnter, onDelete, onChar])

  return (
    <div>
      <div className="mb-2 flex justify-center">
        {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
            solution={solution}
          />
        ))}
      </div>
      <div className="mb-2 flex justify-center">
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
          <Key
            width={60}
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
            solution={solution}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Key
          width={showPlayAgainKey && swapEnterAndDelete ? 110 : 81}
          value={
            swapEnterAndDelete
              ? ENTER_TEXT.toUpperCase()
              : DELETE_TEXT.toUpperCase()
          }
          onClick={onClick}
          solution={solution}
        >
          {swapEnterAndDelete
            ? showPlayAgainKey ? 'Play Again' : ENTER_TEXT
            : DELETE_TEXT}
        </Key>
        {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
            solution={solution}
          />
        ))}
        <Key
          width={showPlayAgainKey && !swapEnterAndDelete ? 110 : 81}
          value={
            swapEnterAndDelete
              ? DELETE_TEXT.toUpperCase()
              : ENTER_TEXT.toUpperCase()
          }
          onClick={onClick}
          solution={solution}
        >
          {swapEnterAndDelete
            ? DELETE_TEXT
            : showPlayAgainKey ? 'Play Again' : ENTER_TEXT}
        </Key>
      </div>
    </div>
  )
}
