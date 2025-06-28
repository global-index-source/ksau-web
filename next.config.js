/** @type {import('next').NextConfig} */
const API_BASE =
  process.env.NEXT_PUBLIC_LOCAL_API_ENDPOINT ||
  process.env.NEXT_PUBLIC_API_ENDPOINT ||
  'https://project.ksauraj.eu.org';

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
        destination: `${API_BASE}/system`,
      },
      {
        source: '/api/quota',
        destination: `${API_BASE}/quota`,
      },
    ]
  }
};

module.exports = nextConfig;
