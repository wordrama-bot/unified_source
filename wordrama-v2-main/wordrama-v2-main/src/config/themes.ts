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
  entitlementKey?: string;
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
    absentCell?: string;
  };

  keyboard: {
    key: string;
    keyText: string;
    absentKey?: string;
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
  CABIN: 'theme.cabin',
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
      key: 'bg-slate-800 hover:bg-slate-600 active:bg-slate-500 border border-slate-500',
      keyText: 'text-white',
      absentKey: 'bg-slate-950 border border-slate-800 text-slate-500',
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
      background: 'bg-rose-200',
      panel: 'bg-rose-50 text-rose-950 border border-rose-300',
      text: 'text-rose-950',
      gameSurface:
        'bg-rose-100 text-rose-950 border border-rose-300 shadow-2xl',
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
      absentCell: 'bg-rose-200 border-rose-300 text-[#5f2d36]',
    },

    keyboard: {
      key:
        'bg-rose-400 hover:bg-rose-300 active:bg-rose-400 border border-rose-300',
      keyText: 'text-rose-950',
      absentKey:
        'bg-rose-200 hover:bg-rose-500 active:bg-rose-600 border border-rose-500 text-rose-950',
    },

    modal: {
      container: 'bg-white border border-rose-300 text-gray-900',
      title: 'text-white',
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
      glow: 'shadow-[0_0_18px_rgba(251,113,133,0.25)]',
      borderGlow: '',
    },
  },

  {
    meta: {
      id: THEME_IDS.CYBERPUNK,
      name: 'Cyberpunk',
      availability: 'premium',
      entitlementKey: 'THEME:CYBERPUNK',
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
      emptyCell: 'bg-[#35104b] border-fuchsia-400 text-cyan-200 shadow-[0_0_8px_rgba(217,70,239,.5)]',
      filledCell: 'bg-[#61216f] border-cyan-300 text-cyan-100 shadow-[0_0_10px_rgba(34,211,238,.5)]',
      absentCell: 'bg-[#15102b] border-fuchsia-900 text-cyan-100',
    },

    keyboard: {
      key: 'bg-[#4b1465] hover:bg-fuchsia-600 active:bg-pink-500 border border-cyan-300 shadow-[0_0_8px_rgba(34,211,238,.4)]',
      keyText: 'text-cyan-100',
      absentKey: 'bg-[#15102b] border border-fuchsia-900',
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
      entitlementKey: 'THEME:MIAMI_VICE',
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
      absentCell: 'bg-[#241133] border-cyan-400 text-cyan-100',
    },

    keyboard: {
      key: 'bg-[#ff5cb8] hover:bg-pink-400 border border-cyan-300',
      keyText: 'text-white',
      absentKey: 'bg-[#241133] border border-cyan-400',
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
      entitlementKey: 'THEME:GALAXY',
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
      absentCell: 'bg-[#111827] border-violet-500 text-violet-100',
    },

    keyboard: {
      key: 'bg-[#312e81] hover:bg-violet-700 border border-indigo-300',
      keyText: 'text-indigo-100',
      absentKey: 'bg-[#111827] border border-violet-500',
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
      entitlementKey: 'THEME:ICE',
    },

    app: {
      background: 'bg-sky-50',
      panel: 'bg-cyan-50 text-cyan-900 border border-cyan-300',
      text: 'text-cyan-900',
      gameSurface: 'bg-white border-2 border-cyan-300 shadow-2xl shadow-cyan-200/60',
      actionButton: 'bg-cyan-500 hover:bg-cyan-400 text-white border border-cyan-700 shadow-lg',
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
      emptyCell: 'bg-cyan-50 border-cyan-300 text-cyan-900',
      filledCell: 'bg-cyan-200 border-sky-400 text-cyan-900',
      absentCell: 'bg-sky-50 border-cyan-200 text-cyan-900',
    },

    keyboard: {
      key: 'bg-cyan-200 hover:bg-cyan-300 border border-cyan-400',
      keyText: 'text-cyan-900',
      absentKey: 'bg-sky-50 hover:bg-cyan-50 active:bg-cyan-100 border border-cyan-200',
    },

    modal: {
      container: 'bg-cyan-50 border border-cyan-300 text-cyan-950 shadow-2xl',
      title: 'text-cyan-950',
      icon: 'stroke-cyan-700',
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
      default: 'border-cyan-200',
      strong: 'border-cyan-400',
    },

    effects: {
      glow: 'shadow-[0_0_18px_rgba(34,211,238,0.28)]',
      borderGlow: '',
    },
  },

  {
    meta: {
      id: THEME_IDS.LAVA,
      name: 'Lava',
      availability: 'premium',
      entitlementKey: 'THEME:LAVA',
    },

    app: {
      background: 'bg-[#120202]',
      panel: 'bg-[#2b0808] text-orange-100 border border-red-500',
      text: 'text-orange-100',
      gameSurface:
        'bg-[#2b0808] border-2 border-red-500 shadow-2xl shadow-red-950/60',
      actionButton:
        'bg-red-600 hover:bg-red-500 text-white border border-red-900 shadow-lg',
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
      absentCell: 'bg-[#2b0808] border-red-950 text-orange-100',
    },

    keyboard: {
      key: 'bg-[#7f1d1d] hover:bg-red-600 border border-orange-400',
      keyText: 'text-orange-100',
      absentKey:
        'bg-[#2b0808] hover:bg-[#3a0a0a] active:bg-[#4a0d0d] border border-red-950',
    },

    modal: {
      container:
        'bg-[#2b0808] border border-red-500 text-orange-100 shadow-2xl shadow-red-950/70',
      title: 'text-orange-100',
      icon: 'stroke-orange-200',
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
      default: 'border-red-900',
      strong: 'border-orange-500',
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
      entitlementKey: 'THEME:FOREST',
    },

    app: {
      background: 'bg-[#072b14]',
      panel: 'bg-[#12361d] text-green-100 border border-lime-700',
      text: 'text-green-100',
      gameSurface:
        'bg-[#1a5a2c] border-2 border-lime-600 shadow-2xl shadow-green-950/70',
      actionButton:
        'bg-lime-700 hover:bg-lime-600 text-white border border-lime-900 shadow-lg',
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
      emptyCell: 'bg-[#236b35] border-lime-500 text-green-100',
      filledCell: 'bg-[#2d7d46] border-lime-400 text-white',
      absentCell: 'bg-[#12361d] border-green-950 text-green-100',
    },

    keyboard: {
      key: 'bg-[#2d7d46] hover:bg-[#379854] border border-lime-500',
      keyText: 'text-green-100',
      absentKey:
        'bg-[#12361d] hover:bg-[#184724] active:bg-[#236b35] border border-green-950',
    },

    modal: {
      container:
        'bg-[#12361d] border border-lime-600 text-green-100 shadow-2xl shadow-black/60',
      title: 'text-green-100',
      icon: 'stroke-lime-300',
    },

    feedback: {
      success: 'text-green-400',
      warning: 'text-yellow-400',
      error: 'text-red-400',
      info: 'text-sky-400',
    },

    overlay: {
      backdrop: 'bg-black/60',
    },

    border: {
      default: 'border-green-800',
      strong: 'border-lime-600',
    },

    effects: {
      glow: 'shadow-[0_0_14px_rgba(132,204,22,.20)]',
      borderGlow: '',
    },
  },

  {
    meta: {
      id: THEME_IDS.CABIN,
      name: 'Cabin',
      availability: 'premium',
      entitlementKey: 'THEME:CABIN',
    },

    app: {
      background: 'bg-[#15100a]',
      panel: 'bg-[#2a1b10] text-amber-100 border border-amber-800',
      text: 'text-amber-100',
      gameSurface:
        'bg-[#2a211b] border-2 border-amber-700 shadow-2xl shadow-black/70',
      actionButton:
        'bg-[#9a5f12] hover:bg-[#b7791f] text-amber-50 border border-black shadow-lg',
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
      emptyCell: 'bg-[#4a3f35] border-amber-700 text-amber-100',
      filledCell: 'bg-[#5c4030] border-amber-500 text-white',
      absentCell: 'bg-[#2a211b] border-[#7a4b12] text-amber-100',
    },

    keyboard: {
      key: 'bg-[#5c4030] hover:bg-[#6f4a33] border border-amber-700',
      keyText: 'text-amber-100',
      absentKey:
        'bg-[#2a211b] hover:bg-[#3a2b21] active:bg-[#4a3f35] border border-[#7a4b12]',
    },

    modal: {
      container:
        'bg-[#2a211b] border border-amber-700 text-amber-100 shadow-2xl shadow-black/70',
      title: 'text-amber-100',
      icon: 'stroke-amber-300',
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
      default: 'border-amber-800',
      strong: 'border-amber-600',
    },

    effects: {
      glow: 'shadow-[0_0_14px_rgba(180,83,9,0.25)]',
      borderGlow: '',
    },
  },

  {
    meta: {
      id: THEME_IDS.PIRATE,
      name: 'Pirate',
      availability: 'premium',
      entitlementKey: 'THEME:PIRATE',
    },

    app: {
      background:
        'bg-[radial-gradient(circle_at_center,#16120b_0%,#070707_55%,#020202_100%)]',
      panel: 'bg-[#080807] text-[#f8e7b0] border border-[#8a6a2f]',
      text: 'text-[#f8e7b0]',
      gameSurface:
        'bg-[#11100d] border-2 border-[#8a6a2f] shadow-2xl shadow-black/80',
      actionButton:
        'bg-[#11100d] hover:bg-[#1b1710] active:bg-[#080807] text-[#f8e7b0] border border-[#c8a84f] shadow-[0_0_12px_rgba(200,168,79,0.25)]',
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
        'bg-[#11100d] border-[#8a6a2f] text-[#f8e7b0] shadow-[inset_0_0_8px_rgba(0,0,0,0.55)]',
      filledCell:
        'bg-[#181713] border-[#c8a84f] text-white shadow-[inset_0_0_10px_rgba(0,0,0,0.65)]',
      absentCell:
        'bg-[#0a0a08] border-[#4f4328] text-[#8f8568] shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]',
    },

    keyboard: {
      key:
        'bg-[#181720] hover:bg-[#232016] active:bg-[#2d281a] border border-[#8a6a2f] ring-1 ring-[#c8a84f]/20',
      keyText: 'text-[#f8e7b0]',
      absentKey:
        'bg-[#0a0a08] hover:bg-[#11100d] active:bg-[#181713] border border-[#4f4328] text-[#8f8568] ring-1 ring-[#c8a84f]/20',
    },

    modal: {
      container:
        'bg-[#080807] border border-[#c8a84f] text-[#f8e7b0] shadow-2xl shadow-black/80',
      title: 'text-[#f8e7b0]',
      icon: 'stroke-[#f8e7b0]',
    },

    feedback: {
      success: 'text-green-500',
      warning: 'text-[#facc15]',
      error: 'text-red-500',
      info: 'text-sky-400',
    },

    overlay: {
      backdrop: 'bg-black/75',
    },

    border: {
      default: 'border-[#8a6a2f]',
      strong: 'border-[#c8a84f]',
    },

    effects: {
      glow: 'shadow-[0_0_22px_rgba(200,168,79,0.22)]',
      borderGlow: '',
    },
  },

  {
    meta: {
      id: THEME_IDS.ARCADE,
      name: 'Arcade',
      availability: 'premium',
      entitlementKey: 'THEME:ARCADE',
    },

    app: {
      background:
        'bg-[radial-gradient(circle_at_center,#10183a_0%,#050713_55%,#02030a_100%)]',
      panel: 'bg-[#070a18] text-lime-200 border border-blue-500',
      text: 'text-lime-200',
      gameSurface:
        'bg-[#0b1028] border-2 border-blue-500 shadow-2xl shadow-blue-950/70',
      actionButton:
        'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-lime-100 border border-lime-400 shadow-[0_0_14px_rgba(59,130,246,0.35)]',
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
        'bg-[#111936] border-blue-500 text-lime-200 shadow-[inset_0_0_8px_rgba(0,0,0,0.55)]',
      filledCell:
        'bg-[#172554] border-lime-400 text-white shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]',
      absentCell:
        'bg-[#070a18] border-[#1e293b] text-slate-400 shadow-[inset_0_0_8px_rgba(0,0,0,0.75)]',
    },

    keyboard: {
      key:
        'bg-[#172554] hover:bg-blue-800 active:bg-blue-700 border border-blue-500 ring-1 ring-cyan-400/40',
      keyText: 'text-lime-200',
      absentKey:
        'bg-[#070a18] hover:bg-[#0b1028] active:bg-[#111936] border border-[#1e293b] text-slate-400 ring-1 ring-cyan-400/40',
    },

    modal: {
      container:
        'bg-[#070a18] border border-blue-500 text-lime-200 shadow-2xl shadow-blue-950/70',
      title: 'text-lime-200',
      icon: 'stroke-lime-300',
    },

    feedback: {
      success: 'text-lime-400',
      warning: 'text-yellow-400',
      error: 'text-red-500',
      info: 'text-blue-400',
    },

    overlay: {
      backdrop: 'bg-black/70',
    },

    border: {
      default: 'border-blue-700',
      strong: 'border-lime-400',
    },

    effects: {
      glow: 'shadow-[0_0_18px_rgba(59,130,246,0.35)]',
      borderGlow: '',
    },
  },

  {
    meta: {
      id: THEME_IDS.SYNTHWAVE,
      name: 'Synthwave',
      availability: 'premium',
      entitlementKey: 'THEME:SYNTHWAVE',
    },

    app: {
      background:
        'bg-[radial-gradient(circle_at_center,#2b0b45_0%,#140320_50%,#07010d_100%)]',
      panel: 'bg-[#1b0b33] text-cyan-100 border border-pink-400',
      text: 'text-cyan-100',
      gameSurface:
        'bg-[#241044] border-2 border-pink-400 shadow-2xl shadow-pink-950/60',
      actionButton:
        'bg-pink-500 hover:bg-pink-400 active:bg-pink-600 text-white border border-pink-800 shadow-[0_0_14px_rgba(236,72,153,0.35)]',
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
        'bg-[#35195e] border-pink-400 text-cyan-100 shadow-[inset_0_0_8px_rgba(0,0,0,0.45)]',
      filledCell:
        'bg-[#6d28d9] border-cyan-300 text-white shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]',
      absentCell:
        'bg-[#241044] border-pink-700 text-cyan-100 shadow-[inset_0_0_8px_rgba(0,0,0,0.65)]',
    },

    keyboard: {
      key:
        'bg-[#6d28d9] hover:bg-fuchsia-500 active:bg-fuchsia-600 border border-cyan-300 ring-1 ring-pink-400/40',
      keyText: 'text-cyan-100',
      absentKey:
        'bg-[#241044] hover:bg-[#35195e] active:bg-[#4c1d95] border border-pink-700 text-cyan-100 ring-1 ring-pink-400/40',
    },

    modal: {
      container:
        'bg-[#1b0b33] border border-pink-400 text-cyan-100 shadow-2xl shadow-pink-950/60',
      title: 'text-cyan-100',
      icon: 'stroke-pink-300',
    },

    feedback: {
      success: 'text-green-500',
      warning: 'text-yellow-400',
      error: 'text-red-500',
      info: 'text-cyan-400',
    },

    overlay: {
      backdrop: 'bg-black/70',
    },

    border: {
      default: 'border-pink-700',
      strong: 'border-cyan-300',
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