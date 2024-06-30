'use client';

import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'NRL Live Ladder',
    }
}

export default function RootLayout({ children, }: {children: React.ReactNode;}) {
    const currentYear = new Date().getFullYear();
    const pathname = usePathname();

    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>
                <div className="text-4xl flex items-center justify-center font-semibold text-black sticky top-0 h-20 p-4 border-b border-gray-400 bg-white z-10">
                    {
                        pathname === '/' ? 'NRL Live Ladder' : 'NRL Max Points'
                    }
                </div>
                {children}
                <footer 
                    className={
                        `${inter.className} antialiased text-lg flex flex-row h-20 p-4 justify-between items-center bg-white border-t border-gray-400`
                    }
                >
                    <div>&copy; Ryan Herkt {currentYear}</div>
                    <a className="visited:text-purple-500 hover:text-blue-500 text-blue-500"
                        href="https://github.com/ryanherkt3"
                        target="_blank">
                        <span>Github</span>
                    </a>
                </footer>
            </body>
        </html>
    );
}
