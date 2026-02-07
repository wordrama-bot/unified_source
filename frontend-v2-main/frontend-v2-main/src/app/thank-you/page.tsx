"use client"
import NavBar from '@/components/navbar/h-nav';
import Footer from '@/sections/footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText">
      <NavBar
        links={[]}
      />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6">Thank you for your donation!</h1>

        <section className="my-8">
          <p className="mt-2">Dear Player,</p>
          <p className="mt-4">Thank you so much for supporting Wordrama! Your enthusiasm and engagement means the world to us. Every game you play, every achievement you unlock, and every moment you spend with us helps bring our vision to life.</p>
          <p className="mt-4">We’re constantly working to make Wordrama even better, and it’s your support that drives us forward. Keep an eye out for new features and exciting updates — they’re made with you in mind!</p>
          <p className="mt-4">We thank you for being an essential part of our growing community. We couldn’t do this without you!</p>
          <p className="mt-4">Your support means we can keep our servers online and the game Ad-Free*</p>
          <p className="mt-4">From all of us at Wordrama</p>
          <Link href="/">
            <Button className="mt-16 px-4 py-2 rounded">Back to the game</Button>
          </Link>
        </section>
        <section className="my-16">
          <p className="mt-2 text-xs">*We many introduce Ads in the future to support the increasing cost of servers and growing the team.</p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
