import LadderRow from './ladder-row';
import { TeamData, Match, DrawInfo, PageVariables } from '../../lib/definitions';
import Fixtures from '../fixture/fixtures';
import ByeToggleSection from '../bye-toggle';
import { useEffect, useState } from 'react';
import { NUMS } from '@/lib/utils';
import { getPageVariables, updateFixturesToShow } from '@/lib/nrl-draw-utils';
import PageDescription from '../page-desc';
import Standings from './standings';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { teamSortFunction } from '@/lib/team-stats';
import { getMinPointsForSpots, getQualificationStatus } from '@/lib/qualification';
import { useSearchParams } from 'next/navigation';

export default function Ladder({seasonDraw}: {seasonDraw: DrawInfo[]}) {
    // Empty string means info about the NRL will be fetched
    const comp = useSearchParams().get('comp') ?? 'nrl';

    const currentYear = useSelector((state: RootState) => state.currentYear.value);
    const { year } = currentYear;

    // Empty string means the current year will be fetched
    const season = useSearchParams().get('season');
    const drawSeason = season ? parseInt(season) : year;

    // Ensure byes is always an array
    const pageVariablesRaw = getPageVariables(Object.values(seasonDraw), false, comp, drawSeason);
    const pageVariables = { ...pageVariablesRaw, byes: pageVariablesRaw.byes ?? [] };
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

    // Update ladder teams, round index, fixtures and byes
    // when the competition has changed (e.g. from NRL to NRLW)
    useEffect(() => {
        setLadderTeams(allTeams.sort((a: TeamData, b: TeamData) => {
            return teamSortFunction(byePoints, a, b);
        }));
        setRoundIndex(currentRoundNo);
        setFixturesToShow(fixtures);
        if (Object.values(byes).length) {
            setByeTeams(byes);
        }
    }, [comp]);

    const updateFixturesCb = (showPreviousRound: boolean) => {
        updateFixturesToShow(
            showPreviousRound, roundIndex, seasonDraw, setRoundIndex, setFixturesToShow, setByeTeams
        );
    };

    const rounds = NUMS[comp].ROUNDS(drawSeason);
    const seasonByes = NUMS[comp].BYES(drawSeason);

    // Last round for the toggle. Is last round of regular season if not finals football,
    // otherwise it is set to the current finals football week
    const lastFixtureRound = currentRoundNo <= rounds ? rounds : currentRoundNo;

    const topTeams = getLadderRow(true, ladderTeams, byePoints, pageVariables, comp, drawSeason);
    const bottomTeams = getLadderRow(false, ladderTeams, byePoints, pageVariables, comp, drawSeason);

    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <PageDescription
                cssClasses={'text-xl text-center'}
                description={'Ladder auto-updates every few seconds'}
            />
            {
                // Do not show bye toggle if:
                // 1. The competition does not have byes, (BYES = 0) OR
                // 2. The competition is in round 1 or the last round and beyond
                seasonByes === 0 || (currentRoundNo === 1 || currentRoundNo >= rounds) ?
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
 * Get a row in the ladder.
 *
 * @param {boolean} isInTopSection if the team is in the top x of the competition
 * @param {Array<TeamData>} allTeams
 * @param {boolean} byePoints
 * @param {PageVariables} pageVariables
 * @param {String} currentComp
 * @param {number} drawSeason
 * @returns {LadderRow} React object
 */
function getLadderRow(
    isInTopSection: boolean,
    allTeams: TeamData[],
    byePoints: boolean,
    pageVariables: PageVariables,
    currentComp: string,
    drawSeason: number
) {
    const { WEEK_ONE_FINALS_FORMAT } = NUMS[currentComp];
    const finalsTeams = NUMS[currentComp].FINALS_TEAMS(drawSeason);

    const teamList = isInTopSection ? allTeams.slice(0, finalsTeams) : allTeams.slice(finalsTeams);
    const indexAdd = isInTopSection ? 1 : finalsTeams + 1;

    return teamList.map((team: TeamData) => {
        // Check if team is currently playing
        const { fixtures, currentRoundNo, nextRoundInfo, liveMatches } = pageVariables;
        const { name, stats, theme } = team;
        const rounds = NUMS[currentComp].ROUNDS(drawSeason);
        const finalsTeams = NUMS[currentComp].FINALS_TEAMS(drawSeason);

        const isPlaying = Array.isArray(liveMatches) &&
            liveMatches.some((match: Match) => match.awayTeam.nickName === name || match.homeTeam.nickName === name);

        // Get team's next fixture if there is one
        // If team has played (or is playing) get fixture from next round, otherwise get one from current round
        let filteredFixture: Match[] = [];
        let nextTeam = '';
        let nextTeamTooltip = '';
        let nextMatchUrl = '';

        const playedAndByes = stats.played + stats.byes;

        if (playedAndByes < currentRoundNo) {
            const foundFixture = fixtures.find((fixture: Match) => {
                return (name === fixture.homeTeam.nickName || name === fixture.awayTeam.nickName) &&
                    fixture.matchMode === 'Pre';
            });
            if (foundFixture) {
                filteredFixture = [foundFixture];
            }
        }
        else if (nextRoundInfo?.selectedRoundId !== undefined && nextRoundInfo.selectedRoundId !== currentRoundNo) {
            const foundFixture = nextRoundInfo.fixtures.find((fixture: Match) => {
                return name === fixture.homeTeam.nickName || name === fixture.awayTeam.nickName;
            });
            if (foundFixture) {
                filteredFixture = [foundFixture];
            }
        }

        const ladderPos = teamList.indexOf(team) + indexAdd;

        if (filteredFixture.length) {
            const { homeTeam, awayTeam, matchCentreUrl } = filteredFixture[0] ?? {};

            if (name === homeTeam.nickName) {
                nextTeam = awayTeam.theme.key;
                nextTeamTooltip = awayTeam.nickName;
            }
            else {
                nextTeam = homeTeam.theme.key;
                nextTeamTooltip = homeTeam.nickName;
            }

            nextMatchUrl = matchCentreUrl;
        }
        else if (currentRoundNo < rounds) {
            nextTeam = 'BYE';
        }
        else if (currentRoundNo === rounds && ladderPos <= finalsTeams) {
            let finalsOppLadderPos: number | undefined;
            // Get week 1 finals matchup for a team if possible
            const weekOneMatchup = WEEK_ONE_FINALS_FORMAT.find((matchup: number[]) => matchup.includes(ladderPos));
            if (weekOneMatchup) {
                finalsOppLadderPos = weekOneMatchup.find((position: number) => position !== ladderPos);
            }
            if (finalsOppLadderPos !== undefined && teamList[finalsOppLadderPos - 1]) {
                nextTeam = teamList[finalsOppLadderPos - 1]?.theme?.key ?? '';
                nextTeamTooltip = teamList[finalsOppLadderPos - 1]?.name ?? '';
            }
        }

        const qualificationStatus = getQualificationStatus(
            team, allTeams, getMinPointsForSpots(allTeams, currentComp, drawSeason), currentComp, drawSeason
        );

        return <LadderRow
            key={theme.key}
            teamData={team}
            position={ladderPos.toString()}
            isPlaying={isPlaying}
            byePoints={byePoints}
            predictorPage={false}
            nextTeam={nextTeam}
            nextTeamTooltip={nextTeamTooltip}
            nextMatchUrl={nextMatchUrl}
            qualificationStatus={qualificationStatus}
        />;
    });
}
