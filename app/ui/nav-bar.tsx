'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { COLOURCSSVARIANTS, COMPID, CURRENTCOMP, MAINCOLOUR, setCurrentComp, setMainColour } from '../lib/utils';
import SkeletonNavBar from './skeletons/skeleton-nav-bar';

export default function NavBar() {
    // Get the user's chosen competition, if one exists.
    // Also set the main colour used for the finalists bar, completed games etc
    setCurrentComp(useSearchParams().get('comp')?.toLowerCase() || 'nrl');
    setMainColour(COMPID[CURRENTCOMP.toUpperCase()], -1);

    const pathname = usePathname();

    let links = [
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
            setTimeout(() => {
                setMobileNavOpen(false);
                document.querySelector('body')?.classList.remove('no-scroll');
            }, 300);
        }
    };

    // Check if the mobile nav can be opened
    useEffect(() => {
        const handleResize = () => {
            setIsMobileScreen(window.innerWidth <= 850);
            if (window.innerWidth > 850 && mobileNavOpen) {
                setMobileNavOpen(false);
                document.querySelector('body')?.classList.remove('no-scroll');
            }
        };

        if (!isMobileScreenSet) {
            setIsMobileScreen(window.innerWidth <= 850);
        }
        setIsMobileScreenSet(true);

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isMobileScreenSet, mobileNavOpen]);

    // Show a temporary skeleton nav while figuring out if the device is a mobile one or not
    // TODO implement more robust fix for nav links showing on mobile when they shouldn't (due to tailwind 4 updates)
    // Revert back to tailwind 3?
    if (!isMobileScreenSet) {
        return <SkeletonNavBar />;
    }

    // Customise query paramaters based on:
    // 1. whether the comp paramater is valid or not
    // 2. if the default comp (NRL) is being shown
    const query = Object.keys(COMPID).includes(CURRENTCOMP.toUpperCase()) && CURRENTCOMP !== 'nrl' ?
        {['comp']: CURRENTCOMP} : {};

    return (
        <div className={`${colourClasses} ${textClasses} ${navClasses}`}>
            <span>{ activeLink ? activeLink.title : '404 Page' }</span>
            <div className={
                clsx(
                    'md:flex md:flex-row md:gap-4',
                    {
                        'hidden': !mobileNavOpen && isMobileScreen,
                        'absolute-nav': mobileNavOpen && isMobileScreen,
                    }
                )
            }>
                {
                    links.map((link) => {
                        const { title, url } = link;

                        return (
                            <Link
                                key={title}
                                href={{ pathname: url, query: query}}
                                onClick={resetMobileNavOpen}
                                className={`text-lg md:text-xl ${COLOURCSSVARIANTS[`${MAINCOLOUR}-hover-text`]}`}
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

function getNavIcon(isMobileScreen: boolean, mobileNavOpen: boolean, toggleMobileNavOpen: Function) {
    if (isMobileScreen) {
        if (mobileNavOpen) {
            return <XMarkIcon className="cursor-pointer w-8" onClick={toggleMobileNavOpen.bind(null)} />;
        }
        return <Bars3Icon className="cursor-pointer w-8" onClick={toggleMobileNavOpen.bind(null)} />;
    }

    return null;
}

