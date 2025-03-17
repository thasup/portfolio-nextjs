/** @type {import('next').NextConfig} */
const path = require('path'); // Make sure to import path
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname), // Set "@" to the root directory
      // Add more aliases as needed
    };
    return config;
  },
}

module.exports = nextConfig
