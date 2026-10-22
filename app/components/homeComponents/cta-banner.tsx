import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CtaBanner() {
  return (
    <section className="bg-[#17161d] px-5 py-20 text-white sm:px-8 sm:py-24">
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#282138] to-[#1d1b24] px-6 py-8 sm:flex-row sm:items-center sm:px-9 sm:py-9">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-40 h-72 w-72 rounded-full bg-violet-500/15 blur-[90px]" />
        <div className="relative">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Make your next image stand out.</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">Open the editor and try a new backdrop, no account required.</p>
        </div>
        <Link href="/editor/guest" className="relative inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#17151d] transition hover:bg-violet-100">Try the editor <ArrowRight size={16} /></Link>
      </div>
    </section>
  )
}
