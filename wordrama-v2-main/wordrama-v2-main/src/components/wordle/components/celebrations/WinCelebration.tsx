'use client';

import Confetti from 'react-confetti';
import Snowflake from '@/components/Snowflake';
import { THEME_IDS } from '@/config/themes';
import { MatrixCodeRain } from './MatrixCodeRain';

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

  if (christmasEnabled) {
    return <Snowflake />;
  }

  if (themeId === THEME_IDS.MATRIX) {
    return <MatrixCodeRain />;
  }

  return <Confetti className="w-full" />;
}
