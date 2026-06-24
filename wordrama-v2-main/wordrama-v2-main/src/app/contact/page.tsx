"use client"
import Link from "next/link";
import NavBar from '@/components/navbar/h-nav';
import Footer from '@/sections/footer';

export default function ContactPage() {
  return (
    <div className="flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText">
      <NavBar
        links={[
          { href: "/free-play", text: "Quick Play" },
          { href: "/marketplace", text: "Marketplace" },
          { href: "/achievements", text: "Achievements" },
          { href: "/teams", text: "Teams" },
          { href: "/about", text: "About" },
          { href: "/signup", text: "Sign Up / In" },
        ]}
      />

      <main className="container mx-auto p-4 flex-1">
        <h1 className="text-4xl font-bold mb-6">Contact Wordrama</h1>
        <p className="text-sm text-gray-500">Last updated June 18, 2026</p>

        <section className="my-8">
          <p className="mt-2">
            Thanks for visiting Wordrama.io. Whether you are here to play a quick daily word puzzle,
            challenge yourself in infinite mode, compete with friends, explore achievements, or learn more
            about our growing word game community, we want your experience to be fun, fair, and easy to
            use. This page explains the best ways to contact us, what kinds of messages we can help with,
            and how we handle support requests from players, parents, partners, advertisers, and site
            visitors.
          </p>

          <p className="mt-4">
            Wordrama is operated as part of Unhinged Creations, LLC. Our goal is to provide a clean,
            accessible, family-friendly word game experience for players who enjoy vocabulary puzzles,
            daily challenges, leaderboards, achievements, and casual competition. We also care about
            player safety, account security, responsible site operation, and maintaining a positive
            environment that follows our <Link href="/terms-of-use" className="underline hover:text-primary">
            Terms of Use</Link>, <Link href="/privacy-policy" className="underline hover:text-primary">Privacy
            Policy</Link>, and <Link href="/acceptable-use" className="underline hover:text-primary">Acceptable
            Use Policy</Link>.
          </p>
        </section>

        <section className="my-8 rounded-lg border border-gray-200 dark:border-darkBorder p-6 bg-white/40 dark:bg-black/20">
          <h2 className="text-2xl font-semibold">How to reach us</h2>
          <p className="mt-2">
            For general questions, account help, technical issues, content concerns, or business inquiries,
            please email us at:
          </p>

          <p className="mt-4 text-xl font-semibold">
            <a href="mailto:support@wordrama.io" className="text-blue-500 hover:underline">
              support@wordrama.io
            </a>
          </p>

          <p className="mt-4">
            When contacting us, please include a clear subject line and as much helpful detail as possible.
            If your question is about an account, game result, purchase, leaderboard entry, bug, or technical
            issue, include your username or player ID if available, the page you were using, the device and
            browser you were on, and a short description of what happened. Screenshots are also helpful
            when reporting visual bugs, error messages, or unexpected game behavior.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">What we can help with</h2>
          <p className="mt-2">
            We welcome messages about account access, login issues, gameplay bugs, missing stats,
            achievements, leaderboard concerns, game packs, subscriptions, marketplace items, accessibility
            feedback, and general questions about how Wordrama works. We also review reports involving
            suspected cheating, harassment, abuse, impersonation, inappropriate usernames, or other conduct
            that may violate our rules.
          </p>

          <p className="mt-4">
            If you are reporting a safety or conduct concern, please include the username or player
            information involved, the date and time of the issue, where it happened on the site, and any
            supporting details. We may not be able to share the outcome of every review, but we take reports
            seriously and may take action when behavior violates our policies or creates a poor experience
            for other players.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Advertising, partnerships, and site feedback</h2>
          <p className="mt-2">
            We are also happy to hear from potential partners, advertisers, creators, educators, and others
            interested in Wordrama. If you have feedback about site content, accessibility, page performance,
            mobile usability, or features you would like to see in the future, please send it our way.
            Player feedback helps us improve the game and prioritize updates that make Wordrama more useful,
            enjoyable, and reliable.
          </p>

          <p className="mt-4">
            Wordrama may display advertising, affiliate links, sponsored placements, or promotional content
            in some areas of the site. We aim to keep advertising separate from gameplay and avoid anything
            that interferes with the core player experience. For advertising-related questions, please use
            the same support email and include “Advertising Inquiry” in your subject line.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Privacy and legal requests</h2>
          <p className="mt-2">
            For privacy-related questions, data requests, account deletion requests, or concerns about how
            information is collected and used, please review our
            <Link href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link> and
            contact us at the email above. For legal, policy, or intellectual property concerns, include
            enough detail for us to identify the specific content, page, account, or issue involved.
          </p>

          <p className="mt-4">
            Please do not send sensitive personal information unless it is necessary for us to understand
            and respond to your request. We will use the information you provide to review your message,
            respond when appropriate, operate the site, enforce our policies, and improve Wordrama.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Response expectations</h2>
          <p className="mt-2">
            We do our best to review incoming messages in a reasonable timeframe. Some issues, especially
            account, billing, safety, or technical reports, may take longer to investigate. Sending complete
            information in your first message helps us respond more efficiently.
          </p>

          <p className="mt-4">
            Thank you for playing Wordrama and helping us build a better word game experience.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
