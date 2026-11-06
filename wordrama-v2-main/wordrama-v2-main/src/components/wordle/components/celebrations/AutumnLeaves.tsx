'use client';

import type { CSSProperties } from 'react';

// Stable, deterministic values avoid hydration mismatches and re-render jitter.
const LEAVES = Array.from({ length: 26 }, (_, index) => {
  const duration = 6.8 + ((index * 7) % 25) / 10;
  const progress = 0.12 + ((index * 37) % 76) / 100;

  return {
    id: index,
    left: `${4 + ((index * 37.7 + 7) % 90)}%`,
    delay: `${-(duration * progress)}s`,
    duration: `${duration}s`,
    size: `${0.75 + ((index * 11) % 9) / 20}`,
    drift: `${((index * 19) % 100) - 50}px`,
    sway: `${index % 2 === 0 ? 24 : -24}px`,
    spin: `${index % 2 === 0 ? 250 : -250}deg`,
    color: [
      '#d96b28', '#d9a13a', '#b64b2d',
      '#a43f37', '#c77b25', '#8f472c',
    ][index % 6],
    restLeft: `${14 + (index % 3) * 34}%`,
    restTop: `${24 + Math.floor(index / 3) * 43}%`,
  };
});

export function AutumnLeaves() {
  return (
    <div className="autumn-leaves-celebration" aria-hidden="true">
      <style>{`
        .autumn-leaves-celebration {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 50;
          contain: layout style paint;
        }
        .autumn-leaf-particle {
          position: absolute;
          top: -45px;
          width: 23px;
          height: 29px;
          animation: autumn-leaf-fall var(--leaf-duration) linear var(--leaf-delay) infinite;
        }
        .autumn-leaf-shape {
          position: absolute;
          inset: 2px 3px 5px;
          background: var(--leaf-color);
          border-radius: 80% 0 75% 12%;
          transform: rotate(30deg);
          box-shadow: inset -3px -2px 0 rgb(65 30 15 / 17%);
        }
        .autumn-leaf-shape::before {
          content: '';
          position: absolute;
          width: 1px;
          height: 21px;
          left: 9px;
          top: 4px;
          background: rgb(79 37 20 / 50%);
          transform: rotate(42deg);
        }
        .autumn-leaf-shape::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 8px;
          left: 16px;
          top: 19px;
          background: #77512e;
          transform: rotate(-35deg);
          border-radius: 2px;
        }
        @keyframes autumn-leaf-fall {
          0% { transform: translate3d(0, 0, 0) rotate(-25deg) scale(var(--leaf-size)); }
          25% { transform: translate3d(var(--leaf-sway), 25dvh, 0) rotate(55deg) scale(var(--leaf-size)); }
          50% { transform: translate3d(var(--leaf-drift), 50dvh, 0) rotate(130deg) scale(var(--leaf-size)); }
          75% { transform: translate3d(var(--leaf-sway), 75dvh, 0) rotate(205deg) scale(var(--leaf-size)); }
          100% { transform: translate3d(var(--leaf-drift), calc(100dvh + 90px), 0) rotate(var(--leaf-spin)) scale(var(--leaf-size)); }
        }
        @media (max-width: 640px) {
          .autumn-leaf-particle:nth-of-type(n + 11) { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .autumn-leaf-particle { animation: none; display: none; }
          .autumn-leaf-particle:nth-of-type(-n + 6) {
            display: block;
            top: var(--leaf-rest-top);
            left: var(--leaf-rest-left) !important;
            transform: rotate(25deg) scale(var(--leaf-size));
          }
        }
        @media (max-width: 640px) and (prefers-reduced-motion: reduce) {
          .autumn-leaf-particle:nth-of-type(n + 5) { display: none; }
        }
      `}</style>
      {LEAVES.map((leaf) => (
        <div
          key={leaf.id}
          className="autumn-leaf-particle"
          style={{
            left: leaf.left,
            '--leaf-delay': leaf.delay,
            '--leaf-duration': leaf.duration,
            '--leaf-size': leaf.size,
            '--leaf-drift': leaf.drift,
            '--leaf-sway': leaf.sway,
            '--leaf-spin': leaf.spin,
            '--leaf-color': leaf.color,
            '--leaf-rest-left': leaf.restLeft,
            '--leaf-rest-top': leaf.restTop,
          } as CSSProperties}
        >
          <span className="autumn-leaf-shape" />
        </div>
      ))}
    </div>
  );
}
