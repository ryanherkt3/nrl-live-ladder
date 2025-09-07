import RoundFixture from '../ui/fixture/round-fixture';
import LadderRow from '../ui/ladder/ladder-row';
import { DrawInfo, Match, PageVariables, TeamData } from './definitions';
import { getMinPointsForSpots, getQualificationStatus } from './qualification';
import { constructTeamData, constructTeamStats, teamSortFunction } from './team-stats';
import { NUMS } from './utils';

/**
 * Get all the fixtures for a particular round
 *
 * @param {boolean} fixtures the fixtures for the round
 * @param {Array<TeamData>} ladder ladder data
 * @param {boolean} isFinalsFootball if we are in finals football or not
 * @param {boolean} modifiable if the scores can be edited by the user (e.g. for the ladder predictor)
 * @param {Function | undefined} modifiedFixtureCb
 * @returns {Array<RoundFixture>}
 */
export function getRoundFixtures(
    fixtures: Array<Match>,
    ladder: Array<TeamData>,
    isFinalsFootball: boolean,
    modifiable: boolean,
    modifiedFixtureCb: Function | undefined
) {
    const liveFixtures = [];

    for (const fixture of fixtures) {
        const homeTeamWon = fixture.homeTeam.score > fixture.awayTeam.score;
        const awayTeamWon = fixture.homeTeam.score < fixture.awayTeam.score;
        const winningTeam = homeTeamWon ? 'homeTeam' : (awayTeamWon ? 'awayTeam' : 'draw');

        liveFixtures.push(
            <RoundFixture
                key={fixtures.indexOf(fixture)}
                data={fixture}
                winningTeam={winningTeam}
                ladder={ladder}
                isFinalsFootball={isFinalsFootball}
                modifiable={modifiable && fixture.matchMode === 'Pre'}
                modifiedFixtureCb={modifiedFixtureCb}
            />
        );
    }

    return liveFixtures;
}

/**
 * Get a row in the ladder.
 *
 * @param {boolean} isInTopSection if the team is in the top x of the competition
 * @param {Array<TeamData>} allTeams
 * @param {boolean} byePoints
 * @param {PageVariables} pageVariables
 * @param {String} currentComp
 * @param {boolean} isPredictorPage
 * @returns {LadderRow} React object
 */
export function getLadderRow(
    isInTopSection: boolean,
    allTeams: Array<TeamData>,
    byePoints: boolean,
    pageVariables: PageVariables,
    currentComp: string,
    isPredictorPage: boolean,
) {
    const { TEAMS, FINALS_TEAMS, WEEK_ONE_FINALS_FORMAT } = NUMS[currentComp];

    const teamList = isInTopSection ? allTeams.slice(0, FINALS_TEAMS) : allTeams.slice(FINALS_TEAMS);
    const indexAdd = isInTopSection ? 1 : FINALS_TEAMS + 1;

    const highlightRow = allTeams.filter((team) => {
        return team.qualificationStatus === '(E)';
    }).length < TEAMS - FINALS_TEAMS;

    return teamList.map((team: TeamData) => {
        // Check if team is currently playing
        let isPlaying = false;

        const { fixtures, currentRoundNo, nextRoundInfo, liveMatches } = pageVariables;
        const { name, stats, theme } = team;
        const { ROUNDS, FINALS_TEAMS } = NUMS[currentComp];

        if (liveMatches) {
            for (const match of liveMatches) {
                isPlaying = match.awayTeam.nickName === name || match.homeTeam.nickName === name;

                if (isPlaying) {
                    break;
                }
            }
        }

        // Get team's next fixture if there is one
        // If team has played (or is playing) get fixture from next round, otherwise get one from current round
        let filteredFixture = null;
        let nextTeam = '';
        let nextTeamTooltip = '';
        let nextMatchUrl = '';

        const ladderPos = teamList.indexOf(team) + indexAdd;

        if (!isPredictorPage) {
            const playedAndByes = stats.played + stats.byes;

            if (playedAndByes < currentRoundNo) {
                filteredFixture = fixtures.filter((fixture: Match) => {
                    return (name === fixture.homeTeam.nickName || name === fixture.awayTeam.nickName) &&
                        fixture.matchMode === 'Pre';
                });
            }
            else if (nextRoundInfo && nextRoundInfo.selectedRoundId !== currentRoundNo) {
                filteredFixture = nextRoundInfo.fixtures.filter((fixture: Match) => {
                    return name === fixture.homeTeam.nickName || name === fixture.awayTeam.nickName;
                });
            }

            if (filteredFixture && filteredFixture.length) {
                const { homeTeam, awayTeam, matchCentreUrl } = filteredFixture[0];

                if (name === homeTeam.nickName) {
                    nextTeam = awayTeam.theme.key;
                    nextTeamTooltip = awayTeam.nickName;
                }
                else {
                    nextTeam = homeTeam.theme.key;
                    nextTeamTooltip = homeTeam.nickName;
                }

                nextMatchUrl = matchCentreUrl;
            }
            else if (currentRoundNo < ROUNDS) {
                nextTeam = 'BYE';
            }
            else if (currentRoundNo === ROUNDS && ladderPos <= FINALS_TEAMS) {
                let finalsOppLadderPos;

                // Get week 1 finals matchup for a team if possible
                let matchUpFound = false;
                for (const weekOneMatchup of WEEK_ONE_FINALS_FORMAT) {
                    if (matchUpFound) {
                        break;
                    }

                    if (weekOneMatchup.includes(ladderPos)) {
                        finalsOppLadderPos = weekOneMatchup.filter((position: number) => {
                            return position !== ladderPos;
                        })[0];

                        matchUpFound = true;
                    }
                }

                if (finalsOppLadderPos) {
                    nextTeam = teamList[finalsOppLadderPos - 1].theme.key;
                    nextTeamTooltip = teamList[finalsOppLadderPos - 1].name;
                }
            }
        }

        return <LadderRow
            key={theme.key}
            teamData={team}
            position={ladderPos.toString()}
            isPlaying={isPlaying}
            highlightRow={highlightRow}
            byePoints={byePoints}
            predictorPage={isPredictorPage}
            nextTeam={nextTeam}
            nextTeamTooltip={nextTeamTooltip}
            nextMatchUrl={nextMatchUrl}
        />;
    });
}

