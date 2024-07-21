import { TeamData, NextTeam } from "../../lib/definitions";
import { getShortCode, NUMS } from "../../lib/utils";
import SkeletonByeCell from "../skeletons/skeleton-bye-cell";
import TeamImage from "../team-image";
import axios from "axios";
import useSWRImmutable from "swr/immutable";

export default function LadderRow(
    { 
        teamData, 
        position,
        isPlaying,
        isOnBye,
        byePoints,
        currentRound,
        teamId
    }: { 
        teamData: TeamData;
        position: String;
        isPlaying: boolean;
        isOnBye: boolean;
        byePoints: boolean;
        currentRound: number;
        teamId: number;
    }
) {
    let statsData = isPlaying && teamData.liveStats ? teamData.liveStats : teamData.stats;
    const byeCounted = isOnBye && teamData.next.isBye && statsData.played + statsData.byes === currentRound;

    const fetcher = (url: string) => axios.get(url).then(res => res.data)
    const nextRound = useSWRImmutable(isOnBye || isPlaying ? `/api/nextround?teamid=${teamId}` : null, fetcher);

    return (
        <div className="flex flex-row gap-2 py-1 items-center text-center text-lg">
            <div className="w-[10%] md:w-[5%] flex justify-center flex-row gap-2 font-semibold">
                {
                    isPlaying ? getLiveStatus(isPlaying) : <span>{position}</span>
                }
            </div>
            <div className="hidden sm:flex w-[15%] sm:w-[8%] justify-center">
                <TeamImage imageLink='' teamKey={teamData.theme.key} />
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
                    getNextFixture(teamData.next, currentRound, byeCounted, isPlaying, teamId, nextRound)
                }
            </div>
            <div className="w-[15%] sm:w-[6%] font-semibold">
                {byePoints ? teamData.stats.points : teamData.stats.noByePoints}
            </div>
        </div>
    );
}

function getNextFixture(
    nextFixture: NextTeam,
    currentRound: number,
    byeCounted: boolean,
    isPlaying: boolean,
    teamId: number,
    nextRound: any, // TODO fix type
) {
    // Get the next fixture if:
    // 1. the bye has been counted already
    // 2. the team is playing their current opponent
    if (byeCounted || isPlaying) {
        if (nextRound) {
            const data = nextRound.data;
            
            if (data) {
                // Team is eliminated for the season (or the next fixture is not yet known)
                if (currentRound === NUMS.ROUNDS) {
                    return null;
                }
                
                const matchAfterBye = data.fixtures[currentRound];
    
                if (matchAfterBye.type === 'Bye') {
                    return 'BYE';
                }
    
                const opponent = matchAfterBye.homeTeam.teamId === teamId ?
                    matchAfterBye.awayTeam : matchAfterBye.homeTeam;
                const imageLink = `https://nrl.com${matchAfterBye.matchCentreUrl}`;
    
                return <TeamImage imageLink={imageLink} teamKey={opponent.theme.key} />;
            }
        }
        return <SkeletonByeCell />;
    }
    else {
        if (nextFixture.isBye) {
            return 'BYE';
        }
    
        // Team is eliminated for the season (or the next fixture is not yet known)
        if (!nextFixture.matchCentreUrl) {
            return null;
        }
    
        return <TeamImage imageLink={nextFixture.matchCentreUrl} teamKey={nextFixture.theme.key} />;
    }
}

function getLiveStatus(isPlaying: boolean) {
    if (isPlaying) {
        return <div className="w-6 h-6 border rounded-full live-match border-red-600"></div>;
    }

    return null;
}
