import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = [
    { name: "About", href: "#" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Contact", href: "#" },
  ]
  
  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="h-5 w-5" />, href: "#" },
    { name: "Twitter", icon: <Twitter className="h-5 w-5" />, href: "#" },
    { name: "Instagram", icon: <Instagram className="h-5 w-5" />, href: "#" },
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, href: "#" },
    { name: "GitHub", icon: <Github className="h-5 w-5" />, href: "#" },
  ]

  return (
    <footer className="bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <Link href="#" className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Picfer
            </Link>
            <p className="mt-2 text-gray-400 max-w-md">
              Create stunning, professional backgrounds for your photos and videos with our powerful editor.
            </p>
          </div>
          
          <div className="flex space-x-4">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={link.name}
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="border-t border-slate-800 my-8"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4 md:mb-0">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="text-gray-500 text-sm">
            &copy; {currentYear} Picfer. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}