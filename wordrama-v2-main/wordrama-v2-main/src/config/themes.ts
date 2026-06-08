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
      background: 'bg-[#05080d]',
      panel: 'bg-[#0d1117] border border-[#30363d]',
      text: 'text-[#f0f6fc]',
      gameSurface:
        'bg-[#0b1018]/90 border border-[#30363d] shadow-2xl shadow-black/40',
      actionButton:
        'bg-[#161b22] hover:bg-[#21262d] active:bg-[#30363d] text-[#f0f6fc] border border-[#3d444d] shadow-lg shadow-black/30',
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
      emptyCell: 'bg-[#05080d] border-[#3d444d] text-[#f0f6fc]',
      filledCell: 'border-[#8b949e] text-[#f0f6fc]',
    },

    keyboard: {
      key: 'bg-[#0d1117] hover:bg-[#161b22] active:bg-[#21262d] border border-[#30363d]',
      keyText: 'text-[#f0f6fc]',
    },

    modal: {
      container:
        'bg-[#0d1117] border border-[#30363d] text-[#f0f6fc] shadow-2xl shadow-black/40',
      title: 'text-[#f0f6fc]',
      icon: 'stroke-[#f0f6fc]',
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