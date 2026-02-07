import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Marquee from 'react-fast-marquee';
import { Wordrama } from '@/components/assets'


export default function Faq({ items }: {
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
