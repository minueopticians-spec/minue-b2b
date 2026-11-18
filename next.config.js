/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: '/invierno', destination: '/' }];
  },
};
module.exports = nextConfig;
