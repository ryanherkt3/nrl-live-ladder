// 'use client';

import Ladder from "./ui/ladder";
import useSWR from 'swr';
import axios from 'axios';
import SkeletonLadder from "./ui/skeletons/skeleton-ladder";
import { useEffect, useState } from "react";
import { getNRLInfo } from "./lib/utils";

export default async function HomePage() {
    // const fetcher = (url: string) => axios.get(url).then(res => res.data)
    // const { data, error, isLoading } = useSWR('/api/nrlinfo', fetcher);
    
    // TODO add byes toggle to show ladder w/o bye points
    let nrlInfo = await getNRLInfo();
 
    // if (error) {
    //     return (
    //         <div className="px-8 py-6 flex flex-col gap-6">
    //             Failed to load!
    //         </div>
    //     );
    // }
    // if (isLoading) {
    //     return (
    //         <div className="px-8 py-6 flex flex-col gap-6">
    //             <SkeletonLadder />
    //         </div>
    //     );
    // }
    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <Ladder nrlInfo={nrlInfo} />
        </div>
    );
}
