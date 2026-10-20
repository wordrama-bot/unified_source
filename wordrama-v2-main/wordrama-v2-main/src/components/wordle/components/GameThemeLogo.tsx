import type { AppearanceTheme } from '@/config/themes';

type GameThemeLogoProps = {
  theme: AppearanceTheme;
  className?: string;
};

export function GameThemeLogo({
  theme,
  className = 'h-16 w-auto',
}: GameThemeLogoProps) {
  const logoSrc =
    theme.branding?.logoSrc || '/images/wordrama-logo.png';

  return (
    <img
      src={logoSrc}
      alt="Wordrama Logo"
      className={className}
      draggable={false}
      loading="eager"
      decoding="async"
      onError={(event) => {
        const image = event.currentTarget;
        const fallback = '/images/wordrama-logo.png';

        if (!image.src.endsWith(fallback)) {
          image.src = fallback;
        }
      }}
    />
  );
}