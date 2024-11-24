import RoundFixture from '../ui/fixture/round-fixture';
import { DrawInfo, Match, TeamData } from './definitions';
import { CURRENTYEAR, NUMS } from './utils';

/**
 * Construct the data for a team (statistics, team name, theme key)
 *
 * @param {Array<TeamData>} teams
 * @returns {Array<TeamData>} the list of teams
 */
export function constructTeamData(teams: Array<TeamData>) {
    const teamList: Array<TeamData> = [];

    for (const team of teams) {
        teamList.push({
            stats: {
                played: 0,
                wins: 0,
                drawn: 0,
                lost: 0,
                byes: 0,
                'points for': 0,
                'points against': 0,
                'points difference': 0,
                points: 0,
                noByePoints: 0,
                maxPoints: getMaxPoints(0, 0)
            },
            name: team.name,
            theme: {
                key: team.theme.key
            }
        });
    }

    return teamList;
}

/**
 * Get a team's maximum points
 *
 * @param {number} losses
 * @param {number} draws
 * @returns {number}
 */
export function getMaxPoints(losses: number, draws: number) {
    const { BYES: byes, WIN_POINTS, MATCHES } = NUMS;

    const perfectSeasonPts = WIN_POINTS * MATCHES;

    console.log(perfectSeasonPts);

    const pointsLost = perfectSeasonPts - (WIN_POINTS * losses) - draws;

    return pointsLost + (WIN_POINTS * byes);
}

/**
 * Construct a team's statistics (wins, points etc)
 *
 * @param {Array<DrawInfo>} seasonDraw the information for each round
 * @param {number} currentRoundNo
 * @param {Array<TeamData>} teams
 * @param {Boolean} modifiable if the team stats can be modified (on the ladder predictor page)
 * @returns {Array<TeamData>} the list of teams
 */
export function constructTeamStats(
    seasonDraw: Array<DrawInfo>,
    currentRoundNo: number,
    teams: Array<TeamData>,
    modifiable: boolean,
) {
    const { WIN_POINTS } = NUMS;

    const updateStats = (team: TeamData, teamScore: number, oppScore: number) => {
        team.stats.played += 1;
        team.stats.wins += teamScore > oppScore ? 1 : 0;
        team.stats.drawn += teamScore === oppScore ? 1 : 0;
        team.stats.lost += teamScore < oppScore ? 1 : 0;
        team.stats['points for'] += teamScore;
        team.stats['points against'] += oppScore;
        team.stats['points difference'] = team.stats['points for'] - team.stats['points against'];
        team.stats.points = (WIN_POINTS * team.stats.wins) + team.stats.drawn +
            (WIN_POINTS * team.stats.byes);
        team.stats.noByePoints = team.stats.points - (WIN_POINTS * team.stats.byes);
        team.stats.maxPoints = getMaxPoints(team.stats.lost, team.stats.drawn);
    };

    for (const round of seasonDraw) {
        // Do not count stats for games not started or finals games
        if (round.selectedRoundId > currentRoundNo) {
            break;
        }

        for (const bye of round.byes) {
            const byeTeam = teams.filter((team: TeamData) => {
                return bye.teamNickName === team.name;
            })[0];

            const playedRoundFixtures = round.fixtures.filter((fixture) => {
                return fixture.matchMode !== 'Pre';
            });

            // If a fixture has been played (or is being played) for a particular round,
            // give the bye team their points
            if (playedRoundFixtures.length) {
                byeTeam.stats.byes += 1;
                byeTeam.stats.points = (WIN_POINTS * byeTeam.stats.wins) + byeTeam.stats.drawn +
                    (WIN_POINTS * byeTeam.stats.byes);
                byeTeam.stats.noByePoints = byeTeam.stats.points - (WIN_POINTS * byeTeam.stats.byes);
            }
        }

        for (const fixture of round.fixtures) {
            const { matchMode, homeTeam, awayTeam, roundTitle, matchCentreUrl } = fixture;
            const currentYear = CURRENTYEAR;

            // If match not started and on ladder page break away
            if (matchMode === 'Pre' && !modifiable) {
                break;
            }

            const homeFixtureTeam = teams.filter((team: TeamData) => {
                return homeTeam.nickName === team.name;
            })[0];

            const awayFixtureTeam = teams.filter((team: TeamData) => {
                return awayTeam.nickName === team.name;
            })[0];

            // Update score from localStorage (if possible) if on ladder predictor page
            if (modifiable && localStorage[`predictedMatches${currentYear}`]) {
                const slug = matchCentreUrl.split('/').filter(i => i)[4]; // homeTeam-v-awayTeam
                const round = parseInt(roundTitle.split(' ')[1]);

                const predictions = JSON.parse(localStorage[`predictedMatches${currentYear}`]);
                if (predictions[round] && predictions[round][slug]) {
                    const scores: string[] = Object.values(predictions[round][slug]);
                    homeTeam.score = parseInt(scores[0]);
                    awayTeam.score = parseInt(scores[1]);
                }
            }

            const { score: homeScore } = homeTeam;
            const { score: awayScore } = awayTeam;

            // Only update team stats if both scores are numeric and non-NaN
            const isValidHomeScore = typeof homeScore === 'number' && !isNaN(homeScore);
            const isValidAwayScore = typeof awayScore === 'number' && !isNaN(awayScore);
            if (isValidHomeScore && isValidAwayScore) {
                updateStats(homeFixtureTeam, homeScore, awayScore);
                updateStats(awayFixtureTeam, awayScore, homeScore);
            }
        }
    }

    return teams;
}

