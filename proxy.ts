import { NextRequest, NextResponse } from 'next/server';

const TARGET_COOKIE_RULES: Record<string, { httpOnly: boolean; secure: boolean }> = {
    'visitor-id': { httpOnly: true, secure: true },
    '_v-anonymous-id': { httpOnly: true, secure: true },
    '_v-anonymous-id-renewed': { httpOnly: true, secure: true },
    '_v-consent': { httpOnly: true, secure: true },
};

function hasCookieAttribute(setCookie: string, attribute: string): boolean {
    const pattern = new RegExp(`;\\s*${attribute}(?:=|;|$)`, 'i');
    return pattern.test(setCookie);
}

function splitSetCookieHeader(headerValue: string): string[] {
    const cookies: string[] = [];
    let current = '';
    let inExpires = false;

    for (let index = 0; index < headerValue.length; index++) {
        const char = headerValue[index];
        const nextSlice = headerValue.slice(index).toLowerCase();

        if (!inExpires && nextSlice.startsWith('expires=')) {
            inExpires = true;
        }

        if (char === ';' && inExpires) {
            inExpires = false;
        }

        if (char === ',' && !inExpires) {
            if (current.trim()) {
                cookies.push(current.trim());
            }
            current = '';
            continue;
        }

        current += char;
    }

    if (current.trim()) {
        cookies.push(current.trim());
    }

    return cookies;
}

function readSetCookieHeaders(response: NextResponse): string[] {
    const maybeHeaders = response.headers as Headers & { getSetCookie: () => string[] };
    const setCookieFromApi = maybeHeaders.getSetCookie();

    if (setCookieFromApi.length > 0) {
        return setCookieFromApi;
    }

    const joinedHeader = response.headers.get('set-cookie');
    if (!joinedHeader) {
        return [];
    }

    return splitSetCookieHeader(joinedHeader);
}

function hardenTargetCookieHeaders(response: NextResponse): void {
    const existingSetCookies = readSetCookieHeaders(response);
    if (existingSetCookies.length === 0) {
        return;
    }

    const hardenedSetCookies = existingSetCookies.map((setCookieValue) => {
        const cookieName = setCookieValue.split('=')[0]?.trim();
        if (!cookieName) {
            return setCookieValue;
        }

        if (!(cookieName in TARGET_COOKIE_RULES)) {
            return setCookieValue;
        }
        const rule = TARGET_COOKIE_RULES[cookieName];

        let updated = setCookieValue;

        if (rule.secure && !hasCookieAttribute(updated, 'secure')) {
            updated += '; Secure';
        }

        if (rule.httpOnly && !hasCookieAttribute(updated, 'httponly')) {
            updated += '; HttpOnly';
        }

        if (!hasCookieAttribute(updated, 'samesite')) {
            updated += '; SameSite=Lax';
        }

        return updated;
    });

    response.headers.delete('set-cookie');
    hardenedSetCookies.forEach((cookie) => {
        response.headers.append('set-cookie', cookie);
    });
}

export default function proxy(req: NextRequest) {
    // Generate a random 128-bit cryptographically secure base64 token
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

    // Define strict dynamic rules with nonces
    const cspHeader = `
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
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

    // Re-issue targeted cookies with hardened flags so insecure variants are overwritten.
    Object.entries(TARGET_COOKIE_RULES).forEach(([cookieName, rule]) => {
        const cookie = req.cookies.get(cookieName);
        if (!cookie?.value) {
            return;
        }

        response.cookies.set(cookieName, cookie.value, {
            httpOnly: rule.httpOnly,
            secure: rule.secure,
            sameSite: 'lax',
            path: '/',
        });
    });

    hardenTargetCookieHeaders(response);
    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
