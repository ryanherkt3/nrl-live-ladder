import { COLOURCSSVARIANTS, CURRENTCOMP, getOrdinalNumber, getShortCode, MAINCOLOUR, NUMS } from '../lib/utils';
import { DrawInfo, Match, TeamData, TeamPoints, TeamStatuses } from '../lib/definitions';
import clsx from 'clsx';
import { getRoundFixtures, getPageVariables } from '../lib/nrl-draw-utils';
import PageDescription from './page-desc';

export default function MaxPoints({seasonDraw}: {seasonDraw: Array<DrawInfo>}) {
    const { allTeams, liveMatches } = getPageVariables(Object.values(seasonDraw), false);
    const { FINALS_TEAMS } = NUMS[CURRENTCOMP];

    const teamsByMaxPoints = [...allTeams].sort((a: TeamData, b: TeamData) => {
        return b.stats.maxPoints - a.stats.maxPoints;
    });
    const minPointsForSpots: TeamStatuses = {
        topTwo: teamsByMaxPoints[2].stats.maxPoints,
        topFour: teamsByMaxPoints[4].stats.maxPoints,
        finalsQualification: teamsByMaxPoints[FINALS_TEAMS].stats.maxPoints,
        eliminated: allTeams[FINALS_TEAMS - 1].stats.points,
    };

    const highestMaxPts = teamsByMaxPoints[0].stats.maxPoints;
    const lastPlacePts = allTeams[allTeams.length - 1].stats.points;

    return (
        <div className="px-6 py-8 flex flex-col gap-6 page-min-height">
            {
                getRoundFixturesSection(liveMatches, allTeams)
            }
            <PageDescription
                cssClasses={'text-xl font-semibold text-center'}
                description={'See where your team stands in the race for Finals Football'}
            />
            <div className="flex flex-col">
                <div className="w-full md:hidden max-md:flex flex-row items-center text-center py-1 font-semibold">
                    <div className="w-[15%] mr-4"></div>
                    <div className="w-[25%]">Points</div>
                    <div className="w-[25%]">Max Points</div>
                    <div className="w-[25%]">Best</div>
                    <div className="w-[25%]">Worst</div>
                </div>
                {
                    getTableRows(allTeams, true, highestMaxPts, lastPlacePts, minPointsForSpots, liveMatches)
                }
                <div className={`border-4 ${COLOURCSSVARIANTS[`${MAINCOLOUR}-border`]}`}></div>
                {
                    getTableRows(allTeams, false, highestMaxPts, lastPlacePts, minPointsForSpots, liveMatches)
                }
            </div>
        </div>
    );
}

/**
 * Get the rows for display on the page, split between the top 8 and bottom teams
 *
 * @param {Array<TeamData>} allTeams an object with all the teams
 * @param {boolean} topHalf whether to map against the top teams or the bottom ones
 * @param {number} highestMaxPts the highest max points value any team can get
 * @param {number} lastPlacePts the current points the last placed team has
 * @param {TeamStatuses} minPointsForSpots an object with the points required to attain a certain status (e.g top 2)
 * @param {Array<Match>} liveMatches a list of the ongoing match(es)
 * @returns
 */
