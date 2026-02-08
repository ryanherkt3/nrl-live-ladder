import { TeamData, TeamStatuses } from './definitions';
import { NUMS } from './utils';

// Display if a team is eliminated, qualified for finals football, or in the top 2/4 of the ladder
export function getQualificationStatus(
    team: TeamData,
    allTeams: TeamData[],
    minPointsForSpots: TeamStatuses,
    currentComp: string,
    currentYear: number
) {
    const finalsTeams = NUMS[currentComp].FINALS_TEAMS(currentYear);
    const matches = NUMS[currentComp].MATCHES(currentYear);
    const byes = NUMS[currentComp].BYES(currentYear);
    const teams = NUMS[currentComp].TEAMS(currentYear);

    const topTeams = [...allTeams];
    const bottomTeams = topTeams.splice(finalsTeams);

    const lastFinalist = topTeams[topTeams.length - 1];
    const { stats: lfStats } = lastFinalist;

    const { wins, drawn, maxPoints, played } = team.stats;
    const { eliminated, topTwo, topFour, finalsQualification } = minPointsForSpots;

    // Include bye points in the calculations, as sometimes a team may look as
    // though their worst finish is one place above the cut off, but are actually
    // qualified if bye points are counted
    const pointsWithByes = ((wins + byes) * 2) + drawn;

    const bottomTeamsCanFinishAbove = bottomTeams.filter((bottomTeam: TeamData) => {
        const filteredTeamStats = bottomTeam.stats;
        const filteredTeamPointsWithByes =
            ((bottomTeam.stats.wins + byes) * 2) + bottomTeam.stats.drawn;

        const filteredTeamHasLessPoints = filteredTeamStats.maxPoints < pointsWithByes;

        if (bottomTeam.name !== team.name) {
            return filteredTeamHasLessPoints ||
                (
                    filteredTeamPointsWithByes === pointsWithByes &&
                    filteredTeamStats['points difference'] < team.stats['points difference']
                );
        }

        return false;
    });

    // Display if a team is eliminated, qualified for finals football, or in the top 2/4 of the ladder
    let qualificationStatus = '';
    const isEliminated = maxPoints <= eliminated ||
        (
            // Is also eliminated if last placed finals team has better points differential
            // when tied on points at end of season
            played === matches &&
            lfStats.points >= pointsWithByes &&
            lfStats['points difference'] > team.stats['points difference']
        );

    if (isEliminated) {
        qualificationStatus = '(E)';
    }
    else if (pointsWithByes >= topTwo) {
        qualificationStatus = '(T2)';
    }
    else if (pointsWithByes >= topFour && teams > 4) {
        qualificationStatus = '(T4)';
    }
    else if (pointsWithByes >= finalsQualification ||
            (played === matches && bottomTeamsCanFinishAbove.length >= teams - finalsTeams)) {
        qualificationStatus = '(Q)';
    }

    return qualificationStatus;
}

// Get the lowest amount of points to qualify for a given position (top 2/4/8, elimination)
export function getMinPointsForSpots(
    allTeams: TeamData[],
    currentComp: string,
    currentYear: number
) {
    const finalsTeams = NUMS[currentComp].FINALS_TEAMS(currentYear);
    const byes = NUMS[currentComp].BYES(currentYear);

    const teamsByMaxPoints = [...allTeams].sort((a: TeamData, b: TeamData) => {
        return b.stats.maxPoints - a.stats.maxPoints;
    });

    const lowestPlacedFinalsTeam = teamsByMaxPoints[finalsTeams - 1];
    const { wins: lowestPlacedFinalsTeamWins, drawn : lowestPlacedFinalsTeamDraws } = lowestPlacedFinalsTeam.stats;

    const minPointsForSpots: TeamStatuses = {
        // Add one to the finals spots
        topTwo: teamsByMaxPoints[2].stats.maxPoints + 1,
        topFour: finalsTeams >= 4 ? teamsByMaxPoints[4].stats.maxPoints + 1 : 0,
        finalsQualification: teamsByMaxPoints[finalsTeams].stats.maxPoints + 1,
        // Subtract one for the eliminated spots
        eliminated: ((lowestPlacedFinalsTeamWins + byes) * 2) + lowestPlacedFinalsTeamDraws - 1,
    };

    return minPointsForSpots;
}
