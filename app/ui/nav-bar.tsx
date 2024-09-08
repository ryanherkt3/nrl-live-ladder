'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
    const pathname = usePathname();

    const isLadderPage = pathname === '/';
    const isMaxPtsPage = pathname === '/maxpoints';

    const navLinkText = isLadderPage ? 'Max Points' : 'Ladder';
    const navLink = isLadderPage ? '/maxpoints' : '/';

    const colourClasses = 'text-black border-gray-400 bg-white';
    const textClasses = 'text-2xl md:text-4xl font-semibold';
    const navClasses = 'flex justify-between items-center sticky top-0 h-20 px-6 py-4 border-b z-20';

    return (
        <div className={`${colourClasses} ${textClasses} ${navClasses}`}>
            <span>{isLadderPage ? 'NRL Live Ladder' : (isMaxPtsPage ? 'NRL Max Points' : '404 Page')}</span>
            <Link href={navLink} className='text-lg md:text-xl hover:text-green-400'>{navLinkText}</Link>
        </div>
    );
}
