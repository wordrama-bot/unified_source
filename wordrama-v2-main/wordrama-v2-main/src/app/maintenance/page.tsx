"use client"
import Header from '@/sections/header';
import NavBar from "@/components/navbar/public-nav";
import Footer from '@/sections/footer';
import { useAuth } from '@/providers/auth-provider';

export default function MaintenancePage() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText">
      <NavBar
        links={user ? [
          { href: "/games", text: "Games" },
          { href: "/leaderboard", text: "Leaderboard" },
          { href: "/marketplace", text: "Marketplace" },
          { href: "/achievements", text: "Achievements" },
          //{ href: "/teams", text: "Teams" },
        ] : [
            { href: "/about", text: "About" },
            { href: "/free-play", text: "Wordle" },
            { href: "/signup", text: "SignUp" },
          ]
        }
      />
      <section
        id="about"
        className="py-24 sm:py-32 mx-10"
      >
        <div className="border rounded-lg py-12 w-full">
          <div className="px-6 gap-8 md:gap-12">
            <div className="bg-green-0 flex flex-col justify-between">
              <div className="pb-6">
                <h2 className="text-center text-3xl md:text-4xl font-bold">
                  <span className="bg-clip-text">
                    This part of the website is under maintenance{" "}
                  </span>
                </h2>
                <p className="text-center text-xl text-muted-foreground mt-4">
                  Please check back later or join our discord for updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
