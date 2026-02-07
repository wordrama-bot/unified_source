import Image from 'next/image';
import Link from 'next/link';
import { SpellBee, Wordle, More } from '@/components/assets';
import { useAuth } from '@/providers/auth-provider';

export default function Games({
  games = []
}: {
  games: {
    title: string,
    link: string,
    Icon: () => JSX.Element,
    text: string
  }[]
}) {
  const { role } = useAuth();
  if (games.length === 0) {
    if (role === 'STREAMER' || role === 'PRO' || role === 'CASUAL') {
      games = [{
        title: 'Wordrama',
        link: '/games/wordrama',
        Icon: Wordle,
        text: '4-23 letter Daily, Infinite & Custom modes.',
      },{
        title: 'Spell Bee',
        link: '/games/spellbee/daily',
        Icon: SpellBee,
        text: 'Daily & Infinite modes.',
      },{
        title: 'Word Search',
        link: '/games/word-search',
        Icon: SpellBee,
        text: 'Word Search game with 3 difficulty levels.',
      },{
        title: 'Cross Word',
        link: '/games/cross-word',
        Icon: SpellBee,
        text: 'Cross Word game with 3 difficulty levels.',
      },{
        title: 'Guess the word',
        link: '/games/guess-the-word',
        Icon: SpellBee,
        text: 'Guess the word from the clues given.',
      }];
    } else {
      games = [{
        title: 'Wordrama',
        link: '/games/wordrama',
        Icon: Wordle,
        text: '4-23 letter Daily, Infinite & Custom modes.',
      },
      {
        title: 'Wordrama Custom',
        link: '/games/wordrama/custom',
        Icon: Wordle,
        text: 'Create a custom game.',
      }
      /*,{
        title: 'Spell Bee',
        link: '/games/spellbee/daily',
        Icon: SpellBee,
        text: 'Daily & Infinite modes.',
      },{
        title: 'Subscribe to access more games',
        link: '/',
        Icon: More,
        text: 'Casual & Pro/Streamer can access all games.',
        } */
      ];
    }
  }
  return (
    <section className="border-t-border dark:border-t-darkBorder dark:bg-darkBg border-t-2 bg-bg py-20 font-base lg:py-[50px]">
      <div className="mx-auto grid w-container max-w-full grid-cols-1 gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
        { games.map(({ title, text, link, Icon }, gameIdx) => {
          return (
            <Link href={link || '/'} key={gameIdx}>
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
