'use client';

import Confetti from 'react-confetti';
import Snowflake from '@/components/Snowflake';
import { THEME_IDS } from '@/config/themes';
import { MatrixCodeRain } from './MatrixCodeRain';
import { LightsaberRain } from './LightsaberRain';
import { AutumnLeaves } from './AutumnLeaves';

type WinCelebrationProps = {
  enabled: boolean;
  visible: boolean;
  themeId?: string;
  christmasEnabled: boolean;
};

export function WinCelebration({
  enabled,
  visible,
  themeId,
  christmasEnabled,
}: WinCelebrationProps) {
  if (!enabled || !visible) return null;

  const snowThemeIds: readonly string[] = [
    THEME_IDS.ICE,
    THEME_IDS.EVERGREEN_NOEL,
    THEME_IDS.WINTER_WONDERLAND,
  ];

  if (themeId === THEME_IDS.MATRIX) {
    return <MatrixCodeRain />;
  }

  if (themeId === THEME_IDS.EMPIRE) {
    return <LightsaberRain />;
  }

  if (themeId === THEME_IDS.HARVEST_HEARTH) {
    return <AutumnLeaves />;
  }

  if (christmasEnabled || (themeId != null && snowThemeIds.includes(themeId))) {
    return <Snowflake />;
  }

  return <Confetti className="w-full" />;
}
