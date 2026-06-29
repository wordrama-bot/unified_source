import * as changeKeys from 'change-case/keys';

import { db } from '../models';
import { CATALOG } from './marketplaceV2/catalog';
import ledgerService from './ledger';
import { enqueue, sendMessage } from '../utils/gameLoop';
import { createMessage } from '../utils/gameLoop.js';

import { getPlayerEntitlements } from './marketplaceV2/entitlements';

import { STRIPE_ITEM_PRICE_ENV_VARS } from '../config/stripeProducts';

async function getPurchases(playerId: string) {
  const { data, error } = await db
    .from('_purchased_items')
    .select(
      `
      id,
      _items (
        id,
        name,
        coin_price,
        real_price,
        description,
        purchasable_with_coins,
        purchasable_with_money,
        discontinued,
        type,
        rarity,
        item_image,
        marketplace_image
      ),
      bought_with_coins,
      bought_with_money,
      unlocked_with_subscription
    `,
    )
    .eq('player_id', playerId);

  if (error) {
    console.error(error);
    return [];
  }

  return changeKeys.camelCase(data, 10);
}

async function getPurchasedItems(playerId: string) {
  const purchasedItemSources = new Map<string, 'PURCHASED' | 'SUBSCRIPTION'>();
  const legacyItems = await getPurchases(playerId);

  const legacyItemIds = legacyItems
    .filter((item) => item.items?.id)
    .map((item) => item.items.id);

  legacyItemIds.forEach((id) => purchasedItemSources.set(id, 'PURCHASED'));

  try {
    const entitlements = await getPlayerEntitlements(playerId);

    entitlements
      .filter(
        (entitlement: any) =>
          entitlement.status === 'ACTIVE' &&
          ['ORDER_ITEM', 'SUBSCRIPTION'].includes(entitlement.source_type) &&
          entitlement.metadata?.catalogItemId
      )
      .forEach((entitlement: any) => {
        const catalogItemId = entitlement.metadata.catalogItemId;

        if (entitlement.source_type === 'ORDER_ITEM') {
          purchasedItemSources.set(catalogItemId, 'PURCHASED');
          return;
        }

        if (!purchasedItemSources.has(catalogItemId)) {
          purchasedItemSources.set(catalogItemId, 'SUBSCRIPTION');
        }
      });
  } catch (error) {
    console.error('Error fetching Marketplace V2 entitlements for store items', error);
  }

  return purchasedItemSources;
}

