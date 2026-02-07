import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Marquee from 'react-fast-marquee';
import Image from 'next/image';

const Wordrama = () => {
  return (
    <Image height={100} width={200} src="/logo-fulltext-blue.png" alt="wordle" />
  )
}

export default function Faq({ items = [
  { title: 'What is Wordrama?', content: 'Wordrama brings a new twist to the word game community by rebuilding well loved games with a modern style and adding competition. Made by the players for the players.' },
  { title: 'How do I play Wordrama?', content: 'Sign up. Select a game to play. WIN!' },
  { title: 'How do I level up?', content: 'Complete games to earn XP. The more XP you earn, the higher your level.' },
  { title: 'What are beta features and releases?', content: 'Beta features and releases are new features and games that are still in development. Pro/Streamer subscribers can access these features and games before they are released to the wider community.' },
  { title: 'What are word packs?', content: 'Word packs are collections of words that you can use to in games. Word packs are categorised e.g. Place names, football teams, foods etc. Pro/Streamer subscribers can access premium packs for free.'},
  { title: 'What is streamer mode?', content: 'Streamer mode is a set of features to provide you more control over your Wordrama experience. For example adding your socials to your profile.' }
]}: {
  items: { title: string; content: string }[]
}) {
  return (
    <div>
      <section className=" dark:bg-darkBg bg-bg py-20 font-base lg:py-[100px]">
        <h2 className="mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
          Frequently asked questions
        </h2>

        <div className="mx-auto grid w-[700px] max-w-full px-5">
          <Accordion className="text-base sm:text-lg" type="single" collapsible>
            {
              items.map(({ title, content}, itemIdx) => (
                <AccordionItem className="mb-2" value={`item-${itemIdx + 1}`} key={itemIdx}>
                  <AccordionTrigger>{ title }</AccordionTrigger>
                  <AccordionContent>
                    { content }
                  </AccordionContent>
                </AccordionItem>
              ))
            }
          </Accordion>
        </div>
      </section>
      <div>
        <Marquee
          className="border-y-border dark:border-y-darkBorder dark:border-darkBorder dark:bg-darkBg border-y-2 bg-white py-3 font-base sm:py-5"
          direction="right"
        >
          {Array(10)
            .fill('xd')
            .map((x, id) => {
              return (
                <div className="flex items-center" key={id}>
                  <span className="mx-10 text-xl font-heading sm:text-2xl lg:text-4xl">
                    Play Now!
                  </span>
                  <Wordrama />
                  <span className="mx-10 text-xl font-heading sm:text-2xl lg:text-4xl">
                    Challenge your friends!
                  </span>
                  <Wordrama />
                  <span className="mx-10 text-xl font-heading sm:text-2xl lg:text-4xl">
                    Level up!
                  </span>
                  <Wordrama />
                </div>
              )
            })}
        </Marquee>
      </div>
    </div>
  )
}
