'use client';

import Link from 'next/link';
import { COLOURCSSVARIANTS, COMPID } from '../lib/utils';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { resetDraw } from '@/state/draw/drawData';

export default function CompButton({compKey}: {compKey: string}) {
    // Empty string means info about the NRL will be fetched
    const comp = useSearchParams().get('comp') ?? 'nrl';

    const dispatch = useDispatch();

    let buttonTitle = '';

    const resetStates = (compKey: string) => {
        if (compKey !== comp && Object.keys(COMPID).includes(compKey.toUpperCase())) {
            dispatch(resetDraw());
        }
    };

    switch (compKey) {
        case 'nrl':
            buttonTitle = 'NRL';
            break;
        case 'nrlw':
            buttonTitle = 'NRL-W';
            break;
        case 'nsw':
            buttonTitle = 'NSW Cup';
            break;
        case 'qld':
            buttonTitle = 'Q Cup';
            break;
        default:
            buttonTitle = 'NRL';
            break;
    }

    const hoverBgStyle = COLOURCSSVARIANTS[`${compKey || 'nrl'}-hover-bg`];
    const borderClasses = `border rounded-lg border-2 ${COLOURCSSVARIANTS[`${compKey || 'nrl'}-border`]}`;
    const textClasses = `text-center text-xl hover:text-white ${COLOURCSSVARIANTS[`${compKey || 'nrl'}-text`]}`;

    return (
        <Link
            key={compKey}
            href={{ pathname: '/ladder', query: {['comp']: compKey}}}
            onClick={() => {
                resetStates(compKey);
            }}
            className={`p-6 cursor-pointer font-bold ${borderClasses} ${textClasses} ${hoverBgStyle}`}
        >
            {buttonTitle}
        </Link>
    );
}
