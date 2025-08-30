import { TeamData, TeamStatuses } from './definitions';
import { NUMS } from './utils';

// Display if a team is eliminated, qualified for finals football, or in the top 2/4 of the ladder
export function getQualificationStatus(
    team: TeamData,
    allTeams: Array<TeamData>,
    minPointsForSpots: TeamStatuses,
    currentComp: string
) {
    const { FINALS_TEAMS, MATCHES, BYES, TEAMS } = NUMS[currentComp];

    const topTeams = [...allTeams];
    const bottomTeams = topTeams.splice(FINALS_TEAMS);

    const lastFinalist = topTeams[topTeams.length - 1];
    const { stats: lfStats } = lastFinalist;

    const { noByePoints, noByeMaxPoints, played } = team.stats;
    const { eliminated, topTwo, topFour, finalsQualification } = minPointsForSpots;

    // Include bye points in the calculations, as sometimes a team may look as
    // though their worst finish is one place above the cut off, but are actually
    // qualified if bye points are counted
    const pointsWithByes = ((team.stats.wins + BYES) * 2) + team.stats.drawn;

    const bottomTeamsCanFinishAbove = bottomTeams.filter((bottomTeam: TeamData) => {
        const filteredTeamStats = bottomTeam.stats;
        const filteredTeamPointsWithByes =
            ((bottomTeam.stats.wins + NUMS[currentComp].BYES) * 2) + bottomTeam.stats.drawn;

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
    let qualificationStatus: TeamData['qualificationStatus'] = '';
    const isEliminated = noByeMaxPoints <= eliminated ||
        (
            // Is also eliminated if last placed finals team has better points differential
            // when tied on points at end of season
            played === MATCHES &&
            lfStats.noByePoints >= noByePoints &&
            lfStats['points difference'] > team.stats['points difference']
        );

    if (isEliminated) {
        qualificationStatus = '(E)';
    }
    else if (noByePoints >= topTwo) {
        qualificationStatus = '(T2)';
    }
    else if (noByePoints >= topFour) {
        qualificationStatus = '(T4)';
    }
    else if (pointsWithByes >= finalsQualification || bottomTeamsCanFinishAbove.length >= TEAMS - FINALS_TEAMS) {
        qualificationStatus = '(Q)';
    }

    return qualificationStatus;
}

// Get the lowest amount of points to qualify for a given position (top 2/4/8, elimination)
export function getMinPointsForSpots(
    allTeams: Array<TeamData>,
    currentComp: string
) {
    const { FINALS_TEAMS, WIN_POINTS } = NUMS[currentComp];

    const teamsByMaxPoints = [...allTeams].sort((a: TeamData, b: TeamData) => {
        return b.stats.noByeMaxPoints - a.stats.noByeMaxPoints;
    });

    const teamsByNoByePoints = [...allTeams].sort((a: TeamData, b: TeamData) => {
        return b.stats.noByePoints - a.stats.noByePoints;
    });

    const lowestPlacedFinalsTeam = teamsByNoByePoints[FINALS_TEAMS - 1];
    const { wins: lowestPlacedFinalsTeamWins, drawn: lowestPlacedFinalsTeamDraws } = lowestPlacedFinalsTeam.stats;

    const minPointsForSpots: TeamStatuses = {
        // Add one to the finals spots
        topTwo: teamsByMaxPoints[2].stats.noByeMaxPoints + 1,
        topFour: teamsByMaxPoints[4].stats.noByeMaxPoints + 1,
        finalsQualification: teamsByMaxPoints[FINALS_TEAMS].stats.noByeMaxPoints + 1,
        // Subtract one for the eliminated spots
        eliminated: ((lowestPlacedFinalsTeamWins * WIN_POINTS) + lowestPlacedFinalsTeamDraws) - 1,
    };

    return minPointsForSpots;
}
