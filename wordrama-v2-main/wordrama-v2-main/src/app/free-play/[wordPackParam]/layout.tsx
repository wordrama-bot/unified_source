export async function generateMetadata({ params }) {
  const paramMapper: { [key: string]: string } = {
    '5-letter': '5 Letter',
    'five-letter': '5 Letter',
    'FIVE_LETTER': '5 Letter',
    '6-letter': '6 Letter',
    'six-letter': '6 Letter',
    'SIX_LETTER': '6 Letter',
    '7-letter': '7 Letter',
    'seven-letter': '7 Letter',
    'SEVEN_LETTER': '7 Letter',
    '8-letter': '8 Letter',
    'eight-letter': '8 Letter',
    'EIGHT_LETTER': '8 Letter',
    '9-letter': '9 Letter',
    'nine-letter': '9 Letter',
    'NINE_LETTER': '9 Letter',
    '10-letter': '10 Letter',
    'ten-letter': '10 Letter',
    'TEN_LETTER': '10 Letter',
    '11-letter': '11 Letter',
    'eleven-letter': '11 Letter',
    'ELEVEN_LETTER': '11 Letter',
  }
  if (!paramMapper[params.wordPackParam]) return { title: "Word Pack Not Found" };

  return {
    title: `${paramMapper[params.wordPackParam]} Wordle Unlimited - Wordrama`,
    description: `Play unlimited ${paramMapper[params.wordPackParam]} Wordle games on Wordrama. Track your stats, compete with friends, and level up your skills. Join the fun today!`,
  };
}

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
