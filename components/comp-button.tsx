'use client';

import Link from 'next/link';
import { COLOURCSSVARIANTS, COMPID } from '../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { update as compUpdate } from '../state/current-comp/currentComp';
import { update as mainColourUpdate } from '../state/main-site-colour/mainSiteColour';
import { RootState } from '../state/store';

export default function CompButton({compKey}: {compKey: string}) {
    const currentComp = useSelector((state: RootState) => state.currentComp.value);
    const { comp } = currentComp;

    const dispatch = useDispatch();

    let buttonTitle = '';

    const resetStates = (compKey: string) => {
        if (compKey !== comp && Object.keys(COMPID).includes(compKey.toUpperCase())) {
            dispatch(compUpdate(compKey));
            dispatch(
                mainColourUpdate(
                    {
                        comp: compKey,
                        currentRoundNo: -1,
                        finalUpdate: false,
                    }
                )
            );
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
