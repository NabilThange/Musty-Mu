/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@fullcalendar/common', '@fullcalendar/core', '@fullcalendar/daygrid', '@fullcalendar/interaction', '@fullcalendar/react', '@fullcalendar/timegrid'],
  serverExternalPackages: ['pdf-parse', 'tesseract.js'],
  webpack: (config, { isServer }) => {
    // Import mini-css-extract-plugin only in client builds
    if (!isServer) {
      const MiniCssExtractPlugin = require('mini-css-extract-plugin');
      
      // Add the plugin to the webpack config
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash].css',
          chunkFilename: 'static/css/[id].[contenthash].css',
        })
      );
    }
    
    return config;
  },
}

module.exports = nextConfig 