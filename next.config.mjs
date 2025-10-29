import { config } from 'dotenv';

config({ path: ['.env.local'] });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.NEXT_OUTPUT, // Modified by the Standalone Docker build
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.IMAGES_BASE_URL,
      },
    ],
  },
};

export default nextConfig;
