export interface GameResultBodyRequest {
    isHardMode: boolean;
    guesses: string[];
    solution: string;
};

export interface GameProcessorBodyRequest {
    isDaily: boolean;
    isCustomGame: boolean;
    isHardMode: boolean;
    isDarkMode: boolean;
    isHighContrastMode: boolean;
    swapEnterAndDelete: boolean;
    isSpeedRunEnabled: boolean;
    isConfettiEnabled: boolean;
    wordLength: string;
    gameId: string;
    isGameLost: boolean;
    isGameWon: boolean;
    solution: string;
    guesses: string[];
}