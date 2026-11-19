export type UpdateCategory =
  | "NEW_FEATURE"
  | "IMPROVEMENT"
  | "BUG_FIX"
  | "ANNOUNCEMENT";

export interface SiteUpdate {
  slug: string;
  date: string;
  title: string;
  summary: string;
  category: UpdateCategory;
  content: string[];
  link?: {
    label: string;
    href: string;
  };
}

export const siteUpdates: SiteUpdate[] = [
  {
    slug: "welcome-to-whats-new",
    date: "2026-11-19",
    title: "Welcome to What's New!",
    summary:
      "Your new home for Wordrama announcements, feature releases, and improvements.",
    category: "ANNOUNCEMENT",
    content: [
      "Welcome to What's New, the place to discover everything changing across Wordrama.",
      "We'll share new game modes, marketplace additions, feature improvements, and other announcements here.",
      "Check back whenever you want to see what's changed since your last visit."
    ]
  }
];

export function getSortedUpdates(): SiteUpdate[] {
  return [...siteUpdates].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function getUpdateYears(): number[] {
  return [...new Set(
    siteUpdates.map(update => Number(update.date.slice(0, 4)))
  )].sort((a, b) => b - a);
}

export function getUpdatesByYear(year: number): SiteUpdate[] {
  return getSortedUpdates().filter(
    update => Number(update.date.slice(0, 4)) === year
  );
}

export function getUpdateBySlug(
  slug: string
): SiteUpdate | undefined {
  return siteUpdates.find(update => update.slug === slug);
}
