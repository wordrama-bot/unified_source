import type {
  CreateTournamentInput,
  LiveTournament,
  TournamentStatusInput,
  UpdateTournamentInput,
} from './types.js';

export interface TournamentService {
  createTournament(input: CreateTournamentInput): Promise<LiveTournament>;
  updateTournament(input: UpdateTournamentInput): Promise<LiveTournament>;
  openRegistration(input: TournamentStatusInput): Promise<LiveTournament>;
  closeRegistration(input: TournamentStatusInput): Promise<LiveTournament>;
  startTournament(input: TournamentStatusInput): Promise<LiveTournament>;
  endTournament(input: TournamentStatusInput): Promise<LiveTournament>;
  cancelTournament(input: TournamentStatusInput): Promise<LiveTournament>;
}
