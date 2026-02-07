export default function Footer() {
  return (
    <footer className="m500:text-sm dark:bg-darkBg z-30 bg-white px-5 py-5 text-center font-base">
      © 2023-{new Date().getFullYear()} Wordrama. All rights reserved.<br/>Built with ❤️ by{' '}
      <a
        target="_blank"
        href="https://devvy.co.uk"
        className="font-heading underline"
      >
        Devvy
      </a>
      .
    </footer>
  )
}
