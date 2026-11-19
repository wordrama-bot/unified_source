import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getUpdateYears,
  getUpdatesByYear,
} from "@/data/site-updates";

export function generateStaticParams() {
  return getUpdateYears().map((year) => ({
    year: String(year),
  }));
}

export default function YearArchivePage({
  params,
}: {
  params: { year: string };
}) {
  const year = Number(params.year);

  if (!Number.isInteger(year)) notFound();

  const updates = getUpdatesByYear(year);

  if (updates.length === 0) notFound();

  return (
    <main className="min-h-screen bg-bg px-5 py-12 text-text dark:bg-darkBg dark:text-darkText">
      <div className="mx-auto max-w-4xl">
        <Link href="/whats-new" className="text-sm underline">
          Back to What's New
        </Link>

        <h1 className="mb-4 mt-8 text-4xl font-bold">
          Wordrama Updates: {year}
        </h1>

        <p className="mb-10">
          Explore everything that changed in Wordrama during {year}.
        </p>

        <div className="space-y-6">
          {updates.map((update) => (
            <article
              key={update.slug}
              className="rounded-base border-2 border-border bg-bg p-6 shadow-light dark:border-darkBorder dark:bg-darkBg dark:shadow-dark"
            >
              <time
                dateTime={update.date}
                className="text-sm opacity-75"
              >
                {update.date}
              </time>

              <h2 className="mt-3 text-2xl font-bold">
                <Link
                  href={`/whats-new/${year}/${update.slug}`}
                  className="hover:underline"
                >
                  {update.title}
                </Link>
              </h2>

              <p className="mt-4">{update.summary}</p>

              <Link
                href={`/whats-new/${year}/${update.slug}`}
                className="mt-5 inline-block font-semibold underline"
              >
                Read update
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
