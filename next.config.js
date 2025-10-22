/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  experimental: {
    turbopack: {
      root: '/Users/clubzilla/Downloads/BLOGGERS-SYSYTEM-main'
    }
  }
}

module.exports = nextConfig