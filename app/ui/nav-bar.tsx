'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { COLOURCSSVARIANTS, COMPID } from '../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { update as compUpdate } from '../state/current-comp/currentComp';
import { update as mainColourUpdate } from '../state/main-site-colour/mainSiteColour';
import { RootState } from '../state/store';

export default function NavBar() {
    // Get the user's chosen competition, if one exists.
    // Also set the main colour used for the finalists bar, completed games etc
    const currentComp = useSelector((state: RootState) => state.currentComp.value);
    const { comp } = currentComp;

    const mainSiteColour = useSelector((state: RootState) => state.mainSiteColour.value);
    const { colour } = mainSiteColour;

    const dispatch = useDispatch();

    const initCompParam = useSearchParams().get('comp')?.toLowerCase() || 'nrl';

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
            dispatch(compUpdate(initCompParam));
        }
    }, [currentComp, mainSiteColour, initCompParam, colour, comp, dispatch]);

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

    // Customise query paramaters based on:
    // 1. whether the comp paramater is valid or not
    // 2. if the default comp (NRL) is being shown
    const query = Object.keys(COMPID).includes(comp.toUpperCase()) && comp !== 'nrl' ?
        {['comp']: comp} : {};

    return (
        <div className={`${colourClasses} ${textClasses} ${navClasses}`}>
            <span>{ activeLink ? activeLink.title : '404 Page' }</span>
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
                    (mobileNavOpen ?
                        <XMarkIcon className="cursor-pointer w-8" onClick={toggleMobileNavOpen.bind(null)} /> :
                        <Bars3Icon className="cursor-pointer w-8" onClick={toggleMobileNavOpen.bind(null)} />
                    )
                }
            </div>
        </div>
    );
}
