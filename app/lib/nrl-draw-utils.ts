import { TeamData } from "./definitions";
import { NUMS } from "./utils";

export const constructTeamData = (teams: any) => {
    const teamList: Array<TeamData> = [];

    for (const team of teams) {
        teamList.push(
            {
                stats: 
                {
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
                teamNickname: team.name,
                theme: {
                    key: team.theme.key
                },
            }
        )
    }

    return teamList;
}

export const constructTeamStats = (seasonDraw: any, currentRoundNo: number, teams: any) => {
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
                return bye.teamNickName === team.teamNickname;
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
                return fixture.homeTeam.nickName === team.teamNickname;
            })[0];

            const awayTeam = teams.filter((team: TeamData) => {
                return fixture.awayTeam.nickName === team.teamNickname;
            })[0];

            const homeScore = fixture.homeTeam.score;
            const awayScore = fixture.awayTeam.score;

            updateStats(homeTeam, homeScore, awayScore);
            updateStats(awayTeam, awayScore, homeScore);
        }
    }

    return teams;
}

export const teamSortFunction = (showByes: boolean, a: TeamData, b: TeamData) => {
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
