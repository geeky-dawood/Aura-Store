import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '9f55-39-37-174-44.ngrok-free.app',
      },
      {
        protocol: 'https',
        hostname: 'media.wired.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }

    ],
  },
};


export default nextConfig;
