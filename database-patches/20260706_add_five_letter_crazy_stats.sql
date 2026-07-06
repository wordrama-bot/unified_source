create or replace view public._v_wordle_daily_stats as
 SELECT r.day,
    r.month,
    r.year,
    r.week,
    r.player,
    sum(
        CASE
            WHEN r.game_was_won = true THEN 1
            ELSE 0
        END) AS games_won,
    sum(
        CASE
            WHEN r.game_was_won = false THEN 1
            ELSE 0
        END) AS games_lost,
    sum(
        CASE
            WHEN r.game_was_won = true OR r.game_was_won = false THEN 1
            ELSE 0
        END) AS games_played,
    sum(
        CASE
            WHEN r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS games_won_in_1,
    sum(
        CASE
            WHEN r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS games_won_in_2,
    sum(
        CASE
            WHEN r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS games_won_in_3,
    sum(
        CASE
            WHEN r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS games_won_in_4,
    sum(
        CASE
            WHEN r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS games_won_in_5,
    sum(
        CASE
            WHEN r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS four_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 4 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS four_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 4 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS four_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 4 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS four_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 4 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS four_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 4 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS four_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 4 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS four_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 4 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS four_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER' AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS five_letter_games_won,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER' AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS five_letter_games_lost,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER' AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS five_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER' AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS five_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER' AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS five_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER' AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS five_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER' AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS five_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER' AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS five_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS six_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 6 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS six_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 6 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS six_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 6 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS six_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 6 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS six_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 6 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS six_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 6 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS six_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 6 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS six_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 7 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS seven_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 7 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS seven_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 7 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS seven_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 7 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS seven_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 7 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS seven_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 7 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS seven_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 7 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS seven_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 7 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS seven_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 8 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eight_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 8 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS eight_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 8 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eight_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 8 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eight_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 8 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eight_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 8 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eight_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 8 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eight_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 8 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eight_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 9 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS nine_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 9 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS nine_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 9 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS nine_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 9 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS nine_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 9 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS nine_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 9 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS nine_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 9 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS nine_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 9 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS nine_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 10 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS ten_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 10 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS ten_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 10 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS ten_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 10 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS ten_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 10 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS ten_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 10 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS ten_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 10 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS ten_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 10 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS ten_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 11 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eleven_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 11 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS eleven_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 11 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eleven_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 11 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eleven_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 11 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eleven_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 11 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eleven_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 11 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eleven_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 11 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eleven_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 12 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twelve_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 12 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS twelve_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 12 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twelve_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 12 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twelve_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 12 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twelve_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 12 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twelve_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 12 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twelve_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 12 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twelve_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 13 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS thirteen_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 13 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS thirteen_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 13 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS thirteen_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 13 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS thirteen_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 13 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS thirteen_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 13 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS thirteen_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 13 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS thirteen_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 13 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS thirteen_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 14 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS fourteen_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 14 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS fourteen_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 14 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS fourteen_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 14 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS fourteen_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 14 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS fourteen_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 14 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS fourteen_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 14 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS fourteen_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 14 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS fourteen_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 15 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS fifteen_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 15 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS fifteen_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 15 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS fifteen_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 15 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS fifteen_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 15 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS fifteen_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 15 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS fifteen_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 15 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS fifteen_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 15 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS fifteen_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 16 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS sixteen_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 16 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS sixteen_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 16 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS sixteen_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 16 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS sixteen_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 16 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS sixteen_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 16 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS sixteen_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 16 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS sixteen_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 16 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS sixteen_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 17 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS seventeen_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 17 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS seventeen_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 17 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS seventeen_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 17 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS seventeen_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 17 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS seventeen_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 17 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS seventeen_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 17 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS seventeen_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 17 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS seventeen_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 18 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eighteen_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 18 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS eighteen_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 18 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eighteen_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 18 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eighteen_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 18 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eighteen_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 18 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eighteen_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 18 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eighteen_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 18 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS eighteen_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 19 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS nineteen_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 19 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS nineteen_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 19 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS nineteen_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 19 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS nineteen_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 19 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS nineteen_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 19 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS nineteen_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 19 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS nineteen_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 19 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS nineteen_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 20 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twenty_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 20 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS twenty_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 20 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twenty_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 20 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twenty_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 20 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twenty_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 20 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twenty_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 20 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twenty_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 20 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twenty_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 21 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentyone_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 21 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS twentyone_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 21 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentyone_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 21 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentyone_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 21 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentyone_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 21 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentyone_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 21 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentyone_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 21 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentyone_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 22 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 22 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 22 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 22 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 22 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 22 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 22 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 22 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_length = 23 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentythree_letter_games_won,
    sum(
        CASE
            WHEN r.word_length = 23 AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS twentythree_letter_games_lost,
    sum(
        CASE
            WHEN r.word_length = 23 AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentythree_letter_games_won_in_1,
    sum(
        CASE
            WHEN r.word_length = 23 AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentythree_letter_games_won_in_2,
    sum(
        CASE
            WHEN r.word_length = 23 AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentythree_letter_games_won_in_3,
    sum(
        CASE
            WHEN r.word_length = 23 AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentythree_letter_games_won_in_4,
    sum(
        CASE
            WHEN r.word_length = 23 AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentythree_letter_games_won_in_5,
    sum(
        CASE
            WHEN r.word_length = 23 AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS twentythree_letter_games_won_in_6,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER_CRAZY' AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS five_letter_crazy_games_won,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER_CRAZY' AND r.game_was_won = false THEN 1
            ELSE 0
        END) AS five_letter_crazy_games_lost,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER_CRAZY' AND r.guess_count = 1 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS five_letter_crazy_games_won_in_1,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER_CRAZY' AND r.guess_count = 2 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS five_letter_crazy_games_won_in_2,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER_CRAZY' AND r.guess_count = 3 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS five_letter_crazy_games_won_in_3,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER_CRAZY' AND r.guess_count = 4 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS five_letter_crazy_games_won_in_4,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER_CRAZY' AND r.guess_count = 5 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS five_letter_crazy_games_won_in_5,
    sum(
        CASE
            WHEN r.word_pack = 'FIVE_LETTER_CRAZY' AND r.guess_count = 6 AND r.game_was_won = true THEN 1
            ELSE 0
        END) AS five_letter_crazy_games_won_in_6
   FROM _wordle_game_result r
  WHERE NOT (EXISTS ( SELECT 1
           FROM _admin_bans b
          WHERE b.ban_type = 'PLAYER'::text AND b.ban_value = r.player::text AND b.is_active = true AND (b.expires_at IS NULL OR b.expires_at > now())))
  GROUP BY r.day, r.week, r.month, r.year, r.player;

create or replace view public._v_wordle_weekly_stats as 
   SELECT _v_wordle_daily_stats.player,
    _v_wordle_daily_stats.year,
    _v_wordle_daily_stats.week,
    sum(_v_wordle_daily_stats.games_won) AS games_won,
    sum(_v_wordle_daily_stats.games_lost) AS games_lost,
    sum(_v_wordle_daily_stats.games_played) AS games_played,
    sum(_v_wordle_daily_stats.games_won_in_1) AS games_won_in_1,
    sum(_v_wordle_daily_stats.games_won_in_2) AS games_won_in_2,
    sum(_v_wordle_daily_stats.games_won_in_3) AS games_won_in_3,
    sum(_v_wordle_daily_stats.games_won_in_4) AS games_won_in_4,
    sum(_v_wordle_daily_stats.games_won_in_5) AS games_won_in_5,
    sum(_v_wordle_daily_stats.games_won_in_6) AS games_won_in_6,
    sum(_v_wordle_daily_stats.four_letter_games_won) AS four_letter_games_won,
    sum(_v_wordle_daily_stats.four_letter_games_lost) AS four_letter_games_lost,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_1) AS four_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_2) AS four_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_3) AS four_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_4) AS four_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_5) AS four_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_6) AS four_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.five_letter_games_won) AS five_letter_games_won,
    sum(_v_wordle_daily_stats.five_letter_games_lost) AS five_letter_games_lost,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_1) AS five_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_2) AS five_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_3) AS five_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_4) AS five_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_5) AS five_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_6) AS five_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.six_letter_games_won) AS six_letter_games_won,
    sum(_v_wordle_daily_stats.six_letter_games_lost) AS six_letter_games_lost,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_1) AS six_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_2) AS six_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_3) AS six_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_4) AS six_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_5) AS six_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_6) AS six_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.seven_letter_games_won) AS seven_letter_games_won,
    sum(_v_wordle_daily_stats.seven_letter_games_lost) AS seven_letter_games_lost,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_1) AS seven_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_2) AS seven_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_3) AS seven_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_4) AS seven_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_5) AS seven_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_6) AS seven_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.eight_letter_games_won) AS eight_letter_games_won,
    sum(_v_wordle_daily_stats.eight_letter_games_lost) AS eight_letter_games_lost,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_1) AS eight_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_2) AS eight_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_3) AS eight_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_4) AS eight_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_5) AS eight_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_6) AS eight_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.nine_letter_games_won) AS nine_letter_games_won,
    sum(_v_wordle_daily_stats.nine_letter_games_lost) AS nine_letter_games_lost,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_1) AS nine_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_2) AS nine_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_3) AS nine_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_4) AS nine_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_5) AS nine_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_6) AS nine_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.ten_letter_games_won) AS ten_letter_games_won,
    sum(_v_wordle_daily_stats.ten_letter_games_lost) AS ten_letter_games_lost,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_1) AS ten_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_2) AS ten_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_3) AS ten_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_4) AS ten_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_5) AS ten_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_6) AS ten_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.eleven_letter_games_won) AS eleven_letter_games_won,
    sum(_v_wordle_daily_stats.eleven_letter_games_lost) AS eleven_letter_games_lost,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_1) AS eleven_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_2) AS eleven_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_3) AS eleven_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_4) AS eleven_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_5) AS eleven_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_6) AS eleven_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.twelve_letter_games_won) AS twelve_letter_games_won,
    sum(_v_wordle_daily_stats.twelve_letter_games_lost) AS twelve_letter_games_lost,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_1) AS twelve_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_2) AS twelve_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_3) AS twelve_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_4) AS twelve_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_5) AS twelve_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_6) AS twelve_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won) AS thirteen_letter_games_won,
    sum(_v_wordle_daily_stats.thirteen_letter_games_lost) AS thirteen_letter_games_lost,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_1) AS thirteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_2) AS thirteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_3) AS thirteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_4) AS thirteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_5) AS thirteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_6) AS thirteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won) AS fourteen_letter_games_won,
    sum(_v_wordle_daily_stats.fourteen_letter_games_lost) AS fourteen_letter_games_lost,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_1) AS fourteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_2) AS fourteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_3) AS fourteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_4) AS fourteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_5) AS fourteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_6) AS fourteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won) AS fifteen_letter_games_won,
    sum(_v_wordle_daily_stats.fifteen_letter_games_lost) AS fifteen_letter_games_lost,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_1) AS fifteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_2) AS fifteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_3) AS fifteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_4) AS fifteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_5) AS fifteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_6) AS fifteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won) AS sixteen_letter_games_won,
    sum(_v_wordle_daily_stats.sixteen_letter_games_lost) AS sixteen_letter_games_lost,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_1) AS sixteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_2) AS sixteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_3) AS sixteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_4) AS sixteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_5) AS sixteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_6) AS sixteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won) AS seventeen_letter_games_won,
    sum(_v_wordle_daily_stats.seventeen_letter_games_lost) AS seventeen_letter_games_lost,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_1) AS seventeen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_2) AS seventeen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_3) AS seventeen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_4) AS seventeen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_5) AS seventeen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_6) AS seventeen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won) AS eighteen_letter_games_won,
    sum(_v_wordle_daily_stats.eighteen_letter_games_lost) AS eighteen_letter_games_lost,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_1) AS eighteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_2) AS eighteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_3) AS eighteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_4) AS eighteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_5) AS eighteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_6) AS eighteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won) AS nineteen_letter_games_won,
    sum(_v_wordle_daily_stats.nineteen_letter_games_lost) AS nineteen_letter_games_lost,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_1) AS nineteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_2) AS nineteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_3) AS nineteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_4) AS nineteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_5) AS nineteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_6) AS nineteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.twenty_letter_games_won) AS twenty_letter_games_won,
    sum(_v_wordle_daily_stats.twenty_letter_games_lost) AS twenty_letter_games_lost,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_1) AS twenty_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_2) AS twenty_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_3) AS twenty_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_4) AS twenty_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_5) AS twenty_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_6) AS twenty_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won) AS twentyone_letter_games_won,
    sum(_v_wordle_daily_stats.twentyone_letter_games_lost) AS twentyone_letter_games_lost,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_1) AS twentyone_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_2) AS twentyone_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_3) AS twentyone_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_4) AS twentyone_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_5) AS twentyone_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_6) AS twentyone_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won) AS twentytwo_letter_games_won,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_lost) AS twentytwo_letter_games_lost,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_1) AS twentytwo_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_2) AS twentytwo_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_3) AS twentytwo_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_4) AS twentytwo_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_5) AS twentytwo_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_6) AS twentytwo_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won) AS twentythree_letter_games_won,
    sum(_v_wordle_daily_stats.twentythree_letter_games_lost) AS twentythree_letter_games_lost,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_1) AS twentythree_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_2) AS twentythree_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_3) AS twentythree_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_4) AS twentythree_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_5) AS twentythree_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_6) AS twentythree_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won) AS five_letter_crazy_games_won,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_lost) AS five_letter_crazy_games_lost,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_1) AS five_letter_crazy_games_won_in_1,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_2) AS five_letter_crazy_games_won_in_2,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_3) AS five_letter_crazy_games_won_in_3,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_4) AS five_letter_crazy_games_won_in_4,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_5) AS five_letter_crazy_games_won_in_5,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_6) AS five_letter_crazy_games_won_in_6
   FROM _v_wordle_daily_stats
  GROUP BY _v_wordle_daily_stats.player, _v_wordle_daily_stats.week, _v_wordle_daily_stats.year;

