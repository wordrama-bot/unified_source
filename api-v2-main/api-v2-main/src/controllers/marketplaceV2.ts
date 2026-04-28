import type { Request, Response } from 'express'
import { getPlayerCoinBalance } from '../services/marketplaceV2/balances'
import { getPlayerEntitlements } from '../services/marketplaceV2/entitlements'
import { getPlayerOrders } from '../services/marketplaceV2/orders'
import { checkoutWithCoins } from '../services/marketplaceV2/checkout'
import type { ApiRequest } from '../types/auth.types'

export async function getCoinBalanceController(req: ApiRequest, res: Response) {
  try {
    const playerId = req.userId

    if (!playerId) {
      return res.status(401).json({
        success: false,
        message: 'Missing player id',
      })
    }

    const data = await getPlayerCoinBalance(playerId)
    return res.status(200).json({ success: true, data })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch balance',
    })
  }
}

export async function getEntitlementsController(req: ApiRequest, res: Response) {
  try {
    const playerId = req.userId

    if (!playerId) {
      return res.status(401).json({
        success: false,
        message: 'Missing player id',
      })
    }

    const data = await getPlayerEntitlements(playerId)
    return res.status(200).json({ success: true, data })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch entitlements',
    })
  }
}

export async function getOrderHistoryController(req: ApiRequest, res: Response) {
  try {
    const playerId = req.userId

    if (!playerId) {
      return res.status(401).json({
        success: false,
        message: 'Missing player id',
      })
    }

    const data = await getPlayerOrders(playerId)
    return res.status(200).json({ success: true, data })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders',
    })
  }
}

export async function checkoutWithCoinsController(req: ApiRequest, res: Response) {
  try {
    const playerId = req.userId
    const { items, idempotencyKey } = req.body

    if (!playerId) {
      return res.status(401).json({
        success: false,
        message: 'Missing player id',
      })
    }

    const data = await checkoutWithCoins({
      playerId,
      items,
      idempotencyKey,
    })

    return res.status(200).json({ success: true, data })
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      code: error.code || 'CHECKOUT_FAILED',
      message: error.message || 'Checkout failed',
    })
  }
}