/** Stable daily order shared by 3-letter packs. Never reshuffle by process startup. */
export function threeLetterDailyOrder(words: string[], seed: number): string[] {
  const result = [...words];
  let state = seed >>> 0;
  for (let i = result.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
