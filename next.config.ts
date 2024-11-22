/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        canvas: false
      },
    };
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: 'asset/resource'
    });
    return config;
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["*"]
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;