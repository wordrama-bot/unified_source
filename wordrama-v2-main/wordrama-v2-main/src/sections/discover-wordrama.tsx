import Link from "next/link";
import { GraduationCap, Megaphone } from "lucide-react";

const discoveryItems = [
  {
    title: "What's New?",
    description:
      "Discover new features, game updates, and improvements across Wordrama.",
    href: "/whats-new",
    Icon: Megaphone,
  },
  {
    title: "Wordrama Academy",
    description:
      "Learn how to earn coins, unlock rewards, join teams, and make the most of Wordrama.",
    href: "/academy",
    Icon: GraduationCap,
  },
];

export default function DiscoverWordrama() {
  return (
    <section className="border-t-2 border-border bg-bg py-12 dark:border-darkBorder dark:bg-darkBg">
      <div className="mx-auto w-container max-w-full px-5">
        <h2 className="mb-6 text-3xl font-heading text-text dark:text-darkText">
          Discover More Wordrama
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {discoveryItems.map(({ title, description, href, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col gap-3 rounded-base border-2 border-border bg-bg p-6 text-text shadow-light transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 dark:border-darkBorder dark:bg-darkBg dark:text-darkText dark:shadow-dark dark:hover:shadow-none"
            >
              <Icon size={36} aria-hidden="true" />

              <h3 className="text-2xl font-heading">
                {title}
              </h3>

              <p>{description}</p>

              <span className="mt-auto pt-3 font-semibold underline">
                Explore
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
