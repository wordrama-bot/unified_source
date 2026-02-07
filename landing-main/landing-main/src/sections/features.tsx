import Marquee from 'react-fast-marquee'
import Image from 'next/image';

const SpellBee = () => {
  return (
    <Image width={128} height={64} src="/spellbee.webp" alt="SpellBee" />
  )
}

const Wordle = () => (
  <Image width={128} height={64} src="/wordrama.webp" alt="Wordle" />
);

const More = () => (
  <Image width={128} height={64} src="/soon.webp" alt="Coming Soon" />
)


export default function Features() {
  const icons = [Wordle, SpellBee, More]

  const features = [{
    title: 'Wordrama',
    text: '5-11 letter Daily, Infinite & Custom mode Wordle.',
  },{
    title: 'Spell Bee',
    text: 'Daily & Infinite mode Spell Bee.',
  },{
    title: 'Coming Soon',
    text: 'We are constantly working on new games. Stay tuned!',
  }]

  return (
    <div>
      <section className="border-t-border dark:border-t-darkBorder dark:bg-darkBg border-t-2 bg-bg py-20 font-base lg:py-[100px]">
        <h2 className="mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
          Our Games
        </h2>

        <div className="mx-auto grid w-container max-w-full grid-cols-1 gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = icons[i]

            return (
              <div
                className="border-border dark:border-darkBorder dark:bg-darkBg shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base border-2 bg-white p-5"
                key={i}
              >
                <Icon />

                <h4 className="mt-2 text-xl font-heading">
                  {feature.title}
                </h4>
                <p>{feature.text}</p>
              </div>
            )
          })}
        </div>
      </section>
      <div>
        <Marquee
          className="border-y-border dark:border-y-darkBorder dark:border-darkBorder dark:bg-darkBg border-y-2 bg-white py-3 font-base sm:py-5"
          direction="left"
        >
          {Array(20)
            .fill('xd')
            .map((x, id) => {
              return (
                <div className="flex items-center" key={id}>
                  <span className="mx-10 text-xl font-heading sm:text-2xl lg:text-4xl">
                    Play Now!
                  </span>
                  <Wordle />
                  <span className="mx-10 text-xl font-heading sm:text-2xl lg:text-4xl">
                    Play Now!
                  </span>
                  <SpellBee />
                </div>
              )
            })}
        </Marquee>
      </div>
    </div>
  )
}
