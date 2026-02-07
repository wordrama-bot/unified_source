import Image from 'next/image';
import Link from 'next/link';
import { SpellBee, Wordle, More } from '@/components/assets';
import { useAuth } from '@/providers/auth-provider';

export default function MarketplaceCategories({
  categories = []
}: {
  categories: {
    title: string,
    link: string,
    Icon: () => JSX.Element,
    text: string
  }[]
}) {
  if (categories.length === 0) {
    categories = [{
      title: 'All Items',
      link: '/marketplace/all-items',
      Icon: Wordle,
      text: 'All marketplace items in one place!',
    },
    //{
    //  title: 'Avatars (Beta)',
    //  link: '/marketplace/avatars',
    //  Icon: Wordle,
    //  text: 'Customise your profile with unique avatars!',
    //},
    {
      title: 'Word Packs',
      link: '/marketplace/word-packs',
      Icon: Wordle,
      text: 'Get word packs with 4-23 letter words!',
    }];
  }
  return (
    <section className="border-t-border dark:border-t-darkBorder dark:bg-darkBg border-t-2 bg-bg py-20 font-base lg:py-[50px]">
      <div className="mx-auto grid w-container max-w-full grid-cols-1 gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
        { categories.map(({ title, text, link, Icon }, categoryIdx) => {
          return (
            <Link href={link || '/'} key={categoryIdx}>
              <div
                className={`border-2 border-border dark:border-darkBorder dark:bg-darkBg shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base bg-bg p-5 ${link && 'hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none dark:bg-darkBg shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base bg-bg p-5'}`}>
                <Icon />
                <h4 className="mt-2 text-xl font-heading">
                  { title }
                </h4>
                <p>{ text }</p>
              </div>
            </Link>
          )
        }) }
      </div>
    </section>
  )
}