/**
 * Function to sort the list of teams to construct a ladder in descending order by:
 * 1. Points
 * 2. Points differential
 *
 * @param {boolean} showByes if the bye toggle (if it exists) is turned on
 * @param {teamData} a team one
 * @param {teamData} b team two
 * @returns {boolean} which team (if any) should be ranked higher
 */
export function teamSortFunction(showByes: boolean, a: TeamData, b: TeamData) {
    const { stats: bStats } = b;
    const { points: bPoints, noByePoints: bNoByePoints } = bStats;
    const { stats: aStats } = a;
    const { points: aPoints, noByePoints: aNoByePoints } = aStats;

    if (showByes) {
        if (bPoints !== aPoints) {
            return bPoints - aPoints;
        }
        return bStats['points difference'] - aStats['points difference'];
    }

    if (bNoByePoints !== aNoByePoints) {
        return bNoByePoints - aNoByePoints;
    }
    return bStats['points difference'] - aStats['points difference'];
}

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
 * Get all the page variables
 *
 * @param {Array<DrawInfo>} seasonDraw
 * @param {Boolean} modifiable if the team stats can be modified (on the ladder predictor page)
 * @returns {PageVariables}
 */
export function getPageVariables(seasonDraw: Array<DrawInfo>, modifiable: boolean) {
    // Construct list of teams manually
    const teamList: Array<TeamData> = constructTeamData(seasonDraw[0].filterTeams);

    // Get current round number
    const currentRoundInfo: Array<DrawInfo> = seasonDraw.filter((round: DrawInfo) => {
        if (round.byes) {
            return round.byes[0].isCurrentRound;
        }

        return round.fixtures[0].isCurrentRound;
    });

    const { byes, fixtures, selectedRoundId: currentRoundNo } = currentRoundInfo[0];
    const { ROUNDS, FINALS_WEEKS } = NUMS;

    let nextRoundInfo;
    if (currentRoundNo < ROUNDS + FINALS_WEEKS) {
        nextRoundInfo = seasonDraw[currentRoundNo];
    }
    const liveMatches = fixtures.filter((fixture: Match) => {
        return fixture.matchMode === 'Live';
    });

    const allTeams = constructTeamStats(seasonDraw, currentRoundNo, teamList, modifiable)
        .sort((a: TeamData, b: TeamData) => {
            return teamSortFunction(true, a, b);
        });

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

    // Fixtures don't exist so return early
    if (!seasonDraw[newRoundIndex]) {
        return false;
    }

    const { fixtures, byes } = seasonDraw[newRoundIndex];

    setRoundIndex(newRoundIndex);
    setFixturesToShow(fixtures);
    setByeTeams(byes);
}
