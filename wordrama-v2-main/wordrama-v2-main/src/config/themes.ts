export type AppearanceTheme = {
  id: string;
  name: string;
  premium: boolean;

  app: {
    background: string;
    panel: string;
    text: string;
    gameSurface: string;
    actionButton: string;
  };

  board: {
    emptyCell: string;
    filledCell: string;
  };

  keyboard: {
    key: string;
    keyText: string;
  };

  modal: {
    container: string;
    title: string;
    icon: string;
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
      gameSurface: '',
      actionButton: '',
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

    modal: {
      container: '',
      title: '',
      icon: '',
    },
  },

  {
    id: 'theme.midnight',
    name: 'Midnight',
    premium: true,

    app: {
      background: 'bg-[#0d1117]',
      panel: 'bg-[#161b22] border border-[#30363d]',
      text: 'text-[#f0f6fc]',
      gameSurface: 'bg-slate-950/70 border border-slate-700 shadow-2xl',
      actionButton:
        'bg-[#1f2937] hover:bg-[#374151] text-[#f8fafc] border border-[#4b5563] shadow-lg',
    },

    board: {
      emptyCell: 'bg-[#0d1117] border-[#566274]',
      filledCell: 'border-[#c9d1d9]',
    },

    keyboard: {
      key: 'bg-[#111827] hover:bg-[#1f2937] active:bg-[#374151] border border-[#374151]',
      keyText: 'text-[#f8fafc]',
    },

    modal: {
      container: 'bg-slate-900 border border-slate-700 text-slate-100',
      title: 'text-slate-100',
      icon: 'stroke-slate-100',
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
      gameSurface: 'border border-rose-300 shadow-2xl',
      actionButton:
        'bg-rose-200 hover:bg-rose-300 text-rose-950 border border-rose-300 shadow-lg',
    },

    board: {
      emptyCell: 'bg-rose-50 border-rose-400',
      filledCell: 'border-rose-700',
    },

    keyboard: {
      key: 'bg-rose-300 hover:bg-rose-400 active:bg-rose-500',
      keyText: 'text-rose-950',
    },

    modal: {
      container: 'bg-white border border-rose-300 text-gray-900',
      title: '',
      icon: 'stroke-rose-400',
    },
  },
];

export function getAppearanceTheme(themeId?: string): AppearanceTheme {
  return (
    appearanceThemes.find((theme) => theme.id === themeId) ||
    appearanceThemes[0]
  );
}