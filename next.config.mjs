/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: process.env.NODE_ENV === 'development'
                    ? 'http://127.0.0.1:8080/api/:path*'
                    : '/api/',
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'nrl.com',
                port: '',
                pathname: '/.theme/**',
                search: '',
            },
        ],
    },
};

export default nextConfig;
