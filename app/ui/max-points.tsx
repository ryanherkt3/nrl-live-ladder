import { COLOURCSSVARIANTS, getOrdinalNumber, getShortCode, NUMS } from '../lib/utils';
import { DrawInfo, Match, TeamData, TeamPoints } from '../lib/definitions';
import clsx from 'clsx';
import { getRoundFixtures, getPageVariables } from '../lib/nrl-draw-utils';
import PageDescription from './page-desc';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { getMinPointsForSpots, getQualificationStatus } from '../lib/qualification';

export default function MaxPoints({seasonDraw}: {seasonDraw: Array<DrawInfo>}) {
    const currentComp = useSelector((state: RootState) => state.currentComp.value);
    const { comp } = currentComp;

    const currentYear = useSelector((state: RootState) => state.currentYear.value);
    const { year } = currentYear;

    const mainSiteColour = useSelector((state: RootState) => state.mainSiteColour.value);
    const { colour } = mainSiteColour;

    const { allTeams, liveMatches } = getPageVariables(Object.values(seasonDraw), false, comp, year);

    const teamsByMaxPoints = [...allTeams].sort((a: TeamData, b: TeamData) => {
        return b.stats.maxPoints - a.stats.maxPoints;
    });

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
                    getTableRows(
                        allTeams, true, highestMaxPts, lastPlacePts, liveMatches, comp
                    )
                }
                <div className={`border-4 ${COLOURCSSVARIANTS[`${colour}-border`]}`}></div>
                {
                    getTableRows(
                        allTeams, false, highestMaxPts, lastPlacePts, liveMatches, comp
                    )
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
 * @param {Array<Match>} liveMatches a list of the ongoing match(es)
 * @param {string} currentComp
 * @returns
 */
function getTableRows(
    allTeams: Array<TeamData>,
    topHalf: boolean,
    highestMaxPts: number,
    lastPlacePts: number,
    liveMatches: Array<Match>,
    currentComp: string
) {
    const { FINALS_TEAMS } = NUMS[currentComp];

    const topTeams = [...allTeams];
    const bottomTeams = topTeams.splice(FINALS_TEAMS);
    const teamList = topHalf ? topTeams : bottomTeams;

    return teamList.map((team: TeamData) => {
        const { stats, name: nickname } = team;
        const { points: currentPoints, maxPoints } = stats;

        let bgClassName = nickname.toLowerCase().replace(' ', '');

        if (nickname === 'Broncos' || nickname === 'Roosters') {
            bgClassName += '-gradient';
        }
        else if (nickname === 'Bears' || nickname === 'Jets' || nickname === 'Magpies') {
            bgClassName += `-${currentComp}`;
        }

        const qualificationStatus = getQualificationStatus(
            team, allTeams, getMinPointsForSpots(allTeams, currentComp), currentComp
        );
        const isEliminated = qualificationStatus === '(E)';

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
                        {getShortCode(nickname, currentComp)} {qualificationStatus}
                    </span>
                </div>
                <div className="w-full max-md:hidden md:flex flex-row items-center">
                    {
                        getPointCells(pointValues, nickname.toLowerCase().replace(' ', ''), isEliminated, currentComp)
                    }
                </div>
                {
                    getLadderStatus(allTeams, pointValues, nickname, team, currentComp)
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
 * @param {string} currentComp
 * @returns {Array<Object>} HTML objects representing the point cells
 */
function getPointCells(pointValues: TeamPoints, nickname: string, isEliminated: boolean, currentComp: string) {
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
                bgName += `-${currentComp}`;
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
 * @param {string} currentComp
 * @returns HTML object
 */
function getLadderStatus(
    teamList: Array<TeamData>,
    pointValues: TeamPoints,
    nickname: String,
    teamInfo: TeamData,
    currentComp: string,
) {
    const { currentPoints, maxPoints } = pointValues;
    const isFinished = currentPoints === maxPoints;

    const teamsCanFinishAbove = teamList.filter((team: TeamData) => {
        const filteredTeamStats = team.stats;
        const filteredTeamPointsWithByes = ((team.stats.wins + NUMS[currentComp].BYES) * 2) + team.stats.drawn;

        return filteredTeamPointsWithByes > maxPoints ||
            (
                isFinished && team.name !== nickname &&
                filteredTeamStats.played === NUMS[currentComp].MATCHES &&
                filteredTeamPointsWithByes >= maxPoints &&
                filteredTeamStats['points difference'] > teamInfo.stats['points difference']
            );
    });

    const teamsCanFinishBelow = teamList.filter((team: TeamData) => {
        const filteredTeamStats = team.stats;
        const filteredTeamHasFinished = filteredTeamStats.played === NUMS[currentComp].MATCHES;

        if (team.name !== nickname) {
            if (filteredTeamStats.maxPoints > currentPoints) {
                return true;
            }
            if (filteredTeamStats.maxPoints < currentPoints) {
                return false;
            }

            // If maxPoints is equal to a team's current points, check if the teams have finished or not:
            // 1. Both finished > check points difference
            // 2. Only one has finished > check filtered team's points is greater than team's max points
            // 3. If both still playing then return true
            if (filteredTeamHasFinished && isFinished) {
                return filteredTeamStats['points difference'] > teamInfo.stats['points difference'];
            }
            else if (isFinished || filteredTeamHasFinished) {
                return filteredTeamStats.maxPoints >= currentPoints;
            }

            return true;
        }

        return false;
    });

    return (
        <div className="w-full md:hidden max-md:flex flex-row items-center">
            <div className="w-[25%] py-1">{currentPoints}</div>
            <div className="w-[25%]">{maxPoints}</div>
            <div className="w-[25%]">{getOrdinalNumber(teamsCanFinishAbove.length + 1)}</div>
            <div className="w-[25%]">{getOrdinalNumber(teamsCanFinishBelow.length + 1)}</div>
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
