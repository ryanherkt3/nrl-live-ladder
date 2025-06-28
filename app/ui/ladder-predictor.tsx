import LadderRow from './ladder/ladder-row';
import { TeamData, DrawInfo, Match } from '../lib/definitions';
import { COLOURCSSVARIANTS as CCV, CURRENTCOMP, CURRENTYEAR, MAINCOLOUR, NUMS } from '@/app/lib/utils';
import { getPageVariables, updateFixturesToShow } from '@/app/lib/nrl-draw-utils';
import Fixtures from './fixture/fixtures';
import { useEffect, useState } from 'react';
import PageDescription from './page-desc';
import Standings from './ladder/standings';
import LadderPredictorButton from './ladder-predictor-button';

export default function LadderPredictor({seasonDraw}: {seasonDraw: Array<DrawInfo>}) {
    const seasonDrawInfo = Object.values(seasonDraw);
    const pageVariables = getPageVariables(seasonDrawInfo, true);

    const { currentRoundNo, allTeams, fixtures, byes } = pageVariables;
    const { ROUNDS, FINALS_TEAMS } = NUMS[CURRENTCOMP];

    const currentYear = CURRENTYEAR;

    // Set current fixture round to last round if in finals football
    const inFinalsFootball = currentRoundNo > ROUNDS;
    const currentFixtureRound = inFinalsFootball ? ROUNDS : currentRoundNo;

    const updateAllTeams = (slug: string, round: number, teamName: string, score: number) => {
        const roundKey = round - 1;

        const fixtureToUpdate = seasonDrawInfo[roundKey].fixtures.find((fixture) => {
            return fixture.matchCentreUrl.indexOf(slug) > 0;
        });

        if (!fixtureToUpdate) {
            return;
        }

        const { homeTeam, awayTeam } = fixtureToUpdate;

        const homeTeamSlug = homeTeam.nickName.toLowerCase().replace(' ', '-');
        const awayTeamSlug = awayTeam.nickName.toLowerCase().replace(' ', '-');
        const isAwayTeamUpdated = awayTeamSlug === teamName;

        const teamToUpdate = isAwayTeamUpdated ? awayTeam : homeTeam;
        const opponent = isAwayTeamUpdated ? homeTeam : awayTeam;

        teamToUpdate.score = score;
        const opponentScore = opponent.score || '';

        // Store user scores in localStorage
        const predictions = localStorage[`predictedMatches${currentYear}${CURRENTCOMP}`] ?
            JSON.parse(localStorage[`predictedMatches${currentYear}${CURRENTCOMP}`]) :
            {};

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

        updatePredictions(predictions, roundIndex);
    };

    const updateFixturesCb = (showPreviousRound: boolean) => {
        updateFixturesToShow(
            showPreviousRound, roundIndex, seasonDraw, setRoundIndex, setFixturesToShow, setByeTeams
        );

        // Update the disabled clear round button
        const predictedMatches = localStorage[`predictedMatches${currentYear}${CURRENTCOMP}`] ?
            JSON.parse(localStorage[`predictedMatches${currentYear}${CURRENTCOMP}`]) :
            {};
        const index = showPreviousRound ? roundIndex - 1 : roundIndex + 1;
        if (predictedMatches) {
            setDisabledClearRndBtn(!predictedMatches[index]);
        }
        setDisabledResetBtn(!Object.entries(predictedMatches).length);
    };
    const [roundIndex, setRoundIndex] = useState(currentFixtureRound);
    const [fixturesToShow, setFixturesToShow] = useState(fixtures);
    const [byeTeams, setByeTeams] = useState(byes);

    // Update predictions stored in localStorage
    const updatePredictions = (predictions: Object | String, roundNum: number) => {
        const predictedMatches = localStorage[`predictedMatches${currentYear}${CURRENTCOMP}`] ?
            JSON.parse(localStorage[`predictedMatches${currentYear}${CURRENTCOMP}`]) :
            {};

        const updatePredictions = typeof predictions === 'object';
        const clearRound = typeof predictions === 'string' && predictions === 'clear-round';
        let clearAll = typeof predictions === 'string' && predictions === 'clear-all';

        if (updatePredictions) {
            localStorage[`predictedMatches${currentYear}${CURRENTCOMP}`] = JSON.stringify(predictions);
        }
        else if (clearRound) {
            // Reset the scores for every predicted fixture for the chosen round and
            // delete the localStorage entry for that round
            for (const fixture of seasonDrawInfo[roundNum - 1].fixtures) {
                if (fixture.matchMode === 'Pre' || fixture.matchState === 'Upcoming') {
                    fixture.homeTeam.score = '';
                    fixture.awayTeam.score = '';
                }
            }

            delete predictedMatches[roundNum];

            localStorage[`predictedMatches${currentYear}${CURRENTCOMP}`] = JSON.stringify(predictedMatches);

            // Set clearAll to true if clearing the round predictions also clears all the predictions
            if (['null', '""', '{}'].includes(JSON.stringify(predictedMatches))) {
                clearAll = true;
            }
        }

        if (clearAll) {
            // Reset the scores for every predicted fixture and delete the localStorage entry
            for (const round of seasonDrawInfo) {
                if (round.selectedRoundId > ROUNDS) {
                    break;
                }

                for (const fixture of round.fixtures) {
                    if (fixture.matchMode === 'Pre' || fixture.matchState === 'Upcoming') {
                        fixture.homeTeam.score = '';
                        fixture.awayTeam.score = '';
                    }
                }
            }
            delete localStorage[`predictedMatches${currentYear}${CURRENTCOMP}`];
        }

        // Update the button states - TODO migrate to redux
        setDisabledClearRndBtn(clearRound || clearAll);
        setDisabledResetBtn(clearAll);

        // Get updated data for each match
        const pageVariables = getPageVariables(seasonDrawInfo, true);
        const { allTeams } = pageVariables;

        setTeams(allTeams);
    };

    const predictedMatches = localStorage[`predictedMatches${currentYear}${CURRENTCOMP}`] ?
        JSON.parse(localStorage[`predictedMatches${currentYear}${CURRENTCOMP}`]) :
        {};

    const [teams, setTeams] = useState(allTeams);
    const [disabledClearRndBtn, setDisabledClearRndBtn] = useState(
        inFinalsFootball || !predictedMatches ? true : !predictedMatches[roundIndex]
    );
    const [disabledResetBtn, setDisabledResetBtn] = useState(
        inFinalsFootball || !Object.entries(predictedMatches).length
    );

    // Update ladder teams after each re-render if allTeams is changed
    useEffect(() => {
        if (JSON.stringify(allTeams) === JSON.stringify(teams)) {
            return;
        }

        setTeams(allTeams);
    }, [allTeams]);

    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <PageDescription
                cssClasses={'text-xl text-center'}
                description={'Predict the outcome of every match and see how the ladder looks!'}
            />
            <Standings
                topHalf={getLadderRow(teams.slice(0, FINALS_TEAMS), 1, pageVariables.liveMatches)}
                bottomHalf={getLadderRow(teams.slice(FINALS_TEAMS), FINALS_TEAMS + 1, pageVariables.liveMatches)}
                predictorPage={true}
            />
            <div className="flex flex-row gap-3 self-end">
                <LadderPredictorButton
                    text={'Clear Round'}
                    activeClasses={'border-gray-400 bg-gray-400 text-gray-100'}
                    disabledClasses={`${CCV[`${MAINCOLOUR}-border`]} ${CCV[`${MAINCOLOUR}-hover-bg`]} hover:text-white`}
                    disabled={disabledClearRndBtn}
                    clickCallback={() => updatePredictions('clear-round', roundIndex)}
                />
                <LadderPredictorButton
                    text={'Reset All'}
                    activeClasses={'border-gray-400 bg-gray-400 text-gray-100'}
                    disabledClasses={'border-red-400 hover:bg-red-400 hover:text-white'}
                    disabled={disabledResetBtn}
                    clickCallback={() => updatePredictions('clear-all', 0)}
                />
            </div>
            <Fixtures
                roundNum={roundIndex}
                byes={byeTeams}
                fixtures={roundIndex === currentFixtureRound ? fixtures : fixturesToShow}
                teamList={teams}
                updateCallback={updateFixturesCb}
                lastRoundNo={ROUNDS}
                modifiable={true}
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
 * @param {Array<Match>} liveMatches
 * @returns {LadderRow} React object
 */
function getLadderRow(teamList: Array<TeamData>, indexAdd: number, liveMatches: Array<Match>) {
    return teamList.map((team: TeamData) => {
        let isPlaying = false;

        if (liveMatches) {
            for (const match of liveMatches) {
                isPlaying = match.awayTeam.nickName === team.name || match.homeTeam.nickName === team.name;

                if (isPlaying) {
                    break;
                }
            }
        }

        const nextTeam = '';
        const nextMatchUrl = '';

        const ladderPos = teamList.indexOf(team) + indexAdd;

        return <LadderRow
            key={team.theme.key}
            teamData={team}
            position={ladderPos.toString()}
            isPlaying={isPlaying}
            byePoints={true}
            predictorPage={true}
            nextTeam={nextTeam}
            nextMatchUrl={nextMatchUrl}
        />;
    });
}
