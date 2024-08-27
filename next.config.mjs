import { config } from 'dotenv';
config({ path: ['.env.local'] });

const s3hostname = process.env.S3_BUCKET + '.s3.amazonaws.com';
console.log(s3hostname);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'placekitten.com',
      },
      {
        protocol: 'https',
        hostname: s3hostname,
      },
    ],
  },
};

export default nextConfig;