async function getStoreItems(playerId: string, filters) {
  const { data, error } = await db.from('_items').select(`
    id,
    name,
    coin_price,
    real_price,
    description,
    purchasable_with_coins,
    purchasable_with_money,
    discontinued,
    type,
    game,
    rarity,
    item_image,
    marketplace_image
  `);

  if (error) {
    console.error(error);
    return [];
  }

    const purchasedItemSources = await getPurchasedItems(playerId);
    const purchasedItems = Array.from(purchasedItemSources.keys());

    const filteredData = data
      .map((item) => {
        const hasStripePrice = Boolean(STRIPE_ITEM_PRICE_ENV_VARS[item.id]);

        if (purchasedItems.includes(item.id)) {
          return {
            ...item,
            hasStripePrice,
            isPurchased: purchasedItemSources.get(item.id) === 'PURCHASED',
            isUnlockedBySubscription:
              purchasedItemSources.get(item.id) === 'SUBSCRIPTION',
          };
        }

        return {
          ...item,
          hasStripePrice,
          isPurchased: false,
          isUnlockedBySubscription: false,
        };
      })
      .filter((item) => {
        const minCoinPrice = Number(filters.minCoinPrice) || 0;
        const maxCoinPrice = Number(filters.maxCoinPrice) || Infinity;
        const coinPrice = Number(item.coin_price) || 0;

        if (coinPrice < minCoinPrice || coinPrice > maxCoinPrice) return false;

        if (filters.gameFilter !== 'ALL' && item.game !== filters.gameFilter)
          return false;

        if (
          filters.itemTypeFilter !== 'ALL' &&
          item.type !== filters.itemTypeFilter
        )
          return false;

        if (filters.showPurchased === 'false' && item.isPurchased) return false;
        if (filters.showUnavailable === 'false' && item.discontinued)
          return false;

        return true;
      });

    // TODO: REFACTOR THIS
    const megaPackId = '3d3ff93b-65c1-4d36-902e-3a889c71ac86';

    const megaPackChildIds = [
      'ab14511c-f2ac-4b16-a8ef-7cb8ed61a2cc',
      'db526774-11da-47de-b410-5b47a4168db8',
      '72215e5b-6638-4388-84bc-55dcd36c0e05',
      '6e66a620-8e17-4f75-aa0b-1c282aafb9d8',
      '1d348c05-c51e-4ea3-a888-d4823436704f',
      '425c96ab-beff-40ef-9774-feb6db135644',
      '80e197a9-0829-4074-8e85-a88e6e8b7ea0',
      '1ee2de50-072f-4718-b8ac-7663f3069f2e',
      'fef67eba-96db-4f5e-8b25-81487a1dbc9d',
      '3159552d-8c96-4bb5-aafa-ebf36aa5a2c2',
      'b8c73f14-79ad-4495-9fd9-a4be65d5fcbc',
      '7f06b10e-d52a-4ae3-b77f-a7e9a7c5e5fb',
    ];

    const hasMegaPack = purchasedItems.includes(megaPackId);
    const hasAllMegaPackChildrenPurchased = megaPackChildIds.every(
      (id) => purchasedItemSources.get(id) === 'PURCHASED',
    );

    const megaFiltered =
      hasMegaPack || hasAllMegaPackChildrenPurchased
        ? filteredData.filter((item) => {
            if (item.id === megaPackId && hasAllMegaPackChildrenPurchased) return false;
            if (megaPackChildIds.includes(item.id) && hasMegaPack) return false;
            return true;
          })
        : filteredData;

    return changeKeys.camelCase(megaFiltered, 10);
  }

  async function getItemPrice(itemId: string): Promise<
    | {
        id: string;
        coinPrice: number;
      }
    | undefined
  > {
    const { data, error } = await db
      .from('_items')
      .select('id, coin_price')
      .eq('id', itemId)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    return changeKeys.camelCase(data, 10) as {
      id: string;
      coinPrice: number;
    };
  }

  /**
   * Expands bundle items into individual purchasable item IDs
   */
  function expandBundleItemIds(itemId: string): string[] {
    const MEGA_BUNDLE_ID = '3d3ff93b-65c1-4d36-902e-3a889c71ac86';

    if (itemId !== MEGA_BUNDLE_ID) {
      return [itemId];
    }

    return [
      'ab14511c-f2ac-4b16-a8ef-7cb8ed61a2cc',
      'db526774-11da-47de-b410-5b47a4168db8',
      '72215e5b-6638-4388-84bc-55dcd36c0e05',
      '6e66a620-8e17-4f75-aa0b-1c282aafb9d8',
      '1d348c05-c51e-4ea3-a888-d4823436704f',
      '425c96ab-beff-40ef-9774-feb6db135644',
      '80e197a9-0829-4074-8e85-a88e6e8b7ea0',
      '1ee2de50-072f-4718-b8ac-7663f3069f2e',
      'fef67eba-96db-4f5e-8b25-81487a1dbc9d',
      '3159552d-8c96-4bb5-aafa-ebf36aa5a2c2',
      'b8c73f14-79ad-4495-9fd9-a4be65d5fcbc',
      '7f06b10e-d52a-4ae3-a888-d4823436704f',
    ];
  }

  async function purchaseItemWithCoins(playerId: string, itemId: string) {
    const itemIds = [itemId];

    const results = [];

    for (const id of itemIds) {
      const storeItemPrice = await getItemPrice(id);
      if (!storeItemPrice) return { error: 'Item not found' };

      const { coinBalance: playerBalance } =
        await ledgerService.getBalance(playerId);

      if (playerBalance < storeItemPrice.coinPrice)
        return { error: 'Insufficient funds' };

      const updatedBalance = await ledgerService.changeBalance(
        playerId,
        'down',
        storeItemPrice.coinPrice,
      );

      if (!updatedBalance)
        return { error: 'Failed to update balance' };

      await db.from('_purchased_items').insert({
        player_id: playerId,
        item_id: id,
        bought_with_coins: true,
        bought_with_money: false,
        unlocked_with_subscription: false,
      });

      const catalogItem = CATALOG.find((item) => item.catalogItemId === id);

      if (catalogItem) {
        await db.from('_player_entitlements').insert({
          player_id: playerId,
          entitlement_key: catalogItem.entitlementKey,
          entitlement_type: catalogItem.entitlementType,
          source_type: 'ORDER_ITEM',
          status: 'ACTIVE',
          metadata: {
            catalogItemId: catalogItem.catalogItemId,
            purchaseMethod: 'COINS',
          },
        });
      }

      await enqueue([
        createMessage('PURCHASED_ITEM', {
          userId: playerId,
          metadata: {
            itemId: id,
          },
        }),
      ]);

      results.push({ id });
    }

    return { data: results };
  }

  async function purchaseItemsWithCoins(playerId: string, itemIds: string[]) {
    const acc = [];

    for (const itemId of itemIds) {
      const { data, error } = await purchaseItemWithCoins(playerId, itemId);
      if (error) return { error };
      acc.push(data);
    }

    return acc;
  }

  export default {
    getPurchases,
    getStoreItems,
    purchaseItemWithCoins,
    purchaseItemsWithCoins,
  };
