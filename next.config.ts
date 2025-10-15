/** @type {import('next').NextConfig} */
import type { Configuration } from "webpack";
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true, // ✅ Ensure app router is enabled
     webAssembly: true,
    workerThreads: true,
  },
    webpack: (config: Configuration): Configuration => {
    config.experiments = {
      ...(config.experiments || {}),
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
  images: {
    domains: ["pixabay.com", "images.pexels.com"], // ✅ Allow Pixabay images in Next.js
    
  },
};

export default nextConfig;
