/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: '.next',
    poweredByHeader: false,
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
        }
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        unoptimized: true
    }
}

module.exports = nextConfig