function getTableRows(
    allTeams: Array<TeamData>,
    topHalf: boolean,
    highestMaxPts: number,
    lastPlacePts: number,
    minPointsForSpots: TeamStatuses,
    liveMatches: Array<Match>
) {
    const { FINALS_TEAMS, MATCHES } = NUMS[CURRENTCOMP];

    const topTeams = [...allTeams];
    const bottomTeams = topTeams.splice(FINALS_TEAMS);
    const teamList = topHalf ? topTeams : bottomTeams;

    const lastFinalist = topTeams[topTeams.length - 1];
    const { stats: lfStats } = lastFinalist;
    const firstEliminated = bottomTeams[0];
    const { stats: feStats } = firstEliminated;

    return teamList.map((team: TeamData) => {
        const { stats, name: nickname } = team;
        const { points: currentPoints, maxPoints } = stats;
        const { eliminated, topTwo, topFour, finalsQualification } = minPointsForSpots;

        let bgClassName = nickname.toLowerCase().replace(' ', '');

        if (nickname === 'Broncos' || nickname === 'Roosters') {
            bgClassName += '-gradient';
        }
        else if (nickname === 'Bears' || nickname === 'Jets' || nickname === 'Magpies') {
            bgClassName += `-${CURRENTCOMP}`;
        }

        // Display if a team is eliminated, qualified for finals football, or in the top 2/4 of the ladder
        let qualificationStatus = '';
        const isEliminated = maxPoints < eliminated ||
            (
                // Is also eliminated if last placed finals team has better points differential
                // when tied on points at end of season
                stats.played === MATCHES &&
                lfStats.points >= currentPoints &&
                lfStats['points difference'] > stats['points difference']
            );
        if (isEliminated) {
            qualificationStatus = '(E)';
        }
        else if (currentPoints > topTwo) {
            qualificationStatus = '(T2)';
        }
        else if (currentPoints > topFour) {
            qualificationStatus = '(T4)';
        }
        else if (currentPoints > finalsQualification  ||
            (
                // Is also qualified if top placed bottom team has worse points differential
                // when tied on points at end of season
                feStats.played === MATCHES &&
                feStats.points <= currentPoints &&
                feStats['points difference'] < stats['points difference']
            )
        ) {
            qualificationStatus = '(Q)';
        }

        const pointValues: TeamPoints = {
            lowestCurrentPoints: lastPlacePts,
            highestMaxPoints: highestMaxPts,
            currentPoints: currentPoints,
            maxPoints: maxPoints
        };

        let isPlaying = false;

        if (liveMatches) {
            for (const match of liveMatches) {
                isPlaying = match.awayTeam.nickName === nickname ||
                    match.homeTeam.nickName === nickname;

                if (isPlaying) {
                    break;
                }
            }
        }

        const eelsOrPanthersPlaying = nickname === 'Panthers' || nickname === 'Eels';
        const clsxMatrix = {
            [`bg-${bgClassName}`]: isPlaying && !isEliminated,
            'bg-faded': isPlaying && isEliminated,
            'text-white': isPlaying && !isEliminated && !eelsOrPanthersPlaying,
            'text-black': isPlaying && eelsOrPanthersPlaying,
            'bg-transparent text-black': !isPlaying
        };

        return (
            <div key={nickname} className="flex flex-row text-md text-center">
                <div className="text-left flex items-center font-semibold w-[15%] mr-4">
                    <span
                        className={
                            clsx(
                                'max-md:hidden md:block',
                                clsxMatrix
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
                                'max-md:block md:hidden',
                                clsxMatrix
                            )
                        }
                    >
                        {getShortCode(nickname)} {qualificationStatus}
                    </span>
                </div>
                <div className="w-full max-md:hidden md:flex flex-row items-center">
                    {
                        getPointCells(pointValues, nickname.toLowerCase().replace(' ', ''), isEliminated)
                    }
                </div>
                {
                    getLadderStatus(allTeams, pointValues, nickname, team)
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

    const { lowestCurrentPoints, highestMaxPoints, currentPoints, maxPoints } = pointValues;

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

            let bgName = `bg-${nickname}`;
            if (nickname === 'bears' || nickname === 'jets' || nickname === 'magpies') {
                bgName += `-${CURRENTCOMP}`;
            }
            if (useGradientBg || useAltBg) {
                bgName += useGradientBg ? '-gradient' : '-alt';
            }

            pointCells.push(
                <div
                    key={`${nickname}-${i}`}
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
            );
        }
        else {
            pointCells.push(
                <div key={`${nickname}-${i}`}className={commonClasses}></div>
            );
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
 * @param {TeamData} teamInfo info about the team whose ladder status is being updated here
 * @returns HTML object
 */
function getLadderStatus(
    teamList: Array<TeamData>,
    pointValues: TeamPoints,
    nickname: String,
    teamInfo: TeamData,
) {
    const { currentPoints, maxPoints } = pointValues;
    const isFinished = currentPoints === maxPoints;

    const teamsCanFinishAbove = teamList.filter((team: TeamData) => {
        const filteredTeamStats = team.stats;

        return filteredTeamStats.points > maxPoints ||
            (isFinished && team.name !== nickname &&
                filteredTeamStats.played === NUMS[CURRENTCOMP].MATCHES &&
                filteredTeamStats.points >= maxPoints &&
                filteredTeamStats['points difference'] > teamInfo.stats['points difference']
            );
    }).length;

    const teamsCanFinishBelow = teamList.filter((team: TeamData) => {
        const filteredTeamStats = team.stats;

        return team.name !== nickname && // not same team
            (
                (currentPoints < filteredTeamStats.maxPoints) ||
                (
                    filteredTeamStats.points === currentPoints &&
                    filteredTeamStats['points difference'] > teamInfo.stats['points difference']
                )
            );
    }).length;

    return (
        <div className="w-full md:hidden max-md:flex flex-row items-center">
            <div className="w-[25%] py-1">{currentPoints}</div>
            <div className="w-[25%]">{maxPoints}</div>
            <div className="w-[25%]">{getOrdinalNumber(teamsCanFinishAbove + 1)}</div>
            <div className="w-[25%]">{getOrdinalNumber(teamsCanFinishBelow + 1)}</div>
        </div>
    );
}

/**
 * Get the matches for display
 *
 * @param {Array<Match>} liveMatches
 * @param {Array<TeamData>} teamList list of teams
 * @returns HTML object or null if no live matches exist
 */
function getRoundFixturesSection(liveMatches: Array<Match>, teamList: Array<TeamData>) {
    if (liveMatches.length) {
        return (
            <div className="flex flex-col gap-4">
                <span className="text-xl font-semibold text-center">Current live fixture(s):</span>
                {
                    getRoundFixtures(liveMatches, teamList, false, false, undefined)
                }
            </div>
        );
    }

    return null;
}
