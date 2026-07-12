'use client';

import { useEffect, useMemo, useState } from 'react';

const MATRIX_CHARACTERS = [
  '0',
  '1',
  'A',
  'B',
  'C',
  'X',
  'Y',
  'Z',
  '$',
  '#',
  '+',
  '=',
  '\uFF71',
  '\uFF72',
  '\uFF73',
  '\uFF74',
  '\uFF75',
  '\uFF76',
  '\uFF77',
  '\uFF78',
  '\uFF79',
  '\uFF7A',
];

type MatrixStream = {
  id: number;
  characters: string[];
  left: number;
  delay: number;
  duration: number;
  fontSize: number;
  opacity: number;
  flickerDelay: number;
};

function createCharacter() {
  return MATRIX_CHARACTERS[
    Math.floor(Math.random() * MATRIX_CHARACTERS.length)
  ];
}

export function MatrixCodeRain() {
  const initialStreams = useMemo<MatrixStream[]>(
    () =>
      Array.from({ length: 28 }, (_, index) => {
        const streamLength = 26 + Math.floor(Math.random() * 18);

        return {
          id: index,
          characters: Array.from(
            { length: streamLength },
            createCharacter
          ),
          left: Math.random() * 100,
          delay: Math.random() * -10,
          duration: 8 + Math.random() * 6,
          fontSize: 13 + Math.random() * 7,
          opacity: 0.35 + Math.random() * 0.4,
          flickerDelay: Math.random() * -3,
        };
      }),
    []
  );

  const [streams, setStreams] =
    useState<MatrixStream[]>(initialStreams);

  useEffect(() => {
    const mutationInterval = window.setInterval(() => {
      setStreams((currentStreams) =>
        currentStreams.map((stream) => {
          // Only mutate some streams during each interval.
          if (Math.random() > 0.25) {
            return stream;
          }

          const nextCharacters = [...stream.characters];

          // Change one or occasionally two characters.
          const mutations = Math.random() > 0.8 ? 2 : 1;

          for (let index = 0; index < mutations; index += 1) {
            const characterIndex = Math.floor(
              Math.random() * nextCharacters.length
            );

            nextCharacters[characterIndex] = createCharacter();
          }

          return {
            ...stream,
            characters: nextCharacters,
          };
        })
      );
    }, 320);

    return () => {
      window.clearInterval(mutationInterval);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] h-screen w-screen overflow-hidden"
    >
      {streams.map((stream) => (
        <div
          key={stream.id}
          className="matrix-code-stream absolute flex flex-col items-center font-mono font-bold"
          style={{
            top: '-120vh',
            left: `${stream.left}%`,
            animationDelay: `${stream.delay}s`,
            animationDuration: `${stream.duration}s`,
            fontSize: `${stream.fontSize}px`,
            opacity: stream.opacity,
          }}
        >
          {[...stream.characters, ...stream.characters].map(
            (character, characterIndex) => {
              const sequenceIndex =
                characterIndex % stream.characters.length;

              const brightness =
                1 - sequenceIndex / stream.characters.length;

              return (
                <span
                  key={`${stream.id}-${characterIndex}`}
                  className={
                    sequenceIndex === 0
                      ? 'matrix-code-head matrix-code-flicker'
                      : 'matrix-code-character matrix-code-flicker'
                  }
                  style={{
                    opacity: Math.max(0.2, brightness),
                    animationDelay: `${
                      stream.flickerDelay - sequenceIndex * 0.07
                    }s`,
                  }}
                >
                  {character}
                </span>
              );
            }
          )}
        </div>
      ))}
    </div>
  );
}
