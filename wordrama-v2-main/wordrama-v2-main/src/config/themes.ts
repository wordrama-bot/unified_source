export type ThemeAvailability =
  | 'free'
  | 'premium'
  | 'seasonal'
  | 'subscription'
  | 'admin';

export type ThemeMetadata = {
  id: ThemeId;
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

  effects: {
    glow: string;
    borderGlow: string;
  }
};

export const THEME_IDS = {
  DEFAULT: 'theme.default',
  MIDNIGHT: 'theme.midnight',
  ROSE_GOLD: 'theme.rose-gold',
  CYBERPUNK: 'theme.cyberpunk',
  MIAMI_VICE: 'theme.miami-vice',
  GALAXY: 'theme.galaxy',
  ICE: 'theme.ice',
  LAVA: 'theme.lava',
  FOREST: 'theme.forest',
  PIRATE: 'theme.pirate',
  ARCADE: 'theme.arcade',
  SYNTHWAVE: 'theme.synthwave',
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
      id: THEME_IDS.DEFAULT,
      name: 'Default',
      availability: 'free',
    },

    app: {
      background: 'bg-bg dark:bg-darkBg',
      panel: 'bg-bg dark:bg-darkBg text-text dark:text-darkText',
      text: 'text-text dark:text-darkText',
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
      container: 'bg-bg dark:bg-darkBg text-text dark:text-darkText',
      title: 'text-text dark:text-darkText',
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

    effects: {
      glow: '',
      borderGlow: '',
    },
  },

  {
    meta: {
      id: THEME_IDS.MIDNIGHT,
      name: 'Midnight',
      availability: 'free',
    },

    app: {
      background: 'bg-slate-950',
      panel: 'bg-slate-950 text-white border border-slate-800',
      text: 'text-white',
      gameSurface:
        'bg-slate-950 text-white border border-sky-800 shadow-2xl shadow-sky-950/50',
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

    effects: {
      glow: 'shadow-[0_0_12px_rgba(14,165,233,0.25)]',
      borderGlow: '',
    },
  },

  {
    meta: {
      id: THEME_IDS.ROSE_GOLD,
      name: 'Rose Gold',
      availability: 'free',
    },

    app: {
      background: 'bg-rose-100',
      panel: 'bg-rose-50',
      text: 'text-rose-950',
      gameSurface:
        'bg-rose-50 text-rose-950 border border-rose-300 shadow-2xl',
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

    effects: {
      glow: 'shadow-[0_0_15px_rgba(251,113,133,0.3)]',
      borderGlow: '',
    },
  },

  {
    meta: {
      id: THEME_IDS.CYBERPUNK,
      name: 'Cyberpunk',
      availability: 'premium',
    },

    app: {
      background: 'bg-[#090414]',
      panel:
        'bg-[#150c2f] text-cyan-100 border-2 border-fuchsia-400 shadow-[0_0_25px_rgba(217,70,239,.5)]',
      text: 'text-cyan-100',
      gameSurface:
        'bg-[#1a1038] border-2 border-fuchsia-400 shadow-[0_0_30px_rgba(217,70,239,0.45)]',
      actionButton:
        'bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-500 hover:to-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.6)]',
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
        'bg-[#35104b] border-fuchsia-400 text-cyan-200 shadow-[0_0_8px_rgba(217,70,239,.5)]',

      filledCell:
        'bg-[#61216f] border-cyan-300 text-cyan-100 shadow-[0_0_10px_rgba(34,211,238,.5)]',
    },

    keyboard: {
      key:
        'bg-[#4b1465] hover:bg-fuchsia-600 active:bg-pink-500 border border-cyan-300 shadow-[0_0_8px_rgba(34,211,238,.4)]',

      keyText: 'text-cyan-100',
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

    effects: {
      glow: 'shadow-[0_0_12px_rgba(217,70,239,.6)]',
      borderGlow: 'ring-1 ring-fuchsia-400/70',
    }
  },

  {
    meta: {
      id: THEME_IDS.MIAMI_VICE,
      name: 'Miami Vice',
      availability: 'premium',
    },

    app: {
      background: 'bg-[#1b0f33]',
      panel: 'bg-[#2a1552] text-pink-100 border border-cyan-300',
      text: 'text-pink-100',
      gameSurface: 'bg-[#28134d] border-2 border-cyan-300',
      actionButton: 'bg-cyan-400 hover:bg-cyan-300 text-[#2a1552]',
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
      emptyCell: 'bg-[#4b1d77] border-cyan-300 text-pink-100',
      filledCell: 'bg-[#ff5cb8] border-cyan-200 text-white',
    },

    keyboard: {
      key: 'bg-[#ff5cb8] hover:bg-pink-400 border border-cyan-300',
      keyText: 'text-white',
    },


    modal: {
      container: 'bg-bg dark:bg-darkBg text-text dark:text-darkText',
      title: 'text-text dark:text-darkText',
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

    effects: {
      glow: 'shadow-[0_0_14px_rgba(34,211,238,.45)]',
      borderGlow: 'ring-1 ring-cyan-300/70',
    },
  },
  
  {
    meta: {
      id: THEME_IDS.GALAXY,
      name: 'Galaxy',
      availability: 'premium',
    },

    app: {
      background: 'bg-[#030712]',
      panel: 'bg-[#111827] text-indigo-100 border border-violet-500',
      text: 'text-indigo-100',
      gameSurface: 'bg-[#111827] border-2 border-violet-500',
      actionButton: 'bg-violet-600 hover:bg-violet-500 text-white',
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
      emptyCell: 'bg-[#1e1b4b] border-violet-400 text-indigo-100',
      filledCell: 'bg-[#4338ca] border-indigo-300 text-white',
    },

    keyboard: {
      key: 'bg-[#312e81] hover:bg-violet-700 border border-indigo-300',
      keyText: 'text-indigo-100',
    },

    modal: {
      container: 'bg-bg dark:bg-darkBg text-text dark:text-darkText',
      title: 'text-text dark:text-darkText',
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

    effects: {
      glow: 'shadow-[0_0_16px_rgba(139,92,246,.45)]',
      borderGlow: '',
    },
  },

  {
    meta: {
      id: THEME_IDS.ICE,
      name: 'Ice',
      availability: 'premium',
    },

    app: {
      background: 'bg-sky-50',
      panel: 'bg-cyan-50 text-cyan-900 border border-cyan-300',
      text: 'text-cyan-900',
      gameSurface: 'bg-white border-2 border-cyan-300',
      actionButton: 'bg-cyan-500 hover:bg-cyan-400 text-white',
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
      emptyCell: 'bg-cyan-100 border-cyan-300 text-cyan-900',
      filledCell: 'bg-cyan-200 border-sky-400 text-cyan-900',
    },

    keyboard: {
      key: 'bg-cyan-200 hover:bg-cyan-300 border border-cyan-400',
      keyText: 'text-cyan-900',
    },

    modal: {
      container: 'bg-bg dark:bg-darkBg text-text dark:text-darkText',
      title: 'text-text dark:text-darkText',
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

    effects: {
      glow: 'shadow-[0_0_10px_rgba(34,211,238,.25)]',
      borderGlow: '',
    },
  },

  {
    meta: {
      id: THEME_IDS.LAVA,
      name: 'Lava',
      availability: 'premium',
    },

    app: {
      background: 'bg-[#120202]',
      panel: 'bg-[#2b0808] text-orange-100 border border-red-500',
      text: 'text-orange-100',
      gameSurface: 'bg-[#2b0808] border-2 border-red-500',
      actionButton: 'bg-red-600 hover:bg-red-500 text-white',
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
      emptyCell: 'bg-[#4a0d0d] border-orange-500 text-orange-100',
      filledCell: 'bg-[#7f1d1d] border-yellow-400 text-white',
    },

    keyboard: {
      key: 'bg-[#7f1d1d] hover:bg-red-600 border border-orange-400',
      keyText: 'text-orange-100',
    },

    modal: {
      container: 'bg-bg dark:bg-darkBg text-text dark:text-darkText',
      title: 'text-text dark:text-darkText',
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

    effects: {
      glow: 'shadow-[0_0_16px_rgba(239,68,68,.4)]',
      borderGlow: '',
    },
  },

  {
    meta: {
      id: THEME_IDS.FOREST,
      name: 'Forest',
      availability: 'premium',
    },

    app: {
      background: 'bg-green-950',
      panel: 'bg-green-900 text-green-100 border border-lime-400',
      text: 'text-green-100',
      gameSurface: 'bg-green-900 border-2 border-lime-400',
      actionButton: 'bg-lime-500 hover:bg-lime-400 text-green-950',
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
      emptyCell: 'bg-green-800 border-lime-400 text-green-100',
      filledCell: 'bg-green-700 border-lime-300 text-white',
    },

    keyboard: {
      key: 'bg-green-700 hover:bg-green-600 border border-lime-300',
      keyText: 'text-green-100',
    },

    modal: {
      container: 'bg-bg dark:bg-darkBg text-text dark:text-darkText',
      title: 'text-text dark:text-darkText',
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

    effects: {
      glow: 'shadow-[0_0_12px_rgba(132,204,22,.3)]',
      borderGlow: '',
    },
  },

  {
    meta: {
      id: THEME_IDS.PIRATE,
      name: 'Pirate',
      availability: 'premium',
    },

    app: {
      background: 'bg-stone-900',
      panel: 'bg-stone-800 text-amber-100 border border-yellow-700',
      text: 'text-amber-100',
      gameSurface: 'bg-stone-800 border-2 border-yellow-700',
      actionButton: 'bg-yellow-700 hover:bg-yellow-600 text-black',
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
      emptyCell: 'bg-stone-700 border-yellow-700 text-amber-100',
      filledCell: 'bg-stone-600 border-amber-500 text-white',
    },

    keyboard: {
      key: 'bg-stone-600 hover:bg-stone-500 border border-yellow-700',
      keyText: 'text-amber-100',
    },

    modal: {
      container: 'bg-bg dark:bg-darkBg text-text dark:text-darkText',
      title: 'text-text dark:text-darkText',
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

    effects: {
      glow: '',
      borderGlow: '',
    },
  },

  {
    meta: {
      id: THEME_IDS.ARCADE,
      name: 'Arcade',
      availability: 'premium',
    },

    app: {
      background: 'bg-black',
      panel: 'bg-[#111111] text-lime-300 border border-fuchsia-500',
      text: 'text-lime-300',
      gameSurface: 'bg-[#151515] border-2 border-fuchsia-500',
      actionButton: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white',
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
      emptyCell: 'bg-[#1f1f1f] border-fuchsia-500 text-lime-300',
      filledCell: 'bg-[#393939] border-lime-300 text-white',
    },

    keyboard: {
      key: 'bg-[#393939] hover:bg-fuchsia-700 border border-lime-400',
      keyText: 'text-lime-300',
    },

    modal: {
      container: 'bg-bg dark:bg-darkBg text-text dark:text-darkText',
      title: 'text-text dark:text-darkText',
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

    effects: {
      glow: 'shadow-[0_0_16px_rgba(217,70,239,.45)]',
      borderGlow: '',
    },
  },

  {
    meta: {
      id: THEME_IDS.SYNTHWAVE,
      name: 'Synthwave',
      availability: 'premium',
    },

    app: {
      background: 'bg-[#140320]',
      panel: 'bg-[#22103d] text-cyan-100 border border-pink-400',
      text: 'text-cyan-100',
      gameSurface: 'bg-[#22103d] border-2 border-pink-400',
      actionButton: 'bg-pink-500 hover:bg-pink-400 text-white',
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
      emptyCell: 'bg-[#35195e] border-pink-400 text-cyan-100',
      filledCell: 'bg-[#6d28d9] border-cyan-300 text-white',
    },

    keyboard: {
      key: 'bg-[#6d28d9] hover:bg-fuchsia-500 border border-cyan-300',
      keyText: 'text-cyan-100',
    },

    modal: {
      container: 'bg-bg dark:bg-darkBg text-text dark:text-darkText',
      title: 'text-text dark:text-darkText',
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

    effects: {
      glow: 'shadow-[0_0_18px_rgba(236,72,153,.45)]',
      borderGlow: 'ring-1 ring-pink-400/60',
    },
  },
];

export function getAppearanceTheme(themeId?: string): AppearanceTheme {
  return (
    appearanceThemes.find((theme) => theme.meta.id === themeId) ||
    appearanceThemes[0]
  );
}