import Image from "next/image"
import spidy from "@/public/assets/imgs/spidy.png"
import robo from "@/public/assets/imgs/robo.png"
import icecream from "@/public/assets/imgs/icecream.png"
import kitty from "@/public/assets/imgs/kitty.png"
import mockup from "@/public/assets/imgs/mockup.png"
import cheese from "@/public/assets/imgs/cheese.png"

export function Gallery() {
  const images = [
    { src: spidy, alt: "Portrait with colorful backdrop" },
    { src: robo, alt: "Abstract studio backdrop" },
    { src: icecream, alt: "Professional photoshoot backdrop" },
    { src: kitty, alt: "Creative light backdrop" },
    { src: mockup, alt: "Sale-inspired backdrop" },
    { src: cheese, alt: "Nature-inspired backdrop" },
  ]

  return (
    <section className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Masterpiece
            </span>{" "}
            Gallery
          </h2>
          <p className="text-xl text-gray-400">
            {`See what's possible with Backdrop Master`}
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {images.map((image, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl break-inside-avoid">
              <Image
                src={image.src}
                alt={image.alt}
                className="w-full h-auto rounded-xl object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-semibold">{image.alt}</h3>
                  <p className="text-gray-300 text-sm">
                    Created with Picfer
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
