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
