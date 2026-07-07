import type {
  AdvanceWinnerInput,
  GenerateBracketInput,
  GetNextMatchInput,
  LiveBracket,
  LiveMatch,
} from './types.js';

export interface BracketService {
  generateBracket(input: GenerateBracketInput): Promise<LiveBracket>;
  advanceWinner(input: AdvanceWinnerInput): Promise<LiveMatch | null>;
  getNextMatch(input: GetNextMatchInput): Promise<LiveMatch | null>;
}
