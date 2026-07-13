export interface AvatarStyle {
  key: string;
  name: string;
  image: string;
}

export const AVATAR_STYLES: Record<string, AvatarStyle> = {
  'FRAME:BRONZE': {
    key: 'FRAME:BRONZE',
    name: 'Bronze Champion',
    image: '/images/avatars/frames/bronze.svg',
  },

  'FRAME:SILVER': {
    key: 'FRAME:SILVER',
    name: 'Silver Champion',
    image: '/images/avatars/frames/silver.svg',
  },

  'FRAME:GOLD': {
    key: 'FRAME:GOLD',
    name: 'Gold Champion',
    image: '/images/avatars/frames/gold.svg',
  },

  'FRAME:PLUS': {
    key: 'FRAME:PLUS',
    name: 'Wordrama Plus',
    image: '/images/avatars/frames/plus.svg',
  },

  'FRAME:CREATOR': {
    key: 'FRAME:CREATOR',
    name: 'Creator',
    image: '/images/avatars/frames/creator.svg',
  },

  'FRAME:OWNER': {
    key: 'FRAME:OWNER',
    name: 'Owner',
    image: '/images/avatars/frames/owner.svg',
  },
};
