'use client';

import { Inter } from 'next/font/google';
import Header from '../components/header';
import './globals.css';
import { Suspense } from 'react';
import SkeletonHeader from '../components/skeletons/skeleton-header';
import { Provider } from 'react-redux';
import { store } from '../state/store';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children, }: {children: React.ReactNode;}) {
    const footerClasses = 'antialiased text-lg flex flex-row h-20 p-4 justify-center items-center border-t';
    const footerColours = 'bg-white border-gray-400';

    return (
        <Provider store={store}>
            <html lang="en">
                <body className={`${inter.className} antialiased`}>
                    <Suspense fallback={<SkeletonHeader />}>
                        <Header />
                    </Suspense>
                    {children}
                    <footer
                        className={
                            `${inter.className} ${footerClasses} ${footerColours}`
                        }
                    >
                        <div>
                            Not affiliated with {" "}
                            <a
                                className="visited:text-purple-500 hover:text-blue-500 text-blue-500"
                                href="https://nrl.com/"
                                target="_blank"
                            >
                                nrl.com
                            </a>
                        </div>
                    </footer>
                </body>
            </html>
        </Provider>
    );
}
