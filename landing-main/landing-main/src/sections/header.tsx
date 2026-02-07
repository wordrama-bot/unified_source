import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="dark:bg-darkBg inset-0 flex min-h-[80dvh] w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
      <Image 
          className='flex justify-center items-center'
          src="/logo-fulltext-blue.png"
          alt="logo"
          width={300}
          height={100}
        />
      <div className="mx-auto w-container max-w-full px-5 text-center">
        <p className="my-12 mt-8 text-lg font-normal leading-relaxed md:text-3xl lg:text-4xl lg:leading-relaxed">
        Challenge, Play, Level Up.
        </p>
        <Button
          size="lg"
          className="h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl"
        >
          Earn rewards now
        </Button>
      </div>
    </header>
  )
}
