import { TeamData, Match, QualificationConditions, QualificationResultSets, ByeTeam } from './definitions';
import { getMinPointsForSpots, getQualificationStatus } from './qualification';
import { getMaxPoints, teamSortFunction } from './team-stats';
import { NUMS } from './utils';

/**
 * Check for any possible qualification outcomes for a given round for teams that can be eliminated,
 * or qualify for finals football or the top 2/4.
 *
 * @param {Array<TeamData>} teamList
 * @param {string} currentComp
 * @param {number} currentRoundNo
 * @param {Array<Match>} fixtures
 * @param {Array<ByeTeam>} byes
 * @returns {Object}
 */
export function checkQualificationOutcomes(
    teamList: Array<TeamData>,
    currentComp: string,
    fixtures: Array<Match>,
    byes: Array<ByeTeam>
) {
    const { WIN_POINTS, DRAW_POINTS } = NUMS[currentComp];

    // Use the fixtures list to remove this round's result from their stats
    fixtures.map((fixture) => {
        if (fixture.matchMode !== 'Pre') {
            const updateStats = (team: TeamData, teamScore: number, oppScore: number) => {
                team.stats.played -= 1;
                team.stats.wins -= teamScore > oppScore ? 1 : 0;
                team.stats.drawn -= teamScore === oppScore ? 1 : 0;
                team.stats.lost -= teamScore < oppScore ? 1 : 0;
                team.stats['points for'] -= typeof teamScore === 'number' ? teamScore : 0;
                team.stats['points against'] -= typeof oppScore === 'number' ? oppScore : 0;
                team.stats['points difference'] = team.stats['points for'] - team.stats['points against'];
                team.stats.points = (WIN_POINTS * team.stats.wins) + team.stats.drawn +
                    (WIN_POINTS * team.stats.byes);
                team.stats.noByePoints = team.stats.points - (WIN_POINTS * team.stats.byes);
                team.stats.maxPoints = getMaxPoints(team.stats.lost, team.stats.drawn, currentComp, true);
                team.stats.noByeMaxPoints = getMaxPoints(team.stats.lost, team.stats.drawn, currentComp, false);
            };

            const homeTeam = teamList.find((team) => {
                return fixture.homeTeam.nickName === team.name;
            });
            const awayTeam = teamList.find((team) => {
                return fixture.awayTeam.nickName === team.name;
            });

            if (homeTeam && awayTeam) {
                updateStats(homeTeam, fixture.homeTeam.score as number, fixture.awayTeam.score as number);
                updateStats(awayTeam, fixture.awayTeam.score as number, fixture.homeTeam.score as number);
            }
        }
    });

    // Remove the bye points from the team on the bye
    byes.map((bye) => {
        const updateStats = (team: TeamData) => {
            team.stats.byes -= 1;
            team.stats.points = (WIN_POINTS * team.stats.wins) + team.stats.drawn +
                (WIN_POINTS * team.stats.byes);
            team.stats.noByePoints = team.stats.points - (WIN_POINTS * team.stats.byes);
        };

        const byeTeam = teamList.find((team) => {
            return bye.teamNickName === team.name;
        });

        if (byeTeam) {
            updateStats(byeTeam);
        }
    });

    // Then reset the qualification statuses as appropriate
    teamList.map((team) => {
        team.qualificationStatus = getQualificationStatus(
            team, teamList, getMinPointsForSpots(teamList, currentComp), currentComp
        );
    });

    const eliminatedTeams: QualificationConditions[] = [];
    let qualifiedTeams: QualificationConditions[] = [];
    let topFourTeams: QualificationConditions[] = [];
    let topTwoTeams: QualificationConditions[] = [];

    const { eliminated, finalsQualification: qualified, topFour, topTwo} = getMinPointsForSpots(teamList, currentComp);

    const eliminatedInfluencers = teamList.filter((team) => {
        const { noByePoints } = team.stats;

        // TODO fix
        // If the difference between a team's "no bye points" value and the eliminated value is zero or one,
        // then that team is capable of moving the elimination threshold
        return [0, 1].includes(noByePoints - eliminated);
    });

    const qualificationInfluencers = teamList.filter((team) => {
        const { noByeMaxPoints } = team.stats;

        // Find the team(s) which could move the qualification threshold
        return qualified - noByeMaxPoints <= WIN_POINTS && noByeMaxPoints < qualified;
    });

    const topFourInfluencers = teamList.filter((team) => {
        const { noByeMaxPoints } = team.stats;

        // Find the team(s) which could move the top four threshold
        return topFour - noByeMaxPoints <= WIN_POINTS && noByeMaxPoints < topFour;
    });

    const topTwoInfluencers = teamList.filter((team) => {
        const { noByeMaxPoints } = team.stats;

        // Find the team(s) which could move the qualification threshold
        return topTwo - noByeMaxPoints <= WIN_POINTS && noByeMaxPoints < topTwo;
    });

    // Check if OTHER TEAMS individual results affect a team or not
    // Elimination influencer
    const eliminationResultMatrix = generateResultMatrix(eliminatedInfluencers.length, currentComp);
    teamList.map((team) => {
        // Only check if the team is not already eliminated or qualified AND
        // is within 4 points of the elimination threshold
        if (team.qualificationStatus === '' && (team.stats.noByeMaxPoints - eliminated <= WIN_POINTS * WIN_POINTS)) {
            const { noByeMaxPoints } = team.stats;

            for (const elimResult of eliminationResultMatrix) {
                // Assign a win or draw to the influencer teams
                for (let i = 0; i < eliminatedInfluencers.length; i++) {
                    if (elimResult[i] === DRAW_POINTS) {
                        eliminatedInfluencers[i].stats.drawn++;
                        eliminatedInfluencers[i].stats.points += DRAW_POINTS;
                        eliminatedInfluencers[i].stats.noByePoints += DRAW_POINTS;
                        eliminatedInfluencers[i].stats.maxPoints -= DRAW_POINTS;
                        eliminatedInfluencers[i].stats.noByeMaxPoints -= DRAW_POINTS;
                    }
                    else if (elimResult[i] === WIN_POINTS) {
                        eliminatedInfluencers[i].stats.wins++;
                        eliminatedInfluencers[i].stats.points += WIN_POINTS;
                        eliminatedInfluencers[i].stats.noByePoints += WIN_POINTS;
                    }
                }

                // Check if the team is on the bye this round
                const isOnBye = byes.filter((bye) => {
                    return bye.teamNickName === team.name;
                }).length;

                const minPointsTeamList = teamList.sort((a: TeamData, b: TeamData) => {
                    return teamSortFunction(true, a, b);
                });

                const { eliminated: elimPoints } = getMinPointsForSpots(minPointsTeamList, currentComp);

                const resultSet: QualificationResultSets = {
                    result: '',
                    teamName: '',
                    dependentResults: null,
                    requirementSatisfied: 'TBC',
                };

                const dependentResults: QualificationResultSets[] = [];
                const dependentResultSet: QualificationResultSets = {
                    result: '',
                    teamName: 'other',
                    dependentResults: null,
                    requirementSatisfied: 'TBC',
                };

                // Flag to prevent duplicate results being added
                let pushResult = true;

                const existingElimTeam = eliminatedTeams.filter((elimTeam) => {
                    return elimTeam.teamName === team.name;
                })[0];

                // Steps:
                // 1. Check if team is eliminated via other results (they win, or took the bye, in this scenario).
                // 2. Check if team is eliminated if they draw or lose. If not, team cannot be eliminated this week
                if (noByeMaxPoints <= elimPoints) {
                    let teamResString = '';

                    let resultCanBeDraw = false;
                    for (let i = 0; i < elimResult.length; i++) {
                        // Check if the influencer team is on the bye this round. If so, do not add
                        // them to the result
                        const influencerOnBye = byes.filter((bye) => {
                            return bye.teamNickName === eliminatedInfluencers[i].name;
                        }).length;

                        if (!influencerOnBye) {
                            resultCanBeDraw = elimResult[i] === DRAW_POINTS;

                            const teamName = eliminatedInfluencers[i].name.replace(' ', '-');
                            const result = elimResult[i] === DRAW_POINTS ? 'draw|win' : 'win';

                            teamResString += `${teamName}&${result},`;
                        }
                    }

                    if (existingElimTeam && existingElimTeam.resultSets) {
                        pushResult = existingElimTeam.resultSets.filter((resSet) => {
                            return resSet.result === 'DW';
                        }).length === 0;
                    }

                    resultSet.result = resultCanBeDraw ? 'DW' : 'W';
                    resultSet.teamName = teamResString;
                }
                else if (!isOnBye &&
                        (noByeMaxPoints - DRAW_POINTS <= elimPoints || noByeMaxPoints - WIN_POINTS <= elimPoints)) {
                    const matchOutcome = noByeMaxPoints - DRAW_POINTS <= elimPoints ? 'DL' : 'L';
                    resultSet.result = matchOutcome;
                    resultSet.teamName = 'self';

                    // Check if result is dependent on others
                    let isDependent = false;
                    for (let i = 0; i < eliminatedInfluencers.length; i++) {
                        const initNoByePoints = eliminatedInfluencers[i].stats.noByePoints - elimResult[i];
                        const decrement = matchOutcome === 'DL' ? DRAW_POINTS : WIN_POINTS;

                        // A result is dependent if the max points after a team's result is greater than or equal to
                        // the initial bye points of any team
                        if (noByeMaxPoints - decrement >= initNoByePoints) {
                            isDependent = true;
                        }

                        if (isDependent) {
                            let teamResString = '';

                            for (let i = 0; i < elimResult.length; i++) {
                                // Check if the influencer team is on the bye this round. If so, do not add
                                // them to the result
                                const influencerOnBye = byes.filter((bye) => {
                                    return bye.teamNickName === eliminatedInfluencers[i].name;
                                }).length;

                                if (elimResult[i] > 0 && !influencerOnBye) {
                                    const teamName = eliminatedInfluencers[i].name.replace(' ', '-');
                                    const result = elimResult[i] === DRAW_POINTS ? 'draw|win' : 'win';
                                    teamResString += `${teamName}&${result},`;
                                }
                            }

                            // Do not push if the result string has no length (i.e. all teams lose)
                            if (teamResString.length) {
                                const allTeamsWin = elimResult.every(
                                    (val: number) => val === elimResult[0] && val === WIN_POINTS
                                );

                                dependentResultSet.result = allTeamsWin ? 'W' : 'DW';
                                dependentResultSet.teamName = teamResString;
                                dependentResults.push(dependentResultSet);

                                // If true, no need to check for any of the other teams
                                break;
                            }
                        }
                    }

                    resultSet.dependentResults = dependentResults.length ? dependentResults : null;

                    // If the match outcome is the same as an existing result AND the dependent results are the same,
                    // do not push the result
                    if (existingElimTeam) {
                        pushResult = existingElimTeam.resultSets.filter((resSet) => {
                            const outcomeMatchesOrExists = resSet.result === matchOutcome ||
                                (resSet.result === 'L' && matchOutcome === 'DL');
                            const dependentResultsMatch =
                                JSON.stringify(resSet.dependentResults || []) === JSON.stringify(dependentResults);

                            const resultSetExists = outcomeMatchesOrExists && dependentResultsMatch;

                            return resultSetExists;
                        }).length === 0;
                    }
                }

                // If the result is valid, check it has happened then add it to the list
                // TODO refactor result checking logic into 1 or 2 functions
                if (resultSet.result && pushResult) {
                    // Check if result has happened
                    let requirementSatisfied = true;
                    if (resultSet.teamName === 'self') {
                        let isHomeTeam = false;
                        const teamFixture = fixtures.filter((fixture) => {
                            isHomeTeam = isHomeTeam || fixture.homeTeam.nickName === team.name;
                            return isHomeTeam || fixture.awayTeam.nickName === team.name;
                        });

                        if (teamFixture.length && teamFixture[0].matchMode !== 'Pre') {
                            const fixtureTeam = isHomeTeam ? teamFixture[0].homeTeam : teamFixture[0].awayTeam;
                            const opponent = isHomeTeam ? teamFixture[0].awayTeam : teamFixture[0].homeTeam;

                            if (resultSet.result === 'L') {
                                requirementSatisfied = fixtureTeam.score < opponent.score;
                            }
                            else if (resultSet.result === 'D') {
                                requirementSatisfied = fixtureTeam.score === opponent.score;
                            }
                            else if (resultSet.result === 'DL') {
                                requirementSatisfied = fixtureTeam.score <= opponent.score;
                            }
                            resultSet.requirementSatisfied = requirementSatisfied;
                        }
                        else {
                            resultSet.requirementSatisfied = 'TBC';
                        }

                        // Check if dependent results have happened
                        if (resultSet.dependentResults && resultSet.dependentResults.length) {
                            for (const depResult of resultSet.dependentResults) {
                                // Remove last item from the teamName array ('' - empty quotes)
                                let teamsArray: string[] = depResult.teamName.split(',');
                                teamsArray = teamsArray.slice(0, teamsArray.length - 1);

                                let depRequirementSatisfied = true;
                                for (let i = 0; i < teamsArray.length; i++) {
                                    // Split the team name and the results
                                    const teamAndResults = teamsArray[i].split('&');
                                    const depTeam = teamAndResults[0];
                                    const results = teamAndResults[1];

                                    let depTeamIsHomeTeam = false;
                                    const depTeamFixture = fixtures.filter((fixture) => {
                                        depTeamIsHomeTeam = depTeamIsHomeTeam || fixture.homeTeam.nickName === depTeam;
                                        return depTeamIsHomeTeam || fixture.awayTeam.nickName === depTeam;
                                    });

                                    if (depTeamFixture.length && depTeamFixture[0].matchMode !== 'Pre') {
                                        const { homeTeam, awayTeam } = depTeamFixture[0];

                                        const fixtureTeam = depTeamIsHomeTeam ? homeTeam : awayTeam;
                                        const opponent = depTeamIsHomeTeam ? awayTeam : homeTeam;

                                        if (results === 'win') {
                                            depRequirementSatisfied = fixtureTeam.score > opponent.score;
                                        }
                                        else if (results === 'draw|win' || results === 'draw') {
                                            depRequirementSatisfied = fixtureTeam.score === opponent.score;
                                        }

                                        // All dependent results are satisfied if this result is true AND
                                        // any other depndent results are true
                                        depResult.requirementSatisfied =
                                            depResult.requirementSatisfied && depRequirementSatisfied;
                                    }
                                    else {
                                        depResult.requirementSatisfied = depResult.requirementSatisfied && 'TBC';
                                    }
                                }

                                // Update the overall requirementSatisfied flag of the result set
                                // (team + deps is only true if both are true)
                                resultSet.requirementSatisfied =
                                    resultSet.requirementSatisfied && depResult.requirementSatisfied;
                            }
                        }
                    }
                    else if (resultSet.teamName !== 'self') {
                        // Remove last item from the teamName array ('' - empty quotes)
                        let teamsArray: string[] = resultSet.teamName.split(',');
                        teamsArray = teamsArray.slice(0, teamsArray.length - 1);

                        let allRequirementsSatisfied = true;
                        for (let i = 0; i < teamsArray.length; i++) {
                            // Split the team name and the results
                            const teamAndResults = teamsArray[i].split('&');
                            const otherTeam = teamAndResults[0];
                            const results = teamAndResults[1];

                            let otherTeamIsHomeTeam = false;
                            const otherTeamFixture = fixtures.filter((fixture) => {
                                otherTeamIsHomeTeam = otherTeamIsHomeTeam || fixture.homeTeam.nickName === otherTeam;
                                return otherTeamIsHomeTeam || fixture.awayTeam.nickName === otherTeam;
                            });

                            if (otherTeamFixture.length && otherTeamFixture[0].matchMode !== 'Pre') {
                                const { homeTeam, awayTeam } = otherTeamFixture[0];

                                const fixtureTeam = otherTeamIsHomeTeam ? homeTeam : awayTeam;
                                const opponent = otherTeamIsHomeTeam ? awayTeam : homeTeam;

                                if (results === 'win') {
                                    allRequirementsSatisfied = fixtureTeam.score > opponent.score;
                                }
                                else if (results === 'draw|win' || results === 'draw') {
                                    allRequirementsSatisfied = fixtureTeam.score === opponent.score;
                                }

                                // All dependent results are satisfied if this result is true AND
                                // any other dependent results are true
                                resultSet.requirementSatisfied = isOnBye ?
                                    allRequirementsSatisfied :
                                    allRequirementsSatisfied && resultSet.requirementSatisfied;
                            }
                            else {
                                resultSet.requirementSatisfied = isOnBye ?
                                    resultSet.requirementSatisfied :
                                    resultSet.requirementSatisfied && 'TBC';
                            }
                        }
                    }

                    if (existingElimTeam) {
                        existingElimTeam.resultSets.push(resultSet);
                    }
                    else {
                        eliminatedTeams.push({
                            teamName: team.name,
                            resultSets: [resultSet]
                        });
                    }
                }

                // Unssign a win or draw to the influencer teams
                for (let i = 0; i < eliminatedInfluencers.length; i++) {
                    if (elimResult[i] === DRAW_POINTS) {
                        eliminatedInfluencers[i].stats.drawn--;
                        eliminatedInfluencers[i].stats.points -= DRAW_POINTS;
                        eliminatedInfluencers[i].stats.noByePoints -= DRAW_POINTS;
                        eliminatedInfluencers[i].stats.maxPoints += DRAW_POINTS;
                        eliminatedInfluencers[i].stats.noByeMaxPoints += DRAW_POINTS;
                    }
                    else if (elimResult[i] === WIN_POINTS) {
                        eliminatedInfluencers[i].stats.wins--;
                        eliminatedInfluencers[i].stats.points -= WIN_POINTS;
                        eliminatedInfluencers[i].stats.noByePoints -= WIN_POINTS;
                    }
                }
            }

            const existingTeam = eliminatedTeams.filter((elimTeam) => {
                return elimTeam.teamName === team.name;
            })[0];

            if (existingTeam) {
                existingTeam.resultSets.sort((a, b) => {
                    // Sort by team name (self ahead of non-self / dependent teams)
                    if (a.teamName === 'self' && b.teamName !== 'self') {
                        return -1;
                    }
                    if (a.teamName !== 'self' && b.teamName === 'self') {
                        return 1;
                    }

                    // Sort by result (W > D > L > DW > DL)
                    if (a.result === 'W' && b.result !== 'W') {
                        return -1;
                    }
                    if (a.result !== 'W' && b.result === 'W') {
                        return 1;
                    }
                    if (a.result === 'D' && b.result !== 'D') {
                        return -1;
                    }
                    if (a.result !== 'D' && b.result === 'D') {
                        return 1;
                    }
                    if (a.result === 'L' && b.result !== 'L') {
                        return -1;
                    }
                    if (a.result !== 'L' && b.result === 'L') {
                        return 1;
                    }
                    if (a.result === 'DW' && b.result !== 'DW') {
                        return -1;
                    }
                    if (a.result !== 'DW' && b.result === 'DW') {
                        return 1;
                    }
                    if (a.result === 'DL' && b.result !== 'DL') {
                        return -1;
                    }
                    if (a.result !== 'DL' && b.result === 'DL') {
                        return 1;
                    }

                    return 0;
                });

                // Prune the results if there is a catch-all result (i.e. all influencer teams
                // drawing at a minimum guarantees elimination)
                const influencerNames = eliminatedInfluencers.map((influencer) => {
                    return influencer.name.replace(' ', '-');
                });

                let catchAllResultString = '';
                for (const influencer of influencerNames) {
                    // Check if the influencer team is on the bye this round. If so, do not add
                    // them to the catch all string
                    const influencerOnBye = byes.filter((bye) => {
                        return bye.teamNickName === influencer;
                    }).length;

                    if (!influencerOnBye) {
                        catchAllResultString += `${influencer}&draw|win,`;
                    }
                }

                let catchAllSelfResult, catchAllOtherResult = false;
                const catchAllResult = existingTeam.resultSets.find((resultSet) => {
                    const { teamName, dependentResults } = resultSet;

                    catchAllOtherResult = teamName === catchAllResultString;

                    catchAllSelfResult = dependentResults && dependentResults.length &&
                        dependentResults[0].teamName === catchAllResultString;

                    return catchAllSelfResult || catchAllOtherResult;
                });

                if (catchAllResult) {
                    existingTeam.resultSets = existingTeam.resultSets.filter((resultSet) => {
                        const { result, teamName, dependentResults } = resultSet;
                        const { result: CAResult } = catchAllResult;
                        const resultMatches = result === CAResult;

                        // Return result sets that:
                        // 1) Do not have a matching catch-all result, OR
                        // 2) That do AND
                        //    2.1) the teamName matches the catch-all result string, OR
                        //    2.1) the teamName from the dependent result matches the catch-all result string
                        return !resultMatches ||
                            (
                                resultMatches &&
                                (
                                    teamName === catchAllResultString ||
                                    dependentResults && dependentResults[0].teamName === catchAllResultString
                                )
                            );
                    });
                }
            }
        }
    });

    // Qualifying influencer
    const qualificationResultMatrix = generateResultMatrix(qualificationInfluencers.length, currentComp);
    qualifiedTeams = finalsMappingFunction(
        teamList, qualificationResultMatrix, qualificationInfluencers, currentComp, '', fixtures, byes
    );

    // Top four influencer
    const t4ResultMatrix = generateResultMatrix(topFourInfluencers.length, currentComp);
    topFourTeams = finalsMappingFunction(
        teamList, t4ResultMatrix, topFourInfluencers, currentComp, '(Q)', fixtures, byes
    );

    // Top two influencer
    const t2ResultMatrix = generateResultMatrix(topTwoInfluencers.length, currentComp);
    topTwoTeams = finalsMappingFunction(
        teamList, t2ResultMatrix, topTwoInfluencers, currentComp, '(T4)', fixtures, byes
    );

    // Update team stats to include the current round's fixtures and byes after calcuating qualifying scenarios
    fixtures.map((fixture) => {
        if (fixture.matchMode !== 'Pre') {
            const updateStats = (team: TeamData, teamScore: number, oppScore: number) => {
                team.stats.played += 1;
                team.stats.wins += teamScore > oppScore ? 1 : 0;
                team.stats.drawn += teamScore === oppScore ? 1 : 0;
                team.stats.lost += teamScore < oppScore ? 1 : 0;
                team.stats['points for'] += typeof teamScore === 'number' ? teamScore : 0;
                team.stats['points against'] += typeof oppScore === 'number' ? oppScore : 0;
                team.stats['points difference'] = team.stats['points for'] - team.stats['points against'];
                team.stats.points = (WIN_POINTS * team.stats.wins) + team.stats.drawn +
                    (WIN_POINTS * team.stats.byes);
                team.stats.noByePoints = team.stats.points - (WIN_POINTS * team.stats.byes);
                team.stats.maxPoints = getMaxPoints(team.stats.lost, team.stats.drawn, currentComp, true);
                team.stats.noByeMaxPoints = getMaxPoints(team.stats.lost, team.stats.drawn, currentComp, false);
            };

            const homeTeam = teamList.find((team) => {
                return fixture.homeTeam.nickName === team.name;
            });
            const awayTeam = teamList.find((team) => {
                return fixture.awayTeam.nickName === team.name;
            });

            if (homeTeam && awayTeam) {
                updateStats(homeTeam, fixture.homeTeam.score as number, fixture.awayTeam.score as number);
                updateStats(awayTeam, fixture.awayTeam.score as number, fixture.homeTeam.score as number);
            }
        }
    });

    byes.map((bye) => {
        const updateStats = (team: TeamData) => {
            team.stats.byes += 1;
            team.stats.points = (WIN_POINTS * team.stats.wins) + team.stats.drawn +
                (WIN_POINTS * team.stats.byes);
            team.stats.noByePoints = team.stats.points - (WIN_POINTS * team.stats.byes);
        };

        const byeTeam = teamList.find((team) => {
            return bye.teamNickName === team.name;
        });

        if (byeTeam) {
            updateStats(byeTeam);
        }
    });

    teamList.map((team) => {
        team.qualificationStatus = getQualificationStatus(
            team, teamList, getMinPointsForSpots(teamList, currentComp), currentComp
        );
    });

    return {
        eliminatedTeams,
        qualifiedTeams,
        topFourTeams,
        topTwoTeams
    };
}

