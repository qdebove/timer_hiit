/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: isDev,
  register: !isDev,
  skipWaiting: !isDev,
});

module.exports = withPWA({
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['react']
  }
});
