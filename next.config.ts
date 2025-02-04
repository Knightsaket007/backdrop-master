/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,  // ✅ Ensure app router is enabled
  },
};

export default nextConfig;
