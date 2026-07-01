create or replace view public._v_wordle_daily_stats as
 SELECT r.day,
    r.month,
    r.year,
    r.week,
    r.player,
    sum(
        CASE
            WHEN (r.game_was_won = true) THEN 1
            ELSE 0
        END) AS games_won,
    sum(
        CASE
            WHEN (r.game_was_won = false) THEN 1
            ELSE 0
        END) AS games_lost,
    sum(
        CASE
            WHEN ((r.game_was_won = true) OR (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS games_played,
    sum(
        CASE
            WHEN ((r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS games_won_in_1,
    sum(
        CASE
            WHEN ((r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS games_won_in_2,
    sum(
        CASE
            WHEN ((r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS games_won_in_3,
    sum(
        CASE
            WHEN ((r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS games_won_in_4,
    sum(
        CASE
            WHEN ((r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS games_won_in_5,
    sum(
        CASE
            WHEN ((r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS four_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 4) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS four_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 4) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS four_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 4) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS four_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 4) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS four_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 4) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS four_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 4) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS four_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 4) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS four_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS five_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 5) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS five_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 5) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS five_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 5) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS five_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 5) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS five_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 5) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS five_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 5) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS five_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 5) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS five_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS six_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 6) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS six_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 6) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS six_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 6) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS six_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 6) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS six_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 6) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS six_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 6) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS six_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 6) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS six_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 7) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS seven_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 7) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS seven_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 7) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS seven_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 7) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS seven_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 7) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS seven_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 7) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS seven_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 7) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS seven_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 7) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS seven_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 8) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eight_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 8) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS eight_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 8) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eight_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 8) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eight_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 8) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eight_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 8) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eight_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 8) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eight_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 8) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eight_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 9) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS nine_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 9) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS nine_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 9) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS nine_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 9) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS nine_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 9) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS nine_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 9) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS nine_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 9) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS nine_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 9) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS nine_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 10) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS ten_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 10) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS ten_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 10) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS ten_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 10) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS ten_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 10) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS ten_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 10) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS ten_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 10) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS ten_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 10) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS ten_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 11) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eleven_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 11) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS eleven_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 11) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eleven_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 11) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eleven_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 11) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eleven_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 11) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eleven_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 11) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eleven_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 11) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eleven_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 12) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twelve_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 12) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS twelve_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 12) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twelve_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 12) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twelve_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 12) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twelve_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 12) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twelve_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 12) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twelve_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 12) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twelve_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 13) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS thirteen_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 13) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS thirteen_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 13) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS thirteen_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 13) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS thirteen_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 13) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS thirteen_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 13) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS thirteen_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 13) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS thirteen_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 13) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS thirteen_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 14) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS fourteen_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 14) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS fourteen_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 14) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS fourteen_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 14) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS fourteen_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 14) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS fourteen_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 14) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS fourteen_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 14) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS fourteen_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 14) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS fourteen_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 15) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS fifteen_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 15) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS fifteen_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 15) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS fifteen_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 15) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS fifteen_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 15) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS fifteen_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 15) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS fifteen_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 15) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS fifteen_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 15) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS fifteen_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 16) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS sixteen_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 16) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS sixteen_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 16) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS sixteen_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 16) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS sixteen_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 16) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS sixteen_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 16) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS sixteen_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 16) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS sixteen_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 16) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS sixteen_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 17) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS seventeen_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 17) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS seventeen_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 17) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS seventeen_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 17) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS seventeen_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 17) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS seventeen_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 17) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS seventeen_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 17) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS seventeen_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 17) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS seventeen_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 18) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eighteen_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 18) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS eighteen_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 18) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eighteen_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 18) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eighteen_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 18) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eighteen_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 18) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eighteen_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 18) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eighteen_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 18) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS eighteen_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 19) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS nineteen_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 19) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS nineteen_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 19) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS nineteen_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 19) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS nineteen_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 19) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS nineteen_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 19) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS nineteen_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 19) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS nineteen_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 19) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS nineteen_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 20) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twenty_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 20) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS twenty_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 20) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twenty_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 20) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twenty_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 20) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twenty_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 20) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twenty_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 20) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twenty_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 20) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twenty_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 21) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentyone_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 21) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS twentyone_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 21) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentyone_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 21) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentyone_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 21) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentyone_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 21) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentyone_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 21) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentyone_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 21) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentyone_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 22) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 22) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 22) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 22) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 22) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 22) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 22) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 22) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentytwo_letter_games_won_in_6,
    sum(
        CASE
            WHEN ((r.word_length = 23) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentythree_letter_games_won,
    sum(
        CASE
            WHEN ((r.word_length = 23) AND (r.game_was_won = false)) THEN 1
            ELSE 0
        END) AS twentythree_letter_games_lost,
    sum(
        CASE
            WHEN ((r.word_length = 23) AND (r.guess_count = 1) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentythree_letter_games_won_in_1,
    sum(
        CASE
            WHEN ((r.word_length = 23) AND (r.guess_count = 2) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentythree_letter_games_won_in_2,
    sum(
        CASE
            WHEN ((r.word_length = 23) AND (r.guess_count = 3) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentythree_letter_games_won_in_3,
    sum(
        CASE
            WHEN ((r.word_length = 23) AND (r.guess_count = 4) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentythree_letter_games_won_in_4,
    sum(
        CASE
            WHEN ((r.word_length = 23) AND (r.guess_count = 5) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentythree_letter_games_won_in_5,
    sum(
        CASE
            WHEN ((r.word_length = 23) AND (r.guess_count = 6) AND (r.game_was_won = true)) THEN 1
            ELSE 0
        END) AS twentythree_letter_games_won_in_6
   FROM _wordle_game_result r
  WHERE (NOT (EXISTS ( SELECT 1
           FROM _admin_bans b
          WHERE ((b.ban_type = 'PLAYER'::text) AND (b.ban_value = (r.player)::text) AND (b.is_active = true) AND ((b.expires_at IS NULL) OR (b.expires_at > now()))))))
  GROUP BY r.day, r.week, r.month, r.year, r.player;;