import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#101014] py-9 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <Link href="/" aria-label="BackdropMaster home" className="inline-flex items-center text-lg font-semibold tracking-[-0.04em]" style={{ fontFamily: "var(--font-ibm-plex), Arial, sans-serif" }}>BackdropMaster</Link>
          <p className="mt-2 text-xs text-white/40">A creative studio for better product imagery.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/55">
          <Link href="#features" className="transition hover:text-white">Features</Link>
          <Link href="#gallery" className="transition hover:text-white">Gallery</Link>
          <Link href="/Pricing" className="transition hover:text-white">Pricing</Link>
          <Link href="/sign-in" className="transition hover:text-white">Log in</Link>
          <Link href="/dashboard" className="transition hover:text-white">Open studio</Link>
          <a href="https://github.com/Knightsaket007/backdrop-master" target="_blank" rel="noreferrer" className="transition hover:text-white">GitHub</a>
        </nav>
        <p className="text-xs text-white/35">© {new Date().getFullYear()} BackdropMaster</p>
      </div>
    </footer>
  )
}
