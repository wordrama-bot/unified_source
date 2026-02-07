import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="m500:text-sm bg-bg dark:bg-darkBg z-30 px-5 py-5 text-center font-base">
      © 2023-{new Date().getFullYear()} Wordrama. All rights reserved.<br />
      <Link className="ml-2 mr-2 hover:underline" target="_blank" rel="noopener noreferrer" href="/about" passHref>
        About
      </Link>
      <Link className="ml-2 mr-2 hover:underline" target="_blank" rel="noopener noreferrer" href="/privacy-policy" passHref>
        Privacy Policy
      </Link>
      <Link className="ml-2 mr-2 hover:underline" target="_blank" rel="noopener noreferrer" href="/cookies">
        Cookie Policy
      </Link>
      <Link className="ml-2 hover:underline" target="_blank" rel="noopener noreferrer" href="/terms-of-use">
        Terms of Use
      </Link>
      <div className='flex justify-center items-center mt-4'>
        <button className="termly-display-preferences"type="button"> Consent Preferences </button>
      </div>
      <div className="flex justify-center items-center mt-4">
        <a
          className="mx-2"
          href="https://www.tiktok.com/@wordrama.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/tiktok.svg" alt='TikTok Logo' width={32} height={32}/>
        </a>
        <a
          className="mx-2"
          href="https://www.instagram.com/wordrama.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/instagram.svg" alt='Instagram Icon' width={32} height={32}/>
        </a>
        <a
          className="mx-2"
          href="https://discord.gg/cRunwK229g"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/discord.svg" alt='Discord Icon' width={32} height={32}/>
        </a>
      </div>
    </footer>
  );
}
