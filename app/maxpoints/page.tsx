'use client';

import { getOrdinalNumber, getShortCode, NUMS } from "../lib/utils";
import { DrawInfo, Match, TeamData, TeamPoints, TeamStatuses } from "../lib/definitions";
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

    let nrlDraw: Array<DrawInfo> = Object.values(seasonDraw);

    // Construct list of teams manually
    const teamList: Array<TeamData> = constructTeamData(nrlDraw[0].filterTeams);

    // Get current round number
    const currentRoundInfo: Array<DrawInfo> = nrlDraw.filter((round: any) => {
        return round.byes[0].isCurrentRound
    });

    const {selectedRoundId: currentRoundNo, fixtures} = currentRoundInfo[0];

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
    const minPointsForSpots: TeamStatuses = {
        topTwo: teamsByMaxPoints[2].stats.maxPoints,
        topFour: teamsByMaxPoints[4].stats.maxPoints,
        topEight: teamsByMaxPoints[8].stats.maxPoints,
        eliminated: topTeams[7].stats.points,
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

/**
 * Get the rows for display on the page, split between the top 8 and bottom teams
 *
 * @param {Array<TeamData>} allTeams an object with all the teams
 * @param {Array<TeamData>} teamList an object with a subset of all the teams (e.g. the top 8 teams) 
 * @param {number} firstPlaceMaxPts the max points the first placed team can get
 * @param {number} lastPlacePts the max points the last placed team can get
 * @param {TeamStatuses} minPointsForSpots an object with the points required to attain a certain status (e.g top 2)
 * @param {Array<Match>} liveMatch a list of the ongoing match(es) 
 * @returns 
 */
function getTableRows(
    allTeams: Array<TeamData>,
    teamList: Array<TeamData>,
    firstPlaceMaxPts: number,
    lastPlacePts: number,
    minPointsForSpots: TeamStatuses,
    liveMatch: Array<Match>
) {
    return teamList.map((team: TeamData) => {
        const {stats, name: nickname} = team;
        const {points: currentPoints, maxPoints} = stats;
        const {eliminated, topTwo, topFour, topEight} = minPointsForSpots;

        const bgClassName = nickname.toLowerCase().replace(' ', '') +  
            (nickname === 'Broncos' || nickname === 'Roosters' ? '-gradient' : '');

        // Display if a team is eliminated, qualified for finals football, or in the top 2/4 of the ladder
        let qualificationStatus = '';
        const isEliminated = maxPoints < eliminated;
        if (isEliminated) {
            qualificationStatus = '(E)';
        }
        else if (currentPoints > topTwo) {
            qualificationStatus = '(T2)';
        }
        else if (currentPoints > topFour) {
            qualificationStatus = '(T4)';
        }
        else if (currentPoints > topEight) {
            qualificationStatus = '(Q)';
        }

        const pointValues: TeamPoints = {
            lowestCurrentPoints: lastPlacePts,
            highestMaxPoints: firstPlaceMaxPts,
            currentPoints: currentPoints, 
            maxPoints: maxPoints
        }

        let isPlaying = false;

        if (liveMatch) {
            for (const match of liveMatch) {
                isPlaying = match.awayTeam.nickName === nickname ||
                    match.homeTeam.nickName === nickname;
                    
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
                        {getShortCode(nickname)} {qualificationStatus}
                    </span>
                </div>
                <div className="w-full hidden md:flex flex-row items-center">
                    {
                        getPointCells(pointValues, nickname.toLowerCase().replace(' ', ''), isEliminated)
                    }
                </div>
                {
                    getLadderStatus(allTeams, pointValues, nickname)
                }
            </div>
        );
    });
}

/**
 * Get the individual point cells for display on the desktop page.
 * Show the point value if a cell value is equal to either the team's current
 * or max points values.
 *
 * @param {TeamPoints} pointValues 
 * @param {string} nickname
 * @param {boolean} isEliminated
 * @returns {Array<Object>} HTML objects representing the point cells
 */
function getPointCells(pointValues: TeamPoints, nickname: string, isEliminated: boolean) {
    const pointCells = [];
    const commonClasses = 'flex-1 py-2 h-full';

    const {lowestCurrentPoints, highestMaxPoints, currentPoints, maxPoints} = pointValues;

    const altBgMidPoint = maxPoints === currentPoints ? 0 : (maxPoints + currentPoints) / 2;

    for (let i = lowestCurrentPoints; i <= highestMaxPoints; i++) {
        if (i >= currentPoints && i <= maxPoints) {
            const useGradientBg = !isEliminated && i === altBgMidPoint &&
                (nickname === 'roosters' || nickname === 'broncos');
            const useAltBg = !isEliminated && i > altBgMidPoint &&
                (
                    nickname === 'roosters' && maxPoints - i <= i - currentPoints ||
                    nickname === 'broncos' && maxPoints - i <= i - currentPoints
                );
            const blackTextBg = isEliminated || nickname === 'panthers' || nickname === 'eels' ||
                (!isEliminated && useAltBg && nickname === 'broncos');

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
                    {i === currentPoints || i === maxPoints 
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

/**
 * Get the ladder status for a team to be displayed on mobile devices.
 * Show the current & max points, and the lowest and highest ladder positions.
 *
 * @param {Array<TeamData>} teamList list of teams
 * @param {TeamPoints} pointValues
 * @param {String} nickname the team's name (e.g. Panthers)
 * @returns HTML object
 */
function getLadderStatus(teamList: Array<TeamData>, pointValues: TeamPoints, nickname: String) {
    const {currentPoints, maxPoints} = pointValues;

    const teamsCanFinishAbove = teamList.filter((team: TeamData) => {
        return team.stats.points > maxPoints
    }).length;
    const teamsCanFinishBelow = teamList.filter((team: TeamData) => {
        return team.name !== nickname && team.stats.maxPoints >= currentPoints
    }).length;

    return (
        <div className="w-full md:hidden flex flex-row items-center">
            <div className="w-[25%] py-1">{currentPoints}</div>
            <div className="w-[25%]">{maxPoints}</div>
            <div className="w-[25%]">{getOrdinalNumber(teamsCanFinishAbove + 1)}</div>
            <div className="w-[25%]">{getOrdinalNumber(teamsCanFinishBelow + 1)}</div>
        </div>
    );
}

/**
 * Get the current live matches for display
 *
 * @param {Array<Match>} liveMatches
 * @param {Array<TeamData>} teamList list of teams
 * @returns HTML object or null if no live matches exist
 */
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
