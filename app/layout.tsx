import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavBar from './ui/nav-bar';
import './globals.css';
import { Suspense } from 'react';
import SkeletonNavBar from './ui/skeletons/skeleton-nav-bar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'NRL Live Ladder Home',
    description: 'NRL Live Ladder App',
};

export default function RootLayout({ children, }: {children: React.ReactNode;}) {
    const currentYear = new Date().getFullYear();

    const footerClasses = 'antialiased text-lg flex flex-row h-20 p-4 justify-between items-center border-t';
    const footerColours = 'bg-white border-gray-400';

    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>
                <Suspense fallback={<SkeletonNavBar />}>
                    <NavBar />
                </Suspense>
                {children}
                <footer
                    className={
                        `${inter.className} ${footerClasses} ${footerColours}`
                    }
                >
                    <div>&copy; Ryan Herkt {currentYear}</div>
                    <a className="visited:text-purple-500 hover:text-blue-500 text-blue-500"
                        href="https://github.com/ryanherkt3/nrl-live-ladder"
                        target="_blank">
                        <span>Github</span>
                    </a>
                </footer>
            </body>
        </html>
    );
}
