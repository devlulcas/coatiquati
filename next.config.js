/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'placekitten.com',
      'utfs.io',
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
