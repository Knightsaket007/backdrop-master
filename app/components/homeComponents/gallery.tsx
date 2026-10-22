import Image from "next/image"
import Link from "next/link"
import spidy from "@/public/assets/imgs/spidy.png"
import robo from "@/public/assets/imgs/robo.png"
import icecream from "@/public/assets/imgs/icecream.png"
import kitty from "@/public/assets/imgs/kitty.png"
import mockup from "@/public/assets/imgs/mockup.png"
import cheese from "@/public/assets/imgs/cheese.png"

const images = [
  { src: spidy, alt: "Portrait with a colorful backdrop", label: "Portraits" },
  { src: robo, alt: "Robot character in a playful studio scene", label: "Characters" },
  { src: icecream, alt: "Ice cream product photo with a bright backdrop", label: "Products" },
  { src: kitty, alt: "Cute character in a soft creative scene", label: "Playful ideas" },
  { src: mockup, alt: "Promotional product visual ready for a campaign", label: "Campaigns" },
  { src: cheese, alt: "Food product presented in a fresh scene", label: "Food & drink" },
]

export function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-24 bg-[#101014] py-24 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fuchsia-300">A little inspiration</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Made with imagination.</h2>
            <p className="mt-4 text-base leading-7 text-white/55">A few ideas to get you started. Your next favorite could be one prompt away.</p>
          </div>
          <Link href="/dashboard" className="w-fit text-sm font-medium text-violet-200 transition hover:text-white">Make something like this <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="columns-2 gap-4 sm:columns-3 sm:gap-5">
          {images.map((image) => <div key={image.alt} className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:mb-5">
            <Image src={image.src} alt={image.alt} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px" className="block h-auto w-full transition duration-700 group-hover:scale-[1.035]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />
            <p className="absolute bottom-4 left-4 text-sm font-medium text-white sm:bottom-5 sm:left-5">{image.label}</p>
          </div>)}
        </div>
      </div>
    </section>
  )
}
