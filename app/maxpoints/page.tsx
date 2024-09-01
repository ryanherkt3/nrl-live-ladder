'use client';

import { getNumberSuffix, getShortCode, NUMS } from "../lib/utils";
import { DrawInfo, Match, TeamData } from "../lib/definitions";
import clsx from "clsx";
import useSWR from "swr";
import axios from "axios";
import { constructTeamData, constructTeamStats, teamSortFunction } from "../lib/nrl-draw-utils";
import RoundFixture from "../ui/fixture/round-fixture";
import SkeletonMaxPoints from "../ui/skeletons/skeleton-max-points";

// export const metadata: Metadata = {
//     title: 'NRL Max Points',
// }

export default function MaxPointsPage() {
    const fetcher = (url: string) => axios.get(url).then(res => res.data)
    const { data: seasonDraw, error, isLoading } = useSWR('/api/seasondraw', fetcher);
    
    if (error) {
        return <div className="px-8 py-6 flex flex-col gap-6">Failed to load!</div>;
    }
    if (isLoading) {
        return <SkeletonMaxPoints />;
    }

    let nrlDraw: any = Object.values(seasonDraw);

    // Construct list of teams manually
    const teamList: Array<TeamData> = constructTeamData(nrlDraw[0].filterTeams);

    // Get current round number
    const currentRoundInfo: Array<DrawInfo> = nrlDraw.filter((round: any) => {
        return round.byes[0].isCurrentRound
    });

    const currentRoundNo = currentRoundInfo[0].selectedRoundId;

    const fixtures = currentRoundInfo[0].fixtures;

    const liveMatch = fixtures.filter((fixture: Match) => {
        return fixture.matchMode === 'Live';
    });
    
    const allTeams = constructTeamStats(nrlDraw, currentRoundNo, teamList)
        .sort((a: TeamData, b: TeamData) => {
            return teamSortFunction(true, a, b)
        });    

    const topTeams = [...allTeams];
    const bottomTeams = topTeams.splice(NUMS.FINALS_TEAMS);

    const firstPlaceMaxPts = allTeams[0].stats.maxPoints;
    const lastPlacePts = allTeams[allTeams.length - 1].stats.points;

    const teamsByMaxPoints = [...allTeams].sort((a: TeamData, b: TeamData) => {
        return b.stats.maxPoints - a.stats.maxPoints;
    });
    const minPointsForSpots = {
        t2: teamsByMaxPoints[2].stats.maxPoints,
        t4: teamsByMaxPoints[4].stats.maxPoints,
        t8: teamsByMaxPoints[8].stats.maxPoints,
        elim: topTeams[7].stats.points,
    };

    return (
        <div className="px-6 py-8 flex flex-col gap-6 page-min-height">
            { 
                getLiveFixtures(liveMatch, allTeams) 
            }
            <div className="text-xl font-semibold text-center">
                See where your team stands in the race for Finals Football
            </div>
            <div className="flex flex-col">
                <div className="w-full md:hidden flex flex-row items-center text-center py-1 font-semibold">
                    <div className="w-[15%] mr-4"></div>
                    <div className="w-[25%]">Points</div>
                    <div className="w-[25%]">Max Points</div>
                    <div className="w-[25%]">Best</div>
                    <div className="w-[25%]">Worst</div>
                </div>
                {
                    getTableRows(allTeams, topTeams, firstPlaceMaxPts, lastPlacePts, minPointsForSpots, liveMatch)
                }
                <div className="border-4 border-green-400"></div>
                {
                    getTableRows(allTeams, bottomTeams, firstPlaceMaxPts, lastPlacePts, minPointsForSpots, liveMatch)
                }
            </div>
        </div>
    );
}

