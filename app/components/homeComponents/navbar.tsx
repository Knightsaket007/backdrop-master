"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, Menu, X } from "lucide-react"

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Gallery", href: "#gallery" },
  { name: "Pricing", href: "/Pricing" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#101014]/80 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="BackdropMaster home" className="flex items-center gap-3 text-xl font-semibold tracking-[-0.04em]">
          <span className="font-[family-name:var(--font-ibm-plex)]" style={{ fontFamily: "var(--font-ibm-plex), Arial, sans-serif" }}>BackdropMaster</span>
          <span className="hidden rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-violet-200 sm:inline">Creative studio</span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => <Link key={link.name} href={link.href} className="text-sm text-white/65 transition hover:text-white">{link.name}</Link>)}
          <Link href="/sign-in" className="text-sm text-white/75 transition hover:text-white">Log in</Link>
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#17151d] transition hover:bg-violet-100">Start creating <ArrowUpRight size={16} /></Link>
        </div>

        <button type="button" aria-label={isOpen ? "Close navigation" : "Open navigation"} aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)} className="rounded-lg border border-white/10 p-2 text-white md:hidden">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {isOpen && <div className="border-t border-white/10 bg-[#101014] px-5 py-4 md:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-1">
          {navLinks.map((link) => <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="rounded-lg px-3 py-3 text-sm text-white/75 hover:bg-white/5 hover:text-white">{link.name}</Link>)}
          <Link href="/sign-in" onClick={() => setIsOpen(false)} className="rounded-lg px-3 py-3 text-sm text-white/75 hover:bg-white/5 hover:text-white">Log in</Link>
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="mt-2 rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-[#17151d]">Start creating</Link>
        </div>
      </div>}
    </nav>
  )
}
