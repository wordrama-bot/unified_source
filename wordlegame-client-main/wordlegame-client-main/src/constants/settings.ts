import { enUS } from 'date-fns/locale'

export const MAX_CHALLENGES = 6
export const ALERT_TIME_MS = 2000
export const LONG_ALERT_TIME_MS = 10000
export const REVEAL_TIME_MS = 250
export const WELCOME_INFO_MODAL_MS = 350
export const DISCOURAGE_INAPP_BROWSERS = true
export const ENABLE_MIGRATE_STATS = false
export const BLOWFISH_KEY = 'xcQUAHsik#Thq&LG*8es2DsZ$3bw^e'
export const BLOWFISH_IV = '#45XmF^w'
export const ENABLE_ARCHIVED_GAMES = false
export const DATE_LOCALE = enUS

export const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
export const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
export const WORDLE_GAME_BASE_URL = `${API_BASE_URL}/games/wordle`
export const WORDLE_LEADERBOARD_BASE_URL = process.env.REACT_APP_BASE_URL
export const NEW_CUSTOM_WORDLE_GAME_URL = `${WORDLE_LEADERBOARD_BASE_URL}/play/custom/create`
