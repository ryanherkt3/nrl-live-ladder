import RoundFixture from "../ui/fixture/round-fixture";
import { DrawInfo, Match, TeamData } from "./definitions";
import { NUMS } from "./utils";

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
                maxPoints: 0,
            },
            name: team.name,
            theme: {
                key: team.theme.key
            },
        });
    }

    return teamList;
}

/**
 * Construct a team's statistics (wins, points etc)
 *
 * @param {Array<DrawInfo>} seasonDraw the information for each round
 * @param {number} currentRoundNo
 * @param {Array<TeamData>} teams
 * @returns {Array<TeamData>} the list of teams
 */
export function constructTeamStats(seasonDraw: Array<DrawInfo>, currentRoundNo: number, teams: Array<TeamData>) {
    const {BYES: byes, WIN_POINTS, MATCHES, ROUNDS} = NUMS;

    const getMaxPoints = (losses: number, draws: number) => {
        const perfectSeasonPts = WIN_POINTS * MATCHES;

        const pointsLost = perfectSeasonPts - (WIN_POINTS * losses) - draws;

        return pointsLost + (WIN_POINTS * byes);
    };

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
        if (round.selectedRoundId > currentRoundNo || round.selectedRoundId > ROUNDS) {
            break;
        }

        for (const bye of round.byes) {
            const byeTeam = teams.filter((team: TeamData) => {
                return bye.teamNickName === team.name;
            })[0];

            byeTeam.stats.byes += 1;
            byeTeam.stats.points = (WIN_POINTS * byeTeam.stats.wins) + byeTeam.stats.drawn +
                (WIN_POINTS * byeTeam.stats.byes);
            byeTeam.stats.noByePoints = byeTeam.stats.points - (WIN_POINTS * byeTeam.stats.byes);
        }

        for (const fixture of round.fixtures) {
            const {matchMode, homeTeam, awayTeam} = fixture;

            if (matchMode === 'Pre') {
                break;
            }

            const homeFixtureTeam = teams.filter((team: TeamData) => {
                return homeTeam.nickName === team.name;
            })[0];

            const awayFixtureTeam = teams.filter((team: TeamData) => {
                return awayTeam.nickName === team.name;
            })[0];

            const {score: homeScore} = homeTeam;
            const {score: awayScore} = awayTeam;

            updateStats(homeFixtureTeam, homeScore, awayScore);
            updateStats(awayFixtureTeam, awayScore, homeScore);
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
    const {stats: bStats} = b;
    const {points: bPoints, noByePoints: bNoByePoints} = bStats;
    const {stats: aStats} = a;
    const {points: aPoints, noByePoints: aNoByePoints} = aStats;

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

export function getLiveFixtures(fixtures: Array<Match>, ladder: Array<TeamData>, isFinalsFootball: boolean) {
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
            />
        );
    }

    return liveFixtures;
}

/**
 * Get all the page variables
 *
 * @param {Array<DrawInfo>} seasonDraw
 * @returns {PageVariables}
 */
export function getPageVariables(seasonDraw: Array<DrawInfo>) {
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

    const allTeams = constructTeamStats(seasonDraw, currentRoundNo, teamList)
        .sort((a: TeamData, b: TeamData) => {
            return teamSortFunction(true, a, b);
        });

    return {
        currentRoundInfo, byes, fixtures, currentRoundNo, nextRoundInfo, liveMatches, allTeams
    };
}