-- WORDRAMA three-pack isolated reporting preview. FEATURE BRANCH ONLY.
-- NOT APPLIED TO PRODUCTION. No existing object is replaced, renamed or dropped.
-- Separate non-exposed schema; do not grant anon/authenticated access.
-- Uses existing production reporting views as baselines, so it is an additive
-- preview rather than a replacement migration. Existing overall totals/ranks
-- are intentionally inherited, including the 2024 historical adjustment.
-- Prerequisite: inspect security, run on staging first, and validate snapshots.
CREATE SCHEMA IF NOT EXISTS wordrama_pack_preview;
REVOKE ALL ON SCHEMA wordrama_pack_preview FROM PUBLIC, anon, authenticated;

-- DAILY new-pack statistics: existing overall totals are retained.
CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_daily_stats AS
SELECT b.*,
  COALESCE(n.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(n.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(n.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(n.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(n.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(n.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(n.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(n.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(n.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(n.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(n.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(n.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(n.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(n.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(n.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(n.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(n.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(n.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(n.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(n.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(n.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(n.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(n.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(n.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6
FROM public._v_wordle_daily_stats b
LEFT JOIN (SELECT player, day, month, year,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_6
  FROM public._wordle_game_result
  WHERE word_pack IN ('THREE_LETTER','THREE_LETTER_CRAZY','FIVE_LETTER_UNHINGED')
  GROUP BY player, day, month, year) n ON b.player = n.player AND b.day = n.day AND b.month = n.month AND b.year = n.year;

-- WEEKLY new-pack statistics: existing overall totals are retained.
CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_weekly_stats AS
SELECT b.*,
  COALESCE(n.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(n.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(n.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(n.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(n.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(n.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(n.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(n.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(n.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(n.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(n.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(n.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(n.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(n.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(n.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(n.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(n.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(n.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(n.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(n.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(n.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(n.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(n.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(n.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6
FROM public._v_wordle_weekly_stats b
LEFT JOIN (SELECT player, week, year,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_6
  FROM public._wordle_game_result
  WHERE word_pack IN ('THREE_LETTER','THREE_LETTER_CRAZY','FIVE_LETTER_UNHINGED')
  GROUP BY player, week, year) n ON b.player = n.player AND b.week = n.week AND b.year = n.year;

-- MONTHLY new-pack statistics: existing overall totals are retained.
CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_monthly_stats AS
SELECT b.*,
  COALESCE(n.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(n.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(n.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(n.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(n.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(n.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(n.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(n.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(n.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(n.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(n.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(n.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(n.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(n.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(n.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(n.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(n.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(n.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(n.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(n.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(n.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(n.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(n.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(n.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6
FROM public._v_wordle_monthly_stats b
LEFT JOIN (SELECT player, month, year,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_6
  FROM public._wordle_game_result
  WHERE word_pack IN ('THREE_LETTER','THREE_LETTER_CRAZY','FIVE_LETTER_UNHINGED')
  GROUP BY player, month, year) n ON b.player = n.player AND b.month = n.month AND b.year = n.year;

-- YEARLY new-pack statistics: existing overall totals are retained.
CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_yearly_stats AS
SELECT b.*,
  COALESCE(n.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(n.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(n.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(n.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(n.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(n.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(n.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(n.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(n.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(n.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(n.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(n.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(n.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(n.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(n.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(n.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(n.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(n.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(n.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(n.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(n.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(n.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(n.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(n.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6
FROM public._v_wordle_yearly_stats b
LEFT JOIN (SELECT player, year,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_6
  FROM public._wordle_game_result
  WHERE word_pack IN ('THREE_LETTER','THREE_LETTER_CRAZY','FIVE_LETTER_UNHINGED')
  GROUP BY player, year) n ON b.player = n.player AND b.year = n.year;

-- ALLTIME new-pack statistics: existing overall totals are retained.
CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_alltime_stats AS
SELECT b.*,
  COALESCE(n.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(n.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(n.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(n.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(n.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(n.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(n.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(n.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(n.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(n.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(n.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(n.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(n.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(n.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(n.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(n.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(n.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(n.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(n.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(n.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(n.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(n.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(n.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(n.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6
FROM public._v_wordle_alltime_stats b
LEFT JOIN (SELECT player,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_6
  FROM public._wordle_game_result
  WHERE word_pack IN ('THREE_LETTER','THREE_LETTER_CRAZY','FIVE_LETTER_UNHINGED')
  GROUP BY player) n ON b.player = n.player;

-- Preserve the original wrapped-2024 games-played adjustment.
CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_alltime_stats_with_2024_preview AS
SELECT b.*,
  COALESCE(s.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(s.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(s.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(s.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(s.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(s.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(s.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(s.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(s.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(s.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(s.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(s.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(s.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(s.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(s.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(s.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(s.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(s.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(s.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(s.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(s.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(s.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(s.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(s.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6
FROM public._v_wordle_alltime_stats_with_2024_preview b
LEFT JOIN wordrama_pack_preview._wr3_alltime_stats s ON s.player=b.player;

CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_daily_stats_by_type AS
SELECT b.*,
  COALESCE(n.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(n.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(n.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(n.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(n.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(n.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(n.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(n.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(n.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(n.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(n.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(n.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(n.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(n.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(n.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(n.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(n.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(n.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(n.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(n.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(n.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(n.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(n.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(n.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6
FROM public._v_wordle_daily_stats_by_type b
LEFT JOIN (SELECT player, day, month, year, type,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_6
  FROM public._wordle_game_result
  WHERE word_pack IN ('THREE_LETTER','THREE_LETTER_CRAZY','FIVE_LETTER_UNHINGED')
  GROUP BY player, day, month, year, type) n ON b.player = n.player AND b.day = n.day AND b.month = n.month AND b.year = n.year AND b.type = n.type;

CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_weekly_stats_by_type AS
SELECT b.*,
  COALESCE(n.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(n.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(n.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(n.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(n.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(n.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(n.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(n.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(n.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(n.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(n.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(n.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(n.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(n.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(n.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(n.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(n.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(n.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(n.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(n.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(n.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(n.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(n.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(n.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6
FROM public._v_wordle_weekly_stats_by_type b
LEFT JOIN (SELECT player, week, year, type,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_6
  FROM public._wordle_game_result
  WHERE word_pack IN ('THREE_LETTER','THREE_LETTER_CRAZY','FIVE_LETTER_UNHINGED')
  GROUP BY player, week, year, type) n ON b.player = n.player AND b.week = n.week AND b.year = n.year AND b.type = n.type;

CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_monthly_stats_by_type AS
SELECT b.*,
  COALESCE(n.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(n.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(n.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(n.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(n.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(n.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(n.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(n.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(n.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(n.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(n.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(n.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(n.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(n.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(n.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(n.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(n.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(n.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(n.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(n.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(n.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(n.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(n.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(n.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6
FROM public._v_wordle_monthly_stats_by_type b
LEFT JOIN (SELECT player, month, year, type,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_6
  FROM public._wordle_game_result
  WHERE word_pack IN ('THREE_LETTER','THREE_LETTER_CRAZY','FIVE_LETTER_UNHINGED')
  GROUP BY player, month, year, type) n ON b.player = n.player AND b.month = n.month AND b.year = n.year AND b.type = n.type;

CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_yearly_stats_by_type AS
SELECT b.*,
  COALESCE(n.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(n.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(n.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(n.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(n.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(n.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(n.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(n.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(n.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(n.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(n.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(n.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(n.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(n.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(n.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(n.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(n.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(n.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(n.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(n.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(n.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(n.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(n.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(n.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6
FROM public._v_wordle_yearly_stats_by_type b
LEFT JOIN (SELECT player, year, type,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_6
  FROM public._wordle_game_result
  WHERE word_pack IN ('THREE_LETTER','THREE_LETTER_CRAZY','FIVE_LETTER_UNHINGED')
  GROUP BY player, year, type) n ON b.player = n.player AND b.year = n.year AND b.type = n.type;

CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_alltime_stats_by_type AS
SELECT b.*,
  COALESCE(n.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(n.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(n.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(n.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(n.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(n.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(n.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(n.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(n.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(n.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(n.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(n.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(n.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(n.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(n.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(n.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(n.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(n.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(n.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(n.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(n.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(n.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(n.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(n.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6
FROM public._v_wordle_alltime_stats_by_type b
LEFT JOIN (SELECT player, type,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'THREE_LETTER_CRAZY' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS three_letter_crazy_games_won_in_6,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS FALSE THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_lost,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 1 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_1,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 2 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_2,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 3 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_3,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 4 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_4,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 5 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_5,
    COALESCE(SUM(CASE WHEN word_pack = 'FIVE_LETTER_UNHINGED' AND game_was_won IS TRUE AND guess_count = 6 THEN 1 ELSE 0 END),0)::bigint AS five_letter_unhinged_games_won_in_6
  FROM public._wordle_game_result
  WHERE word_pack IN ('THREE_LETTER','THREE_LETTER_CRAZY','FIVE_LETTER_UNHINGED')
  GROUP BY player, type) n ON b.player = n.player AND b.type = n.type;

CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_daily_leaderboard AS
SELECT q.*,
  rank() OVER (PARTITION BY q.day, q.month, q.year ORDER BY q.three_letter_games_won DESC) AS daily_rank_three_letter,
  rank() OVER (PARTITION BY q.day, q.month, q.year ORDER BY q.three_letter_crazy_games_won DESC) AS daily_rank_three_letter_crazy,
  rank() OVER (PARTITION BY q.day, q.month, q.year ORDER BY q.five_letter_unhinged_games_won DESC) AS daily_rank_five_letter_unhinged
FROM (
SELECT b.*,
  COALESCE(s.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(s.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(s.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(s.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(s.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(s.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(s.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(s.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(s.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(s.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(s.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(s.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(s.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(s.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(s.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(s.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(s.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(s.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(s.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(s.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(s.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(s.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(s.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(s.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6
FROM public._v_wordle_daily_leaderboard b
LEFT JOIN wordrama_pack_preview._wr3_daily_stats s ON b.player = s.player AND b.day = s.day AND b.month = s.month AND b.year = s.year
) q;

CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_weekly_leaderboard AS
SELECT q.*,
  rank() OVER (PARTITION BY q.week, q.year ORDER BY q.three_letter_games_won DESC) AS weekly_rank_three_letter,
  rank() OVER (PARTITION BY q.week, q.year ORDER BY q.three_letter_crazy_games_won DESC) AS weekly_rank_three_letter_crazy,
  rank() OVER (PARTITION BY q.week, q.year ORDER BY q.five_letter_unhinged_games_won DESC) AS weekly_rank_five_letter_unhinged
FROM (
SELECT b.*,
  COALESCE(s.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(s.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(s.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(s.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(s.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(s.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(s.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(s.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(s.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(s.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(s.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(s.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(s.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(s.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(s.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(s.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(s.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(s.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(s.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(s.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(s.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(s.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(s.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(s.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6
FROM public._v_wordle_weekly_leaderboard b
LEFT JOIN wordrama_pack_preview._wr3_weekly_stats s ON b.player = s.player AND b.week = s.week AND b.year = s.year
) q;

CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_monthly_leaderboard AS
SELECT q.*,
  rank() OVER (PARTITION BY q.month, q.year ORDER BY q.three_letter_games_won DESC) AS monthly_rank_three_letter,
  rank() OVER (PARTITION BY q.month, q.year ORDER BY q.three_letter_crazy_games_won DESC) AS monthly_rank_three_letter_crazy,
  rank() OVER (PARTITION BY q.month, q.year ORDER BY q.five_letter_unhinged_games_won DESC) AS monthly_rank_five_letter_unhinged
FROM (
SELECT b.*,
  COALESCE(s.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(s.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(s.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(s.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(s.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(s.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(s.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(s.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(s.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(s.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(s.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(s.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(s.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(s.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(s.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(s.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(s.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(s.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(s.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(s.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(s.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(s.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(s.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(s.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6
FROM public._v_wordle_monthly_leaderboard b
LEFT JOIN wordrama_pack_preview._wr3_monthly_stats s ON b.player = s.player AND b.month = s.month AND b.year = s.year
) q;

CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_yearly_leaderboard AS
SELECT q.*,
  rank() OVER (PARTITION BY q.year ORDER BY q.three_letter_games_won DESC) AS yearly_rank_three_letter,
  rank() OVER (PARTITION BY q.year ORDER BY q.three_letter_crazy_games_won DESC) AS yearly_rank_three_letter_crazy,
  rank() OVER (PARTITION BY q.year ORDER BY q.five_letter_unhinged_games_won DESC) AS yearly_rank_five_letter_unhinged
FROM (
SELECT b.*,
  COALESCE(s.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(s.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(s.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(s.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(s.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(s.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(s.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(s.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(s.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(s.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(s.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(s.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(s.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(s.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(s.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(s.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(s.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(s.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(s.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(s.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(s.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(s.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(s.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(s.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6
FROM public._v_wordle_yearly_leaderboard b
LEFT JOIN wordrama_pack_preview._wr3_yearly_stats s ON b.player = s.player AND b.year = s.year
) q;

CREATE OR REPLACE VIEW wordrama_pack_preview._wr3_alltime_leaderboard AS
SELECT q.*,
  rank() OVER (ORDER BY q.three_letter_games_won DESC) AS alltime_rank_three_letter,
  rank() OVER (ORDER BY q.three_letter_crazy_games_won DESC) AS alltime_rank_three_letter_crazy,
  rank() OVER (ORDER BY q.five_letter_unhinged_games_won DESC) AS alltime_rank_five_letter_unhinged,
  rank() OVER (ORDER BY q.three_letter_current_streak DESC) AS three_letter_current_streak_rank,
  rank() OVER (ORDER BY q.three_letter_best_streak DESC) AS three_letter_best_streak_rank,
  rank() OVER (ORDER BY q.three_letter_crazy_current_streak DESC) AS three_letter_crazy_current_streak_rank,
  rank() OVER (ORDER BY q.three_letter_crazy_best_streak DESC) AS three_letter_crazy_best_streak_rank,
  rank() OVER (ORDER BY q.five_letter_unhinged_current_streak DESC) AS five_letter_unhinged_current_streak_rank,
  rank() OVER (ORDER BY q.five_letter_unhinged_best_streak DESC) AS five_letter_unhinged_best_streak_rank
FROM (
SELECT b.*,
  COALESCE(s.three_letter_games_won,0)::bigint AS three_letter_games_won,
  COALESCE(s.three_letter_games_lost,0)::bigint AS three_letter_games_lost,
  COALESCE(s.three_letter_games_won_in_1,0)::bigint AS three_letter_games_won_in_1,
  COALESCE(s.three_letter_games_won_in_2,0)::bigint AS three_letter_games_won_in_2,
  COALESCE(s.three_letter_games_won_in_3,0)::bigint AS three_letter_games_won_in_3,
  COALESCE(s.three_letter_games_won_in_4,0)::bigint AS three_letter_games_won_in_4,
  COALESCE(s.three_letter_games_won_in_5,0)::bigint AS three_letter_games_won_in_5,
  COALESCE(s.three_letter_games_won_in_6,0)::bigint AS three_letter_games_won_in_6,
  COALESCE(s.three_letter_crazy_games_won,0)::bigint AS three_letter_crazy_games_won,
  COALESCE(s.three_letter_crazy_games_lost,0)::bigint AS three_letter_crazy_games_lost,
  COALESCE(s.three_letter_crazy_games_won_in_1,0)::bigint AS three_letter_crazy_games_won_in_1,
  COALESCE(s.three_letter_crazy_games_won_in_2,0)::bigint AS three_letter_crazy_games_won_in_2,
  COALESCE(s.three_letter_crazy_games_won_in_3,0)::bigint AS three_letter_crazy_games_won_in_3,
  COALESCE(s.three_letter_crazy_games_won_in_4,0)::bigint AS three_letter_crazy_games_won_in_4,
  COALESCE(s.three_letter_crazy_games_won_in_5,0)::bigint AS three_letter_crazy_games_won_in_5,
  COALESCE(s.three_letter_crazy_games_won_in_6,0)::bigint AS three_letter_crazy_games_won_in_6,
  COALESCE(s.five_letter_unhinged_games_won,0)::bigint AS five_letter_unhinged_games_won,
  COALESCE(s.five_letter_unhinged_games_lost,0)::bigint AS five_letter_unhinged_games_lost,
  COALESCE(s.five_letter_unhinged_games_won_in_1,0)::bigint AS five_letter_unhinged_games_won_in_1,
  COALESCE(s.five_letter_unhinged_games_won_in_2,0)::bigint AS five_letter_unhinged_games_won_in_2,
  COALESCE(s.five_letter_unhinged_games_won_in_3,0)::bigint AS five_letter_unhinged_games_won_in_3,
  COALESCE(s.five_letter_unhinged_games_won_in_4,0)::bigint AS five_letter_unhinged_games_won_in_4,
  COALESCE(s.five_letter_unhinged_games_won_in_5,0)::bigint AS five_letter_unhinged_games_won_in_5,
  COALESCE(s.five_letter_unhinged_games_won_in_6,0)::bigint AS five_letter_unhinged_games_won_in_6,
  COALESCE(st.three_letter_current_streak,0)::bigint AS three_letter_current_streak,
  COALESCE(st.three_letter_best_streak,0)::bigint AS three_letter_best_streak,
  COALESCE(st.three_letter_crazy_current_streak,0)::bigint AS three_letter_crazy_current_streak,
  COALESCE(st.three_letter_crazy_best_streak,0)::bigint AS three_letter_crazy_best_streak,
  COALESCE(st.five_letter_unhinged_current_streak,0)::bigint AS five_letter_unhinged_current_streak,
  COALESCE(st.five_letter_unhinged_best_streak,0)::bigint AS five_letter_unhinged_best_streak
FROM public._v_wordle_alltime_leaderboard b
LEFT JOIN wordrama_pack_preview._wr3_alltime_stats_with_2024_preview s ON b.player = s.player
LEFT JOIN (SELECT player, MAX(current_streak) FILTER (WHERE word_pack='THREE_LETTER') AS three_letter_current_streak, MAX(best_streak) FILTER (WHERE word_pack='THREE_LETTER') AS three_letter_best_streak, MAX(current_streak) FILTER (WHERE word_pack='THREE_LETTER_CRAZY') AS three_letter_crazy_current_streak, MAX(best_streak) FILTER (WHERE word_pack='THREE_LETTER_CRAZY') AS three_letter_crazy_best_streak, MAX(current_streak) FILTER (WHERE word_pack='FIVE_LETTER_UNHINGED') AS five_letter_unhinged_current_streak, MAX(best_streak) FILTER (WHERE word_pack='FIVE_LETTER_UNHINGED') AS five_letter_unhinged_best_streak FROM public._wordle_streak GROUP BY player) st ON st.player=b.player
) q;

-- Populate only after validation of definition and resource impact.
CREATE MATERIALIZED VIEW wordrama_pack_preview._wr3_daily_leaderboard_mv AS
SELECT * FROM wordrama_pack_preview._wr3_daily_leaderboard
WITH NO DATA;
CREATE UNIQUE INDEX _wr3_daily_leaderboard_unique ON wordrama_pack_preview._wr3_daily_leaderboard_mv (player, day, month, year);

-- Populate only after validation of definition and resource impact.
CREATE MATERIALIZED VIEW wordrama_pack_preview._wr3_weekly_leaderboard_mv AS
SELECT * FROM wordrama_pack_preview._wr3_weekly_leaderboard
WITH NO DATA;
CREATE UNIQUE INDEX _wr3_weekly_leaderboard_unique ON wordrama_pack_preview._wr3_weekly_leaderboard_mv (player, week, year);

-- Populate only after validation of definition and resource impact.
CREATE MATERIALIZED VIEW wordrama_pack_preview._wr3_monthly_leaderboard_mv AS
SELECT * FROM wordrama_pack_preview._wr3_monthly_leaderboard
WITH NO DATA;
CREATE UNIQUE INDEX _wr3_monthly_leaderboard_unique ON wordrama_pack_preview._wr3_monthly_leaderboard_mv (player, month, year);

-- Populate only after validation of definition and resource impact.
CREATE MATERIALIZED VIEW wordrama_pack_preview._wr3_yearly_leaderboard_mv AS
SELECT * FROM wordrama_pack_preview._wr3_yearly_leaderboard
WITH NO DATA;
CREATE UNIQUE INDEX _wr3_yearly_leaderboard_unique ON wordrama_pack_preview._wr3_yearly_leaderboard_mv (player, year);

-- Populate only after validation of definition and resource impact.
CREATE MATERIALIZED VIEW wordrama_pack_preview._wr3_alltime_leaderboard_mv AS
SELECT * FROM wordrama_pack_preview._wr3_alltime_leaderboard
WITH NO DATA;
CREATE UNIQUE INDEX _wr3_alltime_leaderboard_unique ON wordrama_pack_preview._wr3_alltime_leaderboard_mv (player);

-- No cron jobs, RPC replacements, app changes, or refreshes are installed.
-- To populate in an approved test environment, refresh in daily/weekly/monthly/yearly/alltime order.
-- WARNING: This preview inherits existing leaderboard ranking columns and adds new pack-specific ranks.
-- A later true cutover must rebuild ranks from canonical staged stats and coordinate dependent team MV/RPC.
