function generateCombinations(array, minLength = 4, maxLength = 16) {
  let allCombinations = [];

  // Helper function to generate combinations of a specific length
  function getCombinations(start, length, prefix) {
    if (length === 0) {
      allCombinations.push(prefix); // Push the prefix as a string
      return;
    }

    for (let i = start; i <= array.length - length; i++) {
      getCombinations(i + 1, length - 1, prefix + array[i]); // Concatenate strings
    }
  }

  // Generate combinations for each length from minLength to maxLength
  for (let length = minLength; length <= maxLength; length++) {
    getCombinations(0, length, '');
  }

  return allCombinations;
}

const letters = 'abcdefghijklmnopqrstuvwxyz';
const lettersArr = letters.split('');
// Generate combinations from length 4 to 12
const combinations = generateCombinations(lettersArr, 16, 16);

console.log(JSON.stringify(combinations));
