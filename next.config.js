/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['sharp', 'canvas'],
};

module.exports = nextConfig; 