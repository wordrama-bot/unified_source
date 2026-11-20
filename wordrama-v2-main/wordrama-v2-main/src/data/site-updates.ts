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
    slug: "introducing-wordrama-academy",
    date: "2026-11-20",
    title: "Introducing Wordrama Academy & Gameplay Improvements",
    summary:
      "Explore seven new Academy lessons, in-game help, improved Marketplace discovery, and a refreshed subscription experience.",
    category: "NEW_FEATURE",
    content: [
      "We're excited to introduce Wordrama Academy, a new learning destination designed to help players get the most out of Wordrama. Whether you're just getting started or looking to explore more advanced features, Academy offers seven interactive lessons covering gameplay, progression, rewards, word packs, themes, subscriptions, and more.",

      "Alongside Academy, we've launched What's New, a dedicated home for Wordrama announcements, new features, improvements, and bug fixes. You can now find out what's changed without having to leave the website or search through community announcements.",

      "We've also improved the gameplay experience with a new Help menu, more convenient navigation, and better discovery of locked word packs and themes. Players can now explore additional content directly from Game Settings, with helpful links to the Marketplace and subscription options.",

      "Several quality-of-life fixes round out this release, including improved toolbar scrolling behavior, better Game History keyboard focus, and refined streak spacing. We've also refreshed our subscription page to provide clearer descriptions of Free, PLUS, and CREATOR benefits.",

      "Thank you for continuing to support Wordrama and sharing your ideas. Your feedback helps shape what we build next!"
    ],
    link: {
      label: "Explore Wordrama Academy",
      href: "/academy"
    }
  },
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
