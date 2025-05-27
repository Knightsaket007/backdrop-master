import { Wand2, Paintbrush, Download, Sparkles } from "lucide-react"

export function Features() {
  const features = [
    {
      title: "Add Stickers",
      description: "Enhance your images with our library of thousands of stickers and elements.",
      icon: <Paintbrush className="h-10 w-10 text-indigo-500" />,
    },
    {
      title: "Apply Filters",
      description: "Transform the look of your backgrounds with professional-grade filters.",
      icon: <Wand2 className="h-10 w-10 text-purple-500" />,
    },
    {
      title: "HD Export",
      description: "Download your creations in high resolution for print or digital use.",
      icon: <Download className="h-10 w-10 text-pink-500" />,
    },
    {
      title: "AI Auto Backdrop",
      description: "Let our AI generate the perfect backdrop based on your image.",
      icon: <Sparkles className="h-10 w-10 text-indigo-500" />,
    },
  ]

  return (
    <section id="features" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to create professional backgrounds in one place
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all"
            >
              <div className="bg-slate-800 p-3 rounded-lg w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}