import { TeamData, DrawInfo } from './definitions';
import { NUMS } from './utils';

/**
 * Construct the data for a team (statistics, team name, theme key)
 *
 * @param {Array<TeamData>} teams
 * @param {string} currentComp
 * @returns {Array<TeamData>} the list of teams
 * @param {number} currentYear
 */
export function constructTeamData(teams: TeamData[], currentComp: string, currentYear: number) {
    const teamList: TeamData[] = [];

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
                maxPoints: getMaxPoints(0, 0, currentComp, currentYear)
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
 * @param {number} currentYear
 * @returns {number}
 */
export function getMaxPoints(losses: number, draws: number, currentComp: string, currentYear: number) {
    const byes = NUMS[currentComp].BYES(currentYear);
    const winPoints = NUMS[currentComp].WIN_POINTS(currentYear);
    const matches = NUMS[currentComp].MATCHES(currentYear);

    const perfectSeasonPts = winPoints * matches;

    const pointsLost = perfectSeasonPts - (winPoints * losses) - draws;

    return pointsLost + (winPoints * byes);
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
    seasonDraw: DrawInfo[],
    currentRoundNo: number,
    teams: TeamData[],
    modifiable: boolean,
    currentComp: string,
    currentYear: number,
) {
    const rounds = NUMS[currentComp].ROUNDS(currentYear);
    const winPoints = NUMS[currentComp].WIN_POINTS(currentYear);

    const updateStats = (team: TeamData, teamScore: number, oppScore: number) => {
        team.stats.played += 1;
        team.stats.wins += teamScore > oppScore ? 1 : 0;
        team.stats.drawn += teamScore === oppScore ? 1 : 0;
        team.stats.lost += teamScore < oppScore ? 1 : 0;
        team.stats['points for'] += teamScore;
        team.stats['points against'] += oppScore;
        team.stats['points difference'] = team.stats['points for'] - team.stats['points against'];
        team.stats.points = (winPoints * team.stats.wins) + team.stats.drawn +
            (winPoints * team.stats.byes);
        team.stats.noByePoints = team.stats.points - (winPoints * team.stats.byes);
        team.stats.maxPoints = getMaxPoints(team.stats.lost, team.stats.drawn, currentComp, currentYear);
    };

    let roundsCalculated = 1;
    for (const round of seasonDraw) {
        // Do not count stats for finals games, or those that haven't started
        if (roundsCalculated > rounds || roundsCalculated > currentRoundNo) {
            break;
        }

        if (round.byes !== undefined) {
            for (const bye of round.byes) {
                const byeTeam = teams.find((team: TeamData) => bye.teamNickName === team.name);

                const playedRoundFixtures = round.fixtures.filter((fixture) => {
                    return fixture.matchMode !== 'Pre';
                });

                // If a fixture has been played (or is being played) for a particular round,
                // give the bye team their points
                if (playedRoundFixtures.length && byeTeam) {
                    byeTeam.stats.byes += 1;
                    byeTeam.stats.points = (winPoints * byeTeam.stats.wins) + byeTeam.stats.drawn +
                        (winPoints * byeTeam.stats.byes);
                    byeTeam.stats.noByePoints = byeTeam.stats.points - (winPoints * byeTeam.stats.byes);
                }
            }
        }

        for (const fixture of round.fixtures) {
            const { matchMode, homeTeam, awayTeam, roundTitle, matchCentreUrl } = fixture;

            // If match not started and on ladder page break away
            if (matchMode === 'Pre' && !modifiable) {
                break;
            }

            const homeFixtureTeam = teams.find((team: TeamData) => homeTeam.nickName === team.name);
            const awayFixtureTeam = teams.find((team: TeamData) => awayTeam.nickName === team.name);

            // Update score from localStorage (if possible) if on ladder predictor page
            const prediction = localStorage.getItem(`predictedMatches${String(currentYear)}${currentComp}`);
            if (modifiable && prediction) {
                const teamsIndex = currentComp.includes('nrl') ? 4 : 6;
                const slug = matchCentreUrl.split('/').filter(i => i)[teamsIndex]; // homeTeam-v-awayTeam

                const round = parseInt(roundTitle.split(' ')[1]);
                const predictions =
                    JSON.parse(prediction) as Record<number, Record<string, string>> | undefined;

                if (!predictions) {
                    continue;
                }

                const roundPredictions = predictions[round] as Record<string, string> | undefined;

                if (!roundPredictions) {
                    continue;
                }

                const gamePrediction = roundPredictions[slug] ? roundPredictions[slug] : '';

                const gamePredictionJson =
                    gamePrediction === '' ? undefined :
                        (
                            typeof gamePrediction === 'string' ?
                            JSON.parse(gamePrediction)  as Record<string, number> :
                                gamePrediction
                        );

                if (gamePredictionJson !== undefined) {
                    const homeScore = gamePredictionJson[homeTeam.nickName.toLowerCase().replace(' ', '-')];
                    const awayScore = gamePredictionJson[awayTeam.nickName.toLowerCase().replace(' ', '-')];

                    const cleanUpPredictions = () => {
                        delete predictions[round][slug];
                        if (Object.values(predictions[round]).length === 0) {
                            delete predictions[round];
                        }

                        // If no predictions, delete the localStorage entry,
                        // otherwise update it with the new predictions
                        if (['null', '', '{}'].includes(JSON.stringify(predictions))) {
                            localStorage.removeItem(`predictedMatches${String(currentYear)}${currentComp}`);
                        }
                        else {
                            localStorage.setItem(
                                `predictedMatches${String(currentYear)}${currentComp}`, JSON.stringify(predictions)
                            );
                        }
                    };

                    const bothScoresInvalid =
                        [null, ''].includes(String(homeScore)) && [null, ''].includes(String(awayScore));

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
            const isValidHomeScore = homeFixtureTeam && typeof homeScore === 'number' && !isNaN(homeScore);
            const isValidAwayScore = awayFixtureTeam && typeof awayScore === 'number' && !isNaN(awayScore);
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
