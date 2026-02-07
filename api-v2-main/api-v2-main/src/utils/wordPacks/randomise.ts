// Function to read JSON from a file
function readJsonFile(filePath: string) {
  const file = Bun.file(filePath, { type: 'application/json' });
  return file.text();
}

// Function to write JSON to a file
function writeJsonToFile(filePath: string, data: string[]) {
  return Bun.write(filePath, JSON.stringify(data));
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array: string[]) {
  console.log(typeof array);
  const output = [...array];
  for (let i = output.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}

// File paths
// Unselect which wordPack you wish to reshuffle
const wordPacks: string[] = [
  //'FOUR_LETTER',
  //'FIVE_LETTER',
  //'SIX_LETTER',
  //'SEVEN_LETTER',
  //'EIGHT_LETTER',
  //'NINE_LETTER',
  //'TEN_LETTER',
  //'ELEVEN_LETTER',
  //'TWELVE_LETTER',
  //'THIRTEEN_LETTER',
  //'FOURTEEN_LETTER',
  //'FIFTEEN_LETTER',
  //'SIXTEEN_LETTER',
  //'SEVENTEEN_LETTER',
  //'EIGHTEEN_LETTER',
  //'NINETEEN_LETTER',
  //'TWENTY_LETTER',
  //'TWENTYONE_LETTER',
  //'TWENTYTWO_LETTER',
  'TWENTYTHREE_LETTER',
];

for (const wordPack in wordPacks) {
  const inputFilePath = `./${wordPacks[wordPack]}/wordList.json`;
  const outputFilePath = `./${wordPacks[wordPack]}/dailyWordList.json`;
  const jsonStr = await readJsonFile(inputFilePath);
  const jsonArray = JSON.parse(jsonStr);
  const shuffledArray = shuffleArray(jsonArray);
  writeJsonToFile(outputFilePath, shuffledArray);
  console.log(
    `${wordPacks[wordPack]} has been shuffled and saved to ${outputFilePath}`,
  );
}
