import { LessonCompletionButton } from "@/components/academy/academy-progress";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";

import AcademyFeatureLink from "@/components/academy/academy-feature-link";
import {
  academyLessons,
  getAcademyLesson,
} from "@/data/academy-lessons";

export function generateStaticParams() {
  return academyLessons.map((lesson) => ({
    slug: lesson.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const lesson = getAcademyLesson(params.slug);

  return {
    title: lesson
      ? `${lesson.title} | Wordrama Academy`
      : "Wordrama Academy",
    description: lesson?.description || "Explore Wordrama Academy.",
  };
}

export default function AcademyLessonPage({
  params,
}: {
  params: { slug: string };
}) {
  const lesson = getAcademyLesson(params.slug);

  if (!lesson) notFound();

  const index = academyLessons.findIndex(
    (item) => item.slug === lesson.slug
  );

  const previous = index > 0
    ? academyLessons[index - 1]
    : null;

  const next = index < academyLessons.length - 1
    ? academyLessons[index + 1]
    : null;

  return (
    <main className="min-h-screen bg-bg px-5 py-12 text-text dark:bg-darkBg dark:text-darkText">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/academy"
          className="inline-flex items-center gap-2 text-sm font-semibold underline"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Academy
        </Link>

        <header className="mb-10 mt-10">
          <GraduationCap
            size={40}
            className="mb-5"
            aria-hidden="true"
          />

          <p className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-70">
            Lesson {index + 1} of {academyLessons.length}
            {" | "}About {lesson.duration}
          </p>

          <h1 className="text-4xl font-heading md:text-5xl">
            {lesson.title}
          </h1>

          <p className="mt-5 text-lg">
            {lesson.description}
          </p>
        </header>

        <div className="space-y-10">
          {lesson.sections.map((section, sectionIndex) => (
            <section key={sectionIndex}>
              <h2 className="mb-4 text-2xl font-heading">
                {section.heading}
              </h2>

              <div className="space-y-4 leading-relaxed">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {section.points && (
                <ul className="ml-6 mt-5 list-disc space-y-3">
                  {section.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-base border-2 border-border p-6 shadow-light dark:border-darkBorder dark:shadow-dark">
          <h2 className="text-2xl font-heading">
            Try It Yourself!
          </h2>

          <p className="mt-3">
            Ready to explore what you've learned?
            Visit this feature directly in Wordrama.
          </p>

          <AcademyFeatureLink
            href={lesson.action.href}
            className="mt-6 inline-flex items-center gap-2 rounded-base border-2 border-border px-5 py-3 font-semibold hover:underline dark:border-darkBorder"
          >
            {lesson.action.label}
            <ArrowRight size={18} aria-hidden="true" />
          </AcademyFeatureLink>
        </section>

        <LessonCompletionButton slug={lesson.slug} />

        <nav
          aria-label="Academy lesson navigation"
          className="mt-12 grid grid-cols-1 gap-4 border-t border-border pt-8 dark:border-darkBorder sm:grid-cols-2"
        >
          <div>
            {previous && (
              <Link
                href={`/academy/${previous.slug}`}
                className="block rounded-base border-2 border-border p-4 hover:underline dark:border-darkBorder"
              >
                <span className="text-sm opacity-70">
                  Previous Lesson
                </span>
                <p className="mt-2 font-semibold">
                  {previous.title}
                </p>
              </Link>
            )}
          </div>

          <div>
            {next ? (
              <Link
                href={`/academy/${next.slug}`}
                className="block rounded-base border-2 border-border p-4 hover:underline dark:border-darkBorder"
              >
                <span className="text-sm opacity-70">
                  Next Lesson
                </span>
                <p className="mt-2 font-semibold">
                  {next.title}
                </p>
              </Link>
            ) : (
              <Link
                href="/academy"
                className="block rounded-base border-2 border-border p-4 hover:underline dark:border-darkBorder"
              >
                <span className="text-sm opacity-70">
                  Finished Exploring?
                </span>
                <p className="mt-2 font-semibold">
                  Return to Wordrama Academy
                </p>
              </Link>
            )}
          </div>
        </nav>
      </article>
    </main>
  );
}
