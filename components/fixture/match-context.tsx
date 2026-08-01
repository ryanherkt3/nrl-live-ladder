import { Match } from '@/lib/definitions';
import { COLOURCSSVARIANTS, WHITETEXTCOLOURS } from '@/lib/utils';
import clsx from 'clsx';

export default function MatchContext(
    {
        matchData,
        modifiable,
        mainSiteColour
    }:
    {
        matchData: Match,
        modifiable: boolean,
        mainSiteColour: string
    }
) {
    const { matchMode, matchState, clock } = matchData;

    if ((modifiable && matchState !== 'FullTime' && matchMode !== 'Live') || matchState === 'FullTime') {
        const isFullTime = matchState === 'FullTime';
        const string = isFullTime ? 'FULL TIME' : 'PREDICTION';
        const mobileString = isFullTime ? 'FT' : 'PRED';

        const trueClasses =
            `${COLOURCSSVARIANTS[`${mainSiteColour}-bg`]} ${COLOURCSSVARIANTS[`${mainSiteColour}-border`]}`;

        return (
            <div className={
                clsx(
                    'border rounded-md px-2 py-1 w-18.75 sm:w-22.5 md:w-35',
                    {
                        [trueClasses]: isFullTime,
                        'text-white': WHITETEXTCOLOURS.includes(mainSiteColour),
                        'text-black': isFullTime && mainSiteColour === 'nrl-mclt',
                        'border-indigo-400 bg-indigo-400 text-white': !isFullTime
                    }
                )
            }>
                <span className="md:block max-md:hidden">{string}</span>
                <span className="md:hidden max-md:block">{mobileString}</span>
            </div>
        );
    }

    let matchPeriod = '';
    switch (matchState) {
        case 'FirstHalf':
            matchPeriod = 'H1';
            break;
        case 'HalfTime':
            matchPeriod = 'HT';
            break;
        case 'SecondHalf':
            matchPeriod = 'H2';
            break;
        case 'ExtraTime':
            matchPeriod = 'ET';
            break;
        default:
            break;
    }

    if (matchMode === 'Live' && matchPeriod) {
        const colourClasses = 'border-red-500 bg-red-500 text-white';
        const widthClasses = 'w-[75px] sm:w-[90px] md:w-[140px]';

        return (
            <div className="flex flex-col gap-2 items-center text-md">
                <div className={`border rounded-md px-2 py-1 ${colourClasses} ${widthClasses}`}>
                    <span className="md:block max-md:hidden">{matchPeriod} | {clock.gameTime}</span>
                    <span className="md:hidden max-md:block">{matchPeriod}</span>
                </div>
                <div className="md:hidden max-md:block">{clock.gameTime}</div>
            </div>
        );
    }

    return null;
}
