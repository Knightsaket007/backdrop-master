import Image from "next/image"
import spidy from "@/public/assets/imgs/spidy.png"

export function Gallery() {
  const images = [
    {
      src: spidy,
      alt: "Portrait with colorful backdrop",
    },
    {
      src: "https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      alt: "Abstract studio backdrop",
    },
    {
      src: "https://images.pexels.com/photos/1183434/pexels-photo-1183434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      alt: "Professional photoshoot backdrop",
    },
    {
      src: "https://images.pexels.com/photos/3379943/pexels-photo-3379943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      alt: "Creative light backdrop",
    },
    {
      src: "https://images.pexels.com/photos/1038041/pexels-photo-1038041.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      alt: "Nature-inspired backdrop",
    },
    {
      src: "https://images.pexels.com/photos/3812944/pexels-photo-3812944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      alt: "Minimalist studio backdrop",
    },
  ]

  return (
    <section className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Masterpiece</span> Gallery
          </h2>
          <p className="text-xl text-gray-400">
           { `See what's possible with Backdrop Master`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl"
            >
              <div className="aspect-w-4 aspect-h-3">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={600}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-semibold">{image.alt}</h3>
                    <p className="text-gray-300 text-sm">Created with Backdrop Master</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}