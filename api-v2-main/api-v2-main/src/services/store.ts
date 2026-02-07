import * as changeKeys from 'change-case/keys';

import { db } from '../models';
import ledgerService from './ledger';
import { enqueue, sendMessage } from '../utils/gameLoop';
import { createMessage } from '../utils/gameLoop.js';

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
  const items = await getPurchases(playerId);

  return items.filter((item) => item.items.id).map((item) => item.items.id);
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

  const purchasedItems = await getPurchasedItems(playerId);
  const filteredData = data
    .map((item) => {
      if (purchasedItems.includes(item.id)) {
        return {
          ...item,
          isPurchased: true,
        };
      }

      return {
        ...item,
        isPurchased: false,
      };
    })
    .filter((item) => {
      const minCoinPrice = Number(filters.minCoinPrice) || 0;
      const maxCoinPrice = Number(filters.maxCoinPrice) || Infinity;
      const coinPrice = Number(item.coin_price) || 0;

      if (coinPrice < minCoinPrice || coinPrice > maxCoinPrice) return false;

      //TODO: Implement game filter
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
  const hasMegaPack = purchasedItems.find(
    (item) => item === '3d3ff93b-65c1-4d36-902e-3a889c71ac86',
  );
  const megaFiltered = hasMegaPack
    ? filteredData.filter((item) => {
        const packs = [
          'ab14511c-f2ac-4b16-a8ef-7cb8ed61a2cc', //23 Letter
          'db526774-11da-47de-b410-5b47a4168db8', //22 Letter
          '72215e5b-6638-4388-84bc-55dcd36c0e05', //21 Letter
          '6e66a620-8e17-4f75-aa0b-1c282aafb9d8', //20 Letter
          '1d348c05-c51e-4ea3-a888-d4823436704f', //19 Letter
          '425c96ab-beff-40ef-9774-feb6db135644', // 18 Letter
          '80e197a9-0829-4074-8e85-a88e6e8b7ea0', // 17 Letter
          '1ee2de50-072f-4718-b8ac-7663f3069f2e', // 16 Letter
          'fef67eba-96db-4f5e-8b25-81487a1dbc9d', // 15 Letter
          '3159552d-8c96-4bb5-aafa-ebf36aa5a2c2', // 14 Letter
          'b8c73f14-79ad-4495-9fd9-a4be65d5fcbc', // 13 Letter
          '7f06b10e-d52a-4ae3-b77f-a7e9a7c5e5fb', // 12 Letter
        ];
        if (packs.includes(item.id)) return false;
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

async function purchaseItemWithCoins(playerId: string, itemId: string) {
  const storeItemPrice = await getItemPrice(itemId);
  if (!storeItemPrice) return { error: 'Item not found' };

  const { coinBalance: playerBalance } =
    await ledgerService.getBalance(playerId);
  if (playerBalance < storeItemPrice?.coinPrice)
    return { error: 'Insufficient funds' };

  const updatedBalance = await ledgerService.changeBalance(
    playerId,
    'down',
    storeItemPrice.coinPrice,
  );
  if (!updatedBalance) return { error: 'Failed to update balance' };

  const { data: purchased, error: purchaseError } = await db
    .from('_purchased_items')
    .insert({
      player_id: playerId,
      item_id: itemId,
      bought_with_coins: true,
      bought_with_money: false,
      unlocked_with_subscription: false,
    })
    .select('id')
    .maybeSingle();

  if (purchaseError) {
    console.error(purchaseError);
    return { error: 'Failed to purchase item' };
  }

  await enqueue([
    createMessage('PURCHASED_ITEM', {
      userId: playerId,
      metadata: {
        itemId,
      },
    }),
  ]);
  return { data: purchased };
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
