import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { ALERT_TIME_MS } from '../constants/settings'

type AlertStatus = 'success' | 'error' | undefined

type ShowOptions = {
  persist?: boolean
  delayMs?: number
  durationMs?: number
  onClose?: () => void
}

type AlertContextValue = {
  status: AlertStatus
  message: string | null
  isVisible: boolean
  showSuccess: (message: string, options?: ShowOptions) => void
  showError: (message: string, options?: ShowOptions) => void
  clearAlert: () => void
}

export const AlertContext = createContext<AlertContextValue | null>({
  status: 'success',
  message: null,
  isVisible: false,
  showSuccess: () => null,
  showError: () => null,
  clearAlert: () => null,
})

AlertContext.displayName = 'AlertContext'

export const useAlert = () => useContext(AlertContext) as AlertContextValue

type Props = {
  children?: ReactNode
}

export const AlertProvider = ({ children }: Props) => {
  const [status, setStatus] = useState<AlertStatus>('success')
  const [message, setMessage] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelTimers = useCallback(() => {
    if (showTimerRef.current !== null) {
      clearTimeout(showTimerRef.current)
      showTimerRef.current = null
    }

    if (hideTimerRef.current !== null) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  const clearAlert = useCallback(() => {
    cancelTimers()
    setIsVisible(false)
    setMessage(null)
  }, [cancelTimers])

  const show = useCallback(
    (showStatus: AlertStatus, newMessage: string, options?: ShowOptions) => {
      const {
        delayMs = 0,
        persist,
        onClose,
        durationMs = ALERT_TIME_MS,
      } = options || {}

      // Prevent previous alert timers from affecting this alert.
      cancelTimers()

      showTimerRef.current = setTimeout(() => {
        showTimerRef.current = null

        setStatus(showStatus)
        setMessage(newMessage)
        setIsVisible(true)

        if (!persist) {
          hideTimerRef.current = setTimeout(() => {
            hideTimerRef.current = null
            setIsVisible(false)

            if (onClose) {
              onClose()
            }
          }, durationMs)
        }
      }, delayMs)
    },
    [cancelTimers]
  )

  const showError = useCallback(
    (newMessage: string, options?: ShowOptions) => {
      show('error', newMessage, options)
    },
    [show]
  )

  const showSuccess = useCallback(
    (newMessage: string, options?: ShowOptions) => {
      show('success', newMessage, options)
    },
    [show]
  )

  useEffect(() => {
    return () => {
      cancelTimers()
    }
  }, [cancelTimers])

  return (
    <AlertContext.Provider
      value={{
        status,
        message,
        isVisible,
        showError,
        showSuccess,
        clearAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  )
}