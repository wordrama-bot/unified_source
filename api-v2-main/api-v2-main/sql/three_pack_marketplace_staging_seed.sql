-- STAGING ONLY. Preparation seed: do not run on production.
-- Inserts missing pack rows as DISCONTINUED and NOT PURCHASABLE.
-- Idempotent and non-destructive: existing rows are not modified.
-- Review against staging schema and explicitly authorize execution separately.
BEGIN;

INSERT INTO public._items (
  id, name, type, game, rarity, coin_price, real_price,
  description, marketplace_image, purchasable_with_coins,
  purchasable_with_money, discontinued
) VALUES
(
  'f8436a71-8395-4cb1-9235-5a0d06d32f01',
  '3 Letter Pack', 'WORDLE_WORD_PACK', 'WORDLE', 'COMMON',
  1000, '0.99', 'Classic and common three-letter solves. Perfect for crossword and Scrabble enthusiasts.',
  '/images/word-packs/3-letter.png', false, false, true
),
(
  'f8436a71-8395-4cb1-9235-5a0d06d32f02',
  '3 Letter Crazy', 'WORDLE_WORD_PACK', 'WORDLE', 'COMMON',
  1000, '0.99', 'The expanded three-letter challenge. Every word in our three-letter dictionary can be a solution.',
  '/images/word-packs/3-letter-crazy.png', false, false, true
),
(
  'f8436a71-8395-4cb1-9235-5a0d06d32f03',
  '5 Letter Unhinged (18+)', 'WORDLE_WORD_PACK', 'WORDLE', 'COMMON',
  0, '2.99', 'Get unhinged with this adults-only, five-letter solve pack. Warning: contains vulgar and explicit language. NSFW and only for ages 18+.',
  '/images/word-packs/5-letter-unhinged.png', false, false, true
)
ON CONFLICT (id) DO NOTHING;

-- Fail rather than commit if any of the three expected IDs are absent
-- or unexpectedly available for purchase.
DO $$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n
  FROM public._items
  WHERE id IN (
    'f8436a71-8395-4cb1-9235-5a0d06d32f01',
    'f8436a71-8395-4cb1-9235-5a0d06d32f02',
    'f8436a71-8395-4cb1-9235-5a0d06d32f03'
  )
  AND discontinued = true
  AND purchasable_with_coins = false
  AND purchasable_with_money = false;
  IF n <> 3 THEN
    RAISE EXCEPTION 'Staging pack seed verification failed: expected 3 disabled rows, found %', n;
  END IF;
END $$;

COMMIT;

SELECT id, name, type, game, coin_price, real_price,
       purchasable_with_coins, purchasable_with_money, discontinued
FROM public._items
WHERE id IN (
  'f8436a71-8395-4cb1-9235-5a0d06d32f01',
  'f8436a71-8395-4cb1-9235-5a0d06d32f02',
  'f8436a71-8395-4cb1-9235-5a0d06d32f03'
)
ORDER BY id;
