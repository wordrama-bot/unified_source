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
}

export const Keyboard = ({
  onChar,
  onDelete,
  onEnter,
  solution,
  guesses,
  isRevealing,
  swapEnterAndDelete = false,
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
      if (e.code === 'Enter') {
        onEnter()
      } else if (e.code === 'Backspace') {
        onDelete()
      } else {
        const key = localeAwareUpperCase(e.key)
        // TODO: check this test if the range works with non-english letters
        if (key.length === 1 && key >= 'A' && key <= 'Z') {
          onChar(key)
        }
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete, onChar])

  return (
    <div>
      <div className="mb-2 flex justify-center">
        {['1', '2', '3'].map((key) => (
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
        {['4', '5', '6'].map((key) => (
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
        {['7', '8', '9'].map((key) => (
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
      <div className="flex justify-center">
        <Key
          value={
            swapEnterAndDelete
              ? ENTER_TEXT.toUpperCase()
              : DELETE_TEXT.toUpperCase()
          }
          onClick={onClick}
          solution={solution}
        >
          {swapEnterAndDelete ? '+' : '#'}
        </Key>
        <Key
          value={'0'}
          key={'0'}
          onClick={onClick}
          status={charStatuses['0']}
          isRevealing={isRevealing}
          solution={solution}
        />
        <Key
          value={
            swapEnterAndDelete
            ? 'DELETE'
              : 'ENTER'
          }
          onClick={onClick}
          solution={solution}
        >
          {swapEnterAndDelete ? '#' : '+'}
        </Key>
      </div>
    </div>
  )
}
