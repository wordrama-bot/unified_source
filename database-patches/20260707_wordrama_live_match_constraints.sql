create unique index if not exists uq_live_matches_tournament_round_match
on public._live_matches (tournament_id, round_number, match_number)
where tournament_id is not null;
