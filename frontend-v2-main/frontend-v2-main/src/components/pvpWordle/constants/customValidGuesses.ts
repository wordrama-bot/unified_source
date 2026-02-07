function generateValidGuesses(length: number): string[] {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const results: string[] = [];
  const generate = (prefix: string) => {
      if (prefix.length === length) {
          results.push(prefix);
          return;
      }
      for (const letter of alphabet) {
          generate(prefix + letter);
      }
  };
  generate('');
  return results;
}

export function getValidGuesses(wordLength: number) {
  generateValidGuesses(wordLength)
}
