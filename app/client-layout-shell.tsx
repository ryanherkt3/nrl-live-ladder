'use client';

import { Suspense } from 'react';
import { Provider } from 'react-redux';
import Header from '../components/header';
import SkeletonHeader from '../components/skeletons/skeleton-header';
import { store } from '../state/store';

interface ClientLayoutShellProps {
    children: React.ReactNode;
    fontClassName: string;
}

export default function ClientLayoutShell({ children, fontClassName, }: ClientLayoutShellProps) {
    const footerClasses = 'antialiased text-lg flex flex-row h-20 p-4 justify-center items-center border-t';
    const footerColours = 'bg-white border-gray-400';

    return (
        <Provider store={store}>
            <Suspense fallback={<SkeletonHeader />}>
                <Header />
            </Suspense>
            {children}
            <footer className={`${fontClassName} ${footerClasses} ${footerColours}`}>
                <div>
                    Not affiliated with {' '}
                    <a
                        className="visited:text-purple-500 hover:text-blue-500 text-blue-500"
                        href="https://nrl.com/"
                        target="_blank"
                    >
                        nrl.com
                    </a>
                </div>
            </footer>
        </Provider>
    );
}
