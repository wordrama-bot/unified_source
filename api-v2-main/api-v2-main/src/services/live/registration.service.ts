import type {
  CheckEligibilityInput,
  EligibilityResult,
  JoinTournamentInput,
  LeaveTournamentInput,
  LiveTournamentEntrant,
  ReadyPlayerInput,
} from './types.js';

export interface RegistrationService {
  joinTournament(input: JoinTournamentInput): Promise<LiveTournamentEntrant>;
  leaveTournament(input: LeaveTournamentInput): Promise<LiveTournamentEntrant>;
  readyPlayer(input: ReadyPlayerInput): Promise<LiveTournamentEntrant>;
  checkEligibility(input: CheckEligibilityInput): Promise<EligibilityResult>;
}
