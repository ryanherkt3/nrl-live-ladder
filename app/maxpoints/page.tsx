'use client';

import useSWR from 'swr';
import axios from 'axios';
import SkeletonMaxPoints from '../ui/skeletons/skeleton-max-points';
import MaxPoints from '../ui/max-points';

export default function MaxPointsPage() {
    // TODO move duplicate fetcher code for these three pages to own function
    const fetcher = (url: string) => axios.get(url).then(res => res.data);
    const { data: seasonDraw, error, isLoading } = useSWR('/api/seasondraw', fetcher);

    if (error) {
        return <div className="px-8 py-6 flex flex-col gap-6">Failed to load!</div>;
    }
    if (isLoading) {
        return <SkeletonMaxPoints />;
    }

    return <MaxPoints seasonDraw={seasonDraw} />;
}
