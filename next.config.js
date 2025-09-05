/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep dynamic for API routes to work
  images: {
    unoptimized: true,
  },
  // Netlify configuration
  trailingSlash: true,
  // Disable static optimization for dynamic routes
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
