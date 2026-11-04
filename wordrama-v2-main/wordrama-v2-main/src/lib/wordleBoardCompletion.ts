type BoardIdentity = {
  gameInstanceId?: string;
  solution: string;
};

export type CompletedWordleBoard = {
  gameInstanceId: string;
  solution: string;
  guesses: string[];
};

// The completion journal is origin-local; the server lookup also covers
// completions from other origins, tabs and devices. Never match by word alone.
export async function checkWordleBoardCompletion(
  board: BoardIdentity,
  gameMode: string,
  wordPack: string,
  readJournal: () => Promise<any[]>,
  readServer: (id: string) => Promise<any>,
): Promise<CompletedWordleBoard | null> {
  if (!board.gameInstanceId) return null;
  const matches = (result: any) => result &&
    result.gameInstanceId === board.gameInstanceId &&
    result.type === gameMode && result.wordPack === wordPack &&
    result.solution === board.solution && Array.isArray(result.guesses) &&
    result.guesses.every((guess: unknown) => typeof guess === 'string') &&
    (result.guesses.includes(board.solution) || result.guesses.length >= 6);
  let journal: any[] = [];
  try { journal = await readJournal(); }
  catch (error) { console.warn('[wordle] unable to read resume journal', error); }
  const local = journal.find(matches);
  if (local) return local;
  const remote = await readServer(board.gameInstanceId);
  if (remote === null) return null;
  // A failed or malformed lookup is not evidence that a puzzle is unplayed.
  if (!matches(remote)) throw new Error('Invalid Wordle completion check');
  return remote;
}