function getTableRows(
    allTeams: Array<TeamData>,
    teamList: Array<TeamData>,
    firstPlaceMaxPts: number,
    lastPlacePts: number,
    minPointsForSpots: any, // TODO fix type
    liveMatch: Array<Match>
) {
    return teamList.map((team: TeamData) => {
        const currentPoints = team.stats.points;
        const maxPoints = team.stats.maxPoints;
        
        const nickname = team.teamNickname;

        const bgClassName = nickname.toLowerCase().replace(' ', '') +  
            (nickname === 'Broncos' || nickname === 'Roosters' ? '-gradient' : '');

        // Display if a team is eliminated, qualified for finals football, or in the top 2/4 of the ladder
        let qualificationStatus = '';
        let isEliminated = false;
        if (maxPoints < minPointsForSpots.elim) {
            qualificationStatus = '(E)';
            isEliminated = true;
        }
        else if (currentPoints > minPointsForSpots.t2) {
            qualificationStatus = '(T2)';
        }
        else if (currentPoints > minPointsForSpots.t4) {
            qualificationStatus = '(T4)';
        }
        else if (currentPoints > minPointsForSpots.t8) {
            qualificationStatus = '(Q)';
        }

        const pointValues = {
            min: lastPlacePts,
            max: firstPlaceMaxPts,
            currentPts: currentPoints, 
            maxPoints: maxPoints
        }

        let isPlaying = false;

        if (liveMatch) {
            for (const match of liveMatch) {
                isPlaying = match.awayTeam.nickName === team.teamNickname ||
                    match.homeTeam.nickName === team.teamNickname;
                    
                if (isPlaying) {
                    break;
                }
            }
        }

        return (
            <div key={nickname} className="flex flex-row text-md text-center">
                <div className="text-left flex items-center font-semibold w-[15%] mr-4">
                    <span 
                        className={
                            clsx(
                                'hidden md:block',
                                {
                                    [`bg-${bgClassName}`]: isPlaying && !isEliminated,
                                    'bg-faded': isPlaying && isEliminated,
                                    'text-white': isPlaying && !isEliminated && nickname !== 'Panthers',
                                    'text-black': isPlaying && nickname === 'Panthers',
                                    'bg-transparent text-black': !isPlaying
                                }
                            )
                        }
                    >
                        {
                            nickname === 'Wests Tigers' ? 'Tigers' : nickname
                        } {qualificationStatus}
                    </span>
                    <span 
                        className={
                            clsx(
                                'block md:hidden',
                                {
                                    [`bg-${bgClassName}`]: isPlaying && !isEliminated,
                                    'bg-faded': isPlaying && isEliminated,
                                    'text-white': isPlaying && !isEliminated && nickname !== 'Panthers',
                                    'text-black': isPlaying && nickname === 'Panthers',
                                    'bg-transparent text-black': !isPlaying
                                }
                            )
                        }
                    >
                        { getShortCode(nickname) } {qualificationStatus}
                    </span>
                </div>
                <div className="w-full hidden md:flex flex-row items-center">
                    {
                        getPointCells(pointValues, nickname.toLowerCase(), isEliminated)
                    }
                </div>
                {
                    getLadderStatus(allTeams, pointValues, nickname)
                }
            </div>
        );
    });
}

// TODO fix pointValues type
function getPointCells(pointValues: any, nickname: string, isEliminated: boolean) {
    const pointCells = [];
    const commonClasses = 'flex-1 py-2 h-full';

    const {min, max, currentPts, maxPoints} = pointValues;

    const altBgMidPoint = maxPoints === currentPts ? 0 : (maxPoints + currentPts) / 2;

    for (let i = min; i <= max; i++) {
        if (i >= currentPts && i <= maxPoints) {

            const useGradientBg = !isEliminated && i === altBgMidPoint &&
                (nickname === 'Roosters' || nickname === 'Broncos');
            const useAltBg = !isEliminated && i > altBgMidPoint &&
                (
                    nickname === 'Roosters' && maxPoints - i <= i - currentPts ||
                    nickname === 'Broncos' && maxPoints - i <= i - currentPts
                );
            const blackTextBg = isEliminated || nickname === 'Panthers' || nickname === 'Eels' ||
                (!isEliminated && useAltBg && nickname === 'Broncos');

            const bgName = `bg-${nickname}${useGradientBg ? '-gradient' : useAltBg ? '-alt' : ''}`;

            pointCells.push(
                <div 
                    className={
                        clsx(
                            `${commonClasses} relative font-semibold`,
                            {
                                'bg-faded': isEliminated,
                                [bgName]: !isEliminated,
                                'text-black': blackTextBg,
                                'text-white': !blackTextBg,
                            }
                        )        
                    }
                >
                    {i === currentPts || i === maxPoints 
                        ? <span>{i}</span>
                        : null
                    }
                </div>
            )
        }
        else {
            pointCells.push(
                <div className={commonClasses}></div>
            )
        }
    }
    
    return pointCells;
}

// TODO fix pointValues type
function getLadderStatus(teamList: Array<TeamData>, pointValues: any, nickname: String) {
    const {currentPts, maxPoints} = pointValues;

    const teamsCanFinishAbove = teamList.filter((team: TeamData) => {
        return team.stats.points > maxPoints
    }).length;
    const teamsCanFinishBelow = teamList.filter((team: TeamData) => {
        return team.teamNickname !== nickname && team.stats.maxPoints >= currentPts
    }).length;

    return (
        <div className="w-full md:hidden flex flex-row items-center">
            <div className="w-[25%] py-1">{currentPts}</div>
            <div className="w-[25%]">{maxPoints}</div>
            <div className="w-[25%]">{getNumberSuffix(teamsCanFinishAbove + 1)}</div>
            <div className="w-[25%]">{getNumberSuffix(teamsCanFinishBelow + 1)}</div>
        </div>
    );
}

function getLiveFixtures(liveMatches: Array<Match>, teamList: Array<TeamData>) {
    if (liveMatches.length) {
        return (
            <div className="flex flex-col gap-4">
                <span className="text-xl font-semibold text-center">Current live fixture(s):</span>
                { 
                    liveMatches.map((match: Match) => {
                        const homeTeamWon = match.homeTeam.score > match.awayTeam.score;
                        const awayTeamWon = match.homeTeam.score < match.awayTeam.score;
                    
                        let winningTeam = homeTeamWon ? 'homeTeam' : (awayTeamWon ? 'awayTeam' : 'draw');
                    
                        return (
                            <RoundFixture 
                                key={liveMatches.indexOf(match)}
                                data={match}
                                winningTeam={winningTeam}
                                ladder={teamList}
                            />
                        );
                    })
                }
            </div>
        );
    }

    return null;
}
