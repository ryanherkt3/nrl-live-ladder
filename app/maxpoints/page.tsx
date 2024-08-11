'use client';

import { getShortCode, NUMS } from "../lib/utils";
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
                {
                    getTableRows(topTeams, firstPlaceMaxPts, lastPlacePts, minPointsForSpots, liveMatch)
                }
                <div className="border-4 border-green-400"></div>
                {
                    getTableRows(bottomTeams, firstPlaceMaxPts, lastPlacePts, minPointsForSpots, liveMatch)
                }
            </div>
        </div>
    );
}

function getTableRows(
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
        const cssNickname = nickname.toLowerCase().replace(' ', '');

        // Display if a team is eliminated, qualified for finals football, or in the top 2/4 of the ladder
        let qualificationStatus = '';
        if (maxPoints < minPointsForSpots.elim) {
            qualificationStatus = '(E)';
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
                                    [`live-${cssNickname}`]: isPlaying,
                                    'text-white': isPlaying,
                                    'bg-transparent text-black': !isPlaying
                                }
                            )
                        }
                    >
                        {
                            nickname === 'Wests Tigers' ? 'Tigers' : nickname
                        } {qualificationStatus}
                    </span>
                    <span className="block md:hidden">
                        { getShortCode(nickname) } {qualificationStatus}
                    </span>
                </div>
                {
                    getPointCells(pointValues, cssNickname, qualificationStatus.includes('E'))
                }
            </div>
        ) 
    });
}

// TODO fix pointValues type
function getPointCells(pointValues: any, nickname: string, isEliminated: boolean) {
    const pointCells = [];
    const commonClasses = 'w-[2%] sm:w-[2.5%] sm:w-[3%] py-1';

    const {min, max, currentPts, maxPoints} = pointValues;

    for (let i = min; i <= max; i++) {
        if (i >= currentPts && i <= maxPoints) {
            const useAltBg = !isEliminated && 
                (
                    nickname === 'roosters' && maxPoints - i <= i - currentPts ||
                    nickname === 'broncos' && maxPoints - i <= i - currentPts
                );
            const blackTextBg = isEliminated || nickname === 'panthers' || nickname === 'eels' ||
                (!isEliminated && useAltBg && nickname === 'broncos');

            const bgName = `bg-${nickname}${useAltBg ? '-alt' : ''}`;

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
                        ? <span 
                            className={
                                clsx(
                                    {
                                        'hidden xs:block left-2': i === currentPts,
                                        'right-5 sm:right-3 md:right-2': i === maxPoints,
                                        'absolute z-10': i === currentPts || i === maxPoints,
                                        'relative': i !== currentPts || i !== maxPoints,
                                    }
                                )        
                            }
                        >{i}</span>
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
