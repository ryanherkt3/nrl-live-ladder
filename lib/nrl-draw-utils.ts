import { DrawInfo, Match, TeamData, ByeTeam } from './definitions';
import { constructTeamData, constructTeamStats, teamSortFunction } from './team-stats';
import { NUMS } from './utils';

/**
 * Get all the page variables
 *
 * @param {Array<DrawInfo>} seasonDraw
 * @param {Boolean} modifiable if the team stats can be modified (on the ladder predictor page)
 * @param {string} currentComp
 * @param {number} currentYear
 * @param {number} lastRound
 * @returns {PageVariables}
 */
export function getPageVariables(
    seasonDraw: DrawInfo[],
    modifiable: boolean,
    currentComp: string,
    currentYear: number,
    lastRound: number,
) {
    // Construct list of teams manually
    const teamList: TeamData[] = constructTeamData(seasonDraw[0].filterTeams, currentComp, currentYear);

    // Get current round number
    const currentRoundInfo: DrawInfo[] = seasonDraw.filter((round: DrawInfo) => {
        if (lastRound > 0 && round.selectedRoundId === lastRound) {
            return true;
        }

        if (round.byes !== undefined) {
            return round.byes[0].isCurrentRound;
        }

        return round.fixtures[0].isCurrentRound;
    });

    const { byes, fixtures, selectedRoundId: currentRoundNo } = currentRoundInfo[0];

    const rounds = NUMS[currentComp].ROUNDS(currentYear);
    const finalsWeeks = NUMS[currentComp].FINALS_WEEKS(currentYear);

    let nextRoundInfo;
    if (currentRoundNo < rounds + finalsWeeks) {
        nextRoundInfo = seasonDraw[currentRoundNo];
    }
    const liveMatches = fixtures.filter((fixture: Match) => {
        return fixture.matchMode === 'Live' && fixture.matchState !== 'FullTime';
    });

    const allTeams = constructTeamStats(seasonDraw, currentRoundNo, teamList, modifiable, currentComp, currentYear)
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
    seasonDraw: DrawInfo[],
    setRoundIndex: (_newRoundIndex: number) => void,
    setFixturesToShow: (_fixtures: Match[]) => void,
    setByeTeams: (_byes: ByeTeam[]) => void,
) {
    const newRoundIndex = showPreviousRound ? roundIndex - 1 : roundIndex + 1;

    const newRoundInfo = seasonDraw.find((rounds: DrawInfo) => rounds.selectedRoundId === newRoundIndex);

    // Fixtures don't exist so return early
    if (!newRoundInfo) {
        return false;
    }

    const { fixtures, byes } = newRoundInfo;

    setRoundIndex(newRoundIndex);
    setFixturesToShow(fixtures);
    setByeTeams(byes ?? []);
}
