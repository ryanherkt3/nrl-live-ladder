import { TeamData, DrawInfo } from './definitions';
import { NUMS } from './utils';

/**
 * Construct the data for a team (statistics, team name, theme key)
 *
 * @param {Array<TeamData>} teams
 * @param {string} currentComp
 * @returns {Array<TeamData>} the list of teams
 */
export function constructTeamData(teams: Array<TeamData>, currentComp: string) {
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
                maxPoints: getMaxPoints(0, 0, currentComp)
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
 * @param {string} currentComp
 * @returns {number}
 */
export function getMaxPoints(losses: number, draws: number, currentComp: string) {
    const { BYES: byes, WIN_POINTS, MATCHES } = NUMS[currentComp];

    const perfectSeasonPts = WIN_POINTS * MATCHES;

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
 * @param {string} currentComp
 * @param {number} currentYear
 * @returns {Array<TeamData>} the list of teams
 */
export function constructTeamStats(
    seasonDraw: Array<DrawInfo>,
    currentRoundNo: number,
    teams: Array<TeamData>,
    modifiable: boolean,
    currentComp: string,
    currentYear: number,
) {
    const { WIN_POINTS, ROUNDS } = NUMS[currentComp];

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
        team.stats.maxPoints = getMaxPoints(team.stats.lost, team.stats.drawn, currentComp);
    };

    let roundsCalculated = 1;
    for (const round of seasonDraw) {
        // Do not count stats for finals games
        if (roundsCalculated > ROUNDS) {
            break;
        }

        if (round.byes) {
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
        }

        for (const fixture of round.fixtures) {
            const { matchMode, homeTeam, awayTeam, roundTitle, matchCentreUrl } = fixture;

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
            const prediction = localStorage.getItem(`predictedMatches${currentYear}${currentComp}`);
            if (modifiable && prediction) {
                const teamsIndex = currentComp.includes('nrl') ? 4 : 6;
                const slug = matchCentreUrl.split('/').filter(i => i)[teamsIndex]; // homeTeam-v-awayTeam

                const round = parseInt(roundTitle.split(' ')[1]);
                const predictions = JSON.parse(prediction);

                if (predictions[round] && predictions[round][slug]) {
                    const prediction = predictions[round][slug];

                    const homeScore = prediction[homeTeam.nickName.toLowerCase().replace(' ', '-')];
                    const awayScore = prediction[awayTeam.nickName.toLowerCase().replace(' ', '-')];

                    const cleanUpPredictions = () => {
                        delete predictions[round][slug];
                        if (Object.values(predictions[round]).length === 0) {
                            delete predictions[round];
                        }

                        // If no predictions, delete the localStorage entry,
                        // otherwise update it with the new predictions
                        if (['null', '""', '{}'].includes(JSON.stringify(predictions))) {
                            localStorage.removeItem(`predictedMatches${currentYear}${currentComp}`);
                        }
                        else {
                            localStorage.setItem(
                                `predictedMatches${currentYear}${currentComp}`, JSON.stringify(predictions)
                            );
                        }
                    };

                    const bothScoresInvalid = [null, ''].includes(homeScore) && [null, ''].includes(awayScore);

                    // Update score only if the predicted match has not begun and both scores are valid
                    if (fixture.matchMode === 'Pre') {
                        if (bothScoresInvalid) {
                            cleanUpPredictions();
                        }
                        else {
                            homeTeam.score = homeScore;
                            awayTeam.score = awayScore;
                        }
                    }
                    else if (bothScoresInvalid) {
                        cleanUpPredictions();
                    }
                    // Otherwise delete the localStorage entry and get the correct score from the API request
                    else {
                        homeTeam.score = fixture.homeTeam.score;
                        awayTeam.score = fixture.awayTeam.score;

                        cleanUpPredictions();
                    }
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

        roundsCalculated++;
    }

    return teams;
}

/**
 * Function to sort the list of teams to construct a ladder in descending order by:
 * 1. Points
 * 2. Points differential
 * 3. Points for / points against ratio
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
        if (bStats['points difference'] - aStats['points difference'] !== 0) {
            return bStats['points difference'] - aStats['points difference'];
        }
        return (bStats['points for'] / bStats['points against']) - (aStats['points for'] / aStats['points against']);
    }

    if (bNoByePoints !== aNoByePoints) {
        return bNoByePoints - aNoByePoints;
    }
    if (bStats['points difference'] - aStats['points difference'] !== 0) {
        return bStats['points difference'] - aStats['points difference'];
    }
    return (bStats['points for'] / bStats['points against']) - (aStats['points for'] / aStats['points against']);
}
