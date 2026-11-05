'use client';

import type { CSSProperties } from 'react';

// Deterministic positions avoid hydration mismatches and per-render randomness.
const SABERS = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 37.7 + 9) % 94 + 3}%`,
  delay: `${-((index * 1.73) % 8.5)}s`,
  duration: `${6.4 + ((index * 7) % 24) / 10}s`,
  size: `${0.75 + ((index * 11) % 9) / 20}`,
  drift: `${((index * 19) % 120) - 60}px`,
  spin: `${index % 2 === 0 ? 240 : -240}deg`,
}));

export function LightsaberRain() {
  return (
    <div className="lightsaber-celebration" aria-hidden="true">
      <style>{`
        .lightsaber-celebration {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 50;
        }
        .lightsaber-particle {
          position: absolute;
          top: -100px;
          width: 11px;
          height: 72px;
          transform-origin: center;
          animation: lightsaber-fall var(--saber-duration) linear var(--saber-delay) infinite;
        }
        .lightsaber-blade {
          position: absolute;
          left: 3px;
          top: 0;
          width: 5px;
          height: 53px;
          border-radius: 5px 5px 2px 2px;
          background: linear-gradient(90deg, #f00 0%, #ffb0b0 30%, #fff 50%, #ffb0b0 70%, #f00 100%);
          box-shadow: 0 0 5px 2px #ff1616, 0 0 12px 3px #d00000;
        }
        .lightsaber-hilt {
          position: absolute;
          left: 2px;
          top: 53px;
          width: 7px;
          height: 19px;
          border: 1px solid #171717;
          border-radius: 1px 1px 3px 3px;
          background: repeating-linear-gradient(to bottom, #9299a4 0 3px, #22252b 3px 6px);
          box-shadow: inset 1px 0 1px #e1e4e9;
        }
        @keyframes lightsaber-fall {
          from { transform: translate3d(0, 0, 0) rotate(-30deg) scale(var(--saber-size)); }
          to { transform: translate3d(var(--saber-drift), calc(100dvh + 180px), 0) rotate(var(--saber-spin)) scale(var(--saber-size)); }
        }
        @media (max-width: 640px) {
          .lightsaber-particle:nth-child(n + 11) { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lightsaber-particle {
            animation: none;
            display: none;
          }
          .lightsaber-particle:nth-child(-n + 6) {
            display: block;
            top: 22%;
            transform: rotate(-15deg) scale(0.85);
          }
          .lightsaber-particle:nth-child(1),
          .lightsaber-particle:nth-child(4) { left: 15% !important; }
          .lightsaber-particle:nth-child(2),
          .lightsaber-particle:nth-child(5) { left: 50% !important; }
          .lightsaber-particle:nth-child(3),
          .lightsaber-particle:nth-child(6) { left: 85% !important; }
          .lightsaber-particle:nth-child(n + 4):nth-child(-n + 6) { top: 68%; }
        }
        @media (max-width: 640px) and (prefers-reduced-motion: reduce) {
          .lightsaber-particle:nth-child(n + 5) { display: none; }
          .lightsaber-particle:nth-child(1),
          .lightsaber-particle:nth-child(3) { left: 25% !important; }
          .lightsaber-particle:nth-child(2),
          .lightsaber-particle:nth-child(4) { left: 75% !important; }
          .lightsaber-particle:nth-child(1),
          .lightsaber-particle:nth-child(2) { top: 22%; }
          .lightsaber-particle:nth-child(3),
          .lightsaber-particle:nth-child(4) { top: 68%; }
        }
      `}</style>
      {SABERS.map((saber) => (
        <div
          key={saber.id}
          className="lightsaber-particle"
          style={{
            left: saber.left,
            '--saber-delay': saber.delay,
            '--saber-duration': saber.duration,
            '--saber-size': saber.size,
            '--saber-drift': saber.drift,
            '--saber-spin': saber.spin,
          } as CSSProperties}
        >
          <span className="lightsaber-blade" />
          <span className="lightsaber-hilt" />
        </div>
      ))}
    </div>
  );
}
