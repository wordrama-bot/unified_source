export interface AcademySection {
  heading: string;
  paragraphs: string[];
  points?: string[];
}

export interface AcademyLesson {
  slug: string;
  title: string;
  description: string;
  duration: string;
  sections: AcademySection[];
  action: {
    label: string;
    href: string;
  };
}

export const academyLessons: AcademyLesson[] = [
  {
    slug: "getting-started",
    title: "Getting Started with Wordrama",
    description: "Learn the rules, understand letter colors, and discover different ways to play.",
    duration: "3 min",
    sections: [
      {
        heading: "How Wordrama Works",
        paragraphs: [
          "Wordrama is a word-guessing game where your goal is to discover the hidden word using as few guesses as possible.",
          "Enter a valid word of the required length. After submitting your guess, the game reveals clues that help you narrow down the answer."
        ],
        points: [
          "Green means the letter is correct and in the correct position.",
          "Yellow means the letter appears in the word but belongs somewhere else.",
          "Gray means the letter does not appear in the answer, subject to the usual handling of repeated letters."
        ]
      },
      {
        heading: "Daily vs. Infinite",
        paragraphs: [
          "Daily mode gives players a shared daily challenge. It's a great way to compete with friends and compare your results.",
          "Infinite mode lets you keep playing without waiting for tomorrow's puzzle."
        ]
      },
      {
        heading: "Different Word Lengths",
        paragraphs: [
          "Wordrama offers word packs with different lengths and challenges. Some are included with your account or subscription, while others may require a separate unlock.",
          "You can discover available packs and their current access requirements in the Marketplace."
        ]
      }
    ],
    action: {
      label: "Start Playing Wordrama",
      href: "/games/wordrama"
    }
  },
  {
    slug: "coins-xp-rewards",
    title: "Coins, XP & Rewards",
    description: "Discover how your gameplay contributes to your progress and what your coins can unlock.",
    duration: "4 min",
    sections: [
      {
        heading: "Two Ways to Progress",
        paragraphs: [
          "Wordrama rewards your activity with experience points (XP) and coins. They serve different purposes.",
          "XP contributes to your player level and long-term progression. Coins are an in-game currency that can be spent on eligible Marketplace items."
        ]
      },
      {
        heading: "How Do You Earn Coins?",
        paragraphs: [
          "Successfully solving puzzles can earn rewards, and some achievements can award additional coins or XP.",
          "The rewards available depend on the activity and current game rules."
        ],
        points: [
          "Play Wordrama and solve eligible puzzles.",
          "Explore achievements and their available rewards.",
          "Check your coin balance in the site navigation.",
          "Visit the Marketplace to see which items accept coins."
        ]
      },
      {
        heading: "Levels and Prestige",
        paragraphs: [
          "As you accumulate XP, your player level increases. Prestige tracks your longer-term progression beyond individual levels.",
          "Your profile and the progression guide provide more information about how these systems work."
        ]
      }
    ],
    action: {
      label: "Explore XP, Levels & Prestige",
      href: "/progression"
    }
  },
  {
    slug: "marketplace",
    title: "Explore the Marketplace",
    description: "Find new word packs, customize your game, and learn the difference between coins and cash purchases.",
    duration: "4 min",
    sections: [
      {
        heading: "What Is the Marketplace?",
        paragraphs: [
          "The Wordrama Marketplace lets you discover additional word packs, premium themes, and other items that personalize your experience.",
          "You don't have to purchase anything to browse. Exploring the Marketplace is a great way to see everything Wordrama offers."
        ]
      },
      {
        heading: "Understanding Purchase Options",
        paragraphs: [
          "Not every Marketplace item has the same requirements. Some items accept coins, some offer cash purchases through Stripe, and some are unlocked by a subscription.",
          "Certain special items are sold separately and aren't included in PLUS or CREATOR."
        ],
        points: [
          "Coin purchases use your available in-game currency.",
          "Cash purchases use a separate checkout process.",
          "Subscription unlocks depend on your active plan.",
          "Some products are unavailable, discontinued, or not currently purchasable."
        ]
      },
      {
        heading: "Word Packs and Themes",
        paragraphs: [
          "Word packs expand the kinds of puzzles you can play, including additional word lengths and specialized challenges.",
          "Premium themes change the appearance of your Wordrama experience. Check each product's current availability and ownership status before making a purchase."
        ]
      },
      {
        heading: "A Smart Way to Start",
        paragraphs: [
          "Visit the Marketplace, browse available items, and see whether you already own or have access to anything interesting.",
          "Look at your coin balance and compare it with eligible items. You may already have enough coins to unlock something you want."
        ]
      }
    ],
    action: {
      label: "Visit the Marketplace",
      href: "/marketplace"
    }
  },
  {
    slug: "customization",
    title: "Make Wordrama Your Own",
    description: "Explore your player profile, appearance settings, and personalization options.",
    duration: "3 min",
    sections: [
      {
        heading: "Your Wordrama Identity",
        paragraphs: [
          "Your profile represents you in the Wordrama community. It brings together your player identity, activity, and progression.",
          "Explore your profile settings to discover the available customization options."
        ]
      },
      {
        heading: "Themes and Appearance",
        paragraphs: [
          "Wordrama offers different visual themes to personalize the gameplay experience.",
          "Some appearance options are included with subscriptions, while other items may be purchased separately. Availability depends on the particular item."
        ]
      },
      {
        heading: "Game Settings",
        paragraphs: [
          "Your game settings allow you to configure supported gameplay and display preferences.",
          "It's worth exploring these settings to find the setup that works best for you."
        ]
      }
    ],
    action: {
      label: "Explore Game Settings",
      href: "/settings/game"
    }
  },
  {
    slug: "friends-teams-custom-games",
    title: "Friends, Teams & Custom Games",
    description: "Connect with other players, compete together, and create challenges.",
    duration: "4 min",
    sections: [
      {
        heading: "Connect with Friends",
        paragraphs: [
          "Wordrama isn't just about solving puzzles by yourself. The friends system helps you connect with other members of the community.",
          "Explore the Friends page to find players and manage your connections."
        ]
      },
      {
        heading: "Join a Team",
        paragraphs: [
          "Teams let players participate in communities and compete together on the team leaderboard.",
          "Browse existing teams, discover communities, and explore your available membership options."
        ]
      },
      {
        heading: "Create Your Own Team",
        paragraphs: [
          "Team creation is a CREATOR feature. Eligible subscribers can create a team and build a community around their games or audience.",
          "Joining multiple teams is a feature available through eligible subscription access."
        ]
      },
      {
        heading: "Create Custom Challenges",
        paragraphs: [
          "Wordrama also supports custom word challenges. Create a puzzle, choose a word, optionally provide a hint, and share the generated join code.",
          "Custom games are a fun way to challenge friends or interact with your community."
        ]
      }
    ],
    action: {
      label: "Explore Wordrama Teams",
      href: "/teams"
    }
  },
  {
    slug: "achievements-leaderboards",
    title: "Achievements & Leaderboards",
    description: "Discover streaks, rankings, achievements, and long-term challenges.",
    duration: "3 min",
    sections: [
      {
        heading: "Achievements",
        paragraphs: [
          "Wordrama achievements celebrate milestones such as solving puzzles, developing streaks, connecting with friends, and reaching other goals.",
          "Some achievements provide XP or coin rewards, giving you additional reasons to explore the platform."
        ]
      },
      {
        heading: "Track Your Progress",
        paragraphs: [
          "The Achievements page shows available challenges and their status, helping you see what you've already accomplished and what comes next.",
          "Look for achievements that match your favorite ways to play."
        ]
      },
      {
        heading: "Compete on Leaderboards",
        paragraphs: [
          "Leaderboards let you compare your performance with other Wordrama players.",
          "Explore the available daily, weekly, monthly, and yearly rankings, along with team competition."
        ]
      },
      {
        heading: "Build Your Streak",
        paragraphs: [
          "Consistent daily gameplay can help you build your streak and develop your skills.",
          "Your leaderboard position, level, achievements, and streaks each represent a different part of your Wordrama journey."
        ]
      }
    ],
    action: {
      label: "Explore Your Achievements",
      href: "/achievements"
    }
  },
  {
    slug: "plus-creator",
    title: "Discover PLUS & CREATOR",
    description: "Compare subscription benefits and learn what each membership can unlock.",
    duration: "4 min",
    sections: [
      {
        heading: "Free Wordrama",
        paragraphs: [
          "You don't need a paid subscription to enjoy Wordrama. Registered free players can access core gameplay, build progress, earn eligible rewards, and participate in the community.",
          "Optional upgrades expand your access to additional content and customization."
        ]
      },
      {
        heading: "Wordrama PLUS",
        paragraphs: [
          "PLUS is intended for players who want more ways to play and personalize their experience.",
          "Eligible benefits include premium word packs, supported customization features, premium themes, and multiple team membership."
        ]
      },
      {
        heading: "Wordrama CREATOR",
        paragraphs: [
          "CREATOR includes PLUS benefits and adds capabilities for streamers, community leaders, and players who want to create their own teams.",
          "Team creation and eligible avatar customization features are among its additional benefits."
        ]
      },
      {
        heading: "Subscriptions vs. Individual Purchases",
        paragraphs: [
          "Not everything sold in the Marketplace is included with a subscription. Some specialty or seasonal content requires a separate purchase.",
          "For example, the five-letter Unhinged adult pack is configured as a separate cash-only purchase, not a PLUS or CREATOR entitlement.",
          "Always check the subscription page and individual Marketplace listings for the most current availability, prices, and benefits."
        ]
      }
    ],
    action: {
      label: "Compare Subscription Plans",
      href: "/subscribe"
    }
  }
];

export function getAcademyLesson(slug: string) {
  return academyLessons.find((lesson) => lesson.slug === slug);
}
