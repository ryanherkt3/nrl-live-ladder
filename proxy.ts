import { NextRequest, NextResponse } from 'next/server';

export default function proxy(req: NextRequest) {
    // Generate a random 128-bit cryptographically secure base64 token
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

    // Define strict dynamic rules with nonces
    const isDev = process.env.NODE_ENV === 'development';
    const cspHeader = `
        script-src 'self' 'nonce-${nonce}' ${isDev ? 'unsafe-eval' : 'strict-dynamic'};
        img-src 'self' blob: data: https://nrl.com https://www.nrl.com;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests
    `;

    // Set headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', cspHeader.replace(/\s{2,}/g, ' ').trim());

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set('Content-Security-Policy', cspHeader.replace(/\s{2,}/g, ' ').trim());
    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
