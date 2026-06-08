export type KeyboardAvailability =
  | 'free'
  | 'premium'
  | 'seasonal'
  | 'subscription'
  | 'admin';

export type KeyboardMetadata = {
  id: KeyboardId;
  name: string;
  availability: KeyboardAvailability;
};

export const KEYBOARD_IDS = {
  DEFAULT: 'keyboard.default',
  THREE_D: 'keyboard.3d',
} as const;

export type KeyboardId = typeof KEYBOARD_IDS[keyof typeof KEYBOARD_IDS];

export type KeyboardDefinition = {
  meta: KeyboardMetadata;
};

export const KEYBOARDS: Record<KeyboardId, KeyboardDefinition> = {
  [KEYBOARD_IDS.DEFAULT]: {
    meta: {
      id: KEYBOARD_IDS.DEFAULT,
      name: 'Default',
      availability: 'free',
    },
  },
  [KEYBOARD_IDS.THREE_D]: {
    meta: {
      id: KEYBOARD_IDS.THREE_D,
      name: '3D',
      availability: 'free',
    },
  },
};

export function getKeyboardDefinition(keyboardId?: string): KeyboardDefinition {
  if (keyboardId && keyboardId in KEYBOARDS) {
    return KEYBOARDS[keyboardId as KeyboardId];
  }

  return KEYBOARDS[KEYBOARD_IDS.DEFAULT];
}