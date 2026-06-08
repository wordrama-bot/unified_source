export type KeyboardStyleAvailability =
  | 'free'
  | 'premium'
  | 'seasonal'
  | 'subscription'
  | 'admin';

export const KEYBOARD_STYLE_IDS = {
  FLAT: 'keyboard-style.flat',
  RAISED: 'keyboard-style.raised',
} as const;

export type KeyboardStyleId =
  typeof KEYBOARD_STYLE_IDS[keyof typeof KEYBOARD_STYLE_IDS];

export type KeyboardStyleMetadata = {
  id: KeyboardStyleId;
  name: string;
  availability: KeyboardStyleAvailability;
};

export type KeyboardStyleDefinition = {
  meta: KeyboardStyleMetadata;
};

export const KEYBOARD_STYLES: Record<KeyboardStyleId, KeyboardStyleDefinition> = {
  [KEYBOARD_STYLE_IDS.FLAT]: {
    meta: {
      id: KEYBOARD_STYLE_IDS.FLAT,
      name: 'Flat',
      availability: 'free',
    },
  },
  [KEYBOARD_STYLE_IDS.RAISED]: {
    meta: {
      id: KEYBOARD_STYLE_IDS.RAISED,
      name: 'Raised',
      availability: 'free',
    },
  },
};

export function getKeyboardStyleDefinition(
  keyboardStyleId?: string,
): KeyboardStyleDefinition {
  if (keyboardStyleId && keyboardStyleId in KEYBOARD_STYLES) {
    return KEYBOARD_STYLES[keyboardStyleId as KeyboardStyleId];
  }

  return KEYBOARD_STYLES[KEYBOARD_STYLE_IDS.FLAT];
}