# Three Letter and Five Letter Unhinged word lists

Both pack folders exist and follow the exact same JSON/import structure as existing Wordrama packs. They are deliberately **empty and disabled** until reviewed and activated; empty lists must not be enabled for gameplay.

## Where to paste words

- `THREE_LETTER/wordList.json` — all allowed **solutions** (3 letters)
- `THREE_LETTER/validGuesses.json` — all accepted **guesses**, including every solution (3 letters)
- `THREE_LETTER/dailyWordList.json` — ordered **daily answers**, each also present in wordList.json (3 letters)
- `FIVE_LETTER_UNHINGED/wordList.json` — all allowed **solutions** (5 letters)
- `FIVE_LETTER_UNHINGED/validGuesses.json` — all accepted **guesses**, including every solution (5 letters)
- `FIVE_LETTER_UNHINGED/dailyWordList.json` — ordered **daily answers**, each also present in wordList.json (5 letters)

Use a JSON array of lowercase strings, for example `["cat", "dog"]` in a 3-letter file. No comments, trailing commas, duplicates, spaces, or uppercase. Each word must have the correct length. For initial preparation, it is fine to copy the same complete set into all three files, but dailyWordList order becomes the deterministic daily answer schedule; review that order before launch.

Run from `api-v2-main/api-v2-main`:

```powershell
bun test tests/plannedWordPackDictionaries.test.ts tests/plannedWordPackPolicy.test.ts
```

The dictionary loader imports are wired into `src/services/game/wordle/words.ts`, but the API controller does not yet authorize either new pack. Additional server purchase enforcement, statistics, migrations, and rollout review are required before either pack can be used. **Do not deploy or merge to main merely because the lists are filled.**

## 3 Letter Crazy (new)

`THREE_LETTER_CRAZY` is a separate, currently disabled pack with independent DAILY and INFINITE board state. It costs 1,000 coins or $0.99 and is included with PLUS/CREATOR once activated.

**Shared master dictionary:** edit only `THREE_LETTER/validGuesses.json` for the complete curated 3-letter dictionary. Both packs accept every entry as a guess. Crazy uses every entry as a possible Infinite and Daily solution. The regular pack uses only `THREE_LETTER/wordList.json` for Infinite and `THREE_LETTER/dailyWordList.json` for Daily. The latter must be a subset of regular solutions. Do not create duplicate Crazy JSON files; its `index.ts` imports the shared master directly. Crazy daily answers currently follow master-list order, so the final release should use a deterministic shuffled schedule before activation.

No production marketplace, subscription, leaderboard database, or deployment changes have been made. Additional rollout integration is still required.
