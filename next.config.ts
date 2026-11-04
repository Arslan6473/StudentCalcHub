import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async redirects() {
    return [
      // One canonical host: bare-domain requests go to www so search engines
      // never index two copies of the site. Only matches the apex host.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'studentcalchub.com' }],
        destination: 'https://www.studentcalchub.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
