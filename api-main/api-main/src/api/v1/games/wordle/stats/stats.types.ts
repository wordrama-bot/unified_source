export interface SubmitWordleStatBodyRequest {
    gamesFailed: number
    currentStreak: number
    bestStreak: number
    successRate: number
    totalGames: number
    winDistribution: number[]
};

export interface SubmitWordleStatsBodyRequest {
    [key: string]: SubmitWordleStatBodyRequest
};

export interface WordleStat {
    games_won: number
    games_failed:  number
    current_streak: number
    best_streak: number
    success_rate: number
    total_games: number
    win_distribution: number[]
    word_length: string
}
