import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { showChristmasDay } from '@/lib/config';

const today = new Date();
const cmas = new Date(today.getFullYear(), 11, 25);
if (today.getMonth() == 11 && today.getDate() > 25) {
  cmas.setFullYear(cmas.getFullYear()+1);
}

export default function Header({
  heroText,
  ctaLink,
  ctaText,
  showLogo = true,
  showSocialIcons = false,
  logo = 'https://utfs.io/f/vieUBZcrouNZQrdaKfbRj7hpV6g4Axl20D3nvSc9I1BEkdqr',
  className = 'min-h-[80dvh] dark:bg-darkBg inset-0 flex w-full flex-col items-center justify-center bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]'
}: {
  className?: string,
  showLogo?: boolean
  logo?: string,
  heroText: string,
  ctaLink?: string,
  ctaText?: string,
  showSocialIcons?: boolean
}) {
  return (
    <header className={className}>
      { showLogo && (
        <Image
          className='flex justify-center items-center'
          src={logo}
          alt="Wordrama Logo"
          width={300}
          height={100}
        />
      ) }
      <div className="mx-auto w-container max-w-full px-5 text-center">
        <h1 className="my-12 mt-8 text-3xl font-normal leading-relaxed md:text-3xl lg:text-4xl lg:leading-relaxed">
          { heroText }
        </h1>
        { (ctaLink || ctaText) && (
          <Link href={ctaLink}>
            <Button
              size="lg"
              className="h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl"
            >
              { ctaText }
            </Button>
          </Link>
        )}
        { showSocialIcons && (
          <div className="flex justify-center items-center mt-16">
            <a
              className="mx-2"
              href="https://www.tiktok.com/@wordrama.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/tiktok.svg" alt='tiktok icon' width={32} height={32}/>
            </a>
            <a
              className="mx-2"
              href="https://www.instagram.com/wordrama.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/instagram.svg" alt='instagram icon' width={32} height={32}/>
            </a>
            <a
              className="mx-2"
              href="https://discord.gg/cRunwK229g"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/discord.svg" alt='discord icon' width={32} height={32}/>
            </a>
          </div>
        )}
      </div>
    </header>
  )
}

export function ChristmasHeader({
  heroText,
  ctaLink,
  ctaText,
  showLogo = true,
  showSocialIcons = false,
  logo = '/chirstmas.png',
  className = 'min-h-[80dvh] dark:bg-darkBg inset-0 flex w-full flex-col items-center justify-center bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]'
}: {
  className?: string,
  showLogo?: boolean
  logo?: string,
  heroText: string,
  ctaLink?: string,
  ctaText?: string,
  showSocialIcons?: boolean
}) {
  return (
    <header className={className}>
      { showLogo && (
        <Image
          className='flex justify-center items-center'
          src={logo}
          alt="Wordrama Logo"
          width={300}
          height={100}
        />
      ) }
      <div className="mx-auto w-container max-w-full px-5 text-center">
        <h1 className="my-12 mt-8 text-3xl font-normal leading-relaxed md:text-3xl lg:text-4xl lg:leading-relaxed">
          { showChristmasDay ? "Merry Christmas" : `${Math.ceil((cmas.getTime()-today.getTime())/(86400000))} days until Christmas`}{ heroText }
        </h1>
        { (ctaLink || ctaText) && (
          <Link href={ctaLink}>
            <Button
              size="lg"
              className="h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl"
            >
              { ctaText }
            </Button>
          </Link>
        )}
        { showSocialIcons && (
          <div className="flex justify-center items-center mt-16">
            <a
              className="mx-2"
              href="https://www.tiktok.com/@wordrama.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/tiktok.svg" alt='tiktok icon' width={32} height={32}/>
            </a>
            <a
              className="mx-2"
              href="https://www.instagram.com/wordrama.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/instagram.svg" alt='instagram icon' width={32} height={32}/>
            </a>
            <a
              className="mx-2"
              href="https://discord.gg/cRunwK229g"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/discord.svg" alt='discord icon' width={32} height={32}/>
            </a>
          </div>
        )}
      </div>
    </header>
  )
}

export function HalloweenHeader({
  heroText,
  ctaLink,
  ctaText,
  showLogo = true,
  showSocialIcons = false,
  logo = 'https://utfs.io/f/vieUBZcrouNZQrdaKfbRj7hpV6g4Axl20D3nvSc9I1BEkdqr',
  className = 'min-h-[80dvh] dark:bg-darkBg inset-0 flex w-full flex-col items-center justify-center bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]'
}: {
  className?: string,
  showLogo?: boolean
  logo?: string,
  heroText: string,
  ctaLink?: string,
  ctaText?: string,
  showSocialIcons?: boolean
}) {
  return (
    <header className={className}>
      { showLogo && (
        <Image
          className='flex justify-center items-center'
          src={logo}
          alt="Wordrama Logo"
          width={300}
          height={100}
        />
      ) }
      <div className="mx-auto w-container max-w-full px-5 text-center">
        <h1 className="my-12 mt-8 text-lg font-normal leading-relaxed md:text-3xl lg:text-4xl lg:leading-relaxed">
          🎃 Happy Halloween { heroText }! 👻
        </h1>
        { showSocialIcons && (
          <div className="flex justify-center items-center mt-16">
            <a
              className="mx-2"
              href="https://www.tiktok.com/@wordrama.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/tiktok.svg" alt='tiktok icon' width={32} height={32}/>
            </a>
            <a
              className="mx-2"
              href="https://www.instagram.com/wordrama.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/instagram.svg" alt='instagram icon' width={32} height={32}/>
            </a>
            <a
              className="mx-2"
              href="https://discord.gg/cRunwK229g"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/discord.svg" alt='discord icon' width={32} height={32}/>
            </a>
          </div>
        )}
      </div>
    </header>
  )
}