/**
 * Common function to map over arrays
 *
 * @param {Array<TeamData>} teamList
 * @param {Array<Array<number>>} resultMatrix
 * @param {Array<TeamData>} influencers
 * @param {string} currentComp
 * @param {string} qualificationCriteria
 * @param {Array<Match>} fixtures
 * @param {Array<ByeTeam>} byes
 * @returns {Array<QualificationConditions>}
 */
function finalsMappingFunction(
    teamList: Array<TeamData>,
    resultMatrix: Array<Array<number>>,
    influencers: Array<TeamData>,
    currentComp: string,
    qualificationCriteria: string,
    fixtures: Array<Match>,
    byes: Array<ByeTeam>
) {
    const { WIN_POINTS, DRAW_POINTS } = NUMS[currentComp];
    const teamsArray: QualificationConditions[] = [];

    teamList.map((team) => {
        // Only check if the team's qualification status matches
        if (team.qualificationStatus === qualificationCriteria) {
            for (const qualiResult of resultMatrix) {
                // Assign points / max points to each team - but only if they are not on a bye
                // this round (that assignment happens below)
                for (let i = 0; i < influencers.length; i++) {
                    const influencerOnBye = byes.filter((bye) => {
                        return bye.teamNickName === influencers[i].name;
                    }).length;

                    if (!influencerOnBye) {
                        influencers[i].stats.points += qualiResult[i];
                        influencers[i].stats.noByePoints += qualiResult[i];
                        influencers[i].stats.maxPoints += WIN_POINTS - qualiResult[i];
                        influencers[i].stats.noByeMaxPoints -= WIN_POINTS - qualiResult[i];
                    }
                }

                // Check if the team is on the bye this round. If so, assign bye points if not done already
                const isOnBye = byes.filter((bye) => {
                    return bye.teamNickName === team.name;
                }).length;

                const minPointsTeamList = [...teamList].sort((a: TeamData, b: TeamData) => {
                    return teamSortFunction(true, a, b);
                });

                const { finalsQualification, topFour, topTwo } = getMinPointsForSpots(minPointsTeamList, currentComp);

                let finalsPoints = finalsQualification;
                if (qualificationCriteria === '(Q)') {
                    finalsPoints = topFour;
                }
                else if (qualificationCriteria === '(T4)') {
                    finalsPoints = topTwo;
                }

                const resultSet: QualificationResultSets = {
                    result: '',
                    teamName: '',
                    dependentResults: null,
                    requirementSatisfied: 'TBC',
                };

                const dependentResults: QualificationResultSets[] = [];
                const dependentResultSet: QualificationResultSets = {
                    result: '',
                    teamName: 'other',
                    dependentResults: null,
                    requirementSatisfied: 'TBC',
                };

                // Flag to prevent duplicate results being added
                let pushResult = true;

                const existingTeam = teamsArray.filter((qualifyingTeam) => {
                    return qualifyingTeam.teamName === team.name;
                })[0];

                // Steps:
                // 1. Check if team can get in on other results. If not,
                // 2. Check if team can get in if they draw or win. If not, team cannot meet criteria this week
                if (team.stats.noByePoints >= finalsPoints) {
                    let teamResString = '';

                    for (let i = 0; i < qualiResult.length; i++) {
                        // Check if the influencer team is on the bye this round. If so, do not add
                        // them to the result
                        const influencerOnBye = byes.filter((bye) => {
                            return bye.teamNickName === influencers[i].name;
                        }).length;

                        if (!influencerOnBye) {
                            const teamName = influencers[i].name.replace(' ', '-');
                            const result = qualiResult[i] === DRAW_POINTS ? 'draw|loss' : 'loss';
                            teamResString += `${teamName}&${result},`;
                        }
                    }

                    if (existingTeam) {
                        pushResult = existingTeam.resultSets.filter((resSet) => {
                            return resSet.result === 'DL' && resSet.teamName === teamResString;
                        }).length === 0;
                    }

                    resultSet.result = 'DL';
                    resultSet.teamName = teamResString;
                }
                else if (!isOnBye &&
                        (team.stats.noByePoints + DRAW_POINTS >= finalsPoints ||
                        team.stats.noByePoints + WIN_POINTS >= finalsPoints)) {
                    const matchOutcome = team.stats.noByePoints + DRAW_POINTS >= finalsPoints ? 'DW' : 'W';
                    resultSet.result = matchOutcome;
                    resultSet.teamName = 'self';

                    // Check if result is dependent on others.
                    let isDependent = false;
                    for (let i = 0; i < influencers.length; i++) {
                        // Check if the influencer team is on the bye this round.
                        // Move to next iteration of the loop if they are.
                        const influencerOnBye = byes.filter((bye) => {
                            return bye.teamNickName === influencers[i].name;
                        }).length;

                        if (influencerOnBye) {
                            continue;
                        }

                        const initMaxPoints = influencers[i].stats.noByeMaxPoints + WIN_POINTS - qualiResult[i];
                        const pointsIncrement = matchOutcome === 'W' ? WIN_POINTS : DRAW_POINTS;

                        // A result is dependent if the starting max points of at least one team is higher than
                        // the team's new points tally after the draw or win
                        if (team.stats.noByePoints + pointsIncrement <= initMaxPoints) {
                            isDependent = true;
                        }

                        if (isDependent) {
                            let teamResString = '';

                            for (let i = 0; i < qualiResult.length; i++) {
                                // Check if the influencer team is on the bye this round.
                                // Only add to result string if they are not.
                                const influencerOnBye = byes.filter((bye) => {
                                    return bye.teamNickName === influencers[i].name;
                                }).length;

                                if (!influencerOnBye) {
                                    const teamName = influencers[i].name.replace(' ', '-');
                                    const result = qualiResult[i] === DRAW_POINTS ? 'draw|loss' : 'loss';
                                    teamResString += `${teamName}&${result},`;
                                }
                            }

                            // Do not push if the result string has no length (i.e. all teams lose)
                            if (teamResString.length) {
                                const allTeamsWin = qualiResult.every(
                                    (val: number) => val === qualiResult[0] && val === WIN_POINTS
                                );

                                dependentResultSet.result = allTeamsWin ? 'L' : 'DL';
                                dependentResultSet.teamName = teamResString;
                                dependentResults.push(dependentResultSet);

                                // If true, no need to check for any of the other teams
                                break;
                            }
                        }
                    }
                    resultSet.dependentResults = dependentResults.length ? dependentResults : null;

                    // If the match outcome is the same as an existing result AND the dependent results are the same,
                    // do not push the result
                    if (existingTeam) {
                        pushResult = existingTeam.resultSets.filter((resSet) => {
                            const outcomeMatchesOrExists = resSet.result === matchOutcome ||
                                (resSet.result === 'W' && matchOutcome === 'DW');
                            const dependentResultsMatch =
                                JSON.stringify(resSet.dependentResults || []) === JSON.stringify(dependentResults);

                            const resultSetExists = outcomeMatchesOrExists && dependentResultsMatch;

                            return resultSetExists;
                        }).length === 0;
                    }
                }

                if (resultSet.result && pushResult) {
                    // Check if result has happened
                    let requirementSatisfied = true;
                    if (resultSet.teamName === 'self') {
                        let isHomeTeam = false;
                        const teamFixture = fixtures.filter((fixture) => {
                            isHomeTeam = isHomeTeam || fixture.homeTeam.nickName === team.name;
                            return isHomeTeam || fixture.awayTeam.nickName === team.name;
                        });

                        if (teamFixture.length && teamFixture[0].matchMode !== 'Pre') {
                            const fixtureTeam = isHomeTeam ? teamFixture[0].homeTeam : teamFixture[0].awayTeam;
                            const opponent = isHomeTeam ? teamFixture[0].awayTeam : teamFixture[0].homeTeam;

                            if (resultSet.result === 'W') {
                                requirementSatisfied = fixtureTeam.score > opponent.score;
                            }
                            else if (resultSet.result === 'D') {
                                requirementSatisfied = fixtureTeam.score === opponent.score;
                            }
                            else if (resultSet.result === 'DW') {
                                requirementSatisfied = fixtureTeam.score >= opponent.score;
                            }
                            resultSet.requirementSatisfied = requirementSatisfied;
                        }
                        else {
                            resultSet.requirementSatisfied = 'TBC';
                        }

                        // Check if dependent results have happened
                        if (resultSet.dependentResults && resultSet.dependentResults.length) {
                            for (const depResult of resultSet.dependentResults) {
                                // Remove last item from the teamName array ('' - empty quotes)
                                let teamsArray: string[] = depResult.teamName.split(',');
                                teamsArray = teamsArray.slice(0, teamsArray.length - 1);

                                let depRequirementSatisfied = true;
                                for (let i = 0; i < teamsArray.length; i++) {
                                    // Split the team name and the results
                                    const teamAndResults = teamsArray[i].split('&');
                                    const depTeam = teamAndResults[0];
                                    const results = teamAndResults[1];

                                    let depTeamIsHomeTeam = false;
                                    const depTeamFixture = fixtures.filter((fixture) => {
                                        depTeamIsHomeTeam = depTeamIsHomeTeam || fixture.homeTeam.nickName === depTeam;
                                        return depTeamIsHomeTeam || fixture.awayTeam.nickName === depTeam;
                                    });

                                    if (depTeamFixture.length && depTeamFixture[0].matchMode !== 'Pre') {
                                        const { homeTeam, awayTeam } = depTeamFixture[0];

                                        const fixtureTeam = depTeamIsHomeTeam ? homeTeam : awayTeam;
                                        const opponent = depTeamIsHomeTeam ? awayTeam : homeTeam;

                                        if (results === 'loss') {
                                            depRequirementSatisfied = fixtureTeam.score < opponent.score;
                                        }
                                        else if (results === 'draw|loss' || results === 'draw') {
                                            depRequirementSatisfied = fixtureTeam.score <= opponent.score;
                                        }

                                        // All dependent results are satisfied if this result is true AND
                                        // any other depndent results are true
                                        depResult.requirementSatisfied =
                                            depResult.requirementSatisfied && depRequirementSatisfied;
                                    }
                                    else {
                                        depResult.requirementSatisfied = depResult.requirementSatisfied && 'TBC';
                                    }
                                }

                                // Update the overall requirementSatisfied flag of the result set
                                // (team + deps is only true if both are true)
                                resultSet.requirementSatisfied =
                                    resultSet.requirementSatisfied && depResult.requirementSatisfied;
                            }
                        }
                    }
                    else if (resultSet.teamName !== 'self') {
                        // Remove last item from the teamName array ('' - empty quotes)
                        let teamsArray: string[] = resultSet.teamName.split(',');
                        teamsArray = teamsArray.slice(0, teamsArray.length - 1);

                        let allRequirementsSatisfied = true;
                        for (let i = 0; i < teamsArray.length; i++) {
                            // Split the team name and the results
                            const teamAndResults = teamsArray[i].split('&');
                            const otherTeam = teamAndResults[0];
                            const results = teamAndResults[1];

                            let otherTeamIsHomeTeam = false;
                            const otherTeamFixture = fixtures.filter((fixture) => {
                                otherTeamIsHomeTeam = otherTeamIsHomeTeam || fixture.homeTeam.nickName === otherTeam;
                                return otherTeamIsHomeTeam || fixture.awayTeam.nickName === otherTeam;
                            });

                            if (otherTeamFixture.length && otherTeamFixture[0].matchMode !== 'Pre') {
                                const { homeTeam, awayTeam } = otherTeamFixture[0];

                                const fixtureTeam = otherTeamIsHomeTeam ? homeTeam : awayTeam;
                                const opponent = otherTeamIsHomeTeam ? awayTeam : homeTeam;

                                if (results === 'loss') {
                                    allRequirementsSatisfied = fixtureTeam.score < opponent.score;
                                }
                                else if (results === 'draw|loss' || results === 'draw') {
                                    allRequirementsSatisfied = fixtureTeam.score <= opponent.score;
                                }

                                // All dependent results are satisfied if this result is true AND
                                // any other depndent results are true
                                resultSet.requirementSatisfied =
                                    allRequirementsSatisfied && resultSet.requirementSatisfied;
                            }
                            else {
                                resultSet.requirementSatisfied = resultSet.requirementSatisfied && 'TBC';
                            }
                        }
                    }

                    if (existingTeam) {
                        existingTeam.resultSets.push(resultSet);
                    }
                    else {
                        teamsArray.push({
                            teamName: team.name,
                            resultSets: [resultSet]
                        });
                    }
                }

                // Unassign points / max points to each team (i.e. reset them) - but only if they are not on a bye
                // this round (that unassignment happens below)
                for (let j = 0; j < influencers.length; j++) {
                    const influencerOnBye = byes.filter((bye) => {
                        return bye.teamNickName === influencers[j].name;
                    }).length;

                    if (!influencerOnBye) {
                        influencers[j].stats.points -= qualiResult[j];
                        influencers[j].stats.noByePoints -= qualiResult[j];
                        influencers[j].stats.maxPoints += WIN_POINTS - qualiResult[j];
                        influencers[j].stats.noByeMaxPoints += WIN_POINTS - qualiResult[j];
                    }
                }
            }

            const existingTeam = teamsArray.filter((qualifyingTeam) => {
                return qualifyingTeam.teamName === team.name;
            })[0];

            if (existingTeam) {
                existingTeam.resultSets.sort((a, b) => {
                    // Sort by team name (self ahead of non-self / dependent teams)
                    if (a.teamName === 'self' && b.teamName !== 'self') {
                        return -1;
                    }
                    if (a.teamName !== 'self' && b.teamName === 'self') {
                        return 1;
                    }

                    // Sort by result (W > D > L > DW > DL)
                    if (a.result === 'W' && b.result !== 'W') {
                        return -1;
                    }
                    if (a.result !== 'W' && b.result === 'W') {
                        return 1;
                    }
                    if (a.result === 'D' && b.result !== 'D') {
                        return -1;
                    }
                    if (a.result !== 'D' && b.result === 'D') {
                        return 1;
                    }
                    if (a.result === 'L' && b.result !== 'L') {
                        return -1;
                    }
                    if (a.result !== 'L' && b.result === 'L') {
                        return 1;
                    }
                    if (a.result === 'DW' && b.result !== 'DW') {
                        return -1;
                    }
                    if (a.result !== 'DW' && b.result === 'DW') {
                        return 1;
                    }
                    if (a.result === 'DL' && b.result !== 'DL') {
                        return -1;
                    }
                    if (a.result !== 'DL' && b.result === 'DL') {
                        return 1;
                    }

                    return 0;
                });

                // Prune the results if there is a catch-all result (i.e. all influencer teams
                // drawing at a minimum guarantees qualification)
                const influencerNames = influencers.map((influencer) => {
                    return influencer.name.replace(' ', '-');
                });

                let catchAllResultString = '';
                for (const influencer of influencerNames) {
                    // Check if the influencer team is on the bye this round. If so, do not add
                    // them to the catch all string
                    const influencerOnBye = byes.filter((bye) => {
                        return bye.teamNickName === influencer;
                    }).length;

                    if (!influencerOnBye) {
                        catchAllResultString += `${influencer}&draw|loss,`;
                    }
                }

                let catchAllSelfResult, catchAllOtherResult = false;
                const catchAllResult = existingTeam.resultSets.find((resultSet) => {
                    const { teamName, dependentResults } = resultSet;

                    catchAllOtherResult = teamName === catchAllResultString;
                    catchAllSelfResult = dependentResults && dependentResults.length &&
                        dependentResults[0].teamName === catchAllResultString;

                    return catchAllSelfResult || catchAllOtherResult;
                });

                if (catchAllResult) {
                    existingTeam.resultSets = existingTeam.resultSets.filter((resultSet) => {
                        const { result, teamName, dependentResults } = resultSet;
                        const { result: CAResult } = catchAllResult;
                        const resultMatches = result === CAResult;

                        // Return result sets that:
                        // 1) Do not have a matching catch-all result, OR
                        // 2) That do AND
                        //    2.1) the teamName matches the catch-all result string, OR
                        //    2.1) the teamName from the dependent result matches the catch-all result string
                        return !resultMatches ||
                            (
                                resultMatches &&
                                (
                                    teamName === catchAllResultString ||
                                    dependentResults && dependentResults[0].teamName === catchAllResultString
                                )
                            );
                    });
                }
            }
        }
    });

    return teamsArray;
}

/**
 * Generate all possible outcome combinations given a number of teams
 *
 * @param {number} numberOfTeams
 * @param {string} currentComp
 * @returns {Array<Array<number>>}
 */
function generateResultMatrix(numberOfTeams: number, currentComp: string) {
    const { DRAW_POINTS, WIN_POINTS } = NUMS[currentComp];

    const results: Array<Array<number>> = []; // possible outcome combinations.
    const outcomes = [0, DRAW_POINTS, WIN_POINTS]; // 0 = loss, 1 = draw, 2 = win

    function backtrack(current: Array<number>) {
        if (current.length === numberOfTeams) {
            results.push([...current]);
            return;
        }
        for (const outcome of outcomes) {
            current.push(outcome);
            backtrack(current);
            current.pop();
        }
    }

    backtrack([]);

    return results;
}
