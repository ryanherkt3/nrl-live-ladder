import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayoutShell from '@/app/client-layout-shell';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children, }: {children: React.ReactNode;}) {
    const nonce = (await headers()).get('x-nonce') ?? '';

    return (
        <html lang="en" nonce={nonce}>
            <body className={`${inter.className} antialiased`}>
                <ClientLayoutShell fontClassName={inter.className}>
                    {children}
                </ClientLayoutShell>
            </body>
        </html>
    );
}
