import clsx from 'clsx';
import { TeamData } from '../../lib/definitions';
import { getShortCode } from '../../lib/utils';
import TeamImage from '../team-image';
import { RootState } from '@/app/state/store';
import { useSelector } from 'react-redux';

export default function LadderRow(
    {
        teamData,
        position,
        isPlaying,
        byePoints,
        predictorPage,
        nextTeam,
        nextTeamTooltip,
        nextMatchUrl
    }: {
        teamData: TeamData;
        position: String;
        isPlaying: boolean;
        byePoints: boolean;
        predictorPage: boolean;
        nextTeam: string;
        nextTeamTooltip: string;
        nextMatchUrl: string;
    }
) {
    const currentComp = useSelector((state: RootState) => state.currentComp.value);
    const { comp } = currentComp;

    const { stats: statsData, theme, name, qualificationStatus } = teamData;
    const { played, wins, drawn, lost, points, noByePoints, byes } = statsData;

    let bgClassName = name.toLowerCase().replace(' ', '');

    if (name === 'Broncos' || name === 'Roosters') {
        bgClassName += '-gradient';
    }
    else if (name === 'Bears' || name === 'Jets' || name === 'Magpies') {
        bgClassName += `-${comp}`;
    }

    const qualifiedStatuses = ['(T2)', '(T4)', '(Q)'];
    const isQualified = qualifiedStatuses.includes(qualificationStatus);

    // const redBgTeams = ['Dolphins', 'Dragons', 'Bears', 'Capras', 'Hunters'];
    const blackTextQualifiedTeams = [
        'Eels', 'Panthers', // NRL
        'Bears', // NSW Cup
        'Clydesdales', 'Seagulls', 'Cutters', 'Tigers', 'WM Seagulls', 'Blackhawks' // QLD
    ];

    return (
        <div
            className={
                clsx(
                    'flex flex-row gap-2 py-1 items-center text-center text-lg',
                    {
                        'bg-faded': qualificationStatus === '(E)',
                        [`bg-${bgClassName} text-black`]: isQualified && blackTextQualifiedTeams.includes(name),
                        [`bg-${bgClassName} text-white`]: isQualified && !blackTextQualifiedTeams.includes(name),
                    }
                )
            }
        >
            <div className="w-[10%] md:w-[5%] flex justify-center flex-row gap-2 font-semibold">
                {
                    isPlaying ?
                        <div className="w-6 h-6 border rounded-full live-match border-red-600"></div> :
                        <span>{position}</span>
                }
            </div>
            <div className={
                clsx(
                    'flex flex-row items-center',
                    {
                        'w-[33%]': predictorPage,
                        'w-[43%] sm:w-[23%]': !predictorPage
                    }
                )
            }>
                <div className='max-xs:hidden xs:block'>
                    <TeamImage matchLink='' teamKey={theme.key} tooltip={name} />
                </div>
                <div className='max-xs:px-0 xs:px-3 text-left'>
                    <span className='max-md:hidden md:block'>{name}</span>
                    <span className='max-md:block md:hidden'>{getShortCode(name, comp)}</span>
                </div>
            </div>
            <div className="w-[15%] sm:w-[6%]">{played}</div>
            <div className="max-sm:hidden sm:block sm:w-[6%]">{wins}</div>
            <div className="max-sm:hidden sm:block sm:w-[6%]">{drawn}</div>
            <div className="max-sm:hidden sm:block sm:w-[6%]">{lost}</div>
            <div className="max-sm:hidden sm:block sm:w-[6%]">
                {byePoints ? byes : 0}
            </div>
            <div className="max-md:hidden md:block w-[6%]">{statsData['points for']}</div>
            <div className="max-md:hidden md:block w-[6%]">{statsData['points against']}</div>
            <div className={
                clsx(
                    'xs:block w-[15%] sm:w-[6%]',
                    {
                        'max-xs:hidden': !predictorPage
                    }
                )
            }>{statsData['points difference']}</div>
            <div className={
                clsx(
                    'flex w-[25%] sm:w-[15%] md:w-[8%] justify-center',
                    {
                        'hidden': predictorPage
                    }
                )
            }>
                {
                    getNextFixture(nextTeam, nextTeamTooltip, nextMatchUrl)
                }
            </div>
            <div className="w-[15%] sm:w-[6%] font-semibold">
                {byePoints ? points : noByePoints}
            </div>
        </div>
    );
}

/**
 * Get a team's next fixture (bye / nothing / image of logo of next opponent)
 *
 * @param {string} nextTeam
 * @param {string} nextTeamTooltip
 * @param {string} nextMatchUrl
 * @returns {string | undefined | TeamImage}
 */
function getNextFixture(nextTeam: string, nextTeamTooltip: string, nextMatchUrl: string) {
    switch (nextTeam) {
        case 'BYE':
            return 'BYE';
        case '':
            return null;
        default:
            return <TeamImage matchLink={nextMatchUrl} teamKey={nextTeam} tooltip={nextTeamTooltip} />;
    }
}
