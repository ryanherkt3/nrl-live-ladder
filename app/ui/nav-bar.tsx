'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function NavBar() {
    const pathname = usePathname();

    let links = [
        {
            url: '/',
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
    links = links.filter((items) => items.url !== pathname);

    const colourClasses = 'text-black border-gray-400 bg-white';
    const textClasses = 'text-2xl md:text-4xl font-semibold';
    const navClasses = 'flex justify-between items-center sticky top-0 h-20 px-6 py-4 border-b z-20';

    // States for the mobile nav menu
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [isMobileScreen, setIsMobileScreen] = useState(false);
    const [isMobileScreenSet, setIsMobileScreenSet] = useState(false);

    const toggleMobileNavOpen = () => {
        setMobileNavOpen(!mobileNavOpen);
        document.querySelector('body')?.classList.toggle('no-scroll', !mobileNavOpen);
    };

    // Reset the state of mobileNavOpen when going to another page
    const resetMobileNavOpen = () => {
        if (mobileNavOpen) {
            setTimeout(() => setMobileNavOpen(false), 300);
        }
    };

    // Check if the mobile nav can be opened
    useEffect(() => {
        const handleResize = () => {
            setIsMobileScreen(window.innerWidth <= 768);
            if (window.innerWidth > 768 && mobileNavOpen) {
                setMobileNavOpen(false);
                document.querySelector('body')?.classList.remove('no-scroll');
            }
        };

        if (!isMobileScreenSet) {
            setIsMobileScreen(window.innerWidth <= 768);
        }
        setIsMobileScreenSet(true);

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isMobileScreenSet, mobileNavOpen]);

    return (
        <div className={`${colourClasses} ${textClasses} ${navClasses}`}>
            <span>{ activeLink ? `NRL ${activeLink.title}` : '404 Page' }</span>
            <div className={
                clsx(
                    'md:flex md:flex-row md:gap-4',
                    {
                        'hidden': !mobileNavOpen,
                        'absolute-nav': mobileNavOpen,
                    }
                )
            }>
                {
                    links.map((link) => {
                        const {title, url} = link;

                        return (
                            <Link
                                key={title}
                                href={url}
                                onClick={resetMobileNavOpen}
                                className='text-lg md:text-xl hover:text-green-400'
                            >
                                <span>{title}</span>
                            </Link>
                        );
                    })
                }
            </div>
            {
                getNavIcon(isMobileScreen, mobileNavOpen, toggleMobileNavOpen)
            }
        </div>
    );
}

function getNavIcon(isMobileScreen: boolean, mobileNavOpen: boolean, toggleMobileNavOpen: any) {
    if (isMobileScreen) {
        if (mobileNavOpen) {
            return <XMarkIcon className="cursor-pointer w-8" onClick={toggleMobileNavOpen} />;
        }
        return <Bars3Icon className="cursor-pointer w-8" onClick={toggleMobileNavOpen} />;
    }

    return null;
}

