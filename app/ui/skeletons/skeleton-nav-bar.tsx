'use client';

import { usePathname } from 'next/navigation';

export default function SkeletonNavBar() {
    const pathname = usePathname();

    const links = [
        {
            url: '/',
            title: 'Home'
        },
        {
            url: '/ladder',
            title: 'Live Ladder'
        },
        {
            url: '/maxpoints',
            title: 'Max Points'
        },
        {
            url: '/ladder-predictor',
            title: 'Ladder Predictor'
        }
    ];

    const activeLink = links.filter((items) => items.url === pathname)[0];

    const colourClasses = 'text-black border-gray-400 bg-white';
    const textClasses = 'text-2xl md:text-4xl font-semibold';
    const navClasses = 'flex justify-between items-center sticky top-0 h-20 px-6 py-4 border-b z-20';

    return (
        <div className={`${colourClasses} ${textClasses} ${navClasses}`}>
            <span>{ activeLink ? activeLink.title : '404 Page' }</span>
            <div className="shimmer max-md:w-8 md:w-[412px] h-8"></div>
        </div>
    );
}
