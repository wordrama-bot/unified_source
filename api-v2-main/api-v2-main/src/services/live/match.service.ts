import type {
  CreateMatchInput,
  DetermineWinnerInput,
  FinishMatchInput,
  ForfeitPlayerInput,
  LiveMatch,
  MatchResultDecision,
  StartMatchInput,
} from './types.js';

export interface MatchService {
  createMatch(input: CreateMatchInput): Promise<LiveMatch>;
  startMatch(input: StartMatchInput): Promise<LiveMatch>;
  finishMatch(input: FinishMatchInput): Promise<LiveMatch>;
  determineWinner(input: DetermineWinnerInput): Promise<MatchResultDecision>;
  forfeitPlayer(input: ForfeitPlayerInput): Promise<LiveMatch>;
}
