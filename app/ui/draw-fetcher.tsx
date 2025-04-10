'use client';

import Ladder from './ladder/ladder';
import useSWR from 'swr';
import axios from 'axios';
import SkeletonLadder from './skeletons/skeleton-ladder';
import SkeletonMaxPoints from './skeletons/skeleton-max-points';
import LadderPredictor from './ladder-predictor';
import MaxPoints from './max-points';
import { COMPID, CURRENTCOMP, NUMS, setCurrentYear, setMainColour } from '../lib/utils';
import { DrawInfo } from '../lib/definitions';

export default function DrawFetcher({pageName}: {pageName: String}) {
    const { ROUNDS, FINALS_WEEKS } = NUMS[CURRENTCOMP];
    const compRounds = ROUNDS + FINALS_WEEKS + 1;
    const compId = COMPID[CURRENTCOMP.toUpperCase()];
    const apiUrl = `/api/seasondraw?comp=${compId}&rounds=${compRounds}`;

    // Get the data
    const fetcher = (url: string) => axios.get(url).then(res => res.data);
    const { data: seasonDraw, error, isLoading } = useSWR(apiUrl, fetcher);

    // Loading states
    if (error) {
        return <div className="px-8 py-6 flex flex-col gap-6">Failed to load!</div>;
    }
    if (isLoading) {
        return pageName === 'maxpoints' ?
            <SkeletonMaxPoints /> :
            <SkeletonLadder predictorPage={pageName === 'ladder-predictor'} />;
    }

    // Set the current year to be the year of the draw
    setCurrentYear(seasonDraw[1].selectedSeasonId);

    // Set the main colour used for the finalists bar, completed games etc
    const seasonDrawValues: Array<DrawInfo> = Object.values(seasonDraw);
    const currentRound: Array<DrawInfo> = seasonDrawValues.filter((round: DrawInfo) => {
        if (round.byes) {
            return round.byes[0].isCurrentRound;
        }

        return round.fixtures[0].isCurrentRound;
    });
    setMainColour(compId, currentRound[0].selectedRoundId);

    // Load the UI component based on the pageName argument passed in
    switch (pageName) {
        case 'ladder':
            return <Ladder seasonDraw={seasonDraw} />;
        case 'ladder-predictor':
            return <LadderPredictor seasonDraw={seasonDraw} />;
        case 'maxpoints':
            return <MaxPoints seasonDraw={seasonDraw} />;
        default:
            return <Ladder seasonDraw={seasonDraw} />;
    }
}
