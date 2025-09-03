/** @type {import('next').NextConfig} */
const nextConfig = {
  // Comment out output: 'export' for development to allow dynamic routes
  // output: 'export',
  // Remove trailingSlash for API routes to work properly
  // trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
