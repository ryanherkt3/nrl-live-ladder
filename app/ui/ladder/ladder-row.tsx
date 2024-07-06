import { TeamData, NextTeam } from "../../lib/definitions";
import { getShortCode } from "../../lib/utils";
import TeamImage from "../team-image";

export default function LadderRow(
    { 
        data, 
        position,
        isPlaying,
        byePoints 
    }: { 
        data: TeamData;
        position: String;
        isPlaying: boolean;
        byePoints: boolean
    }
) {
    let statsData = isPlaying && data.liveStats ? data.liveStats : data.stats;

    return (
        <div className="flex flex-row gap-2 py-1 items-center text-center text-lg">
            <div className="w-[10%] md:w-[5%] flex justify-center flex-row gap-2 font-semibold">
                {
                    getLiveStatus(isPlaying)
                }
                <span>{position}</span>
            </div>
            <div className="hidden sm:flex w-[15%] sm:w-[8%] justify-center">
                <TeamImage imageLink='' teamKey={data.theme.key} />
            </div>
            <div className="w-[25%] sm:w-[15%] text-left">
                <span className='hidden md:block'>{data.teamNickname}</span>
                <span className='block md:hidden'>
                    {
                        getShortCode(data.teamNickname)
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
                    getNextFixture(data.next)
                }
            </div>
            <div className="w-[15%] sm:w-[6%] font-semibold">
                {byePoints ? statsData.points : statsData.noByePoints}
            </div>
        </div>
    );
}

function getNextFixture(nextFixture: NextTeam) {
    if (nextFixture.isBye) {
        return 'BYE';
    }

    // Team is eliminated for the season
    if (!nextFixture.matchCentreUrl || !nextFixture.theme.key) {
        return null;
    }

    return <TeamImage imageLink={nextFixture.matchCentreUrl} teamKey={nextFixture.theme.key} />;
}

function getLiveStatus(isPlaying: boolean) {
    if (isPlaying) {
        return <div className="w-6 border rounded-full live-match border-red-600"></div>;
    }

    return null;
}
