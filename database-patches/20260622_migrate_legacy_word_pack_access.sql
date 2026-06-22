begin;

-- Migrate legacy coin balances into Marketplace V2 coin balances.
-- Insert-only, idempotent, and safe to rerun.
-- Excludes known Stripe/paywall test users.
insert into _player_coin_balances (
  player_id,
  currency_code,
  available_balance,
  lifetime_earned,
  lifetime_spent,
  version,
  created_at,
  updated_at
)
select
  l.player,
  'COIN',
  l.coin_balance,
  l.coin_balance,
  0,
  0,
  l.created_at,
  now()
from _ledger l
where l.player not in (
  '54e64ea9-3e59-4a5e-9d96-1ab67d74d304',
  '808f7573-d6db-464e-8f87-dbf92af6b075',
  '53c85b68-73bf-40ab-8d1e-b15fe1be64ed'
)
on conflict (player_id, currency_code)
do nothing;

-- Migrate legacy word-pack purchases into permanent entitlements.
-- Only migrates WORDLE_WORD_PACK items.
-- Does not migrate avatars, styling, games, or game modes.
with legacy_word_pack_purchases as (
  select
    pi.player_id,
    pi.item_id,
    min(pi.created_at) as purchased_at,
    i.name as item_name,
    case i.id::text
      when 'ba8671aa-7481-43e5-a1ac-f2b73433a315' then 'WORD_PACK:FOUR_LETTER'
      when 'b1b96d0e-5b1a-403e-80be-88f3d2bae873' then 'WORD_PACK:ELEVEN_LETTER_EXPANSION'
      when '3d3ff93b-65c1-4d36-902e-3a889c71ac86' then 'WORD_PACK:TWELVE_TO_TWENTYTHREE_LETTER'
      when '7f06b10e-d52a-4ae3-b77f-a7e9a7c5e5fb' then 'WORD_PACK:TWELVE_LETTER'
      when 'b8c73f14-79ad-4495-9fd9-a4be65d5fcbc' then 'WORD_PACK:THIRTEEN_LETTER'
      when '3159552d-8c96-4bb5-aafa-ebf36aa5a2c2' then 'WORD_PACK:FOURTEEN_LETTER'
      when 'fef67eba-96db-4f5e-8b25-81487a1dbc9d' then 'WORD_PACK:FIFTEEN_LETTER'
      when '1ee2de50-072f-4718-b8ac-7663f3069f2e' then 'WORD_PACK:SIXTEEN_LETTER'
      when '80e197a9-0829-4074-8e85-a88e6e8b7ea0' then 'WORD_PACK:SEVENTEEN_LETTER'
      when '425c96ab-beff-40ef-9774-feb6db135644' then 'WORD_PACK:EIGHTEEN_LETTER'
      when '1d348c05-c51e-4ea3-a888-d4823436704f' then 'WORD_PACK:NINETEEN_LETTER'
      when '6e66a620-8e17-4f75-aa0b-1c282aafb9d8' then 'WORD_PACK:TWENTY_LETTER'
      when '72215e5b-6638-4388-84bc-55dcd36c0e05' then 'WORD_PACK:TWENTYONE_LETTER'
      when 'db526774-11da-47de-b410-5b47a4168db8' then 'WORD_PACK:TWENTYTWO_LETTER'
      when 'ab14511c-f2ac-4b16-a8ef-7cb8ed61a2cc' then 'WORD_PACK:TWENTYTHREE_LETTER'
      else null
    end as entitlement_key
  from _purchased_items pi
  join _items i on i.id = pi.item_id
  where i.type = 'WORDLE_WORD_PACK'
    and pi.bought_with_coins = true
    and pi.bought_with_money = false
    and pi.unlocked_with_subscription = false
    and pi.player_id not in (
      '54e64ea9-3e59-4a5e-9d96-1ab67d74d304',
      '808f7573-d6db-464e-8f87-dbf92af6b075',
      '53c85b68-73bf-40ab-8d1e-b15fe1be64ed'
    )
  group by pi.player_id, pi.item_id, i.id, i.name
)
insert into _player_entitlements (
  player_id,
  entitlement_key,
  entitlement_type,
  source_type,
  status,
  starts_at,
  expires_at,
  metadata,
  created_at,
  updated_at
)
select
  player_id,
  entitlement_key,
  'WORD_PACK',
  'ORDER_ITEM',
  'ACTIVE',
  purchased_at,
  null,
  jsonb_build_object(
    'catalogItemId', item_id,
    'purchaseMethod', 'COINS',
    'migration', '20260622_legacy_word_pack_access',
    'legacyItemName', item_name
  ),
  purchased_at,
  now()
from legacy_word_pack_purchases
where entitlement_key is not null
on conflict (player_id, entitlement_key)
where status = 'ACTIVE' and expires_at is null
do nothing;

commit;