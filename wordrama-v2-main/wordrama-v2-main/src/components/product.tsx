import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Product({
  itemId,
  subItems = [],
  isPopular = false,
  isPurchased = false,
  isUnlockedBySubscription = false,
  isLocked = false,
  name,
  type,
  description,
  isCashPrice = true,
  price,
  addItemToCard,
  removeItemFromCard,
  buyWithStripe,
  hasStripePrice = false,
  isInCart = false,
  marketplaceImage,
}: {
  itemId: string
  subItems: string[]
  isPopular?: boolean
  isPurchased?: boolean
  isUnlockedBySubscription?: boolean
  isLocked?: boolean
  type: string
  name: string
  description: string
  isCashPrice: boolean
  price: string
  addItemToCard: any
  removeItemFromCard: any
  buyWithStripe?: any
  hasStripePrice?: boolean
  isInCart?: boolean
  marketplaceImage?: string
}) {
  return (
    <div className="border-border dark:border-darkBorder dark:bg-darkBg flex flex-col justify-between rounded-base border-2 bg-bg p-5">
      <div>
        {marketplaceImage && (
          <div className="mb-4 flex h-52 items-center justify-center rounded-base border-2 border-border bg-muted/20 dark:border-darkBorder">
            <img
              src={marketplaceImage}
              alt={`${name} preview`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-heading">{name}</h3>
          {(isPopular || isPurchased || isUnlockedBySubscription) && (
            <span
              className={cn(
                "rounded-base border-2 text-white px-2 py-0.5 text-sm",
                isUnlockedBySubscription ? "bg-blue-600" : "bg-green-600"
              )}
            >
              {isPopular
                ? "Popular"
                : isPurchased
                  ? "Purchased"
                  : "Unlocked"}
            </span>
          )}
        </div>
        <p className="mb-3 mt-1">{type === 'AVATAR' ? 'Avatar' : description}</p>
        <div>
          { isCashPrice ? (
            <>
              { //<span className="text-3xl font-heading">£{price}</span>{' '}
              }
              <p className="mb-3 mt-1">${price}</p>
            </>
          ) : (
            <>
              <p className="mb-3 mt-1">{price} coins</p>
                { // <span className="text-3xl font-heading">{price} coins</span>{' '}
                }
            </>
          )}
        </div>
        <ul className="mt-8 flex flex-col gap-2">
          {subItems.map((item) => {
            return (
              <li key={item} className="flex items-center gap-3">
                <Check className="shrink-0" size={20} /> {item}
              </li>
            )
          })}
        </ul>
      </div>
      {isPurchased ? (
        <Button disabled className="mt-12 w-full">
          Purchased
        </Button>
      ) : isUnlockedBySubscription ? (
        <Button disabled className="mt-12 w-full">
          Included with Your Subscription
        </Button>
      ) : isLocked ? (
        <Button disabled className="mt-12 w-full">
          Upgrade Required
        </Button>
      ) : (
        <div className="mt-12 flex flex-col gap-2">
          {!isInCart ? (
            <Button
              size={isPopular ? 'lg' : 'default'}
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                addItemToCard(itemId);
              }}
            >
              Buy with coins
            </Button>
          ) : (
            <Button
              size={isPopular ? 'lg' : 'default'}
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                removeItemFromCard(itemId);
              }}
            >
              Remove from cart
            </Button>
          )}

          {hasStripePrice && buyWithStripe && (
            <Button
              variant="neutral"
              size={isPopular ? 'lg' : 'default'}
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                buyWithStripe(itemId);
              }}
            >
              Buy with card
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
