'use client';

import Ladder from "./ui/ladder";
import useSWR from 'swr'

export default function HomePage() {
    const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
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
                Loading...
            </div>
        );
    }
    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <Ladder nrlInfo={data} />
        </div>
    );
}
