/* eslint-disable max-len */
'use client';

import Ladder from './ladder/ladder';
import SkeletonLadder from './skeletons/skeleton-ladder';
import SkeletonMaxPoints from './skeletons/skeleton-max-points';
import LadderPredictor from './ladder-predictor/ladder-predictor';
import FinalsRace from './finals-race';
import { COMPID, NUMS } from '../lib/utils';
import { DrawInfo, ReduxUpdateFlags } from '../lib/definitions';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawData, setDrawError } from '../state/draw/drawData';
import { update as mainColourUpdate } from '../state/main-site-colour/mainSiteColour';
import { update as currentYearUpdate } from '../state/current-year/currentYear';
import { RootState } from '../state/store';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function DrawFetcher({pageName}: {pageName: string}) {
    // Empty string means info about the NRL will be fetched
    const comp = useSearchParams().get('comp') ?? 'nrl';

    const currentYear = useSelector((state: RootState) => state.currentYear.value);
    const mainSiteColour = useSelector((state: RootState) => state.mainSiteColour.value);

    const dispatch = useDispatch();

    const drawData = useSelector((state: RootState) => state.drawData.data);
    const drawFetched = useSelector((state: RootState) => state.drawData.fetched);
    const drawError = useSelector((state: RootState) => state.drawData.error);

    // Empty string means the current year will be fetched
    const season = useSearchParams().get('season');
    const drawSeason = season ? parseInt(season) : currentYear.year;

    const fetchData = async () => {
        try {
            const rounds = NUMS[comp].ROUNDS(drawSeason);
            const finalsWeeks = NUMS[comp].FINALS_WEEKS(drawSeason);

            const compRounds = rounds + finalsWeeks + 1;
            const compId = COMPID[comp.toUpperCase()];
            const apiUrl =
                `/api/seasondraw?comp=${String(compId)}&rounds=${String(compRounds)}${drawSeason ? `&season=${String(drawSeason)}` : ''}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('HTTP error!');
            }
            const result = await response.json() as { 'success': boolean, 'data': DrawInfo[] };

            // Set the main colour used for the finalists bar, completed games etc
            const seasonDrawValues: DrawInfo[] = Object.values(result.data);

            const currentRound: DrawInfo[] = seasonDrawValues.filter((round: DrawInfo) => {
                if (round.byes !== undefined) {
                    return round.byes[0].isCurrentRound;
                }

                return round.fixtures[0].isCurrentRound;
            });

            // Set the current year to be the year of the draw if it is not matching
            const { selectedSeasonId } = currentRound[0];
            const skipYearUpdate = comp === 'nrlw' && [2018, 2019].includes(selectedSeasonId);
            if (currentYear.updateStatus === ReduxUpdateFlags.NotUpdated && currentYear.year !== selectedSeasonId && !skipYearUpdate) {
                dispatch(currentYearUpdate(selectedSeasonId));
            }

            const { colour } = mainSiteColour;
            const colourMatchesComp = comp === colour.split('-')[0];
            const skipColourUpdate = selectedSeasonId < new Date().getFullYear();

            // Update the main site colour if the final update has not been executed,
            // or when there is a mismatch (e.g. NRL Ladder -> Homepage -> NSW Cup)
            if ((mainSiteColour.updateStatus !== ReduxUpdateFlags.FinalUpdate || !colourMatchesComp) && !skipColourUpdate) {
                dispatch(
                    mainColourUpdate(
                        {
                            comp: compId,
                            currentRoundNo: currentRound[0].selectedRoundId,
                            finalUpdate: true,
                        }
                    )
                );
            }

            dispatch(setDrawData(seasonDrawValues));
        }
        catch (err) {
            console.error(err);
            dispatch(setDrawError());
        }
    };

    useEffect(() => {
        void fetchData();

        // Only re-fetch if in current season
        const intervalId = setInterval(() => {
            if (drawSeason === new Date().getFullYear()) {
                void fetchData();
            }
        }, 60000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // Loading states
    if (drawError) {
        return <div className="px-8 py-6 flex flex-col gap-6">Failed to load!</div>;
    }
    if (!drawFetched) {
        return pageName === 'finals-race' ?
            <SkeletonMaxPoints /> :
            <SkeletonLadder predictorPage={pageName === 'ladder-predictor'} />;
    }

    // Load the UI component based on the pageName argument passed in
    switch (pageName) {
        case 'ladder':
            return <Ladder seasonDraw={drawData} />;
        case 'ladder-predictor':
            return <LadderPredictor seasonDraw={drawData} />;
        case 'finals-race':
            return <FinalsRace seasonDraw={drawData} />;
        default:
            return <Ladder seasonDraw={drawData} />;
    }
}
