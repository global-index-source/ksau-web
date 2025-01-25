/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_ENDPOINT: 'https://project.ksauraj.eu.org'
  },
  async rewrites() {
    return [
      {
        source: '/api/system',
        destination: 'https://project.ksauraj.eu.org/system',
      },
    ]
  }
};

module.exports = nextConfig;