create or replace view public._v_wordle_monthly_stats as
   SELECT _v_wordle_daily_stats.player,
    _v_wordle_daily_stats.year,
    _v_wordle_daily_stats.month,
    sum(_v_wordle_daily_stats.games_won) AS games_won,
    sum(_v_wordle_daily_stats.games_lost) AS games_lost,
    sum(_v_wordle_daily_stats.games_played) AS games_played,
    sum(_v_wordle_daily_stats.games_won_in_1) AS games_won_in_1,
    sum(_v_wordle_daily_stats.games_won_in_2) AS games_won_in_2,
    sum(_v_wordle_daily_stats.games_won_in_3) AS games_won_in_3,
    sum(_v_wordle_daily_stats.games_won_in_4) AS games_won_in_4,
    sum(_v_wordle_daily_stats.games_won_in_5) AS games_won_in_5,
    sum(_v_wordle_daily_stats.games_won_in_6) AS games_won_in_6,
    sum(_v_wordle_daily_stats.four_letter_games_won) AS four_letter_games_won,
    sum(_v_wordle_daily_stats.four_letter_games_lost) AS four_letter_games_lost,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_1) AS four_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_2) AS four_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_3) AS four_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_4) AS four_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_5) AS four_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_6) AS four_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.five_letter_games_won) AS five_letter_games_won,
    sum(_v_wordle_daily_stats.five_letter_games_lost) AS five_letter_games_lost,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_1) AS five_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_2) AS five_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_3) AS five_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_4) AS five_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_5) AS five_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_6) AS five_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.six_letter_games_won) AS six_letter_games_won,
    sum(_v_wordle_daily_stats.six_letter_games_lost) AS six_letter_games_lost,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_1) AS six_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_2) AS six_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_3) AS six_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_4) AS six_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_5) AS six_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_6) AS six_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.seven_letter_games_won) AS seven_letter_games_won,
    sum(_v_wordle_daily_stats.seven_letter_games_lost) AS seven_letter_games_lost,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_1) AS seven_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_2) AS seven_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_3) AS seven_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_4) AS seven_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_5) AS seven_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_6) AS seven_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.eight_letter_games_won) AS eight_letter_games_won,
    sum(_v_wordle_daily_stats.eight_letter_games_lost) AS eight_letter_games_lost,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_1) AS eight_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_2) AS eight_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_3) AS eight_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_4) AS eight_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_5) AS eight_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_6) AS eight_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.nine_letter_games_won) AS nine_letter_games_won,
    sum(_v_wordle_daily_stats.nine_letter_games_lost) AS nine_letter_games_lost,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_1) AS nine_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_2) AS nine_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_3) AS nine_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_4) AS nine_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_5) AS nine_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_6) AS nine_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.ten_letter_games_won) AS ten_letter_games_won,
    sum(_v_wordle_daily_stats.ten_letter_games_lost) AS ten_letter_games_lost,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_1) AS ten_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_2) AS ten_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_3) AS ten_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_4) AS ten_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_5) AS ten_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_6) AS ten_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.eleven_letter_games_won) AS eleven_letter_games_won,
    sum(_v_wordle_daily_stats.eleven_letter_games_lost) AS eleven_letter_games_lost,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_1) AS eleven_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_2) AS eleven_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_3) AS eleven_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_4) AS eleven_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_5) AS eleven_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_6) AS eleven_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.twelve_letter_games_won) AS twelve_letter_games_won,
    sum(_v_wordle_daily_stats.twelve_letter_games_lost) AS twelve_letter_games_lost,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_1) AS twelve_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_2) AS twelve_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_3) AS twelve_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_4) AS twelve_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_5) AS twelve_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_6) AS twelve_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won) AS thirteen_letter_games_won,
    sum(_v_wordle_daily_stats.thirteen_letter_games_lost) AS thirteen_letter_games_lost,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_1) AS thirteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_2) AS thirteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_3) AS thirteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_4) AS thirteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_5) AS thirteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_6) AS thirteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won) AS fourteen_letter_games_won,
    sum(_v_wordle_daily_stats.fourteen_letter_games_lost) AS fourteen_letter_games_lost,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_1) AS fourteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_2) AS fourteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_3) AS fourteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_4) AS fourteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_5) AS fourteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_6) AS fourteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won) AS fifteen_letter_games_won,
    sum(_v_wordle_daily_stats.fifteen_letter_games_lost) AS fifteen_letter_games_lost,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_1) AS fifteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_2) AS fifteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_3) AS fifteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_4) AS fifteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_5) AS fifteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_6) AS fifteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won) AS sixteen_letter_games_won,
    sum(_v_wordle_daily_stats.sixteen_letter_games_lost) AS sixteen_letter_games_lost,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_1) AS sixteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_2) AS sixteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_3) AS sixteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_4) AS sixteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_5) AS sixteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_6) AS sixteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won) AS seventeen_letter_games_won,
    sum(_v_wordle_daily_stats.seventeen_letter_games_lost) AS seventeen_letter_games_lost,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_1) AS seventeen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_2) AS seventeen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_3) AS seventeen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_4) AS seventeen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_5) AS seventeen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_6) AS seventeen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won) AS eighteen_letter_games_won,
    sum(_v_wordle_daily_stats.eighteen_letter_games_lost) AS eighteen_letter_games_lost,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_1) AS eighteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_2) AS eighteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_3) AS eighteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_4) AS eighteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_5) AS eighteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_6) AS eighteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won) AS nineteen_letter_games_won,
    sum(_v_wordle_daily_stats.nineteen_letter_games_lost) AS nineteen_letter_games_lost,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_1) AS nineteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_2) AS nineteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_3) AS nineteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_4) AS nineteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_5) AS nineteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_6) AS nineteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.twenty_letter_games_won) AS twenty_letter_games_won,
    sum(_v_wordle_daily_stats.twenty_letter_games_lost) AS twenty_letter_games_lost,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_1) AS twenty_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_2) AS twenty_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_3) AS twenty_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_4) AS twenty_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_5) AS twenty_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_6) AS twenty_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won) AS twentyone_letter_games_won,
    sum(_v_wordle_daily_stats.twentyone_letter_games_lost) AS twentyone_letter_games_lost,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_1) AS twentyone_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_2) AS twentyone_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_3) AS twentyone_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_4) AS twentyone_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_5) AS twentyone_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_6) AS twentyone_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won) AS twentytwo_letter_games_won,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_lost) AS twentytwo_letter_games_lost,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_1) AS twentytwo_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_2) AS twentytwo_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_3) AS twentytwo_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_4) AS twentytwo_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_5) AS twentytwo_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_6) AS twentytwo_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won) AS twentythree_letter_games_won,
    sum(_v_wordle_daily_stats.twentythree_letter_games_lost) AS twentythree_letter_games_lost,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_1) AS twentythree_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_2) AS twentythree_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_3) AS twentythree_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_4) AS twentythree_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_5) AS twentythree_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_6) AS twentythree_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won) AS five_letter_crazy_games_won,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_lost) AS five_letter_crazy_games_lost,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_1) AS five_letter_crazy_games_won_in_1,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_2) AS five_letter_crazy_games_won_in_2,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_3) AS five_letter_crazy_games_won_in_3,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_4) AS five_letter_crazy_games_won_in_4,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_5) AS five_letter_crazy_games_won_in_5,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_6) AS five_letter_crazy_games_won_in_6
   FROM _v_wordle_daily_stats
  GROUP BY _v_wordle_daily_stats.player, _v_wordle_daily_stats.month, _v_wordle_daily_stats.year;

