'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
    const pathname = usePathname();

    const isLadderPage = pathname === '/';
    const isMaxPtsPage = pathname === '/maxpoints';

    const navLinkText = isLadderPage ? 'Max Points' : 'Ladder';
    const navLink = isLadderPage ? '/maxpoints' : '/';

    return (
        <div className="text-2xl md:text-4xl flex justify-between items-center font-semibold text-black sticky top-0 h-20 px-6 py-4 border-b border-gray-400 bg-white z-20">
            <span>{ isLadderPage ? 'NRL Live Ladder' : (isMaxPtsPage ? 'NRL Max Points' : '404 Page') }</span>
            <Link href={navLink} className='text-lg md:text-xl hover:text-green-400'>{navLinkText}</Link>
        </div>
    );
}
