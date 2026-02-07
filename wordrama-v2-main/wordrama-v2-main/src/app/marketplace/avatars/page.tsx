"use client"
import { useState } from 'react';
import { FilterIcon } from 'lucide-react';
//import { getAppInsights } from '@/utils/appInsights';
import { useAuth } from '@/providers/auth-provider';
import Header from '@/sections/header';
import Loading from '@/sections/loading';

import NavBar from '@/components/navbar/h-nav';
import Product from '@/components/product';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetFooter,
  SheetClose,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useGetStoreItemsQuery, useGetPurchasesQuery, useGetMyAccountQuery, usePurchaseItemsWithCoinsMutation } from '@/redux/api/wordrama';
import { useEffect } from 'react';

function ShoppingCartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

function Spinner() {
  return (
    <div role="status">
        <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
    </div>
  );
}

export default function AvatarMarketplacePage() {
  //getAppInsights().trackPageView({ name: 'Marketplace - Avatars' });
  const [ minCoinPrice, setMinCoinPrice ] = useState(0);
  const [ maxCoinPrice, setMaxCoinPrice ] = useState(1000000);
  const [ gameFilter, setGameFilter ] = useState('ALL');
  const [ itemTypeFilter, setItemTypeFilter ] = useState('AVATAR');
  const [ showPurchased, setShowPurchased ] = useState(false);
  const [ showUnavailable, setShowUnavailable ] = useState(false);
  const [ itemsInCart, addItemToCart ] = useState([] as string[]);
  const [ alertTitle, setAlertTitle ] = useState('');
  const [ alertText, setAlertText ] = useState('');
  const [ isProcessingOrder, setIsProcessingOrder] = useState(false);
  const { data: myAccount, error: myAccountError, isLoadingMyAccount } = useGetMyAccountQuery();
  const { data: storeItems, error: storeItemsError, isLoading: isLoadingStoreItems } = useGetStoreItemsQuery({
    minCoinPrice,
    maxCoinPrice,
    gameFilter,
    itemTypeFilter,
    showPurchased,
    showUnavailable
  });
  const [ purchaseItemsWithCoins ] = usePurchaseItemsWithCoinsMutation();
  const basketSubTotal = !isLoadingStoreItems && storeItems ? storeItems?.data.filter(item => itemsInCart.includes(item.id)).reduce((acc: number, item: any) => acc + item.coinPrice, 0) : 0
  const hasEnoughCoins = myAccount?.data?.ledger?.coinBalance && myAccount?.data?.ledger?.coinBalance >= basketSubTotal;

  async function handleCheckoutWithCoins() {
    const itemsToCheckout = [...itemsInCart];
    setIsProcessingOrder(true);
    const { data: purchased } = await purchaseItemsWithCoins(itemsToCheckout);
    if (purchased?.status === 200 && purchased?.count === itemsToCheckout.length) {
      addItemToCart([]);
      setAlertTitle('Whoo! 🎉');
      setAlertText('Items purchased');
      setIsProcessingOrder(false);
      return;
    }
    setAlertTitle('Oops! 😢');
    setAlertText('Failed to purchase some or all items');
    setIsProcessingOrder(false);
  }

  if (isLoadingStoreItems || isLoadingMyAccount) return <Loading />;
  return (
    <div className='bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]'>
      <Header
        showLogo={false}
        heroText='Avatar Marketplace'
        className='min-h-[10dvh] dark:bg-darkBg inset-0 flex w-full flex-col items-center justify-center bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]'
      />
      <AlertDialog open={alertTitle && alertText && true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{ alertTitle }</AlertDialogTitle>
            <AlertDialogDescription>
              { alertText }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setAlertTitle('');
                setAlertText('');
              }}>
                Close
              </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Sheet>
        <SheetTrigger asChild>
          <Button className='fixed top-20 right-24' variant='default'>
            <ShoppingCartIcon className='w-6 h-6' /> {itemsInCart.length > 0 ? `(${itemsInCart.length})` : ''}
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-bg">
          <SheetHeader>
            <SheetTitle>Basket</SheetTitle>
            <SheetDescription>
              {itemsInCart.length === 0 && 'Your basket is empty'}
              {itemsInCart.length > 0 && `Basket total: ${basketSubTotal} coins`}
            </SheetDescription>
          </SheetHeader>

          { !isProcessingOrder && !isLoadingStoreItems && itemsInCart.length > 0 && (
            <>
              <Separator className='mt-2' />
              <SheetFooter className='pt-4'>
                <Button>Clear basket</Button>
                <Button disabled={!hasEnoughCoins} onClick={() => handleCheckoutWithCoins()}>
                  {hasEnoughCoins ? 'Checkout with Coins' : 'Not enough coins'}
                </Button>
              </SheetFooter>
            </>
          )}
          { isProcessingOrder && (
            <div className='flex items-center justify-center'>
              <Spinner />
            </div>
          )}
          <div className="grid gap-4 py-4">
            <Separator />
            {
              !isProcessingOrder && !isLoadingStoreItems && itemsInCart.map((id, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-lg font-semibold'>{ !isLoadingStoreItems && storeItems && storeItems?.data.find(item => item.id === id)?.name}</h3>
                    <p className='text-sm'>{!isLoadingStoreItems && storeItems && storeItems?.data.find(item => item.id === id)?.coinPrice} coins</p>
                  </div>
                  <div>
                    <Button
                      variant='default'
                      onClick={() =>
                        addItemToCart(itemsInCart.filter((currId) => currId !== id))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            }
          </div>
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger asChild>
          <Button className='fixed top-20 right-5' variant='default'><FilterIcon className='w-6 h-6'/></Button>
        </SheetTrigger>
        <SheetContent className="bg-bg">
          <SheetHeader>
            <SheetTitle>Filter</SheetTitle>
            <SheetDescription>

            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <Separator />
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Show purchased
              </Label>
              <Switch checked={showPurchased} onCheckedChange={checked => setShowPurchased(checked)} />
              <Label htmlFor="name" className="text-right">
                Show unavailable
              </Label>
              <Switch checked={showUnavailable} onCheckedChange={checked => setShowUnavailable(checked)} />
            </div>
            <Separator />
          </div>
          {
          // <SheetFooter>
          //   <SheetClose asChild>
          //     <Button type="submit">Save changes</Button>
          //   </SheetClose>
          // </SheetFooter>
          }
        </SheetContent>
      </Sheet>
      <div className='p-8'>
        { storeItems?.data.length === 0 && (
          <div className="text-center text-xl">
            No items found.
            <br />
            Try changing the filters.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {storeItems?.data.map((item) => {
            const isCashPrice = false;
            const subItems = [];
            const cashPrice = '1';
            return (
              <Product
                itemId={item.id}
                name={item.name}
                type={item.type}
                description={item.description}
                price={isCashPrice ? cashPrice : item.coinPrice}
                isCashPrice={isCashPrice}
                isPurchased={item.isPurchased}
                subItems={[]}
                addItemToCard={() => {
                  if (!itemsInCart.includes(item.id))
                  addItemToCart([...itemsInCart, item.id]);
                }}
                removeItemFromCard={() => {
                  addItemToCart(itemsInCart.filter((id) => id !== item.id));
                }}
                isInCart={itemsInCart.includes(item.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  )
}
