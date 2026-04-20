import { Router } from 'express'
import {
  getCoinBalanceController,
  getEntitlementsController,
  getOrderHistoryController,
  checkoutWithCoinsController,
} from '@/controllers/marketplaceV2'
import { validateToken } from '../../middleware/tokenValidation'

const router = Router()

router.use(validateToken)

router.get('/balance', getCoinBalanceController)
router.get('/entitlements', getEntitlementsController)
router.get('/orders', getOrderHistoryController)
router.post('/checkout/coins', checkoutWithCoinsController)

export default router