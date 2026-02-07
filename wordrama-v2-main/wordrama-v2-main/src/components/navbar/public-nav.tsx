// import Link from "next/link";
// import Image from 'next/image';

// export default function NavBar({
//   links = [],
// }: {
//   links?: { href: string, text: string }[],
// }) {
//   return (
//     <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-bg dark:bg-darkBg text-text dark:text-darkText dark:border-darkBorder px-4 md:px-6 sm:px-6">
//       <nav
//         className='gap-6 font-medium flex flex-row md:flex sm:items-center text-sm items-center lg:gap-6'>
//         <Link
//           href="/"
//           className="flex items-center gap-2 text-lg font-semibold md:text-base"
//         >
//           <Image src="https://utfs.io/f/vieUBZcrouNZQrdaKfbRj7hpV6g4Axl20D3nvSc9I1BEkdqr" width={200} height={50} alt="Wordrama Logo" />
//           <span className="sr-only">Wordrama</span>
//         </Link>
//         { links.map((link, linkIdx) => (
//           <Link
//             key={`mm-${linkIdx}`}
//             href={link.href}
//             className="text-muted-foreground transition-colors hover:text-foreground"
//           >
//             { link.text }
//           </Link>
//         ))}
//       </nav>
//     </header>
//   );
// }

import {
  CircleUser, Menu, Coins, Trophy
} from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserMenuDropDown from "@/components/navbar/user-menu";
import { useGetMyAccountQuery } from "@/redux/api/wordrama";

import { showChristmas } from '@/lib/config';

export default function NavBar({
  links = []
}: {
  links?: { href: string, text: string }[]
}) {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-bg dark:bg-darkBg text-text dark:text-darkText dark:border-darkBorder px-4 md:px-6">
      <nav
        className={`hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6`}>
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Image src={showChristmas ? "https://utfs.io/f/vieUBZcrouNZHgZwgWPc5QTiy9PYrsMqS3jRhEFC148IZDw0" : "https://utfs.io/f/vieUBZcrouNZQrdaKfbRj7hpV6g4Axl20D3nvSc9I1BEkdqr"} width={250} height={50} alt="Wordrama Logo" />
          <span className="sr-only">Wordrama</span>
        </Link>
        { links.map((link, linkIdx) => (
          <Link
            key={`mm-${linkIdx}`}
            href={link.href}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            { link.text }
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5 dark:text-darkText" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Image src={showChristmas ? "https://utfs.io/f/vieUBZcrouNZHgZwgWPc5QTiy9PYrsMqS3jRhEFC148IZDw0" : "https://utfs.io/f/vieUBZcrouNZQrdaKfbRj7hpV6g4Axl20D3nvSc9I1BEkdqr"} width={250} height={50} alt="Wordrama Logo" />
              <span className="sr-only">Wordrama</span>
            </Link>
            { links.map((link, linkIdx) => (
              <Link
                key={`sb-${linkIdx}`}
                href={link.href}
                className="text-muted-foreground hover:text-foreground"
              >
                { link.text }
              </Link>
            ))}
            <Link
              key='Contact'
              href='https://forms.office.com/e/WCW3FcsDgW'
              className="text-muted-foreground hover:text-foreground"
            >
              Contact Us
            </Link>
            <Link
              key='privacy'
              href='/privacy-policy'
              className="text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              key='Cookies'
              href='/cookies'
              className="text-muted-foreground hover:text-foreground"
            >
              Cookie Policy
            </Link>
            <Link
              key='terms-of-use'
              href='/terms-of-use'
              className="text-muted-foreground hover:text-foreground"
            >
              Terms of Use Policy
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
