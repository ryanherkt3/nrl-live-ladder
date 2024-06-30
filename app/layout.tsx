import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "NRL Live Ladder",
    description: "NRL Live Ladder App by Ryan H",
};

export default function RootLayout({ children, }: {children: React.ReactNode;}) {
    const currentYear = new Date().getFullYear();

    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>
                <div className="text-4xl flex items-center justify-center font-semibold text-black sticky top-0 h-20 p-4 border-b border-gray-400 bg-white z-10">
                    NRL Live Ladder
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
