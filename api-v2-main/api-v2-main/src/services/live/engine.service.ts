import type {
  CalculateWinnerInput,
  DetermineMatchResultInput,
  EvaluateGuessInput,
  LiveGuessEvaluationCell,
  MatchResultDecision,
  ValidateGuessInput,
  ValidateGuessResult,
} from './types.js';

export interface EngineService {
  validateGuess(input: ValidateGuessInput): Promise<ValidateGuessResult>;
  evaluateGuess(input: EvaluateGuessInput): Promise<LiveGuessEvaluationCell[]>;
  calculateWinner(input: CalculateWinnerInput): Promise<MatchResultDecision>;
  determineMatchResult(input: DetermineMatchResultInput): Promise<MatchResultDecision>;
}