create or replace view public._v_wordle_yearly_stats as
   SELECT _v_wordle_daily_stats.player,
    _v_wordle_daily_stats.year,
    sum(_v_wordle_daily_stats.games_won) AS games_won,
    sum(_v_wordle_daily_stats.games_lost) AS games_lost,
    sum(_v_wordle_daily_stats.games_played) AS games_played,
    sum(_v_wordle_daily_stats.games_won_in_1) AS games_won_in_1,
    sum(_v_wordle_daily_stats.games_won_in_2) AS games_won_in_2,
    sum(_v_wordle_daily_stats.games_won_in_3) AS games_won_in_3,
    sum(_v_wordle_daily_stats.games_won_in_4) AS games_won_in_4,
    sum(_v_wordle_daily_stats.games_won_in_5) AS games_won_in_5,
    sum(_v_wordle_daily_stats.games_won_in_6) AS games_won_in_6,
    sum(_v_wordle_daily_stats.four_letter_games_won) AS four_letter_games_won,
    sum(_v_wordle_daily_stats.four_letter_games_lost) AS four_letter_games_lost,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_1) AS four_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_2) AS four_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_3) AS four_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_4) AS four_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_5) AS four_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.four_letter_games_won_in_6) AS four_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.five_letter_games_won) AS five_letter_games_won,
    sum(_v_wordle_daily_stats.five_letter_games_lost) AS five_letter_games_lost,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_1) AS five_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_2) AS five_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_3) AS five_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_4) AS five_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_5) AS five_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.five_letter_games_won_in_6) AS five_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.six_letter_games_won) AS six_letter_games_won,
    sum(_v_wordle_daily_stats.six_letter_games_lost) AS six_letter_games_lost,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_1) AS six_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_2) AS six_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_3) AS six_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_4) AS six_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_5) AS six_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.six_letter_games_won_in_6) AS six_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.seven_letter_games_won) AS seven_letter_games_won,
    sum(_v_wordle_daily_stats.seven_letter_games_lost) AS seven_letter_games_lost,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_1) AS seven_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_2) AS seven_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_3) AS seven_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_4) AS seven_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_5) AS seven_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.seven_letter_games_won_in_6) AS seven_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.eight_letter_games_won) AS eight_letter_games_won,
    sum(_v_wordle_daily_stats.eight_letter_games_lost) AS eight_letter_games_lost,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_1) AS eight_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_2) AS eight_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_3) AS eight_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_4) AS eight_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_5) AS eight_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.eight_letter_games_won_in_6) AS eight_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.nine_letter_games_won) AS nine_letter_games_won,
    sum(_v_wordle_daily_stats.nine_letter_games_lost) AS nine_letter_games_lost,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_1) AS nine_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_2) AS nine_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_3) AS nine_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_4) AS nine_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_5) AS nine_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.nine_letter_games_won_in_6) AS nine_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.ten_letter_games_won) AS ten_letter_games_won,
    sum(_v_wordle_daily_stats.ten_letter_games_lost) AS ten_letter_games_lost,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_1) AS ten_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_2) AS ten_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_3) AS ten_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_4) AS ten_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_5) AS ten_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.ten_letter_games_won_in_6) AS ten_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.eleven_letter_games_won) AS eleven_letter_games_won,
    sum(_v_wordle_daily_stats.eleven_letter_games_lost) AS eleven_letter_games_lost,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_1) AS eleven_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_2) AS eleven_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_3) AS eleven_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_4) AS eleven_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_5) AS eleven_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.eleven_letter_games_won_in_6) AS eleven_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.twelve_letter_games_won) AS twelve_letter_games_won,
    sum(_v_wordle_daily_stats.twelve_letter_games_lost) AS twelve_letter_games_lost,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_1) AS twelve_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_2) AS twelve_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_3) AS twelve_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_4) AS twelve_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_5) AS twelve_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.twelve_letter_games_won_in_6) AS twelve_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won) AS thirteen_letter_games_won,
    sum(_v_wordle_daily_stats.thirteen_letter_games_lost) AS thirteen_letter_games_lost,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_1) AS thirteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_2) AS thirteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_3) AS thirteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_4) AS thirteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_5) AS thirteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.thirteen_letter_games_won_in_6) AS thirteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won) AS fourteen_letter_games_won,
    sum(_v_wordle_daily_stats.fourteen_letter_games_lost) AS fourteen_letter_games_lost,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_1) AS fourteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_2) AS fourteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_3) AS fourteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_4) AS fourteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_5) AS fourteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.fourteen_letter_games_won_in_6) AS fourteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won) AS fifteen_letter_games_won,
    sum(_v_wordle_daily_stats.fifteen_letter_games_lost) AS fifteen_letter_games_lost,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_1) AS fifteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_2) AS fifteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_3) AS fifteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_4) AS fifteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_5) AS fifteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.fifteen_letter_games_won_in_6) AS fifteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won) AS sixteen_letter_games_won,
    sum(_v_wordle_daily_stats.sixteen_letter_games_lost) AS sixteen_letter_games_lost,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_1) AS sixteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_2) AS sixteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_3) AS sixteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_4) AS sixteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_5) AS sixteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.sixteen_letter_games_won_in_6) AS sixteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won) AS seventeen_letter_games_won,
    sum(_v_wordle_daily_stats.seventeen_letter_games_lost) AS seventeen_letter_games_lost,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_1) AS seventeen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_2) AS seventeen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_3) AS seventeen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_4) AS seventeen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_5) AS seventeen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.seventeen_letter_games_won_in_6) AS seventeen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won) AS eighteen_letter_games_won,
    sum(_v_wordle_daily_stats.eighteen_letter_games_lost) AS eighteen_letter_games_lost,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_1) AS eighteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_2) AS eighteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_3) AS eighteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_4) AS eighteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_5) AS eighteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.eighteen_letter_games_won_in_6) AS eighteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won) AS nineteen_letter_games_won,
    sum(_v_wordle_daily_stats.nineteen_letter_games_lost) AS nineteen_letter_games_lost,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_1) AS nineteen_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_2) AS nineteen_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_3) AS nineteen_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_4) AS nineteen_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_5) AS nineteen_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.nineteen_letter_games_won_in_6) AS nineteen_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.twenty_letter_games_won) AS twenty_letter_games_won,
    sum(_v_wordle_daily_stats.twenty_letter_games_lost) AS twenty_letter_games_lost,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_1) AS twenty_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_2) AS twenty_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_3) AS twenty_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_4) AS twenty_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_5) AS twenty_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.twenty_letter_games_won_in_6) AS twenty_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won) AS twentyone_letter_games_won,
    sum(_v_wordle_daily_stats.twentyone_letter_games_lost) AS twentyone_letter_games_lost,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_1) AS twentyone_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_2) AS twentyone_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_3) AS twentyone_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_4) AS twentyone_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_5) AS twentyone_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.twentyone_letter_games_won_in_6) AS twentyone_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won) AS twentytwo_letter_games_won,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_lost) AS twentytwo_letter_games_lost,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_1) AS twentytwo_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_2) AS twentytwo_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_3) AS twentytwo_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_4) AS twentytwo_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_5) AS twentytwo_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.twentytwo_letter_games_won_in_6) AS twentytwo_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won) AS twentythree_letter_games_won,
    sum(_v_wordle_daily_stats.twentythree_letter_games_lost) AS twentythree_letter_games_lost,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_1) AS twentythree_letter_games_won_in_1,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_2) AS twentythree_letter_games_won_in_2,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_3) AS twentythree_letter_games_won_in_3,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_4) AS twentythree_letter_games_won_in_4,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_5) AS twentythree_letter_games_won_in_5,
    sum(_v_wordle_daily_stats.twentythree_letter_games_won_in_6) AS twentythree_letter_games_won_in_6,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won) AS five_letter_crazy_games_won,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_lost) AS five_letter_crazy_games_lost,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_1) AS five_letter_crazy_games_won_in_1,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_2) AS five_letter_crazy_games_won_in_2,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_3) AS five_letter_crazy_games_won_in_3,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_4) AS five_letter_crazy_games_won_in_4,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_5) AS five_letter_crazy_games_won_in_5,
    sum(_v_wordle_daily_stats.five_letter_crazy_games_won_in_6) AS five_letter_crazy_games_won_in_6
   FROM _v_wordle_daily_stats
  GROUP BY _v_wordle_daily_stats.player, _v_wordle_daily_stats.year;

