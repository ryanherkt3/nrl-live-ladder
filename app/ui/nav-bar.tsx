'use client';

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
    const pathname = usePathname();
    const isLadderPage = pathname === '/';
    const isMaxPtsPage = pathname === '/maxpoints';

    return (
        <div className="text-3xl md:text-4xl flex justify-between font-semibold text-black sticky top-0 h-20 px-6 py-4 border-b border-gray-400 bg-white z-10">
            <span>
                {
                    isLadderPage ? 'NRL Live Ladder' : (isMaxPtsPage ? 'NRL Max Points' : '404 Page')
                }
            </span>
            <div className="flex flex-row gap-6 items-center">
                <Link 
                    href="/"
                    className={
                        clsx(
                            'text-xl',
                            {
                                'text-green-400': isLadderPage
                            }
                        )
                    }
                >
                    Ladder
                </Link>
                <Link 
                    href="/maxpoints"
                    className={
                        clsx(
                            'text-xl',
                            {
                                'text-green-400': isMaxPtsPage
                            }
                        )
                    }
                >
                    Max Points
                </Link>
            </div>
        </div>
    );
}
