type UserJWT = {
  sub: string;
  iss: string;
  id: string;
  email: string;
  username: string;
  firstName: string;
  surname: string;
  created: string;
  imageUrl: string;
  userId: string;
  iat: number;
};

type Account = {
  addressCity: string | null
  addressCounty: string | null
  addressFirstLine: string | null
  addressPostcode: string | null
  addressSecondLine: string | null
  firstName: string | null
  id: string
  lastName: string | null
  phoneNumber: string | null
  profileImage: string | null
  role: string | null
  title: string | null
  email: string | null
};

type VehiclesResponse = {
  data: Vehicle[];
  count: number;
  statusCode: number;
  message?: string;
};

type VehicleResponse = {
  data: Vehicle;
  count: number;
  statusCode: number;
  message?: string;
};

type AddPlayerRequest = {
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  username?: string;
};

type UpdatePlayerRequest = {
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  username?: string;
  email?: string;
};

type UpdateSettingsRequest = {
  isColourBlind?: boolean;
  isHardMode?: boolean;
  isDarkMode?: boolean;
  wordleWordLength?: number;
  isConfettiEnabled?: boolean;
};

type UpdateStreamerSettingsRequest = {
  hideName?: boolean;
  hideAccountsPage?: boolean;
  hideFromLeaderboard?: boolean;
  showStreamerView?: boolean;
  tiktokUsername?: string;
  twitchUsername?: string;
  youtubeUsername?: string;
};

type AddGameResultWordleRequest = {
  solution: string;
  guesses: string[];
  gameWasHardMode: boolean;
  type: string;
  shareCode?: string;
};

type CreateCustomWordleRequest = {
  customWordle: string;
  hint?: string;
};

type AddGameResultSpellBeeRequest = {
  gameResultType: string;
  middleLetters: string;
  score: number;
  correctWords: string[];
  potentialWords: string[];
};

type Leaderboard = {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  wordleGamesWon: number;
  wordleGamesLost: number;
  wordleWinsIn1: number;
  wordleWinsIn2: number;
  wordleWinsIn3: number;
  wordleWinsIn4: number;
  wordleWinsIn5: number;
  wordleWinsIn6: number;
  wordleCoinsWon: number;
  wordleXpWon: number;
  wordle_5LetterWins: number;
  wordle_5LetterLost: number;
  wordle_6LetterWins: number;
  wordle_6LetterLost: number;
  wordle_7LetterWins: number;
  wordle_7LetterLost: number;
  wordle_8LetterWins: number;
  wordle_8LetterLost: number;
  wordle_9LetterWins: number;
  wordle_9LetterLost: number;
  wordle_10LetterWins: number;
  wordle_10LetterLost: number;
  wordle_11LetterWins: number;
  wordle_11LetterLost: number;
  wordleDailyGamesWon: number;
  wordleDailyGamesLost: number;
  wordleInfiniteGames_won: number;
  wordleInfiniteGamesLost: number;
  wordle_5LetterDaily_wins: number;
  wordle_5LetterDailyLost: number;
  wordle_5LetterInfinite_wins: number;
  wordle_5LetterInfiniteLost: number;
  wordle_6LetterDaily_wins: number;
  wordle_6LetterDailyLost: number;
  wordle_6LetterInfinite_wins: number;
  wordle_6LetterInfiniteLost: number;
  wordle_7LetterDaily_wins: number;
  wordle_7LetterDailyLost: number;
  wordle_7LetterInfinite_wins: number;
  wordle_7LetterInfiniteLost: number;
  wordle_8LetterDaily_wins: number;
  wordle_8LetterDailyLost: number;
  wordle_8LetterInfinite_wins: number;
  wordle_8LetterInfiniteLost: number;
  wordle_9LetterDaily_wins: number;
  wordle_9LetterDailyLost: number;
  wordle_9LetterInfinite_wins: number;
  wordle_9LetterInfiniteLost: number;
  wordle_10LetterDaily_wins: number;
  wordle_10LetterDailyLost: number;
  wordle_10LetterInfinite_wins: number;
  wordle_10LetterInfiniteLost: number;
  wordle_11LetterDaily_wins: number;
  wordle_11LetterDailyLost: number;
  wordle_11LetterInfinite_wins: number;
  wordle_11LetterInfiniteLost: number;
  [key: string]: {
    id: string;
    profileImage: string;
    displayName: string;
  }
  [key: string]:  {
    coinBalance: number;
  }
  [key: string]:  {
    xp: number;
    xpToNextLevel: number;
    level: number;
  }
  [key: string]: {
    hideFromLeaderboard: boolean;
  }
};

type LeaderbordResponse = {
  data: Leaderboard[];
  count: number;
  statusCode: number;
  message?: string;
};

type Player = {
  id: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  displayName?: string;
  [key: string]: {
    coinBalance: number;
  }
  [key: string]: {
    xp: number;
    xpToNextLevel: number;
    level: number;
  }
  [key: string]: {
    isColourBlind: boolean;
    isHardMode: boolean;
    isDarkMode: boolean;
    wordleWordLength: number;
    isConfettiEnabled: boolean;
  }
  [key: string]: {
    hideName: boolean;
    hideAccountsPage: boolean;
    showStreamerView: boolean;
    tiktokUsername: boolean;
    twitchUsername: boolean;
    youtubeUsername: boolean;
    hideFromLeaderboard: boolean;
  }
  [key: string]: {
    code?: string;
    username?: string;
    userId?: string;
  }
};

type PlayerResponse = {
  data: Player;
  count: number;
  status: number;
  message?: string;
};
