import Image from 'next/image';

export function Wordrama() {
  return <Image height={100} width={200} src="/images/wordrama-logo.png" alt="Wordrama Logo" />
}

export function SpellBee() {
  return <Image width={128} height={64} src="/images/games/spellbee.png" alt="SpellBee Logo" />
}

export function Wordle() {
  return (<Image width={128} height={64} src="/images/games/wordrama.png" alt="Wordle Logo" />
  );
};

export function More() {
  return <Image width={128} height={64} src="/images/coming-soon.png" alt="Coming Soon" />
}
