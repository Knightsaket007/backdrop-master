/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true, // ✅ Ensure app router is enabled
  },
  images: {
    domains: ["pixabay.com"], // ✅ Allow Pixabay images in Next.js
  },
};

export default nextConfig;
