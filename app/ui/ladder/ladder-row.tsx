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
    const statsData = teamData.stats;

    return (
        <div className="flex flex-row gap-2 py-1 items-center text-center text-lg">
            <div className="w-[10%] md:w-[5%] flex justify-center flex-row gap-2 font-semibold">
                {
                    getLadderPosition(isPlaying, position)
                }
            </div>
            <div className="hidden sm:flex w-[15%] sm:w-[8%] justify-center">
                <TeamImage matchLink='' teamKey={teamData.theme.key} />
            </div>
            <div className="w-[25%] sm:w-[15%] text-left">
                <span className='hidden md:block'>{teamData.teamNickname}</span>
                <span className='block md:hidden'>
                    {
                        getShortCode(teamData.teamNickname)
                    }
                </span>
            </div>
            <div className="w-[15%] sm:w-[6%]">{statsData.played}</div>
            <div className="hidden sm:block sm:w-[6%]">{statsData.wins}</div>
            <div className="hidden sm:block sm:w-[6%]">{statsData.drawn}</div>
            <div className="hidden sm:block sm:w-[6%]">{statsData.lost}</div>
            <div className="hidden sm:block sm:w-[6%]">
                {byePoints ? statsData.byes : 0}
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
                {byePoints ? teamData.stats.points : teamData.stats.noByePoints}
            </div>
        </div>
    );
}

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

function getLadderPosition(isPlaying: boolean, position: String) {
    if (isPlaying) {
        return <div className="w-6 h-6 border rounded-full live-match border-red-600"></div>;
    }

    return <span>{position}</span>;
}
