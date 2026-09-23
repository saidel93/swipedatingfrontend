/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  async redirects() {
    // Old city pages no longer exist → send visitors to the listings
    return [
      { source: '/regions', destination: '/categories', permanent: true },
      { source: '/regions/:slug*', destination: '/annonces', permanent: true },
    ]
  },
}

module.exports = nextConfig
