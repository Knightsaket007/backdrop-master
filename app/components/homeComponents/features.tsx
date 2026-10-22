import { Download, Layers3, ScanLine, Sparkles } from "lucide-react"

const features = [
  { title: "Clean cutouts", description: "Remove busy backgrounds and keep the subject of your photo in focus.", icon: ScanLine, tone: "text-violet-300 bg-violet-300/10" },
  { title: "Fresh scenes", description: "Give product shots and portraits a new setting that fits your idea.", icon: Sparkles, tone: "text-fuchsia-300 bg-fuchsia-300/10" },
  { title: "Make it yours", description: "Layer in color, stickers, text, and finishing touches in one editor.", icon: Layers3, tone: "text-amber-200 bg-amber-200/10" },
  { title: "Ready to share", description: "Export your finished design and use it across your favorite channels.", icon: Download, tone: "text-emerald-200 bg-emerald-200/10" },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 bg-[#17161d] py-24 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center sm:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">Your creative sidekick</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Everything you need to <span className="text-white/45">set the scene.</span></h2>
          <p className="mt-5 text-base leading-7 text-white/55">From a quick background refresh to a polished product visual, your whole workflow lives in one place.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, icon: Icon, tone }, index) => <article key={title} className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.045] sm:p-7">
            <div className={`mb-10 grid h-12 w-12 place-items-center rounded-2xl ${tone}`}><Icon size={21} /></div>
            <p className="mb-3 text-xs text-white/30">0{index + 1}</p>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">{description}</p>
          </article>)}
        </div>
      </div>
    </section>
  )
}
