/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep dynamic for API routes to work
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
