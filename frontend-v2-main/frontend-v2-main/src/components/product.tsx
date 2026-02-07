import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Product({
  itemId,
  subItems = [],
  isPopular = false,
  isPurchased = false,
  name,
  type,
  description,
  isCashPrice = true,
  price,
  addItemToCard,
  removeItemFromCard,
  isInCart = false
}: {
  itemId: string
  subItems: string[]
  isPopular?: boolean
  isPurchased?: boolean
  type: string
  name: string
  description: string
  isCashPrice: boolean
  price: string
  addItemToCard: any
  removeItemFromCard: any
  isInCart?: boolean
}) {
  return (
    <div className="border-border dark:border-darkBorder dark:bg-darkBg flex flex-col justify-between rounded-base border-2 bg-bg p-5">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-heading">{name}</h3>
          {isPopular || isPurchased && (
            <span className="border-border text-text dark:border-darkBorder rounded-base border-2 bg-main px-2 py-0.5 text-sm">
              {isPopular ? 'Popular' : isPurchased ? 'Purchased' : ''}
            </span>
          )}
        </div>
        <p className="mb-3 mt-1">{type === 'AVATAR' ? 'Avatar' : description}</p>
        <div>
          { isCashPrice ? (
            <>
              { //<span className="text-3xl font-heading">£{price}</span>{' '}
              }
              <p className="mb-3 mt-1">£{price}</p>
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
      { !isPurchased && !isInCart && (
        <Button
          size={isPopular ? 'lg' : 'default'}
          className={cn('mt-12 w-full', isPopular && 'bg-[#FF6663]')}
          onClick={ e => {
            e.preventDefault()
            addItemToCard(itemId);
          }}
        >
          Add to cart
        </Button>
      )}
        { !isPurchased && isInCart && (
          <Button
            size={isPopular ? 'lg' : 'default'}
            className={cn('mt-12 w-full', isPopular && 'bg-[#FF6663]')}
            onClick={ e => {
              e.preventDefault()
              removeItemFromCard(itemId);
            }}
          >
            Remove from cart
          </Button>
        )}
    </div>
  )
}
