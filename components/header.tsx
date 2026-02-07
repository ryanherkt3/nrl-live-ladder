'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { COLOURCSSVARIANTS, COMPID, LINKS } from '../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { update as mainColourUpdate } from '../state/main-site-colour/mainSiteColour';
import { RootState } from '../state/store';

export default function Header() {
    // Get the user's chosen competition, if one exists
    const comp = useSearchParams().get('comp') ?? 'nrl';

    const mainSiteColour = useSelector((state: RootState) => state.mainSiteColour.value);
    const { colour } = mainSiteColour;

    const dispatch = useDispatch();

    // Default to NRL if comp param is not provided or is invalid
    let initCompParam = useSearchParams().get('comp')?.toLowerCase() ?? 'nrl';
    initCompParam = Object.keys(COMPID).includes(initCompParam.toUpperCase()) ? initCompParam : 'nrl';

    // Empty string means the current year will be fetched
    const season = useSearchParams().get('season');

    useEffect(() => {
        const compsNotMatching = initCompParam !== comp;

        if (compsNotMatching) {
            dispatch(
                mainColourUpdate(
                    {
                        comp: COMPID[initCompParam.toUpperCase()],
                        currentRoundNo: -1,
                        finalUpdate: false,
                    }
                )
            );
        }
    }, [mainSiteColour, initCompParam, colour, comp, dispatch]);

    const pathname = usePathname();

    const activeLink = LINKS.find((links) => links.url === pathname);
    const links = LINKS.filter((links) => links.url !== pathname);

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

    // Customise query paramaters based on:
    // 1. whether the comp paramater is valid or not
    // 2. if the default comp (NRL) is being shown
    const query: Record<string, string> = {};
    if (Object.keys(COMPID).includes(comp.toUpperCase()) && comp !== 'nrl') {
        query.comp = comp;
    }
    if (season) {
        query.season = season;
    }

    return (
        <div className={`${colourClasses} ${textClasses} ${navClasses}`}>
            <span>{ activeLink ? activeLink.title : 'Not Found' }</span>
            <div className={
                clsx(
                    'md:flex md:flex-row md:gap-4 max-md:hidden',
                    {
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
                                className={`text-lg md:text-xl ${COLOURCSSVARIANTS[`${colour}-hover-text`]}`}
                            >
                                <span>{title}</span>
                            </Link>
                        );
                    })
                }
            </div>
            <div className='md:hidden'>
                {
                    (
                        mobileNavOpen ?
                            <XMarkIcon className="cursor-pointer w-8" onClick={toggleMobileNavOpen.bind(null)} /> :
                            <Bars3Icon className="cursor-pointer w-8" onClick={toggleMobileNavOpen.bind(null)} />
                    )
                }
            </div>
        </div>
    );
}
