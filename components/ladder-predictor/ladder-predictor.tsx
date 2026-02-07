/* eslint-disable max-len */
import LadderRow from '../ladder/ladder-row';
import { TeamData, DrawInfo, Match } from '../../lib/definitions';
import { COLOURCSSVARIANTS as CCV, NUMS } from '@/lib/utils';
import { getPageVariables, updateFixturesToShow } from '@/lib/nrl-draw-utils';
import Fixtures from '../fixture/fixtures';
import { useEffect, useState } from 'react';
import PageDescription from '../page-desc';
import Standings from '../ladder/standings';
import LadderPredictorButton from './ladder-predictor-button';
import { useDispatch, useSelector } from 'react-redux';
import { update as clearRdBtnUpdate } from '../../state/clear-round-button/clearRoundButton';
import { update as resetAllBtnUpdate } from '../../state/reset-all-button/resetAllButton';
import { RootState } from '../../state/store';
import { getMinPointsForSpots, getQualificationStatus } from '../../lib/qualification';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';

type Prediction = Record<string, Record<string, string>>;

export default function LadderPredictor({seasonDraw}: {seasonDraw: DrawInfo[]}) {
    // Empty string means info about the NRL will be fetched
    const comp = useSearchParams().get('comp') ?? 'nrl';

    const currentYear = useSelector((state: RootState) => state.currentYear.value);
    const { year } = currentYear;

    const mainSiteColour = useSelector((state: RootState) => state.mainSiteColour.value);
    const { colour } = mainSiteColour;

    const clearRoundButtonDisabled = useSelector((state: RootState) => state.clearRoundButton.value);
    const resetAllButtonDisabled = useSelector((state: RootState) => state.resetAllButton.value);

    const dispatch = useDispatch();

    // Empty string means the current year will be fetched
    const season = useSearchParams().get('season');
    const drawSeason = season ? parseInt(season) : year;

    const seasonDrawInfo = Object.values(seasonDraw);
    const pageVariables = getPageVariables(seasonDrawInfo, true, comp, drawSeason);

    const { currentRoundNo, allTeams, fixtures, byes } = pageVariables;

    const rounds = NUMS[comp].ROUNDS(drawSeason);

    // Set current fixture round to last round if in finals football
    const inFinalsFootball = currentRoundNo > rounds;
    const currentFixtureRound = inFinalsFootball ? currentRoundNo : rounds;

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
        const predictions: Prediction = localStorage[`predictedMatches${String(year)}${comp}`]
            ? JSON.parse(String(localStorage[`predictedMatches${String(year)}${comp}`])) as Prediction
            : {};

        // Set the predictions array to update, then update it
        predictions[roundKey + 1] = predictions[roundKey + 1];
        predictions[String(roundKey + 1)] = predictions[String(roundKey + 1)] ?? {};
        predictions[String(roundKey + 1)][slug] = JSON.stringify({
            [homeTeamSlug]: isAwayTeamUpdated ? opponentScore : teamToUpdate.score,
            [awayTeamSlug]: isAwayTeamUpdated ? teamToUpdate.score : opponentScore
        });

        let clearRoundOrAll = false;
        let predictionsClearArg = '';

        // Delete the entry from localStorage if both values are empty (i.e the match is not predicted)
        if (Object.values(predictions[roundKey + 1][slug]).filter(val => (val === '' || Number.isNaN(val))).length === 2) {
            delete predictions[String(roundKey + 1)][slug];

            if (Object.values(predictions[String(roundKey + 1)]).length === 0) {
                delete predictions[String(roundKey + 1)];

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
        const predictedMatches: Prediction = localStorage[`predictedMatches${String(year)}${comp}`] ?
            JSON.parse(String(localStorage[`predictedMatches${String(year)}${comp}`])) as Prediction :
            {};
        const index = showPreviousRound ? roundIndex - 1 : roundIndex + 1;

        // Update the button states if they are different
        if (Object.keys(predictedMatches).length && clearRoundButtonDisabled !== !predictedMatches[index]) {
            dispatch(clearRdBtnUpdate(!predictedMatches[String(index)]));
        }
        if (resetAllButtonDisabled !== !Object.entries(predictedMatches).length) {
            dispatch(resetAllBtnUpdate(!Object.entries(predictedMatches).length));
        }
    };
    const [roundIndex, setRoundIndex] = useState(currentFixtureRound);
    const [fixturesToShow, setFixturesToShow] = useState(fixtures);
    const [byeTeams, setByeTeams] = useState(byes);

    // Update predictions stored in localStorage
    const updatePredictions = (predictions: object | string, roundNum: number) => {
        const predictedMatches: Prediction = localStorage[`predictedMatches${String(year)}${comp}`] ?
            JSON.parse(String(localStorage[`predictedMatches${String(year)}${comp}`])) as Prediction :
            {};

        const updatePredictions = typeof predictions === 'object';
        const clearRound = typeof predictions === 'string' && predictions === 'clear-round';
        let clearAll = typeof predictions === 'string' && predictions === 'clear-all';

        if (updatePredictions) {
            localStorage[`predictedMatches${String(year)}${comp}`] = JSON.stringify(predictions);
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

            localStorage[`predictedMatches${String(year)}${comp}`] = JSON.stringify(predictedMatches);

            // Set clearAll to true if clearing the round predictions also clears all the predictions
            if (['null', '""', '{}'].includes(JSON.stringify(predictedMatches))) {
                clearAll = true;
            }
        }

        if (clearAll) {
            // Reset the scores for every predicted fixture and delete the localStorage entry
            for (const round of seasonDrawInfo) {
                if (round.selectedRoundId > rounds) {
                    break;
                }

                for (const fixture of round.fixtures) {
                    if (fixture.matchMode === 'Pre' || fixture.matchState === 'Upcoming') {
                        fixture.homeTeam.score = '';
                        fixture.awayTeam.score = '';
                    }
                }
            }
            delete localStorage[`predictedMatches${String(year)}${comp}`];
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
    useEffect(() => {
        if (JSON.stringify(allTeams) === JSON.stringify(teams)) {
            return;
        }

        setTeams(allTeams);
    }, [allTeams]);

    useEffect(() => {
        const predictedMatches: Prediction = localStorage[`predictedMatches${String(year)}${comp}`] ?
            JSON.parse(String(localStorage[`predictedMatches${String(year)}${comp}`])) as Prediction :
            {};

        const clearRdBtnValue = inFinalsFootball || !Object.keys(predictedMatches).length ? true : !predictedMatches[roundIndex];
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
                topHalf={getLadderRow(true, teams, pageVariables.liveMatches, comp, drawSeason)}
                bottomHalf={getLadderRow(false, teams, pageVariables.liveMatches, comp, drawSeason)}
                predictorPage={true}
            />
            <div
                className={
                    clsx(
                        'flex flex-row gap-3 self-end',
                        {
                            'hidden': inFinalsFootball
                        }
                    )
                }
            >
                <LadderPredictorButton
                    text={'Clear Round'}
                    activeClasses={'border-gray-400 bg-gray-400 text-gray-100'}
                    disabledClasses={`${CCV[`${colour}-border`]} ${CCV[`${colour}-hover-bg`]} hover:text-white`}
                    disabled={clearRoundButtonDisabled}
                    clickCallback={() => {
                        updatePredictions('clear-round', roundIndex);
                    }}
                />
                <LadderPredictorButton
                    text={'Reset All'}
                    activeClasses={'border-gray-400 bg-gray-400 text-gray-100'}
                    disabledClasses={'border-red-400 hover:bg-red-400 hover:text-white'}
                    disabled={resetAllButtonDisabled}
                    clickCallback={() => {
                        updatePredictions('clear-all', 0);
                    }}
                />
            </div>
            <Fixtures
                roundNum={roundIndex}
                byes={byeTeams}
                fixtures={roundIndex === currentFixtureRound ? fixtures : fixturesToShow}
                teamList={teams}
                updateCallback={updateFixturesCb}
                lastRoundNo={inFinalsFootball ? currentRoundNo : rounds}
                modifiable={!inFinalsFootball}
                modifiedFixtureCb={updateAllTeams as (_slug: string, _round: number, _team: string, _score: number) => void}
            />
        </div>
    );
}

/**
 * Get a row in the ladder.
 *
 * @param {boolean} isInTopSection if the team is in the top x of the competition
 * @param {Array<TeamData>} allTeams
 * @param {Array<Match>} liveMatches
 * @param {String} currentComp
 * @param {number} drawSeason
 * @returns {LadderRow} React object
 */
function getLadderRow(
    isInTopSection: boolean,
    allTeams: TeamData[],
    liveMatches: Match[],
    currentComp: string,
    drawSeason: number
) {
    const finalsTeams = NUMS[currentComp].FINALS_TEAMS(drawSeason);

    const teamList = isInTopSection ? allTeams.slice(0, finalsTeams) : allTeams.slice(finalsTeams);
    const indexAdd = isInTopSection ? 1 : finalsTeams + 1;

    return teamList.map((team: TeamData) => {
        let isPlaying = false;

        if (liveMatches.length) {
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

        const qualificationStatus = getQualificationStatus(
            team, allTeams, getMinPointsForSpots(allTeams, currentComp, drawSeason), currentComp, drawSeason
        );

        return <LadderRow
            key={team.theme.key}
            teamData={team}
            position={ladderPos.toString()}
            isPlaying={isPlaying}
            byePoints={true}
            predictorPage={true}
            nextTeam={nextTeam}
            nextTeamTooltip={''}
            nextMatchUrl={nextMatchUrl}
            qualificationStatus={qualificationStatus}
        />;
    });
}
