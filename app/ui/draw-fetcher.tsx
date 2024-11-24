'use client';

import Ladder from './ladder/ladder';
import useSWR from 'swr';
import axios from 'axios';
import SkeletonLadder from './skeletons/skeleton-ladder';
import SkeletonMaxPoints from './skeletons/skeleton-max-points';
import LadderPredictor from './ladder-predictor';
import MaxPoints from './max-points';
import { setCurrentYear } from '../lib/utils';

export default function DrawFetcher({pageName}: {pageName: String}) {
    // Get the data
    const fetcher = (url: string) => axios.get(url).then(res => res.data);
    const { data: seasonDraw, error, isLoading } = useSWR('/api/seasondraw', fetcher);

    // Loading states
    if (error) {
        return <div className="px-8 py-6 flex flex-col gap-6">Failed to load!</div>;
    }
    if (isLoading) {
        return pageName === 'maxpoints' ? <SkeletonMaxPoints /> : <SkeletonLadder />;
    }

    // Set the current year to be the year of the draw
    setCurrentYear(seasonDraw[1].selectedSeasonId);

    // Load the UI component based on the pageName argument passed in
    switch (pageName) {
        case 'main':
            return <Ladder seasonDraw={seasonDraw} />;
        case 'ladder-predictor':
            return <LadderPredictor seasonDraw={seasonDraw} />;
        case 'maxpoints':
            return <MaxPoints seasonDraw={seasonDraw} />;
        default:
            return <Ladder seasonDraw={seasonDraw} />;
    }
}
