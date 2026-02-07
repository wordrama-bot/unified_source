import { supabase } from './supabaseClient';

import { WORDLE_GAME_BASE_URL } from '../constants/settings';

import { loadStats } from './stats';
import { 
  getStoredIsHighContrastMode,
  setStoredIsHighContrastMode
} from './localStorage';

export async function makeRequestWithAuth(
  method: string,
  url: string,
  body: any = undefined
) {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(`${error}`)
  const response = await fetch(url, {
    method,
    //@ts-ignore
    headers: {
      "Content-Type": "application/json",
      'authorization': `${data?.session?.token_type} ${data?.session?.access_token}`,
    },
    body: JSON.stringify(body)
  });
  return response.json();
}

export async function submitGameStats(isDaily: boolean) {
  const stats = loadStats(isDaily);
  const { data, error } = await makeRequestWithAuth(
    'POST',
    `${WORDLE_GAME_BASE_URL}/stats/submit?gamemode=${isDaily ? 'daily' : 'infinite'}`,
    stats
  );
  if (error) console.error(error);
};

export async function submitGameSettings() {
  const isHighContrast = getStoredIsHighContrastMode();
  const isHardMode = localStorage.getItem('gameMode') === 'hard'; // normal or hard
  const isDarkMode = localStorage.getItem('theme') === 'dark'; // dark or light
  const isConfettiEnabled = localStorage.getItem('confettiEnabled') === 'true';
  const wordLength = localStorage.getItem('wordLength');

  const { data, error } = await makeRequestWithAuth(
    'POST',
    `${WORDLE_GAME_BASE_URL}/settings`,
    {
      isHighContrast,
      isHardMode,
      isDarkMode,
      isConfettiEnabled,
      wordLength
    }
  );
  if (error) console.error(error);
};

export async function submitGameWin(guesses: string[], solution: string) {
  const isHardMode = localStorage.getItem('gameMode') === 'hard'; // normal or hard
  const { data, error } = await makeRequestWithAuth(
    'POST',
    `${WORDLE_GAME_BASE_URL}/game-result`,
    {
      isHardMode,
      guesses,
      solution
    }
  );
  if (error) console.error(error);
};