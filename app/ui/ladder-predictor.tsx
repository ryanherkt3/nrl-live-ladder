import LadderRow from './ladder/ladder-row';
import { TeamData, DrawInfo } from '../lib/definitions';
import { NUMS } from '@/app/lib/utils';
import { getPageVariables, updateFixturesToShow } from '@/app/lib/nrl-draw-utils';
import Fixtures from './fixture/fixtures';
import { useState } from 'react';
import PageDescription from './page-desc';
import Standings from './ladder/standings';

export default function LadderPredictor({seasonDraw}: {seasonDraw: Array<DrawInfo>}) {
    const seasonDrawInfo = Object.values(seasonDraw);
    const pageVariables = getPageVariables(seasonDrawInfo, true);

    const { currentRoundNo, allTeams } = pageVariables;
    const { ROUNDS, FINALS_TEAMS } = NUMS;

    // Set current fixture round to last round if in finals football
    const currentFixtureRound = currentRoundNo <= ROUNDS ? currentRoundNo : ROUNDS;

    const { fixtures, byes } = seasonDraw[currentFixtureRound];

    const updateAllTeams = (slug: string, teamsArray: string, round: number, teamName: string, score: number) => {
        const roundKey = round - 1;

        const fixtureToUpdate = seasonDrawInfo[roundKey].fixtures.find((fixture) => {
            return fixture.matchCentreUrl.indexOf(slug) > 0;
        });

        if (!fixtureToUpdate) {
            console.log('fixture does not exist');
            return;
        }

        const homeTeamSlug = teamsArray[0];
        const awayTeamSlug = teamsArray[1];
        const isAwayTeamUpdated = awayTeamSlug === teamName;

        const teamToUpdate = isAwayTeamUpdated ?
            fixtureToUpdate.awayTeam : fixtureToUpdate.homeTeam;
        const opponent = isAwayTeamUpdated ?
            fixtureToUpdate.homeTeam : fixtureToUpdate.awayTeam;

        teamToUpdate.score = score;
        const opponentScore = opponent.score || '';

        // Store user scores in localStorage
        const predictions = localStorage.predictedMatches ? JSON.parse(localStorage.predictedMatches) : {};

        // Set the predictions array to update, then update it
        predictions[roundKey + 1] = predictions[roundKey + 1] || {};
        predictions[roundKey + 1][slug] = {
            [`${homeTeamSlug}`]: isAwayTeamUpdated ? opponentScore : teamToUpdate.score,
            [`${awayTeamSlug}`]: isAwayTeamUpdated ? teamToUpdate.score : opponentScore
        };

        // Delete the entry from localStorage if both values are empty (i.e the match is not predicted)
        if (Object.values(predictions[roundKey + 1][slug]).filter(val => val === '').length === 2) {
            delete predictions[roundKey + 1][slug];
        }

        // Update localStorage
        localStorage.predictedMatches = JSON.stringify(predictions);

        // Get updated data for each match
        const pageVariables = getPageVariables(seasonDrawInfo, true);
        const { allTeams } = pageVariables;

        setTeams(allTeams);
    };

    const updateFixturesCb = (showPreviousRound: boolean) => {
        updateFixturesToShow(
            showPreviousRound, roundIndex, seasonDraw, setRoundIndex, setFixturesToShow, setByeTeams
        );
    };
    const [roundIndex, setRoundIndex] = useState(currentFixtureRound);
    const [fixturesToShow, setFixturesToShow] = useState(fixtures);
    const [byeTeams, setByeTeams] = useState(byes);

    const [teams, setTeams] = useState(allTeams);

    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <PageDescription
                cssClasses={'text-xl text-center'}
                description={'Predict the outcome of every match and see how the ladder looks!'}
            />
            <Standings
                topHalf={getLadderRow(teams.slice(0, FINALS_TEAMS), 1)}
                bottomHalf={getLadderRow(teams.slice(FINALS_TEAMS), FINALS_TEAMS + 1)}
            />
            <Fixtures
                roundNum={roundIndex}
                byes={byeTeams}
                fixtures={fixturesToShow}
                teamList={teams}
                updateCallback={updateFixturesCb}
                lastRoundNo={ROUNDS}
                modifiable={roundIndex < currentRoundNo}
                modifiedFixtureCb={updateAllTeams}
            />
        </div>
    );
}

/**
 * Get a row in the ladder
 *
 * @param {Array<TeamData>} teamList
 * @param {number} indexAdd the increment for the team's ladder position (1 or FINALS_TEAMS + 1)
 * @returns {LadderRow} React object
 */
function getLadderRow(teamList: Array<TeamData>, indexAdd: number) {
    return teamList.map((team: TeamData) => {
        const nextTeam = '';
        const nextMatchUrl = '';

        const ladderPos = teamList.indexOf(team) + indexAdd;

        return <LadderRow
            key={team.theme.key}
            teamData={team}
            position={ladderPos.toString()}
            isPlaying={false}
            byePoints={true}
            nextTeam={nextTeam}
            nextMatchUrl={nextMatchUrl}
        />;
    });
}
