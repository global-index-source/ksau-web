/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Disable SWC minification to help identify issues
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true
  },
  experimental: {
    // Enable more verbose logging
    logging: {
      level: 'verbose'
    },
    // Use SWC for compilation
    swcPlugins: [],
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom']
    }
  },
  webpack: (config, { isServer }) => {
    // Add source maps for better error reporting
    if (!isServer) {
      config.devtool = 'source-map';
    }
    return config;
  }
};

module.exports = nextConfig;
