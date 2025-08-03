/* eslint-disable max-len */
'use client';

import Ladder from './ladder/ladder';
import useSWR from 'swr';
import axios from 'axios';
import SkeletonLadder from './skeletons/skeleton-ladder';
import SkeletonMaxPoints from './skeletons/skeleton-max-points';
import LadderPredictor from './ladder-predictor';
import MaxPoints from './max-points';
import { COMPID, NUMS } from '../lib/utils';
import { DrawInfo, ReduxUpdateFlags } from '../lib/definitions';
import { useDispatch, useSelector } from 'react-redux';
import { update as mainColourUpdate } from '../state/main-site-colour/mainSiteColour';
import { update as currentYearUpdate } from '../state/current-year/currentYear';
import { RootState } from '../state/store';
import { useEffect } from 'react';

export default function DrawFetcher({pageName}: {pageName: String}) {
    const currentComp = useSelector((state: RootState) => state.currentComp.value);
    const { comp } = currentComp;

    const currentYear = useSelector((state: RootState) => state.currentYear.value);
    const mainSiteColour = useSelector((state: RootState) => state.mainSiteColour.value);

    const dispatch = useDispatch();

    const { ROUNDS, FINALS_WEEKS } = NUMS[comp];
    const compRounds = ROUNDS + FINALS_WEEKS + 1;
    const compId = COMPID[comp.toUpperCase()];
    const apiUrl = `/api/seasondraw?comp=${compId}&rounds=${compRounds}`;

    // Get the data
    const fetcher = (url: string) => axios.get(url).then(res => res.data);
    const { data: seasonDraw, error, isLoading } = useSWR(apiUrl, fetcher);

    useEffect(() => {
        if (!error && !isLoading) {
            const seasonData = seasonDraw.data;

            // Set the main colour used for the finalists bar, completed games etc
            const seasonDrawValues: Array<DrawInfo> = Object.values(seasonData);
            const currentRound: Array<DrawInfo> = seasonDrawValues.filter((round: DrawInfo) => {
                if (round.byes) {
                    return round.byes[0].isCurrentRound;
                }

                return round.fixtures[0].isCurrentRound;
            });

            // Set the current year to be the year of the draw if it is not matching
            const seasonId = seasonData[1].selectedSeasonId;
            if (currentYear.updateStatus === ReduxUpdateFlags.NotUpdated && currentYear.year !== seasonId) {
                dispatch(currentYearUpdate(seasonData[1].selectedSeasonId));
            }

            const { colour } = mainSiteColour;
            const colourMatchesComp = comp === colour.split('-')[0];

            // Update the main site colour if the final update has not been executed,
            // or when there is a mismatch (e.g. NRL Ladder -> Homepage -> NSW Cup)
            if (mainSiteColour.updateStatus !== ReduxUpdateFlags.FinalUpdate || !colourMatchesComp) {
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
        }
    }, [currentComp, comp, currentYear, mainSiteColour, mainSiteColour.colour, error, isLoading, seasonDraw, dispatch, compId]);

    // Loading states
    if (error) {
        return <div className="px-8 py-6 flex flex-col gap-6">Failed to load!</div>;
    }
    if (isLoading) {
        return pageName === 'maxpoints' ?
            <SkeletonMaxPoints /> :
            <SkeletonLadder predictorPage={pageName === 'ladder-predictor'} />;
    }

    const seasonData = seasonDraw.data;

    // Load the UI component based on the pageName argument passed in
    switch (pageName) {
        case 'ladder':
            return <Ladder seasonDraw={seasonData} />;
        case 'ladder-predictor':
            return <LadderPredictor seasonDraw={seasonData} />;
        case 'maxpoints':
            return <MaxPoints seasonDraw={seasonData} />;
        default:
            return <Ladder seasonDraw={seasonData} />;
    }
}
