import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'

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
  const charStatuses = useMemo(() => getStatuses(solution, guesses), [solution, guesses])
  const handlersRef = useRef({ onChar, onDelete, onEnter })
  useLayoutEffect(() => {
    handlersRef.current = { onChar, onDelete, onEnter }
  }, [onChar, onDelete, onEnter])

  const onClick = useCallback((value: string) => {
    if (value === 'ENTER') {
      handlersRef.current.onEnter()
    } else if (value === 'DELETE') {
      handlersRef.current.onDelete()
    } else {
      handlersRef.current.onChar(value)
    }
  }, [])

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.isComposing || e.ctrlKey || e.altKey || e.metaKey) return
      const target = e.target
      if (target instanceof HTMLElement &&
          (target.isContentEditable || target.closest('input, textarea, select, [role="textbox"]'))) return
      // Let focused controls handle Enter through their own native click.
      if (e.key === 'Enter' && target instanceof HTMLElement &&
          target.closest('button, a, [role="button"]')) return
      if (e.repeat && e.key !== 'Backspace' && e.key !== 'Delete') return

      if (e.key === 'Enter') {
        e.preventDefault()
        handlersRef.current.onEnter()
        return
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        handlersRef.current.onDelete()
        return
      }

      const key = localeAwareUpperCase(e.key)

      if (/^[A-Z]$/.test(key)) {
        handlersRef.current.onChar(key)
      }
    }

    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

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
