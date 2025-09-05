/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Ensure proper static export for Netlify
  output: 'standalone',
  // Disable server-side features that don't work on Netlify
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig