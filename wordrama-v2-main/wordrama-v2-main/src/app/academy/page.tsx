import Link from "next/link";
import {
  BookOpen,
  Coins,
  ShoppingBag,
  Palette,
  Users,
  Trophy,
  Crown,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

import AcademyFeatureLink from "@/components/academy/academy-feature-link";
import { academyLessons } from "@/data/academy-lessons";
import {
  AcademyProgressSummary,
  AcademyLessonStatus,
  AcademyLessonAction,
} from "@/components/academy/academy-progress";

export const metadata = {
  title: "Wordrama Academy | Learn Everything About Wordrama",
  description:
    "Learn to play Wordrama, earn coins, explore the Marketplace, join teams, unlock achievements, and discover subscription benefits.",
};

const lessonIcons = [
  BookOpen,
  Coins,
  ShoppingBag,
  Palette,
  Users,
  Trophy,
  Crown,
];

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-bg px-5 py-12 text-text dark:bg-darkBg dark:text-darkText">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-semibold underline">
          Back to Wordrama
        </Link>

        <header className="mx-auto mb-12 mt-10 max-w-3xl text-center">
          <GraduationCap
            size={56}
            className="mx-auto mb-5"
            aria-hidden="true"
          />

          <h1 className="text-4xl font-heading md:text-5xl">
            Wordrama Academy
          </h1>

          <p className="mt-5 text-lg">
            There's more to Wordrama than guessing words!
            Discover everything you can do, from earning
            coins and unlocking rewards to competing
            with teams and personalizing your experience.
          </p>

          <div className="mt-6 inline-flex rounded-base border-2 border-border px-5 py-3 font-semibold dark:border-darkBorder">
            {academyLessons.length} Lessons to Explore
          </div>
        </header>

        <AcademyProgressSummary />

        <section aria-labelledby="lessons-heading">
          <h2
            id="lessons-heading"
            className="mb-6 text-2xl font-heading"
          >
            Choose a Lesson
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {academyLessons.map((lesson, index) => {
              const Icon = lessonIcons[index] || BookOpen;

              return (
                <Link
                  key={lesson.slug}
                  href={`/academy/${lesson.slug}`}
                  className="group flex flex-col rounded-base border-2 border-border bg-bg p-6 text-text shadow-light transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 dark:border-darkBorder dark:bg-darkBg dark:text-darkText dark:shadow-dark dark:hover:shadow-none"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <Icon size={36} aria-hidden="true" />

                    <span className="text-sm opacity-70">
                      Lesson {index + 1} of {academyLessons.length}
                    </span>
                  </div>

                  <AcademyLessonStatus slug={lesson.slug} />

                  <h3 className="mt-3 text-2xl font-heading">
                    {lesson.title}
                  </h3>

                  <p className="mt-3 flex-1">
                    {lesson.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4 dark:border-darkBorder">
                    <span className="text-sm opacity-70">
                      About {lesson.duration}
                    </span>

                    <span className="flex items-center gap-2 font-semibold">
                      <AcademyLessonAction slug={lesson.slug} />
                      <ArrowRight size={18} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-14 rounded-base border-2 border-border p-8 text-center dark:border-darkBorder">
          <h2 className="text-2xl font-heading">
            Ready to Put Your Skills to Work?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl">
            You can return to the Academy whenever you
            want to explore another feature or refresh
            your knowledge.
          </p>

          <AcademyFeatureLink
            href="/games/wordrama"
            className="mt-6 inline-flex rounded-base border-2 border-border px-6 py-3 font-semibold hover:underline dark:border-darkBorder"
          >
            Play Wordrama
          </AcademyFeatureLink>
        </section>
      </div>
    </main>
  );
}