/**
 * Get all the page variables
 *
 * @param {Array<DrawInfo>} seasonDraw
 * @param {Boolean} modifiable if the team stats can be modified (on the ladder predictor page)
 * @param {string} currentComp
 * @param {number} currentYear
 * @returns {PageVariables}
 */
export function getPageVariables(
    seasonDraw: Array<DrawInfo>,
    modifiable: boolean,
    currentComp: string,
    currentYear: number
) {
    // Construct list of teams manually
    const teamList: Array<TeamData> = constructTeamData(seasonDraw[0].filterTeams, currentComp);

    // Get current round number
    const currentRoundInfo: Array<DrawInfo> = seasonDraw.filter((round: DrawInfo) => {
        if (round.byes) {
            return round.byes[0].isCurrentRound;
        }

        return round.fixtures[0].isCurrentRound;
    });

    const { byes, fixtures, selectedRoundId: currentRoundNo } = currentRoundInfo[0];
    const { ROUNDS, FINALS_WEEKS } = NUMS[currentComp];

    let nextRoundInfo;
    if (currentRoundNo < ROUNDS + FINALS_WEEKS) {
        nextRoundInfo = seasonDraw[currentRoundNo];
    }
    const liveMatches = fixtures.filter((fixture: Match) => {
        return fixture.matchMode === 'Live' && fixture.matchState !== 'FullTime';
    });

    const allTeams = constructTeamStats(seasonDraw, currentRoundNo, teamList, modifiable, currentComp, currentYear)
        .sort((a: TeamData, b: TeamData) => {
            return teamSortFunction(true, a, b);
        });

    // Get each team's qualification status
    const minPointsForSpots = getMinPointsForSpots(teamList, currentComp);
    for (const team of teamList) {
        team.qualificationStatus = getQualificationStatus(team, teamList, minPointsForSpots, currentComp);
    }

    return {
        currentRoundInfo, byes, fixtures, currentRoundNo, nextRoundInfo, liveMatches, allTeams
    };
}

/**
 * Function to update which round is shown for the Fixtures component
 *
 * @param showPreviousRound whether the user chose to view the previous week's fixtures or the next
 * @param roundIndex the current round of fixtures being shown (e.g. 10)
 * @param seasonDraw
 * @param setRoundIndex the state update function
 * @param setFixturesToShow the state update function
 * @param setByeTeams the state update function
 */
export function updateFixturesToShow(
    showPreviousRound: boolean,
    roundIndex: number,
    seasonDraw: Array<DrawInfo>,
    setRoundIndex: Function,
    setFixturesToShow: Function,
    setByeTeams: Function,
) {
    const newRoundIndex = showPreviousRound ? roundIndex - 1 : roundIndex + 1;

    const newRoundInfo = seasonDraw.filter((rounds: DrawInfo) => {
        return rounds.selectedRoundId === newRoundIndex;
    });

    // Fixtures don't exist so return early
    if (!newRoundInfo) {
        return false;
    }

    const { fixtures, byes } = newRoundInfo[0];

    setRoundIndex(newRoundIndex);
    setFixturesToShow(fixtures);
    setByeTeams(byes);
}
