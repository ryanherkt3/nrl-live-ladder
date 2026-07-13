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
    async headers() {
        return [
        {
            // Applies your headers to all routes in the application
            source: '/:path*', 
            headers: [
                {
                    key: 'X-Frame-Options',
                    value: 'DENY',
                },
                {
                    key: 'X-Content-Type-Options',
                    value: 'nosniff',
                },
                {
                    key: 'Referrer-Policy',
                    value: 'strict-origin-when-cross-origin',
                }
            ],
        },
        ]
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
            {
                protocol: 'https',
                hostname: 'www.nrl.com',
                port: '',
                pathname: '/Client/dist/logos/**',
                search: '',
            },
        ],
    },
};

export default nextConfig;
