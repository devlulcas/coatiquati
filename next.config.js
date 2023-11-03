/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com', 'placekitten.com', 'utfs.io'],
  },
};

module.exports = nextConfig;
