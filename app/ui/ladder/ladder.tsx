import LadderRow from './ladder-row';
import { TeamData, Match, DrawInfo, PageVariables } from '../../lib/definitions';
import Fixtures from '../fixture/fixtures';
import ByeToggleSection from '../bye-toggle';
import { useState } from 'react';
import { NUMS } from '@/app/lib/utils';
import { getPageVariables, teamSortFunction } from '@/app/lib/nrl-draw-utils';
import PageDescription from '../page-desc';
import Standings from './../ladder/standings';

export default function Ladder({seasonDraw}: {seasonDraw: Array<DrawInfo>}) {
    const pageVariables = getPageVariables(Object.values(seasonDraw), false);
    const { byes, fixtures, currentRoundNo, allTeams } = pageVariables;

    const updateByePoints = (newValue: boolean) => {
        // Do not set if the value is the same
        if (newValue === byePoints) {
            return;
        }

        setByePoints(newValue);

        // Update teams object
        teams = teams.sort((a: TeamData, b: TeamData) => {
            return teamSortFunction(newValue, a, b);
        });
    };
    const [byePoints, setByePoints] = useState(true);

    // TODO move to util
    const updateFixturesToShow = (showPreviousRound: boolean) => {
        const newRoundIndex = showPreviousRound ? roundIndex - 1 : roundIndex + 1;

        // Fixtures don't exist so return early
        if (!seasonDraw[newRoundIndex]) {
            return false;
        }

        const { fixtures, byes } = seasonDraw[newRoundIndex];

        setRoundIndex(newRoundIndex);
        setFixturesToShow(fixtures);
        setByeTeams(byes);
    };
    const [roundIndex, setRoundIndex] = useState(currentRoundNo);
    const [fixturesToShow, setFixturesToShow] = useState(fixtures);
    const [byeTeams, setByeTeams] = useState(byes);

    const {ROUNDS, FINALS_TEAMS} = NUMS;
    let teams = allTeams;

    // Last round for the toggle. Is last round of regular season if not finals football,
    // otherwise it is set to the current finals football week
    const lastFixtureRound = currentRoundNo <= ROUNDS ? ROUNDS : currentRoundNo;

    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <PageDescription
                cssClasses={'text-xl text-center'}
                description={'Ladder auto-updates every few seconds'}
            />
            {
                // Do not show bye toggle if in first round or last round and beyond
                currentRoundNo === 1 || currentRoundNo >= ROUNDS ?
                    null :
                    <ByeToggleSection setByeValue={byePoints} byeValueCb={updateByePoints} />
            }
            <Standings
                topHalf={getLadderRow(teams.slice(0, FINALS_TEAMS), 1, byePoints, pageVariables)}
                bottomHalf={getLadderRow(teams.slice(FINALS_TEAMS), FINALS_TEAMS + 1, byePoints, pageVariables)}
            />
            <Fixtures
                roundNum={roundIndex}
                byes={byeTeams}
                fixtures={fixturesToShow}
                teamList={allTeams}
                updateCallback={updateFixturesToShow}
                lastRoundNo={lastFixtureRound}
                modifiable={false}
                modifiedFixtureCb={undefined}
            />
        </div>
    );
}

/**
 * Get a row in the ladder
 *
 * @param {Array<TeamData>} teamList
 * @param {number} indexAdd the increment for the team's ladder position (1 or 9)
 * @param {boolean} byePoints
 * @param {PageVariables} pageVariables
 * @returns {LadderRow} React object
 */
function getLadderRow(
    teamList: Array<TeamData>,
    indexAdd: number,
    byePoints: boolean,
    pageVariables: PageVariables,
) {
    return teamList.map((team: TeamData) => {
        // Check if team is currently playing
        let isPlaying = false;

        const { fixtures, currentRoundNo, nextRoundInfo, liveMatches } = pageVariables;
        const {name, stats, theme} = team;
        const {ROUNDS, FINALS_TEAMS} = NUMS;

        if (liveMatches) {
            for (const match of liveMatches) {
                isPlaying = match.awayTeam.nickName === name ||
                    match.homeTeam.nickName === name;

                if (isPlaying) {
                    break;
                }
            }
        }

        // Get team's next fixture if there is one
        // If team has played get fixture from next round, otherwise get one from current round
        let filteredFixture = null;
        let nextTeam = '';
        let nextMatchUrl = '';

        const playedAndByes = stats.played + stats.byes;
        if ((playedAndByes === currentRoundNo || playedAndByes === ROUNDS) && nextRoundInfo) {
            filteredFixture = nextRoundInfo.fixtures.filter((fixture: Match) => {
                return name === fixture.homeTeam.nickName ||
                    name === fixture.awayTeam.nickName;
            });
        }
        else {
            filteredFixture = fixtures.filter((fixture: Match) => {
                return name === fixture.homeTeam.nickName ||
                    name === fixture.awayTeam.nickName;
            });
        }

        const ladderPos = teamList.indexOf(team) + indexAdd;

        if (filteredFixture && filteredFixture.length) {
            const {homeTeam, awayTeam, matchCentreUrl} = filteredFixture[0];

            nextTeam = name === homeTeam.nickName ?
                awayTeam.theme.key :
                homeTeam.theme.key;
            nextMatchUrl = `https://nrl.com${matchCentreUrl}`;
        }
        else if (currentRoundNo < ROUNDS) {
            nextTeam = 'BYE';
        }
        else if (currentRoundNo === ROUNDS && ladderPos <= FINALS_TEAMS) {
            let finalsOppLadderPos = ladderPos;

            // Finals Week 1: 1v4, 2v3, 5v8, 6v7
            switch (ladderPos) {
                case 1:
                case 5:
                    finalsOppLadderPos += 3;
                    break;
                case 4:
                case 8:
                    finalsOppLadderPos -= 3;
                    break;
                case 2:
                case 6:
                    finalsOppLadderPos += 1;
                    break;
                case 3:
                case 7:
                    finalsOppLadderPos -= 1;
                    break;
                default:
                    break;
            }

            nextTeam = teamList[finalsOppLadderPos - 1].theme.key;
        }

        return <LadderRow
            key={theme.key}
            teamData={team}
            position={ladderPos.toString()}
            isPlaying={isPlaying}
            byePoints={byePoints}
            nextTeam={nextTeam}
            nextMatchUrl={nextMatchUrl}
        />;
    });
}
