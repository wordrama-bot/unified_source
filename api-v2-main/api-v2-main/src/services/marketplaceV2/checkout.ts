import { pgPool } from '@/lib/postgres'
import { getCatalogItemsByIds } from '@/services/marketplaceV2/catalog'
import type { CheckoutCartItemInput } from '@/types/marketplaceV2'

class AppError extends Error {
  statusCode: number
  code: string

  constructor(message: string, statusCode = 400, code = 'APP_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
  }
}

export async function checkoutWithCoins({
  playerId,
  items,
  idempotencyKey,
}: {
  playerId: string
  items: CheckoutCartItemInput[]
  idempotencyKey: string
}) {
  if (!playerId) {
    throw new AppError('Missing player', 401, 'UNAUTHORIZED')
  }

  if (!idempotencyKey || typeof idempotencyKey !== 'string') {
    throw new AppError('Missing idempotency key', 400, 'MISSING_IDEMPOTENCY_KEY')
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError('Cart is empty', 400, 'EMPTY_CART')
  }

  const requestedIds = items.map(item => item.catalogItemId)

  if (new Set(requestedIds).size !== requestedIds.length) {
    throw new AppError('Duplicate cart item detected', 400, 'DUPLICATE_CART_ITEM')
  }

  const catalogItems = getCatalogItemsByIds(requestedIds)

  if (catalogItems.length !== requestedIds.length) {
    throw new AppError('One or more cart items are invalid', 400, 'INVALID_CART_ITEM')
  }

  const nonPurchasable = catalogItems.find(item => !item.isPurchasable)
  if (nonPurchasable) {
    throw new AppError(
      `Item is not purchasable: ${nonPurchasable.catalogItemId}`,
      400,
      'ITEM_NOT_PURCHASABLE'
    )
  }

  const subtotal = catalogItems.reduce((sum, item) => sum + item.priceCoins, 0)
  const discount = 0
  const total = subtotal - discount

  const entitlementKeys = catalogItems
    .map(item => item.entitlementKey)
    .filter(Boolean) as string[]

  const client = await pgPool.connect()

  try {
    await client.query('BEGIN')

    await client.query(
      `
      insert into public._player_coin_balances (player_id, currency_code)
      values ($1, 'COIN')
      on conflict (player_id, currency_code) do nothing
      `,
      [playerId]
    )

    const existingOrderResult = await client.query(
      `
      select id, order_status, total_amount, completed_at
      from public._store_orders
      where player_id = $1
        and idempotency_key = $2
      for update
      `,
      [playerId, idempotencyKey]
    )

    if (existingOrderResult.rowCount && existingOrderResult.rows[0]) {
      const existingOrder = existingOrderResult.rows[0]

      if (existingOrder.order_status === 'COMPLETED') {
        await client.query('COMMIT')
        return {
          orderId: existingOrder.id,
          reused: true,
          totalSpent: Number(existingOrder.total_amount || 0),
        }
      }

      throw new AppError(
        'Idempotency key already exists for an unfinished order',
        409,
        'IDEMPOTENCY_CONFLICT'
      )
    }

    const balanceResult = await client.query(
      `
      select available_balance, lifetime_spent, version
      from public._player_coin_balances
      where player_id = $1
        and currency_code = 'COIN'
      for update
      `,
      [playerId]
    )

    if (!balanceResult.rowCount || !balanceResult.rows[0]) {
      throw new AppError('Balance row not found', 500, 'BALANCE_NOT_FOUND')
    }

    const balanceRow = balanceResult.rows[0]
    const balanceBefore = Number(balanceRow.available_balance || 0)

    if (entitlementKeys.length > 0) {
      const ownedResult = await client.query(
        `
        select entitlement_key
        from public._player_entitlements
        where player_id = $1
          and status = 'ACTIVE'
          and (expires_at is null or expires_at > now())
          and entitlement_key = any($2::text[])
        `,
        [playerId, entitlementKeys]
      )

      if (ownedResult.rowCount > 0) {
        throw new AppError(
          'You already own one or more selected items',
          409,
          'ALREADY_OWNED'
        )
      }
    }

    if (balanceBefore < total) {
      throw new AppError('Insufficient coins', 400, 'INSUFFICIENT_COINS')
    }

    const orderInsertResult = await client.query(
      `
      insert into public._store_orders (
        player_id,
        idempotency_key,
        order_status,
        payment_method,
        currency_code,
        subtotal_amount,
        discount_amount,
        tax_amount,
        total_amount,
        metadata
      )
      values (
        $1,
        $2,
        'PENDING',
        'COINS',
        'COIN',
        $3,
        $4,
        0,
        $5,
        $6::jsonb
      )
      returning id
      `,
      [
        playerId,
        idempotencyKey,
        subtotal,
        discount,
        total,
        JSON.stringify({
          checkoutVersion: 'v2',
        }),
      ]
    )

    const orderId = orderInsertResult.rows[0].id

    const createdOrderItems: Array<{
      id: string
      catalogItemId: string
      entitlementKey?: string
      entitlementType?: string
    }> = []

    for (const item of catalogItems) {
      const itemInsertResult = await client.query(
        `
        insert into public._store_order_items (
          order_id,
          player_id,
          catalog_item_id,
          sku,
          item_type,
          item_name,
          quantity,
          unit_price,
          line_subtotal,
          line_discount,
          line_total,
          fulfillment_status,
          metadata
        )
        values (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          1,
          $7,
          $7,
          0,
          $7,
          'PENDING',
          $8::jsonb
        )
        returning id
        `,
        [
          orderId,
          playerId,
          item.catalogItemId,
          item.sku ?? null,
          item.itemType,
          item.itemName,
          item.priceCoins,
          JSON.stringify({
            entitlementKey: item.entitlementKey ?? null,
          }),
        ]
      )

      createdOrderItems.push({
        id: itemInsertResult.rows[0].id,
        catalogItemId: item.catalogItemId,
        entitlementKey: item.entitlementKey,
        entitlementType: item.entitlementType,
      })
    }

    const balanceAfter = balanceBefore - total

    await client.query(
      `
      insert into public._coin_ledger (
        player_id,
        currency_code,
        direction,
        amount,
        entry_type,
        status,
        balance_before,
        balance_after,
        order_id,
        idempotency_key,
        metadata
      )
      values (
        $1,
        'COIN',
        'DEBIT',
        $2,
        'PURCHASE',
        'POSTED',
        $3,
        $4,
        $5,
        $6,
        $7::jsonb
      )
      `,
      [
        playerId,
        total,
        balanceBefore,
        balanceAfter,
        orderId,
        idempotencyKey,
        JSON.stringify({
          checkoutVersion: 'v2',
        }),
      ]
    )

    await client.query(
      `
      update public._player_coin_balances
      set
        available_balance = $2,
        lifetime_spent = lifetime_spent + $3,
        version = version + 1
      where player_id = $1
        and currency_code = 'COIN'
      `,
      [playerId, balanceAfter, total]
    )

    for (const item of createdOrderItems) {
      if (item.entitlementKey) {
        await client.query(
          `
          insert into public._player_entitlements (
            player_id,
            entitlement_key,
            entitlement_type,
            source_type,
            source_id,
            order_id,
            order_item_id,
            status,
            starts_at,
            metadata
          )
          values (
            $1,
            $2,
            $3,
            'ORDER_ITEM',
            $4,
            $5,
            $4,
            'ACTIVE',
            now(),
            $6::jsonb
          )
          `,
          [
            playerId,
            item.entitlementKey,
            item.entitlementType || 'WORD_PACK',
            item.id,
            orderId,
            JSON.stringify({
              catalogItemId: item.catalogItemId,
            }),
          ]
        )
      }

      await client.query(
        `
        update public._store_order_items
        set fulfillment_status = 'FULFILLED'
        where id = $1
        `,
        [item.id]
      )
    }

    await client.query(
      `
      update public._store_orders
      set
        order_status = 'COMPLETED',
        completed_at = now()
      where id = $1
      `,
      [orderId]
    )

    await client.query('COMMIT')

    return {
      orderId,
      reused: false,
      balanceBefore,
      balanceAfter,
      totalSpent: total,
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}