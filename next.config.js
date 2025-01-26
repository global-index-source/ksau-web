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