create or replace view public._v_wordle_alltime_stats as
   SELECT combined_stats.player,
    sum(combined_stats.games_won) AS games_won,
    sum(combined_stats.games_lost) AS games_lost,
    sum(combined_stats.games_played) AS games_played,
    sum(combined_stats.games_won_in_1) AS games_won_in_1,
    sum(combined_stats.games_won_in_2) AS games_won_in_2,
    sum(combined_stats.games_won_in_3) AS games_won_in_3,
    sum(combined_stats.games_won_in_4) AS games_won_in_4,
    sum(combined_stats.games_won_in_5) AS games_won_in_5,
    sum(combined_stats.games_won_in_6) AS games_won_in_6,
    sum(combined_stats.four_letter_games_won) AS four_letter_games_won,
    sum(combined_stats.four_letter_games_lost) AS four_letter_games_lost,
    sum(combined_stats.four_letter_games_won_in_1) AS four_letter_games_won_in_1,
    sum(combined_stats.four_letter_games_won_in_2) AS four_letter_games_won_in_2,
    sum(combined_stats.four_letter_games_won_in_3) AS four_letter_games_won_in_3,
    sum(combined_stats.four_letter_games_won_in_4) AS four_letter_games_won_in_4,
    sum(combined_stats.four_letter_games_won_in_5) AS four_letter_games_won_in_5,
    sum(combined_stats.four_letter_games_won_in_6) AS four_letter_games_won_in_6,
    sum(combined_stats.five_letter_games_won) AS five_letter_games_won,
    sum(combined_stats.five_letter_games_lost) AS five_letter_games_lost,
    sum(combined_stats.five_letter_games_won_in_1) AS five_letter_games_won_in_1,
    sum(combined_stats.five_letter_games_won_in_2) AS five_letter_games_won_in_2,
    sum(combined_stats.five_letter_games_won_in_3) AS five_letter_games_won_in_3,
    sum(combined_stats.five_letter_games_won_in_4) AS five_letter_games_won_in_4,
    sum(combined_stats.five_letter_games_won_in_5) AS five_letter_games_won_in_5,
    sum(combined_stats.five_letter_games_won_in_6) AS five_letter_games_won_in_6,
    sum(combined_stats.six_letter_games_won) AS six_letter_games_won,
    sum(combined_stats.six_letter_games_lost) AS six_letter_games_lost,
    sum(combined_stats.six_letter_games_won_in_1) AS six_letter_games_won_in_1,
    sum(combined_stats.six_letter_games_won_in_2) AS six_letter_games_won_in_2,
    sum(combined_stats.six_letter_games_won_in_3) AS six_letter_games_won_in_3,
    sum(combined_stats.six_letter_games_won_in_4) AS six_letter_games_won_in_4,
    sum(combined_stats.six_letter_games_won_in_5) AS six_letter_games_won_in_5,
    sum(combined_stats.six_letter_games_won_in_6) AS six_letter_games_won_in_6,
    sum(combined_stats.seven_letter_games_won) AS seven_letter_games_won,
    sum(combined_stats.seven_letter_games_lost) AS seven_letter_games_lost,
    sum(combined_stats.seven_letter_games_won_in_1) AS seven_letter_games_won_in_1,
    sum(combined_stats.seven_letter_games_won_in_2) AS seven_letter_games_won_in_2,
    sum(combined_stats.seven_letter_games_won_in_3) AS seven_letter_games_won_in_3,
    sum(combined_stats.seven_letter_games_won_in_4) AS seven_letter_games_won_in_4,
    sum(combined_stats.seven_letter_games_won_in_5) AS seven_letter_games_won_in_5,
    sum(combined_stats.seven_letter_games_won_in_6) AS seven_letter_games_won_in_6,
    sum(combined_stats.eight_letter_games_won) AS eight_letter_games_won,
    sum(combined_stats.eight_letter_games_lost) AS eight_letter_games_lost,
    sum(combined_stats.eight_letter_games_won_in_1) AS eight_letter_games_won_in_1,
    sum(combined_stats.eight_letter_games_won_in_2) AS eight_letter_games_won_in_2,
    sum(combined_stats.eight_letter_games_won_in_3) AS eight_letter_games_won_in_3,
    sum(combined_stats.eight_letter_games_won_in_4) AS eight_letter_games_won_in_4,
    sum(combined_stats.eight_letter_games_won_in_5) AS eight_letter_games_won_in_5,
    sum(combined_stats.eight_letter_games_won_in_6) AS eight_letter_games_won_in_6,
    sum(combined_stats.nine_letter_games_won) AS nine_letter_games_won,
    sum(combined_stats.nine_letter_games_lost) AS nine_letter_games_lost,
    sum(combined_stats.nine_letter_games_won_in_1) AS nine_letter_games_won_in_1,
    sum(combined_stats.nine_letter_games_won_in_2) AS nine_letter_games_won_in_2,
    sum(combined_stats.nine_letter_games_won_in_3) AS nine_letter_games_won_in_3,
    sum(combined_stats.nine_letter_games_won_in_4) AS nine_letter_games_won_in_4,
    sum(combined_stats.nine_letter_games_won_in_5) AS nine_letter_games_won_in_5,
    sum(combined_stats.nine_letter_games_won_in_6) AS nine_letter_games_won_in_6,
    sum(combined_stats.ten_letter_games_won) AS ten_letter_games_won,
    sum(combined_stats.ten_letter_games_lost) AS ten_letter_games_lost,
    sum(combined_stats.ten_letter_games_won_in_1) AS ten_letter_games_won_in_1,
    sum(combined_stats.ten_letter_games_won_in_2) AS ten_letter_games_won_in_2,
    sum(combined_stats.ten_letter_games_won_in_3) AS ten_letter_games_won_in_3,
    sum(combined_stats.ten_letter_games_won_in_4) AS ten_letter_games_won_in_4,
    sum(combined_stats.ten_letter_games_won_in_5) AS ten_letter_games_won_in_5,
    sum(combined_stats.ten_letter_games_won_in_6) AS ten_letter_games_won_in_6,
    sum(combined_stats.eleven_letter_games_won) AS eleven_letter_games_won,
    sum(combined_stats.eleven_letter_games_lost) AS eleven_letter_games_lost,
    sum(combined_stats.eleven_letter_games_won_in_1) AS eleven_letter_games_won_in_1,
    sum(combined_stats.eleven_letter_games_won_in_2) AS eleven_letter_games_won_in_2,
    sum(combined_stats.eleven_letter_games_won_in_3) AS eleven_letter_games_won_in_3,
    sum(combined_stats.eleven_letter_games_won_in_4) AS eleven_letter_games_won_in_4,
    sum(combined_stats.eleven_letter_games_won_in_5) AS eleven_letter_games_won_in_5,
    sum(combined_stats.eleven_letter_games_won_in_6) AS eleven_letter_games_won_in_6,
    sum(combined_stats.twelve_letter_games_won) AS twelve_letter_games_won,
    sum(combined_stats.twelve_letter_games_lost) AS twelve_letter_games_lost,
    sum(combined_stats.twelve_letter_games_won_in_1) AS twelve_letter_games_won_in_1,
    sum(combined_stats.twelve_letter_games_won_in_2) AS twelve_letter_games_won_in_2,
    sum(combined_stats.twelve_letter_games_won_in_3) AS twelve_letter_games_won_in_3,
    sum(combined_stats.twelve_letter_games_won_in_4) AS twelve_letter_games_won_in_4,
    sum(combined_stats.twelve_letter_games_won_in_5) AS twelve_letter_games_won_in_5,
    sum(combined_stats.twelve_letter_games_won_in_6) AS twelve_letter_games_won_in_6,
    sum(combined_stats.thirteen_letter_games_won) AS thirteen_letter_games_won,
    sum(combined_stats.thirteen_letter_games_lost) AS thirteen_letter_games_lost,
    sum(combined_stats.thirteen_letter_games_won_in_1) AS thirteen_letter_games_won_in_1,
    sum(combined_stats.thirteen_letter_games_won_in_2) AS thirteen_letter_games_won_in_2,
    sum(combined_stats.thirteen_letter_games_won_in_3) AS thirteen_letter_games_won_in_3,
    sum(combined_stats.thirteen_letter_games_won_in_4) AS thirteen_letter_games_won_in_4,
    sum(combined_stats.thirteen_letter_games_won_in_5) AS thirteen_letter_games_won_in_5,
    sum(combined_stats.thirteen_letter_games_won_in_6) AS thirteen_letter_games_won_in_6,
    sum(combined_stats.fourteen_letter_games_won) AS fourteen_letter_games_won,
    sum(combined_stats.fourteen_letter_games_lost) AS fourteen_letter_games_lost,
    sum(combined_stats.fourteen_letter_games_won_in_1) AS fourteen_letter_games_won_in_1,
    sum(combined_stats.fourteen_letter_games_won_in_2) AS fourteen_letter_games_won_in_2,
    sum(combined_stats.fourteen_letter_games_won_in_3) AS fourteen_letter_games_won_in_3,
    sum(combined_stats.fourteen_letter_games_won_in_4) AS fourteen_letter_games_won_in_4,
    sum(combined_stats.fourteen_letter_games_won_in_5) AS fourteen_letter_games_won_in_5,
    sum(combined_stats.fourteen_letter_games_won_in_6) AS fourteen_letter_games_won_in_6,
    sum(combined_stats.fifteen_letter_games_won) AS fifteen_letter_games_won,
    sum(combined_stats.fifteen_letter_games_lost) AS fifteen_letter_games_lost,
    sum(combined_stats.fifteen_letter_games_won_in_1) AS fifteen_letter_games_won_in_1,
    sum(combined_stats.fifteen_letter_games_won_in_2) AS fifteen_letter_games_won_in_2,
    sum(combined_stats.fifteen_letter_games_won_in_3) AS fifteen_letter_games_won_in_3,
    sum(combined_stats.fifteen_letter_games_won_in_4) AS fifteen_letter_games_won_in_4,
    sum(combined_stats.fifteen_letter_games_won_in_5) AS fifteen_letter_games_won_in_5,
    sum(combined_stats.fifteen_letter_games_won_in_6) AS fifteen_letter_games_won_in_6,
    sum(combined_stats.sixteen_letter_games_won) AS sixteen_letter_games_won,
    sum(combined_stats.sixteen_letter_games_lost) AS sixteen_letter_games_lost,
    sum(combined_stats.sixteen_letter_games_won_in_1) AS sixteen_letter_games_won_in_1,
    sum(combined_stats.sixteen_letter_games_won_in_2) AS sixteen_letter_games_won_in_2,
    sum(combined_stats.sixteen_letter_games_won_in_3) AS sixteen_letter_games_won_in_3,
    sum(combined_stats.sixteen_letter_games_won_in_4) AS sixteen_letter_games_won_in_4,
    sum(combined_stats.sixteen_letter_games_won_in_5) AS sixteen_letter_games_won_in_5,
    sum(combined_stats.sixteen_letter_games_won_in_6) AS sixteen_letter_games_won_in_6,
    sum(combined_stats.seventeen_letter_games_won) AS seventeen_letter_games_won,
    sum(combined_stats.seventeen_letter_games_lost) AS seventeen_letter_games_lost,
    sum(combined_stats.seventeen_letter_games_won_in_1) AS seventeen_letter_games_won_in_1,
    sum(combined_stats.seventeen_letter_games_won_in_2) AS seventeen_letter_games_won_in_2,
    sum(combined_stats.seventeen_letter_games_won_in_3) AS seventeen_letter_games_won_in_3,
    sum(combined_stats.seventeen_letter_games_won_in_4) AS seventeen_letter_games_won_in_4,
    sum(combined_stats.seventeen_letter_games_won_in_5) AS seventeen_letter_games_won_in_5,
    sum(combined_stats.seventeen_letter_games_won_in_6) AS seventeen_letter_games_won_in_6,
    sum(combined_stats.eighteen_letter_games_won) AS eighteen_letter_games_won,
    sum(combined_stats.eighteen_letter_games_lost) AS eighteen_letter_games_lost,
    sum(combined_stats.eighteen_letter_games_won_in_1) AS eighteen_letter_games_won_in_1,
    sum(combined_stats.eighteen_letter_games_won_in_2) AS eighteen_letter_games_won_in_2,
    sum(combined_stats.eighteen_letter_games_won_in_3) AS eighteen_letter_games_won_in_3,
    sum(combined_stats.eighteen_letter_games_won_in_4) AS eighteen_letter_games_won_in_4,
    sum(combined_stats.eighteen_letter_games_won_in_5) AS eighteen_letter_games_won_in_5,
    sum(combined_stats.eighteen_letter_games_won_in_6) AS eighteen_letter_games_won_in_6,
    sum(combined_stats.nineteen_letter_games_won) AS nineteen_letter_games_won,
    sum(combined_stats.nineteen_letter_games_lost) AS nineteen_letter_games_lost,
    sum(combined_stats.nineteen_letter_games_won_in_1) AS nineteen_letter_games_won_in_1,
    sum(combined_stats.nineteen_letter_games_won_in_2) AS nineteen_letter_games_won_in_2,
    sum(combined_stats.nineteen_letter_games_won_in_3) AS nineteen_letter_games_won_in_3,
    sum(combined_stats.nineteen_letter_games_won_in_4) AS nineteen_letter_games_won_in_4,
    sum(combined_stats.nineteen_letter_games_won_in_5) AS nineteen_letter_games_won_in_5,
    sum(combined_stats.nineteen_letter_games_won_in_6) AS nineteen_letter_games_won_in_6,
    sum(combined_stats.twenty_letter_games_won) AS twenty_letter_games_won,
    sum(combined_stats.twenty_letter_games_lost) AS twenty_letter_games_lost,
    sum(combined_stats.twenty_letter_games_won_in_1) AS twenty_letter_games_won_in_1,
    sum(combined_stats.twenty_letter_games_won_in_2) AS twenty_letter_games_won_in_2,
    sum(combined_stats.twenty_letter_games_won_in_3) AS twenty_letter_games_won_in_3,
    sum(combined_stats.twenty_letter_games_won_in_4) AS twenty_letter_games_won_in_4,
    sum(combined_stats.twenty_letter_games_won_in_5) AS twenty_letter_games_won_in_5,
    sum(combined_stats.twenty_letter_games_won_in_6) AS twenty_letter_games_won_in_6,
    sum(combined_stats.twentyone_letter_games_won) AS twentyone_letter_games_won,
    sum(combined_stats.twentyone_letter_games_lost) AS twentyone_letter_games_lost,
    sum(combined_stats.twentyone_letter_games_won_in_1) AS twentyone_letter_games_won_in_1,
    sum(combined_stats.twentyone_letter_games_won_in_2) AS twentyone_letter_games_won_in_2,
    sum(combined_stats.twentyone_letter_games_won_in_3) AS twentyone_letter_games_won_in_3,
    sum(combined_stats.twentyone_letter_games_won_in_4) AS twentyone_letter_games_won_in_4,
    sum(combined_stats.twentyone_letter_games_won_in_5) AS twentyone_letter_games_won_in_5,
    sum(combined_stats.twentyone_letter_games_won_in_6) AS twentyone_letter_games_won_in_6,
    sum(combined_stats.twentytwo_letter_games_won) AS twentytwo_letter_games_won,
    sum(combined_stats.twentytwo_letter_games_lost) AS twentytwo_letter_games_lost,
    sum(combined_stats.twentytwo_letter_games_won_in_1) AS twentytwo_letter_games_won_in_1,
    sum(combined_stats.twentytwo_letter_games_won_in_2) AS twentytwo_letter_games_won_in_2,
    sum(combined_stats.twentytwo_letter_games_won_in_3) AS twentytwo_letter_games_won_in_3,
    sum(combined_stats.twentytwo_letter_games_won_in_4) AS twentytwo_letter_games_won_in_4,
    sum(combined_stats.twentytwo_letter_games_won_in_5) AS twentytwo_letter_games_won_in_5,
    sum(combined_stats.twentytwo_letter_games_won_in_6) AS twentytwo_letter_games_won_in_6,
    sum(combined_stats.twentythree_letter_games_won) AS twentythree_letter_games_won,
    sum(combined_stats.twentythree_letter_games_lost) AS twentythree_letter_games_lost,
    sum(combined_stats.twentythree_letter_games_won_in_1) AS twentythree_letter_games_won_in_1,
    sum(combined_stats.twentythree_letter_games_won_in_2) AS twentythree_letter_games_won_in_2,
    sum(combined_stats.twentythree_letter_games_won_in_3) AS twentythree_letter_games_won_in_3,
    sum(combined_stats.twentythree_letter_games_won_in_4) AS twentythree_letter_games_won_in_4,
    sum(combined_stats.twentythree_letter_games_won_in_5) AS twentythree_letter_games_won_in_5,
    sum(combined_stats.twentythree_letter_games_won_in_6) AS twentythree_letter_games_won_in_6,
    sum(combined_stats.five_letter_crazy_games_won) AS five_letter_crazy_games_won,
    sum(combined_stats.five_letter_crazy_games_lost) AS five_letter_crazy_games_lost,
    sum(combined_stats.five_letter_crazy_games_won_in_1) AS five_letter_crazy_games_won_in_1,
    sum(combined_stats.five_letter_crazy_games_won_in_2) AS five_letter_crazy_games_won_in_2,
    sum(combined_stats.five_letter_crazy_games_won_in_3) AS five_letter_crazy_games_won_in_3,
    sum(combined_stats.five_letter_crazy_games_won_in_4) AS five_letter_crazy_games_won_in_4,
    sum(combined_stats.five_letter_crazy_games_won_in_5) AS five_letter_crazy_games_won_in_5,
    sum(combined_stats.five_letter_crazy_games_won_in_6) AS five_letter_crazy_games_won_in_6
   FROM ( SELECT _v_wordle_yearly_stats.player,
            _v_wordle_yearly_stats.year,
            _v_wordle_yearly_stats.games_won,
            _v_wordle_yearly_stats.games_lost,
            _v_wordle_yearly_stats.games_played,
            _v_wordle_yearly_stats.games_won_in_1,
            _v_wordle_yearly_stats.games_won_in_2,
            _v_wordle_yearly_stats.games_won_in_3,
            _v_wordle_yearly_stats.games_won_in_4,
            _v_wordle_yearly_stats.games_won_in_5,
            _v_wordle_yearly_stats.games_won_in_6,
            _v_wordle_yearly_stats.four_letter_games_won,
            _v_wordle_yearly_stats.four_letter_games_lost,
            _v_wordle_yearly_stats.four_letter_games_won_in_1,
            _v_wordle_yearly_stats.four_letter_games_won_in_2,
            _v_wordle_yearly_stats.four_letter_games_won_in_3,
            _v_wordle_yearly_stats.four_letter_games_won_in_4,
            _v_wordle_yearly_stats.four_letter_games_won_in_5,
            _v_wordle_yearly_stats.four_letter_games_won_in_6,
            _v_wordle_yearly_stats.five_letter_games_won,
            _v_wordle_yearly_stats.five_letter_games_lost,
            _v_wordle_yearly_stats.five_letter_games_won_in_1,
            _v_wordle_yearly_stats.five_letter_games_won_in_2,
            _v_wordle_yearly_stats.five_letter_games_won_in_3,
            _v_wordle_yearly_stats.five_letter_games_won_in_4,
            _v_wordle_yearly_stats.five_letter_games_won_in_5,
            _v_wordle_yearly_stats.five_letter_games_won_in_6,
            _v_wordle_yearly_stats.six_letter_games_won,
            _v_wordle_yearly_stats.six_letter_games_lost,
            _v_wordle_yearly_stats.six_letter_games_won_in_1,
            _v_wordle_yearly_stats.six_letter_games_won_in_2,
            _v_wordle_yearly_stats.six_letter_games_won_in_3,
            _v_wordle_yearly_stats.six_letter_games_won_in_4,
            _v_wordle_yearly_stats.six_letter_games_won_in_5,
            _v_wordle_yearly_stats.six_letter_games_won_in_6,
            _v_wordle_yearly_stats.seven_letter_games_won,
            _v_wordle_yearly_stats.seven_letter_games_lost,
            _v_wordle_yearly_stats.seven_letter_games_won_in_1,
            _v_wordle_yearly_stats.seven_letter_games_won_in_2,
            _v_wordle_yearly_stats.seven_letter_games_won_in_3,
            _v_wordle_yearly_stats.seven_letter_games_won_in_4,
            _v_wordle_yearly_stats.seven_letter_games_won_in_5,
            _v_wordle_yearly_stats.seven_letter_games_won_in_6,
            _v_wordle_yearly_stats.eight_letter_games_won,
            _v_wordle_yearly_stats.eight_letter_games_lost,
            _v_wordle_yearly_stats.eight_letter_games_won_in_1,
            _v_wordle_yearly_stats.eight_letter_games_won_in_2,
            _v_wordle_yearly_stats.eight_letter_games_won_in_3,
            _v_wordle_yearly_stats.eight_letter_games_won_in_4,
            _v_wordle_yearly_stats.eight_letter_games_won_in_5,
            _v_wordle_yearly_stats.eight_letter_games_won_in_6,
            _v_wordle_yearly_stats.nine_letter_games_won,
            _v_wordle_yearly_stats.nine_letter_games_lost,
            _v_wordle_yearly_stats.nine_letter_games_won_in_1,
            _v_wordle_yearly_stats.nine_letter_games_won_in_2,
            _v_wordle_yearly_stats.nine_letter_games_won_in_3,
            _v_wordle_yearly_stats.nine_letter_games_won_in_4,
            _v_wordle_yearly_stats.nine_letter_games_won_in_5,
            _v_wordle_yearly_stats.nine_letter_games_won_in_6,
            _v_wordle_yearly_stats.ten_letter_games_won,
            _v_wordle_yearly_stats.ten_letter_games_lost,
            _v_wordle_yearly_stats.ten_letter_games_won_in_1,
            _v_wordle_yearly_stats.ten_letter_games_won_in_2,
            _v_wordle_yearly_stats.ten_letter_games_won_in_3,
            _v_wordle_yearly_stats.ten_letter_games_won_in_4,
            _v_wordle_yearly_stats.ten_letter_games_won_in_5,
            _v_wordle_yearly_stats.ten_letter_games_won_in_6,
            _v_wordle_yearly_stats.eleven_letter_games_won,
            _v_wordle_yearly_stats.eleven_letter_games_lost,
            _v_wordle_yearly_stats.eleven_letter_games_won_in_1,
            _v_wordle_yearly_stats.eleven_letter_games_won_in_2,
            _v_wordle_yearly_stats.eleven_letter_games_won_in_3,
            _v_wordle_yearly_stats.eleven_letter_games_won_in_4,
            _v_wordle_yearly_stats.eleven_letter_games_won_in_5,
            _v_wordle_yearly_stats.eleven_letter_games_won_in_6,
            _v_wordle_yearly_stats.twelve_letter_games_won,
            _v_wordle_yearly_stats.twelve_letter_games_lost,
            _v_wordle_yearly_stats.twelve_letter_games_won_in_1,
            _v_wordle_yearly_stats.twelve_letter_games_won_in_2,
            _v_wordle_yearly_stats.twelve_letter_games_won_in_3,
            _v_wordle_yearly_stats.twelve_letter_games_won_in_4,
            _v_wordle_yearly_stats.twelve_letter_games_won_in_5,
            _v_wordle_yearly_stats.twelve_letter_games_won_in_6,
            _v_wordle_yearly_stats.thirteen_letter_games_won,
            _v_wordle_yearly_stats.thirteen_letter_games_lost,
            _v_wordle_yearly_stats.thirteen_letter_games_won_in_1,
            _v_wordle_yearly_stats.thirteen_letter_games_won_in_2,
            _v_wordle_yearly_stats.thirteen_letter_games_won_in_3,
            _v_wordle_yearly_stats.thirteen_letter_games_won_in_4,
            _v_wordle_yearly_stats.thirteen_letter_games_won_in_5,
            _v_wordle_yearly_stats.thirteen_letter_games_won_in_6,
            _v_wordle_yearly_stats.fourteen_letter_games_won,
            _v_wordle_yearly_stats.fourteen_letter_games_lost,
            _v_wordle_yearly_stats.fourteen_letter_games_won_in_1,
            _v_wordle_yearly_stats.fourteen_letter_games_won_in_2,
            _v_wordle_yearly_stats.fourteen_letter_games_won_in_3,
            _v_wordle_yearly_stats.fourteen_letter_games_won_in_4,
            _v_wordle_yearly_stats.fourteen_letter_games_won_in_5,
            _v_wordle_yearly_stats.fourteen_letter_games_won_in_6,
            _v_wordle_yearly_stats.fifteen_letter_games_won,
            _v_wordle_yearly_stats.fifteen_letter_games_lost,
            _v_wordle_yearly_stats.fifteen_letter_games_won_in_1,
            _v_wordle_yearly_stats.fifteen_letter_games_won_in_2,
            _v_wordle_yearly_stats.fifteen_letter_games_won_in_3,
            _v_wordle_yearly_stats.fifteen_letter_games_won_in_4,
            _v_wordle_yearly_stats.fifteen_letter_games_won_in_5,
            _v_wordle_yearly_stats.fifteen_letter_games_won_in_6,
            _v_wordle_yearly_stats.sixteen_letter_games_won,
            _v_wordle_yearly_stats.sixteen_letter_games_lost,
            _v_wordle_yearly_stats.sixteen_letter_games_won_in_1,
            _v_wordle_yearly_stats.sixteen_letter_games_won_in_2,
            _v_wordle_yearly_stats.sixteen_letter_games_won_in_3,
            _v_wordle_yearly_stats.sixteen_letter_games_won_in_4,
            _v_wordle_yearly_stats.sixteen_letter_games_won_in_5,
            _v_wordle_yearly_stats.sixteen_letter_games_won_in_6,
            _v_wordle_yearly_stats.seventeen_letter_games_won,
            _v_wordle_yearly_stats.seventeen_letter_games_lost,
            _v_wordle_yearly_stats.seventeen_letter_games_won_in_1,
            _v_wordle_yearly_stats.seventeen_letter_games_won_in_2,
            _v_wordle_yearly_stats.seventeen_letter_games_won_in_3,
            _v_wordle_yearly_stats.seventeen_letter_games_won_in_4,
            _v_wordle_yearly_stats.seventeen_letter_games_won_in_5,
            _v_wordle_yearly_stats.seventeen_letter_games_won_in_6,
            _v_wordle_yearly_stats.eighteen_letter_games_won,
            _v_wordle_yearly_stats.eighteen_letter_games_lost,
            _v_wordle_yearly_stats.eighteen_letter_games_won_in_1,
            _v_wordle_yearly_stats.eighteen_letter_games_won_in_2,
            _v_wordle_yearly_stats.eighteen_letter_games_won_in_3,
            _v_wordle_yearly_stats.eighteen_letter_games_won_in_4,
            _v_wordle_yearly_stats.eighteen_letter_games_won_in_5,
            _v_wordle_yearly_stats.eighteen_letter_games_won_in_6,
            _v_wordle_yearly_stats.nineteen_letter_games_won,
            _v_wordle_yearly_stats.nineteen_letter_games_lost,
            _v_wordle_yearly_stats.nineteen_letter_games_won_in_1,
            _v_wordle_yearly_stats.nineteen_letter_games_won_in_2,
            _v_wordle_yearly_stats.nineteen_letter_games_won_in_3,
            _v_wordle_yearly_stats.nineteen_letter_games_won_in_4,
            _v_wordle_yearly_stats.nineteen_letter_games_won_in_5,
            _v_wordle_yearly_stats.nineteen_letter_games_won_in_6,
            _v_wordle_yearly_stats.twenty_letter_games_won,
            _v_wordle_yearly_stats.twenty_letter_games_lost,
            _v_wordle_yearly_stats.twenty_letter_games_won_in_1,
            _v_wordle_yearly_stats.twenty_letter_games_won_in_2,
            _v_wordle_yearly_stats.twenty_letter_games_won_in_3,
            _v_wordle_yearly_stats.twenty_letter_games_won_in_4,
            _v_wordle_yearly_stats.twenty_letter_games_won_in_5,
            _v_wordle_yearly_stats.twenty_letter_games_won_in_6,
            _v_wordle_yearly_stats.twentyone_letter_games_won,
            _v_wordle_yearly_stats.twentyone_letter_games_lost,
            _v_wordle_yearly_stats.twentyone_letter_games_won_in_1,
            _v_wordle_yearly_stats.twentyone_letter_games_won_in_2,
            _v_wordle_yearly_stats.twentyone_letter_games_won_in_3,
            _v_wordle_yearly_stats.twentyone_letter_games_won_in_4,
            _v_wordle_yearly_stats.twentyone_letter_games_won_in_5,
            _v_wordle_yearly_stats.twentyone_letter_games_won_in_6,
            _v_wordle_yearly_stats.twentytwo_letter_games_won,
            _v_wordle_yearly_stats.twentytwo_letter_games_lost,
            _v_wordle_yearly_stats.twentytwo_letter_games_won_in_1,
            _v_wordle_yearly_stats.twentytwo_letter_games_won_in_2,
            _v_wordle_yearly_stats.twentytwo_letter_games_won_in_3,
            _v_wordle_yearly_stats.twentytwo_letter_games_won_in_4,
            _v_wordle_yearly_stats.twentytwo_letter_games_won_in_5,
            _v_wordle_yearly_stats.twentytwo_letter_games_won_in_6,
            _v_wordle_yearly_stats.twentythree_letter_games_won,
            _v_wordle_yearly_stats.twentythree_letter_games_lost,
            _v_wordle_yearly_stats.twentythree_letter_games_won_in_1,
            _v_wordle_yearly_stats.twentythree_letter_games_won_in_2,
            _v_wordle_yearly_stats.twentythree_letter_games_won_in_3,
            _v_wordle_yearly_stats.twentythree_letter_games_won_in_4,
            _v_wordle_yearly_stats.twentythree_letter_games_won_in_5,
            _v_wordle_yearly_stats.twentythree_letter_games_won_in_6,
            _v_wordle_yearly_stats.five_letter_crazy_games_won,
            _v_wordle_yearly_stats.five_letter_crazy_games_lost,
            _v_wordle_yearly_stats.five_letter_crazy_games_won_in_1,
            _v_wordle_yearly_stats.five_letter_crazy_games_won_in_2,
            _v_wordle_yearly_stats.five_letter_crazy_games_won_in_3,
            _v_wordle_yearly_stats.five_letter_crazy_games_won_in_4,
            _v_wordle_yearly_stats.five_letter_crazy_games_won_in_5,
            _v_wordle_yearly_stats.five_letter_crazy_games_won_in_6
           FROM _v_wordle_yearly_stats
          WHERE _v_wordle_yearly_stats.year >= 2025
        UNION ALL
         SELECT _mv_wordle_stats_2024.player,
            _mv_wordle_stats_2024.year,
            _mv_wordle_stats_2024.games_won,
            _mv_wordle_stats_2024.games_lost,
            _mv_wordle_stats_2024.games_played,
            _mv_wordle_stats_2024.games_won_in_1,
            _mv_wordle_stats_2024.games_won_in_2,
            _mv_wordle_stats_2024.games_won_in_3,
            _mv_wordle_stats_2024.games_won_in_4,
            _mv_wordle_stats_2024.games_won_in_5,
            _mv_wordle_stats_2024.games_won_in_6,
            _mv_wordle_stats_2024.four_letter_games_won,
            _mv_wordle_stats_2024.four_letter_games_lost,
            _mv_wordle_stats_2024.four_letter_games_won_in_1,
            _mv_wordle_stats_2024.four_letter_games_won_in_2,
            _mv_wordle_stats_2024.four_letter_games_won_in_3,
            _mv_wordle_stats_2024.four_letter_games_won_in_4,
            _mv_wordle_stats_2024.four_letter_games_won_in_5,
            _mv_wordle_stats_2024.four_letter_games_won_in_6,
            _mv_wordle_stats_2024.five_letter_games_won,
            _mv_wordle_stats_2024.five_letter_games_lost,
            _mv_wordle_stats_2024.five_letter_games_won_in_1,
            _mv_wordle_stats_2024.five_letter_games_won_in_2,
            _mv_wordle_stats_2024.five_letter_games_won_in_3,
            _mv_wordle_stats_2024.five_letter_games_won_in_4,
            _mv_wordle_stats_2024.five_letter_games_won_in_5,
            _mv_wordle_stats_2024.five_letter_games_won_in_6,
            _mv_wordle_stats_2024.six_letter_games_won,
            _mv_wordle_stats_2024.six_letter_games_lost,
            _mv_wordle_stats_2024.six_letter_games_won_in_1,
            _mv_wordle_stats_2024.six_letter_games_won_in_2,
            _mv_wordle_stats_2024.six_letter_games_won_in_3,
            _mv_wordle_stats_2024.six_letter_games_won_in_4,
            _mv_wordle_stats_2024.six_letter_games_won_in_5,
            _mv_wordle_stats_2024.six_letter_games_won_in_6,
            _mv_wordle_stats_2024.seven_letter_games_won,
            _mv_wordle_stats_2024.seven_letter_games_lost,
            _mv_wordle_stats_2024.seven_letter_games_won_in_1,
            _mv_wordle_stats_2024.seven_letter_games_won_in_2,
            _mv_wordle_stats_2024.seven_letter_games_won_in_3,
            _mv_wordle_stats_2024.seven_letter_games_won_in_4,
            _mv_wordle_stats_2024.seven_letter_games_won_in_5,
            _mv_wordle_stats_2024.seven_letter_games_won_in_6,
            _mv_wordle_stats_2024.eight_letter_games_won,
            _mv_wordle_stats_2024.eight_letter_games_lost,
            _mv_wordle_stats_2024.eight_letter_games_won_in_1,
            _mv_wordle_stats_2024.eight_letter_games_won_in_2,
            _mv_wordle_stats_2024.eight_letter_games_won_in_3,
            _mv_wordle_stats_2024.eight_letter_games_won_in_4,
            _mv_wordle_stats_2024.eight_letter_games_won_in_5,
            _mv_wordle_stats_2024.eight_letter_games_won_in_6,
            _mv_wordle_stats_2024.nine_letter_games_won,
            _mv_wordle_stats_2024.nine_letter_games_lost,
            _mv_wordle_stats_2024.nine_letter_games_won_in_1,
            _mv_wordle_stats_2024.nine_letter_games_won_in_2,
            _mv_wordle_stats_2024.nine_letter_games_won_in_3,
            _mv_wordle_stats_2024.nine_letter_games_won_in_4,
            _mv_wordle_stats_2024.nine_letter_games_won_in_5,
            _mv_wordle_stats_2024.nine_letter_games_won_in_6,
            _mv_wordle_stats_2024.ten_letter_games_won,
            _mv_wordle_stats_2024.ten_letter_games_lost,
            _mv_wordle_stats_2024.ten_letter_games_won_in_1,
            _mv_wordle_stats_2024.ten_letter_games_won_in_2,
            _mv_wordle_stats_2024.ten_letter_games_won_in_3,
            _mv_wordle_stats_2024.ten_letter_games_won_in_4,
            _mv_wordle_stats_2024.ten_letter_games_won_in_5,
            _mv_wordle_stats_2024.ten_letter_games_won_in_6,
            _mv_wordle_stats_2024.eleven_letter_games_won,
            _mv_wordle_stats_2024.eleven_letter_games_lost,
            _mv_wordle_stats_2024.eleven_letter_games_won_in_1,
            _mv_wordle_stats_2024.eleven_letter_games_won_in_2,
            _mv_wordle_stats_2024.eleven_letter_games_won_in_3,
            _mv_wordle_stats_2024.eleven_letter_games_won_in_4,
            _mv_wordle_stats_2024.eleven_letter_games_won_in_5,
            _mv_wordle_stats_2024.eleven_letter_games_won_in_6,
            _mv_wordle_stats_2024.twelve_letter_games_won,
            _mv_wordle_stats_2024.twelve_letter_games_lost,
            _mv_wordle_stats_2024.twelve_letter_games_won_in_1,
            _mv_wordle_stats_2024.twelve_letter_games_won_in_2,
            _mv_wordle_stats_2024.twelve_letter_games_won_in_3,
            _mv_wordle_stats_2024.twelve_letter_games_won_in_4,
            _mv_wordle_stats_2024.twelve_letter_games_won_in_5,
            _mv_wordle_stats_2024.twelve_letter_games_won_in_6,
            _mv_wordle_stats_2024.thirteen_letter_games_won,
            _mv_wordle_stats_2024.thirteen_letter_games_lost,
            _mv_wordle_stats_2024.thirteen_letter_games_won_in_1,
            _mv_wordle_stats_2024.thirteen_letter_games_won_in_2,
            _mv_wordle_stats_2024.thirteen_letter_games_won_in_3,
            _mv_wordle_stats_2024.thirteen_letter_games_won_in_4,
            _mv_wordle_stats_2024.thirteen_letter_games_won_in_5,
            _mv_wordle_stats_2024.thirteen_letter_games_won_in_6,
            _mv_wordle_stats_2024.fourteen_letter_games_won,
            _mv_wordle_stats_2024.fourteen_letter_games_lost,
            _mv_wordle_stats_2024.fourteen_letter_games_won_in_1,
            _mv_wordle_stats_2024.fourteen_letter_games_won_in_2,
            _mv_wordle_stats_2024.fourteen_letter_games_won_in_3,
            _mv_wordle_stats_2024.fourteen_letter_games_won_in_4,
            _mv_wordle_stats_2024.fourteen_letter_games_won_in_5,
            _mv_wordle_stats_2024.fourteen_letter_games_won_in_6,
            _mv_wordle_stats_2024.fifteen_letter_games_won,
            _mv_wordle_stats_2024.fifteen_letter_games_lost,
            _mv_wordle_stats_2024.fifteen_letter_games_won_in_1,
            _mv_wordle_stats_2024.fifteen_letter_games_won_in_2,
            _mv_wordle_stats_2024.fifteen_letter_games_won_in_3,
            _mv_wordle_stats_2024.fifteen_letter_games_won_in_4,
            _mv_wordle_stats_2024.fifteen_letter_games_won_in_5,
            _mv_wordle_stats_2024.fifteen_letter_games_won_in_6,
            _mv_wordle_stats_2024.sixteen_letter_games_won,
            _mv_wordle_stats_2024.sixteen_letter_games_lost,
            _mv_wordle_stats_2024.sixteen_letter_games_won_in_1,
            _mv_wordle_stats_2024.sixteen_letter_games_won_in_2,
            _mv_wordle_stats_2024.sixteen_letter_games_won_in_3,
            _mv_wordle_stats_2024.sixteen_letter_games_won_in_4,
            _mv_wordle_stats_2024.sixteen_letter_games_won_in_5,
            _mv_wordle_stats_2024.sixteen_letter_games_won_in_6,
            _mv_wordle_stats_2024.seventeen_letter_games_won,
            _mv_wordle_stats_2024.seventeen_letter_games_lost,
            _mv_wordle_stats_2024.seventeen_letter_games_won_in_1,
            _mv_wordle_stats_2024.seventeen_letter_games_won_in_2,
            _mv_wordle_stats_2024.seventeen_letter_games_won_in_3,
            _mv_wordle_stats_2024.seventeen_letter_games_won_in_4,
            _mv_wordle_stats_2024.seventeen_letter_games_won_in_5,
            _mv_wordle_stats_2024.seventeen_letter_games_won_in_6,
            _mv_wordle_stats_2024.eighteen_letter_games_won,
            _mv_wordle_stats_2024.eighteen_letter_games_lost,
            _mv_wordle_stats_2024.eighteen_letter_games_won_in_1,
            _mv_wordle_stats_2024.eighteen_letter_games_won_in_2,
            _mv_wordle_stats_2024.eighteen_letter_games_won_in_3,
            _mv_wordle_stats_2024.eighteen_letter_games_won_in_4,
            _mv_wordle_stats_2024.eighteen_letter_games_won_in_5,
            _mv_wordle_stats_2024.eighteen_letter_games_won_in_6,
            _mv_wordle_stats_2024.nineteen_letter_games_won,
            _mv_wordle_stats_2024.nineteen_letter_games_lost,
            _mv_wordle_stats_2024.nineteen_letter_games_won_in_1,
            _mv_wordle_stats_2024.nineteen_letter_games_won_in_2,
            _mv_wordle_stats_2024.nineteen_letter_games_won_in_3,
            _mv_wordle_stats_2024.nineteen_letter_games_won_in_4,
            _mv_wordle_stats_2024.nineteen_letter_games_won_in_5,
            _mv_wordle_stats_2024.nineteen_letter_games_won_in_6,
            _mv_wordle_stats_2024.twenty_letter_games_won,
            _mv_wordle_stats_2024.twenty_letter_games_lost,
            _mv_wordle_stats_2024.twenty_letter_games_won_in_1,
            _mv_wordle_stats_2024.twenty_letter_games_won_in_2,
            _mv_wordle_stats_2024.twenty_letter_games_won_in_3,
            _mv_wordle_stats_2024.twenty_letter_games_won_in_4,
            _mv_wordle_stats_2024.twenty_letter_games_won_in_5,
            _mv_wordle_stats_2024.twenty_letter_games_won_in_6,
            _mv_wordle_stats_2024.twentyone_letter_games_won,
            _mv_wordle_stats_2024.twentyone_letter_games_lost,
            _mv_wordle_stats_2024.twentyone_letter_games_won_in_1,
            _mv_wordle_stats_2024.twentyone_letter_games_won_in_2,
            _mv_wordle_stats_2024.twentyone_letter_games_won_in_3,
            _mv_wordle_stats_2024.twentyone_letter_games_won_in_4,
            _mv_wordle_stats_2024.twentyone_letter_games_won_in_5,
            _mv_wordle_stats_2024.twentyone_letter_games_won_in_6,
            _mv_wordle_stats_2024.twentytwo_letter_games_won,
            _mv_wordle_stats_2024.twentytwo_letter_games_lost,
            _mv_wordle_stats_2024.twentytwo_letter_games_won_in_1,
            _mv_wordle_stats_2024.twentytwo_letter_games_won_in_2,
            _mv_wordle_stats_2024.twentytwo_letter_games_won_in_3,
            _mv_wordle_stats_2024.twentytwo_letter_games_won_in_4,
            _mv_wordle_stats_2024.twentytwo_letter_games_won_in_5,
            _mv_wordle_stats_2024.twentytwo_letter_games_won_in_6,
            _mv_wordle_stats_2024.twentythree_letter_games_won,
            _mv_wordle_stats_2024.twentythree_letter_games_lost,
            _mv_wordle_stats_2024.twentythree_letter_games_won_in_1,
            _mv_wordle_stats_2024.twentythree_letter_games_won_in_2,
            _mv_wordle_stats_2024.twentythree_letter_games_won_in_3,
            _mv_wordle_stats_2024.twentythree_letter_games_won_in_4,
            _mv_wordle_stats_2024.twentythree_letter_games_won_in_5,
            _mv_wordle_stats_2024.twentythree_letter_games_won_in_6,
            0 AS five_letter_crazy_games_won,
            0 AS five_letter_crazy_games_lost,
            0 AS five_letter_crazy_games_won_in_1,
            0 AS five_letter_crazy_games_won_in_2,
            0 AS five_letter_crazy_games_won_in_3,
            0 AS five_letter_crazy_games_won_in_4,
            0 AS five_letter_crazy_games_won_in_5,
            0 AS five_letter_crazy_games_won_in_6
           FROM _mv_wordle_stats_2024) combined_stats
  GROUP BY combined_stats.player;