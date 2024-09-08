import { DrawInfo, TeamData } from "./definitions";
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
        })
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
    const getMaxPoints = (losses: number, draws: number) => {
        const byes = NUMS.BYES;
        const perfectSeasonPts = NUMS.WIN_POINTS * NUMS.MATCHES;
    
        const pointsLost = perfectSeasonPts - (NUMS.WIN_POINTS * losses) - draws;
        
        return pointsLost + (NUMS.WIN_POINTS * byes);
    }
    
    const updateStats = (team: TeamData, teamScore: number, oppScore: number) => {
        team.stats.played += 1;
        team.stats.wins += teamScore > oppScore ? 1 : 0;
        team.stats.drawn += teamScore === oppScore ? 1 : 0;
        team.stats.lost += teamScore < oppScore ? 1 : 0;
        team.stats['points for'] += teamScore;
        team.stats['points against'] += oppScore;
        team.stats['points difference'] = team.stats['points for'] - team.stats['points against'];
        team.stats.points = (NUMS.WIN_POINTS * team.stats.wins) + team.stats.drawn + 
            (NUMS.WIN_POINTS * team.stats.byes);
        team.stats.noByePoints = team.stats.points - (NUMS.WIN_POINTS * team.stats.byes);
        team.stats.maxPoints = getMaxPoints(team.stats.lost, team.stats.drawn);
    };
    
    for (const round of seasonDraw) {
        if (round.selectedRoundId > currentRoundNo) {
            break;
        }

        for (const bye of round.byes) {
            const byeTeam = teams.filter((team: TeamData) => {
                return bye.teamNickName === team.name;
            })[0];

            byeTeam.stats.byes += 1;
            byeTeam.stats.points = (NUMS.WIN_POINTS * byeTeam.stats.wins) + byeTeam.stats.drawn + 
                (NUMS.WIN_POINTS * byeTeam.stats.byes);
            byeTeam.stats.noByePoints = byeTeam.stats.points - (NUMS.WIN_POINTS * byeTeam.stats.byes);
        }
        
        for (const fixture of round.fixtures) {
            if (fixture.matchMode === 'Pre') {
                break;
            }
            
            const homeTeam = teams.filter((team: TeamData) => {
                return fixture.homeTeam.nickName === team.name;
            })[0];

            const awayTeam = teams.filter((team: TeamData) => {
                return fixture.awayTeam.nickName === team.name;
            })[0];

            const homeScore = fixture.homeTeam.score;
            const awayScore = fixture.awayTeam.score;

            updateStats(homeTeam, homeScore, awayScore);
            updateStats(awayTeam, awayScore, homeScore);
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
    if (showByes) {
        if (b.stats.points !== a.stats.points) {
            return b.stats.points - a.stats.points;
        }
        return b.stats['points difference'] - a.stats['points difference'];
    }

    if (b.stats.noByePoints !== a.stats.noByePoints) {
        return b.stats.noByePoints - a.stats.noByePoints;
    }
    return b.stats['points difference'] - a.stats['points difference'];
}
