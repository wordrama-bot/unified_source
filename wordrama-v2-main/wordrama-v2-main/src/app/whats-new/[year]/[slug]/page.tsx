import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSortedUpdates,
  getUpdateBySlug,
} from "@/data/site-updates";

export function generateStaticParams() {
  return getSortedUpdates().map((update) => ({
    year: update.date.slice(0, 4),
    slug: update.slug,
  }));
}

export default function UpdateDetailPage({
  params,
}: {
  params: { year: string; slug: string };
}) {
  const update = getUpdateBySlug(params.slug);

  if (
    !update ||
    update.date.slice(0, 4) !== params.year
  ) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-bg px-5 py-12 text-text dark:bg-darkBg dark:text-darkText">
      <article className="mx-auto max-w-3xl">
        <Link href="/whats-new" className="text-sm underline">
          Back to What's New
        </Link>

        <header className="mb-10 mt-8">
          <time dateTime={update.date} className="opacity-75">
            {update.date}
          </time>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            {update.title}
          </h1>

          <p className="mt-5 text-xl">{update.summary}</p>
        </header>

        <div className="space-y-5 text-lg leading-relaxed">
          {update.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {update.link && (
          <Link
            href={update.link.href}
            className="mt-10 inline-block rounded-base border-2 border-border px-5 py-3 font-semibold hover:underline dark:border-darkBorder"
          >
            {update.link.label}
          </Link>
        )}

        <div className="mt-16 border-t border-border pt-6 dark:border-darkBorder">
          <Link href={`/whats-new/${params.year}`} className="underline">
            View all {params.year} updates
          </Link>
        </div>
      </article>
    </main>
  );
}
