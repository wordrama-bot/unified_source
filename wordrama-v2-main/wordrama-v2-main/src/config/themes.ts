export type AppearanceTheme = {
  id: string;
  name: string;
  premium: boolean;

  app: {
    background: string;
    panel: string;
    text: string;
  };

  board: {
    emptyCell: string;
    filledCell: string;
  };

  keyboard: {
    key: string;
    keyText: string;
  };
};

export const appearanceThemes: AppearanceTheme[] = [
  {
    id: 'theme.default',
    name: 'Default',
    premium: false,

    app: {
      background: 'bg-background',
      panel: 'bg-background',
      text: 'text-text',
    },

    board: {
      emptyCell:
        'bg-white dark:bg-[#1c1c1c] border-slate-700 dark:border-slate-600',
      filledCell: 'border-black dark:border-slate-100',
    },

    keyboard: {
      key: 'bg-slate-200 dark:bg-slate-600',
      keyText: 'dark:text-white',
    },
  },

  {
    id: 'theme.midnight',
    name: 'Midnight',
    premium: true,

    app: {
      background: 'bg-slate-950',
      panel: 'bg-slate-900',
      text: 'text-slate-100',
    },

    board: {
      emptyCell: 'bg-slate-800 border-slate-500',
      filledCell: 'border-slate-200',
    },

    keyboard: {
      key: 'bg-slate-700 hover:bg-slate-600 active:bg-slate-500',
      keyText: 'text-slate-100',
    },
  },

  {
    id: 'theme.rose-gold',
    name: 'Rose Gold',
    premium: true,

    app: {
      background: 'bg-rose-100',
      panel: 'bg-rose-50',
      text: 'text-rose-950',
    },

    board: {
      emptyCell: 'bg-rose-50 border-rose-400',
      filledCell: 'border-rose-700',
    },

    keyboard: {
      key: 'bg-rose-300 hover:bg-rose-400 active:bg-rose-500',
      keyText: 'text-rose-950',
    },
  },
];

export function getAppearanceTheme(themeId?: string): AppearanceTheme {
  return (
    appearanceThemes.find((theme) => theme.id === themeId) ||
    appearanceThemes[0]
  );
}