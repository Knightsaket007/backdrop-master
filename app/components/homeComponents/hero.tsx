import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, Github, Sparkles, WandSparkles } from "lucide-react"
import spidy from "@/public/assets/imgs/spidy.png"
import robo from "@/public/assets/imgs/robo.png"
import kitty from "@/public/assets/imgs/kitty.png"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#101014] pb-20 pt-32 text-white sm:pb-28 sm:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-12 h-[460px] w-[460px] rounded-full bg-violet-600/20 blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-32 h-[420px] w-[420px] rounded-full bg-fuchsia-500/15 blur-[130px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_0.95fr] lg:gap-10">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/[0.08] px-4 py-2 text-xs font-medium tracking-wide text-violet-100">
            <Sparkles size={14} className="text-fuchsia-300" /> A HANDS-ON STUDIO FOR BETTER VISUALS
          </div>
          <h1 className="text-[clamp(3.25rem,7vw,5.8rem)] font-semibold leading-[0.98] tracking-[-0.065em]">
            Better backdrops.<br /><span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">Better first impressions.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">Cut out a subject, build a cleaner composition, and give your image the finish it deserves—all in one focused editor.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/editor/guest" className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#17151d] shadow-xl shadow-violet-950/20 transition hover:-translate-y-0.5 hover:bg-violet-100">Try the editor — no sign-in <ArrowRight size={17} className="transition group-hover:translate-x-1" /></Link>
            <a href="https://github.com/Knightsaket007/backdrop-master" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-4 text-sm font-medium text-white/80 transition hover:border-white/30 hover:bg-white/5"><Github size={17} /> View the project</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/50">
            <span className="inline-flex items-center gap-2"><Check size={14} className="text-emerald-300" /> Easy to use</span>
            <span className="inline-flex items-center gap-2"><Check size={14} className="text-emerald-300" /> Made for creators</span>
            <span className="inline-flex items-center gap-2"><Check size={14} className="text-emerald-300" /> Start for free</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[590px]">
          <div aria-hidden="true" className="absolute inset-8 rounded-[2.5rem] bg-gradient-to-br from-violet-500/40 to-fuchsia-500/20 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-3 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-4">
            <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#22212a]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-rose-400"/><span className="h-2 w-2 rounded-full bg-amber-300"/><span className="h-2 w-2 rounded-full bg-emerald-300"/></div>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">Backdrop workspace</span>
                <WandSparkles size={15} className="text-violet-300" />
              </div>
              <div className="grid grid-cols-[1fr_0.68fr] gap-3 p-3 sm:gap-4 sm:p-4">
                <div className="relative min-h-[300px] overflow-hidden rounded-xl bg-gradient-to-br from-[#f6b78e] via-[#cd8e9f] to-[#6851a5] sm:min-h-[370px]">
                  <Image src={spidy} alt="Example portrait with a vibrant AI-style backdrop" fill sizes="(max-width: 1024px) 60vw, 350px" className="object-cover object-center" priority />
                  <div className="absolute inset-x-3 bottom-3 rounded-lg border border-white/20 bg-black/35 p-3 backdrop-blur-md">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/60">Background removal</p>
                    <p className="mt-1 text-xs font-medium text-white">Subject isolated and ready to edit</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="relative min-h-[145px] flex-1 overflow-hidden rounded-xl bg-[#6551a2]">
                    <Image src={robo} alt="Creative character against a colorful backdrop" fill sizes="(max-width: 1024px) 35vw, 220px" className="object-cover" />
                    <span className="absolute left-2 top-2 rounded-full border border-white/20 bg-black/35 px-2 py-1 text-[9px] text-white/90">01 · Studio</span>
                  </div>
                  <div className="relative min-h-[145px] flex-1 overflow-hidden rounded-xl bg-[#d6b8cd]">
                    <Image src={kitty} alt="Playful character composition" fill sizes="(max-width: 1024px) 35vw, 220px" className="object-cover" />
                    <span className="absolute left-2 top-2 rounded-full border border-white/20 bg-black/35 px-2 py-1 text-[9px] text-white/90">02 · Playful</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-violet-300/20 bg-violet-300/10 px-3 py-3 text-[11px] text-violet-100"><Sparkles size={14} className="shrink-0 text-fuchsia-300" /> Your next idea, made real</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mx-auto mt-20 max-w-7xl border-t border-white/10 px-5 pt-6 sm:px-8">
        <p className="text-center text-[10px] font-medium uppercase tracking-[0.24em] text-white/35">One simple workspace for your visual ideas</p>
      </div>
    </section>
  )
}
