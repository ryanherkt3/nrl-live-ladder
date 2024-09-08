import { TeamData } from "../../lib/definitions";
import { getShortCode } from "../../lib/utils";
import TeamImage from "../team-image";

export default function LadderRow(
    {
        teamData,
        position,
        isPlaying,
        byePoints,
        nextTeam,
        nextMatchUrl
    }: {
        teamData: TeamData;
        position: String;
        isPlaying: boolean;
        byePoints: boolean;
        nextTeam: string;
        nextMatchUrl: string;
    }
) {
    const {stats: statsData, theme, name} = teamData;
    const {played, wins, drawn, lost, points, noByePoints, byes} = statsData;

    return (
        <div className="flex flex-row gap-2 py-1 items-center text-center text-lg">
            <div className="w-[10%] md:w-[5%] flex justify-center flex-row gap-2 font-semibold">
                {
                    isPlaying ?
                        <div className="w-6 h-6 border rounded-full live-match border-red-600"></div> :
                        <span>{position}</span>
                }
            </div>
            <div className="hidden sm:flex w-[15%] sm:w-[8%] justify-center">
                <TeamImage matchLink='' teamKey={theme.key} />
            </div>
            <div className="w-[25%] sm:w-[15%] text-left">
                <span className='hidden md:block'>{name}</span>
                <span className='block md:hidden'>
                    {
                        getShortCode(name)
                    }
                </span>
            </div>
            <div className="w-[15%] sm:w-[6%]">{played}</div>
            <div className="hidden sm:block sm:w-[6%]">{wins}</div>
            <div className="hidden sm:block sm:w-[6%]">{drawn}</div>
            <div className="hidden sm:block sm:w-[6%]">{lost}</div>
            <div className="hidden sm:block sm:w-[6%]">
                {byePoints ? byes : 0}
            </div>
            <div className="hidden md:block w-[6%]">{statsData['points for']}</div>
            <div className="hidden md:block w-[6%]">{statsData['points against']}</div>
            <div className="hidden xs:block w-[15%] sm:w-[6%]">{statsData['points difference']}</div>
            <div className="flex w-[25%] sm:w-[15%] md:w-[8%] justify-center">
                {
                    getNextFixture(nextTeam, nextMatchUrl)
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
 * @param {string} nextMatchUrl
 * @returns {string | undefined | TeamImage}
 */
function getNextFixture(nextTeam: string, nextMatchUrl: string) {
    switch (nextTeam) {
        case 'BYE':
            return 'BYE';
        case '':
            return null;
        default:
            return <TeamImage matchLink={nextMatchUrl} teamKey={nextTeam} />;
    }
}
