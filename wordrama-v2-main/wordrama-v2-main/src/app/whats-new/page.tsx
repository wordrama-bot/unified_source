import Link from "next/link";
import {
  getSortedUpdates,
  getUpdateYears,
  type UpdateCategory,
} from "@/data/site-updates";

export const metadata = {
  title: "What's New | Wordrama",
  description:
    "Discover the latest Wordrama features, game updates, improvements, and announcements.",
};

const categoryLabels: Record<UpdateCategory, string> = {
  NEW_FEATURE: "New Feature",
  IMPROVEMENT: "Improvement",
  BUG_FIX: "Bug Fix",
  ANNOUNCEMENT: "Announcement",
};

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }
  );
}

export default function WhatsNewPage() {
  const updates = getSortedUpdates();
  const years = getUpdateYears();

  return (
    <main className="min-h-screen bg-bg px-5 py-12 text-text dark:bg-darkBg dark:text-darkText">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm underline">
          Back to Wordrama
        </Link>

        <header className="mb-12 mt-8">
          <h1 className="text-4xl font-bold md:text-5xl">
            What's New in Wordrama?
          </h1>
          <p className="mt-4 text-lg">
            Discover new features, updates, improvements,
            and everything happening across Wordrama.
          </p>
        </header>

        {years.length > 0 && (
          <nav
            aria-label="Update archives"
            className="mb-10 flex flex-wrap gap-3"
          >
            {years.map((year) => (
              <Link
                key={year}
                href={`/whats-new/${year}`}
                className="rounded-lg border-2 border-border px-4 py-2 hover:underline dark:border-darkBorder"
              >
                {year}
              </Link>
            ))}
          </nav>
        )}

        <div className="space-y-6">
          {updates.map((update) => (
            <article
              key={update.slug}
              className="rounded-base border-2 border-border bg-bg p-6 shadow-light dark:border-darkBorder dark:bg-darkBg dark:shadow-dark"
            >
              <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
                <time dateTime={update.date}>
                  {formatDate(update.date)}
                </time>

                <span className="rounded-base border border-border px-3 py-1 dark:border-darkBorder">
                  {categoryLabels[update.category]}
                </span>
              </div>

              <h2 className="text-2xl font-bold">
                <Link
                  href={`/whats-new/${update.date.slice(0, 4)}/${update.slug}`}
                  className="hover:underline"
                >
                  {update.title}
                </Link>
              </h2>

              <p className="mt-4">{update.summary}</p>

              <Link
                href={`/whats-new/${update.date.slice(0, 4)}/${update.slug}`}
                className="mt-5 inline-block font-semibold underline"
              >
                Read more
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
