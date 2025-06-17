import LadderRow from './ladder-row';
import { TeamData, Match, DrawInfo, PageVariables } from '../../lib/definitions';
import Fixtures from '../fixture/fixtures';
import ByeToggleSection from '../bye-toggle';
import { useEffect, useState } from 'react';
import { NUMS } from '@/app/lib/utils';
import { getPageVariables, teamSortFunction, updateFixturesToShow } from '@/app/lib/nrl-draw-utils';
import PageDescription from '../page-desc';
import Standings from './../ladder/standings';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

export default function Ladder({seasonDraw}: {seasonDraw: Array<DrawInfo>}) {
    const currentComp = useSelector((state: RootState) => state.currentComp.value);
    const { comp } = currentComp;

    const currentYear = useSelector((state: RootState) => state.currentYear.value);
    const { year } = currentYear;

    const pageVariables = getPageVariables(Object.values(seasonDraw), false, comp, year);
    const { byes, fixtures, currentRoundNo, allTeams } = pageVariables;

    const [byePoints, setByePoints] = useState(true);
    const [ladderTeams, setLadderTeams] = useState(allTeams);
    const [roundIndex, setRoundIndex] = useState(currentRoundNo);
    const [fixturesToShow, setFixturesToShow] = useState(fixtures);
    const [byeTeams, setByeTeams] = useState(byes);

    const updateByePoints = (newValue: boolean) => {
        // Do not set if the value is the same
        if (newValue === byePoints) {
            return;
        }

        // Update ladder teams object and bye points value
        setByePoints(newValue);
        setLadderTeams(allTeams.sort((a: TeamData, b: TeamData) => {
            return teamSortFunction(newValue, a, b);
        }));
    };

    // Update ladder teams after each re-render if the fixtures get changed (i.e. the score updates)
    useEffect(() => {
        if (JSON.stringify(allTeams) === JSON.stringify(ladderTeams)) {
            return;
        }

        setLadderTeams(allTeams.sort((a: TeamData, b: TeamData) => {
            return teamSortFunction(byePoints, a, b);
        }));
    }, [fixtures]);

    const updateFixturesCb = (showPreviousRound: boolean) => {
        updateFixturesToShow(
            showPreviousRound, roundIndex, seasonDraw, setRoundIndex, setFixturesToShow, setByeTeams
        );
    };

    const { ROUNDS, FINALS_TEAMS } = NUMS[comp];

    // Last round for the toggle. Is last round of regular season if not finals football,
    // otherwise it is set to the current finals football week
    const lastFixtureRound = currentRoundNo <= ROUNDS ? ROUNDS : currentRoundNo;

    const topTeams = getLadderRow(ladderTeams.slice(0, FINALS_TEAMS), 1, byePoints, pageVariables, comp);
    const bottomTeams = getLadderRow(ladderTeams.slice(FINALS_TEAMS), FINALS_TEAMS + 1, byePoints, pageVariables, comp);

    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <PageDescription
                cssClasses={'text-xl text-center'}
                description={'Ladder auto-updates every few seconds'}
            />
            {
                //Do not show bye toggle if in R1, last round, or finals football
                currentRoundNo === 1 || currentRoundNo >= ROUNDS ?
                    null :
                    <ByeToggleSection setByeValue={byePoints} byeValueCb={updateByePoints} />
            }
            <Standings
                topHalf={topTeams}
                bottomHalf={bottomTeams}
                predictorPage={false}
            />
            <Fixtures
                roundNum={roundIndex}
                byes={byeTeams}
                fixtures={roundIndex === currentRoundNo ? fixtures : fixturesToShow}
                teamList={ladderTeams}
                updateCallback={updateFixturesCb}
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
 * @param {String} currentComp
 * @returns {LadderRow} React object
 */
function getLadderRow(
    teamList: Array<TeamData>,
    indexAdd: number,
    byePoints: boolean,
    pageVariables: PageVariables,
    currentComp: string,
) {
    return teamList.map((team: TeamData) => {
        // Check if team is currently playing
        let isPlaying = false;

        const { fixtures, currentRoundNo, nextRoundInfo, liveMatches } = pageVariables;
        const { name, stats, theme } = team;
        const { ROUNDS, FINALS_TEAMS } = NUMS[currentComp];

        if (liveMatches) {
            for (const match of liveMatches) {
                isPlaying = match.awayTeam.nickName === name || match.homeTeam.nickName === name;

                if (isPlaying) {
                    break;
                }
            }
        }

        // Get team's next fixture if there is one
        // If team has played (or is playing) get fixture from next round, otherwise get one from current round
        let filteredFixture = null;
        let nextTeam = '';
        let nextMatchUrl = '';

        const playedAndByes = stats.played + stats.byes;

        if (playedAndByes < currentRoundNo) {
            filteredFixture = fixtures.filter((fixture: Match) => {
                return (name === fixture.homeTeam.nickName || name === fixture.awayTeam.nickName) &&
                    fixture.matchMode === 'Pre';
            });
        }
        else if (nextRoundInfo) {
            filteredFixture = nextRoundInfo.fixtures.filter((fixture: Match) => {
                return name === fixture.homeTeam.nickName || name === fixture.awayTeam.nickName;
            });
        }

        const ladderPos = teamList.indexOf(team) + indexAdd;

        if (filteredFixture && filteredFixture.length) {
            const { homeTeam, awayTeam, matchCentreUrl } = filteredFixture[0];

            nextTeam = name === homeTeam.nickName ?
                awayTeam.theme.key :
                homeTeam.theme.key;
            nextMatchUrl = matchCentreUrl;
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
            predictorPage={false}
            nextTeam={nextTeam}
            nextMatchUrl={nextMatchUrl}
        />;
    });
}
