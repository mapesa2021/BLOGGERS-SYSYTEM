/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep dynamic for API routes to work
  images: {
    unoptimized: true,
  },
  // Enable experimental features
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
