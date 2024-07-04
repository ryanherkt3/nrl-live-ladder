'use client';

import Ladder from "./ui/ladder";
import useSWR from 'swr';
import axios from 'axios';
import SkeletonLadder from "./ui/skeletons/skeleton-ladder";

export default function HomePage() {
    const fetcher = (url: string) => axios.get(url).then(res => res.data)
    const { data, error, isLoading } = useSWR('/api/nrlinfo', fetcher);
 
    if (error) {
        return (
            <div className="px-8 py-6 flex flex-col gap-6">
                Failed to load!
            </div>
        );
    }
    if (isLoading) {
        return (
            <div className="px-8 py-6 flex flex-col gap-6">
                <SkeletonLadder />
            </div>
        );
    }
    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <Ladder nrlInfo={data} />
        </div>
    );
}
