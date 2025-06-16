/* eslint-disable max-len */
import LadderRow from './ladder/ladder-row';
import { TeamData, DrawInfo, Match } from '../lib/definitions';
import { COLOURCSSVARIANTS as CCV, NUMS } from '@/app/lib/utils';
import { getPageVariables, updateFixturesToShow } from '@/app/lib/nrl-draw-utils';
import Fixtures from './fixture/fixtures';
import { useEffect, useState } from 'react';
import PageDescription from './page-desc';
import Standings from './ladder/standings';
import LadderPredictorButton from './ladder-predictor-button';
import { useDispatch, useSelector } from 'react-redux';
import { update as clearRdBtnUpdate } from '../state/clear-round-button/clearRoundButton';
import { update as resetAllBtnUpdate } from '../state/reset-all-button/resetAllButton';
import { RootState } from '../state/store';

export default function LadderPredictor({seasonDraw}: {seasonDraw: Array<DrawInfo>}) {
    const currentComp = useSelector((state: RootState) => state.currentComp.value);
    const { comp } = currentComp;

    const currentYear = useSelector((state: RootState) => state.currentYear.value);
    const { year } = currentYear;

    const mainSiteColour = useSelector((state: RootState) => state.mainSiteColour.value);
    const { colour } = mainSiteColour;

    const clearRoundButtonDisabled = useSelector((state: RootState) => state.clearRoundButton.value);
    const resetAllButtonDisabled = useSelector((state: RootState) => state.resetAllButton.value);

    const dispatch = useDispatch();

    const seasonDrawInfo = Object.values(seasonDraw);
    const pageVariables = getPageVariables(seasonDrawInfo, true, comp, year);

    const { currentRoundNo, allTeams } = pageVariables;
    const { ROUNDS, FINALS_TEAMS } = NUMS[comp];

    // Set current fixture round to last round if in finals football
    const inFinalsFootball = currentRoundNo > ROUNDS;
    const currentFixtureRound = inFinalsFootball ? ROUNDS : currentRoundNo;

    const { fixtures, byes } = seasonDraw[currentFixtureRound];

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
        const predictions = localStorage[`predictedMatches${year}${comp}`] ?
            JSON.parse(localStorage[`predictedMatches${year}${comp}`]) :
            {};

        // Set the predictions array to update, then update it
        predictions[roundKey + 1] = predictions[roundKey + 1] || {};
        predictions[roundKey + 1][slug] = {
            [`${homeTeamSlug}`]: isAwayTeamUpdated ? opponentScore : teamToUpdate.score,
            [`${awayTeamSlug}`]: isAwayTeamUpdated ? teamToUpdate.score : opponentScore
        };

        let clearRoundOrAll = false;
        let predictionsClearArg = '';

        // Delete the entry from localStorage if both values are empty (i.e the match is not predicted)
        if (Object.values(predictions[roundKey + 1][slug]).filter(val => (val === '' || Number.isNaN(val))).length === 2) {
            delete predictions[roundKey + 1][slug];

            if (Object.values(predictions[roundKey + 1]).length === 0) {
                delete predictions[roundKey + 1];

                clearRoundOrAll = true;
                predictionsClearArg = 'clear-round';
            }
        }

        if (clearRoundOrAll) {
            // Clear all predictions if there are none left
            if (['null', '""', '{}'].includes(JSON.stringify(predictions))) {
                predictionsClearArg = 'clear-all';
            }

            updatePredictions(predictionsClearArg, roundIndex);
        }
        else {
            updatePredictions(predictions, roundIndex);
        }
    };

    const updateFixturesCb = (showPreviousRound: boolean) => {
        updateFixturesToShow(
            showPreviousRound, roundIndex, seasonDraw, setRoundIndex, setFixturesToShow, setByeTeams
        );

        // Update the disabled clear round button
        const predictedMatches = localStorage[`predictedMatches${year}${comp}`] ?
            JSON.parse(localStorage[`predictedMatches${year}${comp}`]) :
            {};
        const index = showPreviousRound ? roundIndex - 1 : roundIndex + 1;

        // Update the button states if they are different
        if (predictedMatches && clearRoundButtonDisabled !== !predictedMatches[index]) {
            dispatch(clearRdBtnUpdate(!predictedMatches[index]));
        }
        if (resetAllButtonDisabled !== !Object.entries(predictedMatches).length) {
            dispatch(resetAllBtnUpdate(!Object.entries(predictedMatches).length));
        }
    };
    const [roundIndex, setRoundIndex] = useState(currentFixtureRound);
    const [fixturesToShow, setFixturesToShow] = useState(fixtures);
    const [byeTeams, setByeTeams] = useState(byes);

    // Update predictions stored in localStorage
    const updatePredictions = (predictions: Object | String, roundNum: number) => {
        const predictedMatches = localStorage[`predictedMatches${year}${comp}`] ?
            JSON.parse(localStorage[`predictedMatches${year}${comp}`]) :
            {};

        const updatePredictions = typeof predictions === 'object';
        const clearRound = typeof predictions === 'string' && predictions === 'clear-round';
        let clearAll = typeof predictions === 'string' && predictions === 'clear-all';

        if (updatePredictions) {
            localStorage[`predictedMatches${year}${comp}`] = JSON.stringify(predictions);
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

            localStorage[`predictedMatches${year}${comp}`] = JSON.stringify(predictedMatches);

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
            delete localStorage[`predictedMatches${year}${comp}`];
        }

        // Update the button states if they are different
        if (clearRoundButtonDisabled !== (clearRound || clearAll)) {
            dispatch(clearRdBtnUpdate(clearRound || clearAll));
        }
        if (resetAllButtonDisabled !== clearAll) {
            dispatch(resetAllBtnUpdate(clearAll));
        }

        // Get updated data for each match
        const pageVariables = getPageVariables(seasonDrawInfo, true, comp, year);
        const { allTeams } = pageVariables;

        setTeams(allTeams);
    };

    const [teams, setTeams] = useState(allTeams);

    // Update ladder teams after each re-render if allTeams is changed
    // TODO redux for this?
    useEffect(() => {
        if (JSON.stringify(allTeams) === JSON.stringify(teams)) {
            return;
        }

        setTeams(allTeams);
    }, [allTeams]);

    useEffect(() => {
        const predictedMatches = localStorage[`predictedMatches${year}${comp}`] ?
            JSON.parse(localStorage[`predictedMatches${year}${comp}`]) :
            {};

        const clearRdBtnValue = inFinalsFootball || !predictedMatches ? true : !predictedMatches[roundIndex];
        if (clearRoundButtonDisabled !== clearRdBtnValue) {
            dispatch(clearRdBtnUpdate(clearRdBtnValue));
        }

        const resetAllBtnValue = inFinalsFootball || !Object.entries(predictedMatches).length;
        if (resetAllButtonDisabled !== resetAllBtnValue) {
            dispatch(resetAllBtnUpdate(resetAllBtnValue));
        }
    }, [clearRoundButtonDisabled, comp, dispatch, inFinalsFootball, resetAllButtonDisabled, roundIndex, teams, year]);

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
                    disabledClasses={`${CCV[`${colour}-border`]} ${CCV[`${colour}-hover-bg`]} hover:text-white`}
                    disabled={clearRoundButtonDisabled}
                    clickCallback={() => updatePredictions('clear-round', roundIndex)}
                />
                <LadderPredictorButton
                    text={'Reset All'}
                    activeClasses={'border-gray-400 bg-gray-400 text-gray-100'}
                    disabledClasses={'border-red-400 hover:bg-red-400 hover:text-white'}
                    disabled={resetAllButtonDisabled}
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
