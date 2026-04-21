'use client'

import { useMemo, useState } from 'react'
import Product from '@/components/product'
import { Button } from '@/components/ui/button'
import { marketplaceV2Catalog } from '@/lib/marketplaceV2Catalog'
import {
  useCheckoutMarketplaceCoinsMutation,
  useGetMarketplaceBalanceQuery,
  useGetMarketplaceEntitlementsQuery,
} from '@/redux/api/marketplaceV2'

export default function MarketplaceV2Test() {
  const {
    data: balanceData,
    isLoading: balanceLoading,
    isError: balanceIsError,
    error: balanceError,
  } = useGetMarketplaceBalanceQuery()

  const {
    data: entitlementsData,
    isLoading: entitlementsLoading,
    isError: entitlementsIsError,
    error: entitlementsError,
  } = useGetMarketplaceEntitlementsQuery()

  const [checkoutMarketplaceCoins, { isLoading: isProcessingOrder }] =
    useCheckoutMarketplaceCoinsMutation()

  const [itemsInCart, setItemsInCart] = useState<string[]>([])
  const [alertTitle, setAlertTitle] = useState('')
  const [alertText, setAlertText] = useState('')

  const ownedCatalogItemIds = useMemo(() => {
    const entitlements = entitlementsData?.data || []

    return new Set(
      entitlements
        .map((entitlement: any) => entitlement?.metadata?.catalogItemId)
        .filter(Boolean)
    )
  }, [entitlementsData])

  const availableBalance = balanceData?.data?.available_balance ?? 0

  const basketItems = useMemo(
    () => marketplaceV2Catalog.filter(item => itemsInCart.includes(item.id)),
    [itemsInCart]
  )

  const basketSubTotal = basketItems.reduce((acc, item) => acc + item.price, 0)
  const hasEnoughCoins = availableBalance >= basketSubTotal

  const groupedCatalog = useMemo(() => {
    return {
      WORD_PACK: marketplaceV2Catalog.filter(item => item.type === 'WORD_PACK'),
      GAME_MODE: marketplaceV2Catalog.filter(item => item.type === 'GAME_MODE'),
      COSMETIC: marketplaceV2Catalog.filter(item => item.type === 'COSMETIC'),
    }
  }, [])

  const addItemToCart = (itemId: string) => {
    setItemsInCart(prev => (prev.includes(itemId) ? prev : [...prev, itemId]))
  }

  const removeItemFromCart = (itemId: string) => {
    setItemsInCart(prev => prev.filter(id => id !== itemId))
  }

  const clearBasket = () => {
    setItemsInCart([])
  }

  const handleCheckoutWithCoins = async () => {
    if (itemsInCart.length === 0) return

    setAlertTitle('')
    setAlertText('')

    try {
      const purchased = await checkoutMarketplaceCoins({
        items: itemsInCart.map(catalogItemId => ({ catalogItemId })),
        idempotencyKey: crypto.randomUUID(),
      }).unwrap()

      setItemsInCart([])
      setAlertTitle('Whoo! 🎉')
      setAlertText(
        purchased?.data?.reused
          ? 'Previous checkout was reused successfully.'
          : 'Items purchased successfully.'
      )
    } catch (err: any) {
      const code = err?.data?.code
      const message = err?.data?.message || 'Checkout failed'

      setAlertTitle('Oops! 😢')

      if (code === 'INSUFFICIENT_COINS') {
        setAlertText('You do not have enough coins for this purchase.')
      } else if (code === 'ALREADY_OWNED') {
        setAlertText('You already own one or more selected items.')
      } else {
        setAlertText(message)
      }
    }
  }

  const getDescription = (type: string, label: string) => {
    if (type !== 'WORD_PACK') return `Unlock ${label}.`

    const descriptions: Record<string, string> = {
      '4 Letter Pack':
        'Fast-paced games with tighter guesses. Perfect for quick wins.',

      '11 Letter Expansion':
        'Push beyond the standard 11 letter solve list with additional solutions.',

      '12 Letter Pack':
        'Step into advanced play with longer words that demand precision and strategy.',

      '13 Letter Pack':
        'Even longer words. Fewer lucky guesses. More skill required.',

      '14 Letter Pack':
        'For experienced players who want a serious challenge.',

      '15 Letter Pack':
        'Long words that test both vocabulary and pattern recognition.',

      '16 Letter Pack':
        'High-level difficulty. Every guess matters.',

      '17 Letter Pack':
        'Extended gameplay with complex word structures and deeper strategy.',

      '18 Letter Pack':
        'Elite-difficulty mode for players who want to push their limits.',

      '19 Letter Pack':
        'Massive words. Maximum challenge. Not for the faint of heart.',

      '20 Letter Pack':
        'Extreme-length words that demand careful planning and precision.',

      '21 Letter Pack':
        'One of the longest formats available. Pure mastery required.',

      '22 Letter Pack':
        'Ultra-long words for players chasing the ultimate challenge.',

      '23 Letter Pack':
        'The longest possible words. Only for the best of the best.',

      '12–23 Letter Mega Pack':
        'Unlock ALL advanced word lengths (12–23). Best value for serious players.',
    }

    return descriptions[label] || 'Unlock this word pack for Wordle.'
  }

  const renderSection = (
    title: string,
    items: { id: string; label: string; price: number; type: string }[]
  ) => {
    if (items.length === 0) return null

    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-heading">{title}</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map(item => {
            const isPurchased = ownedCatalogItemIds.has(item.id)

            return (
              <Product
                key={item.id}
                itemId={item.id}
                subItems={[]}
                isPopular={item.label === '12–23 Letter Mega Pack'}
                isPurchased={isPurchased}
                name={item.label}
                type={item.type}
                description={getDescription(item.type, item.label)}
                isCashPrice={false}
                price={String(item.price)}
                addItemToCard={addItemToCart}
                removeItemFromCard={removeItemFromCart}
                isInCart={itemsInCart.includes(item.id)}
              />
            )
          })}
        </div>
      </section>
    )
  }

  if (balanceLoading || entitlementsLoading) {
    return (
      <div className="p-6">
        <p>Loading marketplace...</p>
      </div>
    )
  }

  if (balanceIsError || entitlementsIsError) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-heading">Marketplace V2 Test</h1>
        {balanceIsError && (
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(balanceError, null, 2)}
          </pre>
        )}
        {entitlementsIsError && (
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(entitlementsError, null, 2)}
          </pre>
        )}
      </div>
    )
  }

  return (
    <div className="bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 rounded-base border-2 border-border bg-bg p-6 dark:border-darkBorder dark:bg-darkBg md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading">Marketplace V2</h1>
            <p className="mt-2 text-sm opacity-80">
              Test storefront using the new Marketplace V2 checkout flow.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-base border-2 border-border bg-main px-4 py-2 text-sm dark:border-darkBorder">
              Balance: <span className="font-bold">{availableBalance}</span> coins
            </div>
            <div className="rounded-base border-2 border-border px-4 py-2 text-sm dark:border-darkBorder">
              Basket: <span className="font-bold">{basketSubTotal}</span> coins
            </div>
            <div className="rounded-base border-2 border-border px-4 py-2 text-sm dark:border-darkBorder">
              Items: <span className="font-bold">{itemsInCart.length}</span>
            </div>
          </div>
        </div>

        {(alertTitle || alertText) && (
          <div className="mb-8 rounded-base border-2 border-border bg-bg p-4 dark:border-darkBorder dark:bg-darkBg">
            <h3 className="text-lg font-heading">{alertTitle}</h3>
            <p className="mt-1 text-sm">{alertText}</p>
          </div>
        )}

        {itemsInCart.length > 0 && (
          <div className="mb-8 rounded-base border-2 border-border bg-bg p-6 dark:border-darkBorder dark:bg-darkBg">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-heading">Basket</h2>
                <p className="mt-1 text-sm opacity-80">
                  {itemsInCart.length} item(s) selected · subtotal {basketSubTotal} coins
                </p>
                {!hasEnoughCoins && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    Not enough coins for this order.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={clearBasket}>
                  Clear basket
                </Button>
                <Button
                  disabled={!hasEnoughCoins || isProcessingOrder}
                  onClick={handleCheckoutWithCoins}
                >
                  {isProcessingOrder ? 'Processing...' : 'Checkout with coins'}
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {basketItems.map(item => (
                <span
                  key={item.id}
                  className="rounded-base border-2 border-border px-3 py-1 text-sm dark:border-darkBorder"
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-12">
          {renderSection('Word Packs', groupedCatalog.WORD_PACK)}
          {renderSection('Game Modes', groupedCatalog.GAME_MODE)}
          {renderSection('Cosmetics', groupedCatalog.COSMETIC)}
        </div>
      </div>
    </div>
  )
}