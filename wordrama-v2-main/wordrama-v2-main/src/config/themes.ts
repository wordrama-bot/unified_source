export type ThemeAvailability =
  | 'free'
  | 'premium'
  | 'seasonal'
  | 'subscription'
  | 'admin';

export type ThemeMetadata = {
  id: string;
  name: string;
  availability: ThemeAvailability;
};

export type AppearanceTheme = {
  meta: ThemeMetadata;

  app: {
    background: string;
    panel: string;
    text: string;
    gameSurface: string;
    actionButton: string;
  };

  surface: {
    page: string;
    card: string;
    elevated: string;
  };

  button: {
    primary: string;
    secondary: string;
    disabled: string;
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

  feedback: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };

  overlay: {
    backdrop: string;
  };

  border: {
    default: string;
    strong: string;
  };
};

export const THEME_IDS = {
  DEFAULT: 'theme.default',
  MIDNIGHT: 'theme.midnight',
  ROSE_GOLD: 'theme.rose-gold',
} as const;

export type ThemeId =
  (typeof THEME_IDS)[keyof typeof THEME_IDS];

export type OwnedTheme = {
  themeId: ThemeId;
};

export type EquippedTheme = {
  themeId: ThemeId;
};

export const appearanceThemes: AppearanceTheme[] = [
  {
    meta: {
      id: 'theme.default',
      name: 'Default',
      availability: 'free',
    },

    app: {
      background: 'bg-background',
      panel: 'bg-background',
      text: 'text-text',
      gameSurface: '',
      actionButton: '',
    },

    surface: {
      page: '',
      card: '',
      elevated: '',
    },

    button: {
      primary: '',
      secondary: '',
      disabled: '',
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

    feedback: {
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500',
      info: 'text-blue-500',
    },

    overlay: {
      backdrop: 'bg-black/60',
    },

    border: {
      default: 'border-slate-300',
      strong: 'border-slate-600',
    },
  },

  {
    meta: {
      id: 'theme.midnight',
      name: 'Midnight',
      availability: 'free',
    },

    app: {
      background: 'bg-slate-950',
      panel: 'bg-slate-950 border border-slate-800',
      text: 'text-white',
      gameSurface:
        'bg-slate-950 border border-sky-800 shadow-2xl shadow-sky-950/50',
      actionButton:
        'bg-slate-950 hover:bg-slate-800 active:bg-slate-700 text-white border border-white/60 shadow-lg shadow-black/60',
    },

    surface: {
      page: '',
      card: '',
      elevated: '',
    },

    button: {
      primary: '',
      secondary: '',
      disabled: '',
    },
    
    board: {
      emptyCell: 'bg-slate-950 border-sky-500 text-white',
      filledCell: 'bg-slate-800 border-sky-300 text-white',
    },

    keyboard: {
      key: 'bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700',
      keyText: 'text-white',
    },

    modal: {
      container:
        'bg-[#080c12] border border-white/30 text-white shadow-2xl shadow-black/70',
      title: 'text-white',
      icon: 'stroke-white',
    },

    feedback: {
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500',
      info: 'text-blue-500',
    },

    overlay: {
      backdrop: 'bg-black/60',
    },

    border: {
      default: 'border-slate-300',
      strong: 'border-slate-600',
    },
  },

  {
    meta: {
      id: 'theme.rose-gold',
      name: 'Rose Gold',
      availability: 'free',
    },

    app: {
      background: 'bg-rose-100',
      panel: 'bg-rose-50',
      text: 'text-rose-950',
      gameSurface: 'border border-rose-300 shadow-2xl',
      actionButton:
        'bg-rose-200 hover:bg-rose-300 text-rose-950 border border-rose-300 shadow-lg',
    },

    surface: {
      page: '',
      card: '',
      elevated: '',
    },

    button: {
      primary: '',
      secondary: '',
      disabled: '',
    },
    
    board: {
      emptyCell: 'bg-[#fff7ed] border-[#d6a58f] text-[#5f2d36]',
      filledCell: 'bg-[#ffe4e6] border-[#b76e79] text-[#5f2d36]',
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

    feedback: {
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500',
      info: 'text-blue-500',
    },

    overlay: {
      backdrop: 'bg-black/60',
    },

    border: {
      default: 'border-slate-300',
      strong: 'border-slate-600',
    },
  },
];

export function getAppearanceTheme(themeId?: string): AppearanceTheme {
  return (
    appearanceThemes.find((theme) => theme.meta.id === themeId) ||
    appearanceThemes[0]
  );
}