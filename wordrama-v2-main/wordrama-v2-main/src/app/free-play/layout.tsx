import NavBar from "@/components/navbar/public-nav";
import Loader from "@/sections/loading";
import Footer from "@/sections/footer";

//import { useAuth } from '@/providers/auth-provider';
//import { redirect } from 'next/navigation';

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Play Wordrama Now!",
  description: "Play now, signup later",
  keywords: ['wordle game online', 'wordle no ads', 'wordle game online free unlimited', 'how to play wordle online', 'practice wordle', 'practice wordle game', 'wordle anytime', 'wordle any time', 'word game unblocked', 'unblocked games', 'play wordle online', 'free wordle games', 'old wordles', 'wordle game unlimited', 'wordle free play', 'free wordle unlimited', 'wordle today unlimited', 'where to play wordle'],
  openGraph: {
    title: "Play Wordrama Now!",
    description: "Play now, signup later",
  }
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {


  //const { user, session } = useAuth();
  //if (user || session) return redirect('/games/wordrama');
  return (
    <div className="flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText">
      <NavBar
        links={[
          { href: "/", text: "Home" },
          { href: "/about", text: "About" },
          { href: "/signup", text: "Sign Up" },
        ]}
      />
        { children }
      <Footer />
    </div>
  )
}
