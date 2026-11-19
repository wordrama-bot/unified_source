"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, RotateCcw } from "lucide-react";
import { academyLessons } from "@/data/academy-lessons";

const STORAGE_KEY = "wordrama-academy-completed-v1";
const PROGRESS_EVENT = "wordrama-academy-progress";

function readCompletedLessons(): string[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];

    if (!Array.isArray(parsed)) return [];

    const validSlugs = new Set(
      academyLessons.map((lesson) => lesson.slug)
    );

    return parsed.filter(
      (slug): slug is string =>
        typeof slug === "string" && validSlugs.has(slug)
    );
  } catch {
    return [];
  }
}

function useAcademyProgress() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function refresh() {
      setCompleted(readCompletedLessons());
    }

    refresh();
    setLoaded(true);

    window.addEventListener("storage", refresh);
    window.addEventListener(PROGRESS_EVENT, refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(PROGRESS_EVENT, refresh);
    };
  }, []);

  function setLessonComplete(slug: string, isComplete: boolean) {
    if (!academyLessons.some((lesson) => lesson.slug === slug)) {
      return;
    }

    try {
      const previous = readCompletedLessons();
      const next = isComplete
        ? [...new Set([...previous, slug])]
        : previous.filter((item) => item !== slug);

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(next)
      );

      setCompleted(next);
      window.dispatchEvent(new Event(PROGRESS_EVENT));
    } catch {
      // Browser storage may be unavailable.
    }
  }

  return { completed, loaded, setLessonComplete };
}

export function AcademyProgressSummary() {
  const { completed, loaded } = useAcademyProgress();
  const total = academyLessons.length;
  const count = completed.length;
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <section
      aria-label="Academy progress"
      className="mb-10 rounded-base border-2 border-border p-6 dark:border-darkBorder"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl font-heading">
          Your Academy Progress
        </h2>

        <span className="font-semibold" aria-live="polite">
          {loaded ? `${count} of ${total}` : "Loading"}
        </span>
      </div>

      <div
        role="progressbar"
        aria-label="Lessons completed"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={count}
        className="h-4 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
      >
        <div
          className="h-full rounded-full bg-green-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-3 text-sm">
        {loaded && count === total
          ? "Congratulations! You've completed every Academy lesson."
          : "Complete lessons at your own pace. Your progress is saved in this browser."}
      </p>
    </section>
  );
}

export function LessonCompletionButton({
  slug,
}: {
  slug: string;
}) {
  const { completed, loaded, setLessonComplete } =
    useAcademyProgress();

  const isComplete = completed.includes(slug);

  return (
    <button
      type="button"
      disabled={!loaded}
      onClick={() => setLessonComplete(slug, !isComplete)}
      aria-pressed={isComplete}
      className="mt-8 flex w-full items-center justify-center gap-3 rounded-base border-2 border-border bg-bg px-6 py-4 font-semibold shadow-light transition-all hover:shadow-none disabled:opacity-50 dark:border-darkBorder dark:bg-darkBg dark:shadow-dark dark:hover:shadow-none"
    >
      {isComplete ? (
        <>
          <CheckCircle2 size={22} aria-hidden="true" />
          Lesson Completed! Click to Undo
        </>
      ) : (
        <>
          <Circle size={22} aria-hidden="true" />
          Mark Lesson as Complete
        </>
      )}
    </button>
  );
}

export function AcademyLessonStatus({
  slug,
}: {
  slug: string;
}) {
  const { completed, loaded } = useAcademyProgress();

  if (!loaded || !completed.includes(slug)) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-green-600 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
      <CheckCircle2 size={14} aria-hidden="true" />
      Completed
    </span>
  );
}

export function AcademyLessonAction({
  slug,
}: {
  slug: string;
}) {
  const { completed, loaded } = useAcademyProgress();

  return (
    <span>
      {loaded && completed.includes(slug)
        ? "Review Lesson"
        : "Start Lesson"}
    </span>
  );
}
