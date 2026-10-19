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
  EMPIRE: 'theme.empire',
  MATRIX: 'theme.matrix',
  HAUNTED_HOLLOW: 'theme.haunted-hollow',
  PUMPKIN_FRIGHT: 'theme.pumpkin-fright',
  HARVEST_HEARTH: 'theme.harvest-hearth',
  EVERGREEN_NOEL: 'theme.evergreen-noel',
  WINTER_WONDERLAND: 'theme.winter-wonderland',
  FESTIVAL_OF_LIGHTS: 'theme.festival-of-lights',
  UMOJA: 'theme.umoja',
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
  {
    meta: {
      id: THEME_IDS.EMPIRE,
      name: 'Empire',
      availability: 'premium',
      entitlementKey: 'THEME:EMPIRE',
    },

    app: {
      background: 'bg-neutral-950',
      panel: 'bg-[#080808] text-white border border-red-700',
      text: 'text-white',
      gameSurface: 'bg-[#070707] text-white border border-red-700 shadow-2xl shadow-red-950/70',
      actionButton: 'bg-red-900 hover:bg-red-800 active:bg-red-700 text-white border border-red-500 shadow-lg shadow-red-950/70',
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
      emptyCell: 'bg-[#090909] border-red-600 text-white',
      filledCell: 'bg-[#1a0606] border-red-400 text-white',
    },

    keyboard: {
      key: 'bg-red-900 hover:bg-red-800 active:bg-red-700 border border-red-500',
      keyText: 'text-white',
      absentKey: 'bg-[#120606] border border-red-900 text-red-300/60',
    },

    modal: {
      container: 'bg-[#090909] border border-red-600 text-white shadow-2xl shadow-red-950/80',
      title: 'text-white',
      icon: 'stroke-red-400',
    },

    feedback: {
      success: 'text-green-500',
      warning: 'text-amber-500',
      error: 'text-red-500',
      info: 'text-red-300',
    },

    overlay: {
      backdrop: 'bg-black/70',
    },

    border: {
      default: 'border-red-700',
      strong: 'border-red-500',
    },

    effects: {
      glow: 'shadow-[0_0_28px_rgba(239,68,68,0.35)]',
      borderGlow: 'shadow-[0_0_10px_rgba(220,38,38,0.35)]',
    },
  },
  {
    meta: {
      id: THEME_IDS.MATRIX,
      name: 'Matrix',
      availability: 'premium',
      entitlementKey: 'THEME:MATRIX',
    },

    app: {
      background: 'bg-black',
      panel: 'bg-black text-green-300 border border-green-700',
      text: 'text-green-300',
      gameSurface: 'bg-black text-green-300 border border-green-500 shadow-2xl shadow-green-900/50',
      actionButton: 'bg-green-900 hover:bg-green-950 active:bg-green-900 text-green-300 border border-green-500 shadow-lg shadow-green-950/70',
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
      emptyCell: 'bg-black border-green-700 text-green-300',
      filledCell: 'bg-green-950 border-green-400 text-green-100',
    },

    keyboard: {
      key: 'bg-green-900 hover:bg-green-950 active:bg-green-800 border border-green-500',
      keyText: 'text-green-200',
      absentKey: 'bg-black border border-neutral-800 text-green-900',
    },

    modal: {
      container:
        'bg-[#020402] border border-green-500 text-green-200 shadow-2xl shadow-green-950/70',
      title: 'text-green-100',
      icon: 'stroke-green-400',
    },

    feedback: {
      success: 'text-green-400',
      warning: 'text-lime-300',
      error: 'text-red-500',
      info: 'text-emerald-300',
    },

    overlay: {
      backdrop: 'bg-black/80',
    },

    border: {
      default: 'border-green-600',
      strong: 'border-green-400',
    },

    effects: {
      glow: 'shadow-[0_0_18px_rgba(34,197,94,0.35)]',
      borderGlow: 'shadow-[0_0_8px_rgba(34,197,94,0.30)]',
    },
  },
  {
    meta: {
      id: THEME_IDS.HAUNTED_HOLLOW,
      name: 'Haunted Hollow',
      availability: 'premium',
      entitlementKey: 'THEME:HAUNTED_HOLLOW',
    },

    app: {
      background: 'bg-[#100D16]',
      panel:
        'bg-[#201827] text-[#F0E5D5] border border-[#74667F]',
      text: 'text-[#F0E5D5]',
      gameSurface:
        'bg-[#18131F] text-[#F0E5D5] border border-[#A99BB8] shadow-[0_0_24px_3px_rgba(185,104,53,0.35)]',
      actionButton:
        'bg-[#382B42] hover:bg-[#4D3A59] active:bg-[#201827] text-[#F0E5D5] border border-[#B96835] shadow-[0_0_10px_rgba(185,104,53,0.20)]',
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
        'bg-[#16111D] border-[#887794] text-[#F0E5D5]',
      filledCell:
        'bg-[#382B42] border-[#C2B1CD] text-[#F0E5D5]',
      absentCell:
        'bg-[#17141C] border-[#332B3B] text-[#82778C]',
    },

    keyboard: {
      key:
        'bg-[#382B42] hover:bg-[#4D3A59] active:bg-[#5B4768] border border-[#74667F]',
      keyText: 'text-[#F0E5D5]',
      absentKey:
        'bg-[#17141C] border border-[#332B3B] text-[#82778C]',
    },

    modal: {
      container:
        'bg-[#201827] border border-[#A99BB8] text-[#F0E5D5] shadow-2xl shadow-black/80',
      title: 'text-[#F0E5D5]',
      icon: 'stroke-[#D2EDD8]',
    },

    feedback: {
      success: 'text-[#9ED8B4]',
      warning: 'text-[#E6C275]',
      error: 'text-[#E89A9A]',
      info: 'text-[#C2B1CD]',
    },

    overlay: {
      backdrop: 'bg-black/80',
    },

    border: {
      default: 'border-[#74667F]',
      strong: 'border-[#C2B1CD]',
    },

    effects: {
      glow: 'shadow-[0_0_22px_rgba(169,155,184,0.18)]',
      borderGlow:
        'shadow-[0_0_12px_rgba(210,237,216,0.20)]',
    },
  },
  {
    meta: {
      id: THEME_IDS.PUMPKIN_FRIGHT,
      name: 'Pumpkin Fright',
      availability: 'premium',
      entitlementKey: 'THEME:PUMPKIN_FRIGHT',
    },

    app: {
      background: 'bg-[#120B08]',
      panel: 'bg-[#22130D] text-[#F6E8D2] border border-[#C96B2C]',
      text: 'text-[#F6E8D2]',
      gameSurface:
        'bg-[#1A110D] text-[#F6E8D2] border border-[#E28A3B] shadow-[0_0_30px_4px_rgba(226,138,59,0.35)]',
      actionButton:
        'bg-[#8A4A1F] hover:bg-[#A85A28] active:bg-[#6B3514] text-[#FFF4E8] border border-[#F2A65A] shadow-[0_0_10px_rgba(226,138,59,0.28)]',
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
        'bg-[#1B120E] border-[#E28A3B] text-[#F6E8D2]',
      filledCell:
        'bg-[#3B2418] border-[#F2A65A] text-[#FFF4E8]',
      absentCell:
        'bg-[#15100D] border-[#3B2A20] text-[#8F7768]',
    },

    keyboard: {
      key:
        'bg-[#8A4A1F] hover:bg-[#A85A28] active:bg-[#6B3514] border border-[#C96B2C]',
      keyText: 'text-[#FFF4E8]',
      absentKey:
        'bg-[#15100D] border border-[#3B2A20] text-[#8F7768]',
    },

    modal: {
      container:
        'bg-[#22130D] border border-[#E28A3B] text-[#F6E8D2] shadow-2xl shadow-black/80',
      title: 'text-[#FFF4E8]',
      icon: 'stroke-[#F2A65A]',
    },

    feedback: {
      success: 'text-[#8BE28B]',
      warning: 'text-[#F6C453]',
      error: 'text-[#F28B82]',
      info: 'text-[#F2A65A]',
    },

    overlay: {
      backdrop: 'bg-black/80',
    },

    border: {
      default: 'border-[#C96B2C]',
      strong: 'border-[#F2A65A]',
    },

    effects: {
      glow: 'shadow-[0_0_22px_rgba(226,138,59,0.20)]',
      borderGlow: 'shadow-[0_0_12px_rgba(242,166,90,0.25)]',
    },
  },
  {
    meta: {
      id: THEME_IDS.HARVEST_HEARTH,
      name: 'Harvest Hearth',
      availability: 'premium',
      entitlementKey: 'THEME:HARVEST_HEARTH',
    },

    app: {
      background: 'bg-[#24191E]',
      panel:
        'bg-[#43262E] text-[#F0DDBB] border border-[#B78B49]',
      text: 'text-[#F0DDBB]',
      gameSurface:
        'bg-[#43262E] text-[#F0DDBB] border border-[#B78B49] shadow-[0_0_28px_4px_rgba(183,139,73,0.30)]',
      actionButton:
        'bg-[#854234] hover:bg-[#9B5240] active:bg-[#6D332B] text-[#FFF0DB] border border-[#D0A663] shadow-lg shadow-black/40',
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
        'bg-[#2C1D24] border-[#B78B49] text-[#F0DDBB]',
      filledCell:
        'bg-[#854234] border-[#D0A663] text-[#FFF0DB]',
      absentCell:
        'bg-[#271D22] border-[#51363B] text-[#8C7375]',
    },

    keyboard: {
      key:
        'bg-[#854234] hover:bg-[#9B5240] active:bg-[#6D332B] border border-[#B78B49]',
      keyText: 'text-[#FFF0DB]',
      absentKey:
        'bg-[#271D22] border border-[#51363B] text-[#8C7375]',
    },

    modal: {
      container:
        'bg-[#43262E] border border-[#B78B49] text-[#F0DDBB] shadow-2xl shadow-black/70',
      title: 'text-[#F0DDBB]',
      icon: 'stroke-[#D0A663]',
    },

    feedback: {
      success: 'text-[#A5D6A7]',
      warning: 'text-[#F1CE83]',
      error: 'text-[#ECA09C]',
      info: 'text-[#D2AF70]',
    },

    overlay: {
      backdrop: 'bg-black/70',
    },

    border: {
      default: 'border-[#A78447]',
      strong: 'border-[#D2AF70]',
    },

    effects: {
      glow: 'shadow-[0_0_22px_rgba(210,175,112,0.26)]',
      borderGlow: 'shadow-[0_0_12px_rgba(210,175,112,0.22)]',
    },
  },
  {
    meta: {
      id: THEME_IDS.EVERGREEN_NOEL,
      name: 'Evergreen Noel',
      availability: 'premium',
      entitlementKey: 'THEME:EVERGREEN_NOEL',
    },

    app: {
      background: 'bg-[#091C1A]',
      panel:
        'bg-[#12352F] text-[#FFF0D6] border border-[#D8B76C]',
      text: 'text-[#FFF0D6]',
      gameSurface:
        'bg-[#102B27] text-[#FFF0D6] border border-[#D8B76C] shadow-[0_0_28px_4px_rgba(216,183,108,0.32)]',
      actionButton:
        'bg-[#8C293D] hover:bg-[#A6344A] active:bg-[#6E1F30] text-[#FFF0D6] border border-[#D8B76C] shadow-[0_0_12px_rgba(216,183,108,0.25)]',
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
        'bg-[#0B231F] border-[#D8B76C] text-[#FFF0D6]',
      filledCell:
        'bg-[#245348] border-[#E8CC91] text-[#FFF0D6]',
      absentCell:
        'bg-[#0B1D1A] border-[#284038] text-[#758C80]',
    },

    keyboard: {
      key:
        'bg-[#8C293D] hover:bg-[#A6344A] active:bg-[#6E1F30] border border-[#D8B76C]',
      keyText: 'text-[#FFF0D6]',
      absentKey:
        'bg-[#0B1D1A] border border-[#284038] text-[#758C80]',
    },

    modal: {
      container:
        'bg-[#12352F] border border-[#D8B76C] text-[#FFF0D6] shadow-2xl shadow-black/70',
      title: 'text-[#FFF0D6]',
      icon: 'stroke-[#D8B76C]',
    },

    feedback: {
      success: 'text-[#A5DBB6]',
      warning: 'text-[#F1CE83]',
      error: 'text-[#F0A0A0]',
      info: 'text-[#E8CC91]',
    },

    overlay: {
      backdrop: 'bg-black/75',
    },

    border: {
      default: 'border-[#8C293D]',
      strong: 'border-[#D8B76C]',
    },

    effects: {
      glow:
        'shadow-[0_0_22px_rgba(216,183,108,0.28)]',
      borderGlow:
        'shadow-[0_0_12px_rgba(216,183,108,0.25)]',
    },
  },
  {
    meta: {
      id: THEME_IDS.WINTER_WONDERLAND,
      name: 'Winter Wonderland',
      availability: 'premium',
      entitlementKey: 'THEME:WINTER_WONDERLAND',
    },

    app: {
      background: 'bg-[#0D1520]',
      panel:
        'bg-[#182434] text-[#DFEAF0] border border-[#728DA1]',
      text: 'text-[#DFEAF0]',
      gameSurface:
        'bg-[#182434] text-[#DFEAF0] border border-[#94ADBE] shadow-[0_0_28px_4px_rgba(148,173,190,0.30)]',
      actionButton:
        'bg-[#435B70] hover:bg-[#526D82] active:bg-[#293B4D] text-[#DFEAF0] border border-[#94ADBE] shadow-[0_0_12px_rgba(148,173,190,0.22)]',
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
        'bg-[#101C29] border-[#94ADBE] text-[#DFEAF0]',
      filledCell:
        'bg-[#435B70] border-[#BDD0DC] text-[#F1F6F9]',
      absentCell:
        'bg-[#111A24] border-[#2A3A49] text-[#708496]',
    },

    keyboard: {
      key:
        'bg-[#435B70] hover:bg-[#526D82] active:bg-[#344A5D] border border-[#728DA1]',
      keyText: 'text-[#DFEAF0]',
      absentKey:
        'bg-[#111A24] border border-[#2A3A49] text-[#708496]',
    },

    modal: {
      container:
        'bg-[#182434] border border-[#94ADBE] text-[#DFEAF0] shadow-2xl shadow-black/75',
      title: 'text-[#DFEAF0]',
      icon: 'stroke-[#BDD0DC]',
    },

    feedback: {
      success: 'text-[#A6D5BB]',
      warning: 'text-[#E8C780]',
      error: 'text-[#E9A5AA]',
      info: 'text-[#BDD0DC]',
    },

    overlay: {
      backdrop: 'bg-black/80',
    },

    border: {
      default: 'border-[#728DA1]',
      strong: 'border-[#BDD0DC]',
    },

    effects: {
      glow:
        'shadow-[0_0_22px_rgba(148,173,190,0.26)]',
      borderGlow:
        'shadow-[0_0_12px_rgba(189,208,220,0.24)]',
    },
  },
  {
    meta: {
      id: THEME_IDS.FESTIVAL_OF_LIGHTS,
      name: 'Festival of Lights',
      availability: 'premium',
      entitlementKey: 'THEME:FESTIVAL_OF_LIGHTS',
    },

    app: {
      background: 'bg-[#090F29]',
      panel:
        'bg-[#14275A] text-[#F5F1E9] border border-[#C7D3E5]',
      text: 'text-[#F5F1E9]',
      gameSurface:
        'bg-[#101F47] text-[#F5F1E9] border border-[#C7D3E5] shadow-[0_0_28px_4px_rgba(244,210,94,0.34)]',
      actionButton:
        'bg-[#24448B] hover:bg-[#3156A1] active:bg-[#1B3470] text-[#F5F1E9] border border-[#F4D25E] shadow-[0_0_12px_rgba(244,210,94,0.24)]',
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
        'bg-[#0D1940] border-[#C7D3E5] text-[#F5F1E9]',
      filledCell:
        'bg-[#24448B] border-[#E1E8F2] text-[#F5F1E9]',
      absentCell:
        'bg-[#0C1633] border-[#30446B] text-[#7788AA]',
    },

    keyboard: {
      key:
        'bg-[#24448B] hover:bg-[#3156A1] active:bg-[#1B3470] border border-[#718AB8]',
      keyText: 'text-[#F5F1E9]',
      absentKey:
        'bg-[#0C1633] border border-[#30446B] text-[#7788AA]',
    },

    modal: {
      container:
        'bg-[#14275A] border border-[#C7D3E5] text-[#F5F1E9] shadow-2xl shadow-black/75',
      title: 'text-[#F5F1E9]',
      icon: 'stroke-[#F4D25E]',
    },

    feedback: {
      success: 'text-[#A6DDBF]',
      warning: 'text-[#F4D25E]',
      error: 'text-[#EAA2AB]',
      info: 'text-[#C7D3E5]',
    },

    overlay: {
      backdrop: 'bg-black/80',
    },

    border: {
      default: 'border-[#718AB8]',
      strong: 'border-[#C7D3E5]',
    },

    effects: {
      glow:
        'shadow-[0_0_22px_rgba(244,210,94,0.28)]',
      borderGlow:
        'shadow-[0_0_12px_rgba(199,211,229,0.28)]',
    },
  },
  {
    meta: {
      id: THEME_IDS.UMOJA,
      name: 'Umoja',
      availability: 'premium',
      entitlementKey: 'THEME:UMOJA',
    },

    app: {
      background: 'bg-[#101311]',
      panel:
        'bg-[#222522] text-[#F4E8CE] border border-[#D1A64D]',
      text: 'text-[#F4E8CE]',
      gameSurface:
        'bg-[#1B1F1C] text-[#F4E8CE] border border-[#D1A64D] shadow-[0_0_28px_4px_rgba(209,166,77,0.30)]',
      actionButton:
        'bg-[#9B3035] hover:bg-[#B43C42] active:bg-[#792429] text-[#F4E8CE] border border-[#D1A64D] shadow-[0_0_12px_rgba(209,166,77,0.20)]',
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
        'bg-[#111713] border-[#39845C] text-[#F4E8CE]',
      filledCell:
        'bg-[#176B46] border-[#D1A64D] text-[#F4E8CE]',
      absentCell:
        'bg-[#141815] border-[#343C35] text-[#79847A]',
    },

    keyboard: {
      key:
        'bg-[#9B3035] hover:bg-[#B43C42] active:bg-[#792429] border border-[#D1A64D]',
      keyText: 'text-[#F4E8CE]',
      absentKey:
        'bg-[#141815] border border-[#343C35] text-[#79847A]',
    },

    modal: {
      container:
        'bg-[#222522] border border-[#D1A64D] text-[#F4E8CE] shadow-2xl shadow-black/75',
      title: 'text-[#F4E8CE]',
      icon: 'stroke-[#D1A64D]',
    },

    feedback: {
      success: 'text-[#8FD8A9]',
      warning: 'text-[#E9C576]',
      error: 'text-[#EFA0A0]',
      info: 'text-[#D1A64D]',
    },

    overlay: {
      backdrop: 'bg-black/80',
    },

    border: {
      default: 'border-[#176B46]',
      strong: 'border-[#D1A64D]',
    },

    effects: {
      glow: 'shadow-[0_0_22px_rgba(209,166,77,0.25)]',
      borderGlow: 'shadow-[0_0_12px_rgba(209,166,77,0.22)]',
    },
  },
];

export function getAppearanceTheme(themeId?: string): AppearanceTheme {
  return (
    appearanceThemes.find((theme) => theme.meta.id === themeId) ||
    appearanceThemes[0]
  );
}