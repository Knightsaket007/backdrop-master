import { useRouter } from "next/navigation";

export function Hero() {

  const router = useRouter();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500/20 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Picfer
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Create stunning, professional backgrounds for your photos and videos with our powerful, easy-to-use editor.
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg transition-all" onClick={() => router.push('/dashboard')}>
         {`Start Now - It's free`} 
        </button>
      </div>
    </section>
  )
}