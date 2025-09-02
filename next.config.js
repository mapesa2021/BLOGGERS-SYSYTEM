/** @type {import('next').NextConfig} */
const nextConfig = {
  // Comment out output: 'export' for development to allow dynamic routes
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
