'use client';

import SkeletonLadder from '../ui/skeletons/skeleton-ladder';
import axios from 'axios';
import useSWRImmutable from 'swr/immutable';
import LadderPredictor from '../ui/ladder-predictor';

export default function LadderPredictorPage() {
    // TODO move duplicate fetcher code for these three pages to own function
    const fetcher = (url: string) => axios.get(url).then(res => res.data);
    const { data: seasonDraw, error, isLoading } = useSWRImmutable('/api/seasondraw', fetcher);

    if (error) {
        return <div className="px-8 py-6 flex flex-col gap-6">Failed to load!</div>;
    }
    if (isLoading) {
        return <SkeletonLadder />;
    }

    return <LadderPredictor seasonDraw={seasonDraw} />;
}
