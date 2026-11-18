-- Three-pack canonical source and population validation (read-only).
-- This query is a source-of-truth fixture for the Option 2 rebuild.
-- Unlike the current blue-green preview, the population starts at raw game results.
-- It therefore includes players who have played ONLY a new word pack.
-- No production views, MVs, game rows, or schedules are modified.
WITH canonical AS (
 SELECT player,day,month,year,word_pack,game_was_won,guess_count
 FROM public._wordle_game_result
 WHERE word_pack IN ('THREE_LETTER','THREE_LETTER_CRAZY','FIVE_LETTER_UNHINGED')
), daily AS (
 SELECT player,day,month,year,
 count(*) AS new_pack_games,
 count(*) FILTER (WHERE game_was_won) AS new_pack_wins,
 count(*) FILTER (WHERE NOT game_was_won) AS new_pack_losses,
 count(*) FILTER (WHERE word_pack='THREE_LETTER' AND game_was_won) AS three_letter_games_won,
 count(*) FILTER (WHERE word_pack='THREE_LETTER' AND NOT game_was_won) AS three_letter_games_lost,
 count(*) FILTER (WHERE word_pack='THREE_LETTER_CRAZY' AND game_was_won) AS three_letter_crazy_games_won,
 count(*) FILTER (WHERE word_pack='THREE_LETTER_CRAZY' AND NOT game_was_won) AS three_letter_crazy_games_lost,
 count(*) FILTER (WHERE word_pack='FIVE_LETTER_UNHINGED' AND game_was_won) AS five_letter_unhinged_games_won,
 count(*) FILTER (WHERE word_pack='FIVE_LETTER_UNHINGED' AND NOT game_was_won) AS five_letter_unhinged_games_lost
 FROM canonical GROUP BY player,day,month,year
)
SELECT d.*, b.player IS NOT NULL AS in_live_daily_stats,
 p.player IS NOT NULL AS in_preview_daily_stats
FROM daily d
LEFT JOIN public._v_wordle_daily_stats b USING (player,day,month,year)
LEFT JOIN wordrama_pack_preview._wr3_daily_stats p USING (player,day,month,year)
ORDER BY d.year DESC,d.month DESC,d.day DESC,d.player;

-- Production check on 2026-11-11:
-- one new-pack daily player/date group, present in both live and preview.
-- This DOES NOT validate a new-pack-only player: no such player exists yet.
-- Required cutover assertion: any canonical daily group missing from the rebuilt
-- reporting view is a blocking failure, not an acceptable omission.
-- Next rebuild step: merge the canonical population with historical/legacy
-- populations using a FULL OUTER JOIN or UNION of unique player-period keys,
-- not a LEFT JOIN rooted only in the old reporting view.
