export type AvatarStylePlacement = 'overlay' | 'accessory';

export interface AvatarStyle {
  key: string;
  name: string;
  image: string;
  placement: AvatarStylePlacement;
  accessoryScale?: number;
  accessoryTopOffset?: number;
}

export const AVATAR_STYLES: Record<string, AvatarStyle> = {
  'FRAME:BRONZE': {
    key: 'FRAME:BRONZE',
    name: 'Bronze Champion',
    image: '/images/avatars/frames/bronze.svg',
    placement: 'overlay',
  },

  'FRAME:SILVER': {
    key: 'FRAME:SILVER',
    name: 'Silver Champion',
    image: '/images/avatars/frames/silver.svg',
    placement: 'overlay',
  },

  'FRAME:GOLD': {
    key: 'FRAME:GOLD',
    name: 'Gold Champion',
    image: '/images/avatars/frames/gold.svg',
    placement: 'overlay',
  },

  'FRAME:PLUS': {
    key: 'FRAME:PLUS',
    name: 'Wordrama Plus',
    image: '/images/avatars/frames/plus.svg',
    placement: 'overlay',
  },

  'FRAME:CREATOR': {
    key: 'FRAME:CREATOR',
    name: 'Creator',
    image: '/images/avatars/frames/creator.svg',
    placement: 'overlay',
  },

  'FRAME:OWNER': {
    key: 'FRAME:OWNER',
    name: 'Owner',
    image: '/images/avatars/frames/owner.svg',
    placement: 'overlay',
  },

  'AVATAR:CROWN_DAILY_CHAMPION': {
    key: 'AVATAR:CROWN_DAILY_CHAMPION',
    name: 'Daily Champion Crown',
    image: '/images/avatars/styles/crown-daily-champion.png',
    placement: 'accessory',
    accessoryScale: 0.62,
    accessoryTopOffset: -0.3,
  },

  'AVATAR:CROWN_WEEKLY_CHAMPION': {
    key: 'AVATAR:CROWN_WEEKLY_CHAMPION',
    name: 'Weekly Champion Crown',
    image: '/images/avatars/styles/crown-weekly-champion.png',
    placement: 'accessory',
    accessoryScale: 0.62,
    accessoryTopOffset: -0.3,
  },

  'AVATAR:CROWN_MONTHLY_CHAMPION': {
    key: 'AVATAR:CROWN_MONTHLY_CHAMPION',
    name: 'Monthly Champion Crown',
    image: '/images/avatars/styles/crown-monthly-champion.png',
    placement: 'accessory',
    accessoryScale: 0.62,
    accessoryTopOffset: -0.3,
  },

  'AVATAR:CROWN_YEARLY_CHAMPION': {
    key: 'AVATAR:CROWN_YEARLY_CHAMPION',
    name: 'Yearly Champion Crown',
    image: '/images/avatars/styles/crown-yearly-champion.png',
    placement: 'accessory',
    accessoryScale: 0.62,
    accessoryTopOffset: -0.3,
  },

  'AVATAR:CROWN_ALLTIME_CHAMPION': {
    key: 'AVATAR:CROWN_ALLTIME_CHAMPION',
    name: 'Crown of Champions',
    image: '/images/avatars/styles/crown-alltime-champion.png',
    placement: 'accessory',
    accessoryScale: 0.62,
    accessoryTopOffset: -0.3,
  },
};
