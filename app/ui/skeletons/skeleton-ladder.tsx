import { CURRENTCOMP, NUMS } from '@/app/lib/utils';
import SkeletonFixtures from './skeleton-fixtures';
import SkeletonLadderRow from './skeleton-ladder-row';
import Standings from './../ladder/standings';

export default function SkeletonLadder({ predictorPage }: { predictorPage: boolean; }) {
    const { TEAMS, FINALS_TEAMS } = NUMS[CURRENTCOMP];

    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <div className="flex flex-row self-end shimmer w-[200px] h-[72px] xs:h-7"></div>
            <Standings
                topHalf={getLadderRow(1, FINALS_TEAMS)}
                bottomHalf={getLadderRow(FINALS_TEAMS + 1, TEAMS)}
                predictorPage={predictorPage}
            />
            {
                getPredictorButtons(predictorPage)
            }
            <SkeletonFixtures />
        </div>
    );
}

function getLadderRow(startPos: number, endPos: number) {
    const rows = [];

    for (let i = startPos; i <= endPos; i++) {
        rows.push(
            <SkeletonLadderRow
                key={i}
                position={i.toString()}
            />
        );
    }

    return rows;
}

function getPredictorButtons(predictorPage: boolean) {
    if (predictorPage) {
        return (
            <div className="flex flex-row gap-3 self-end">
                <div className='rounded-lg border border-gray-200 shimmer w-[124px] h-[45px]'></div>
                <div className='rounded-lg border border-gray-200 shimmer w-[93px] h-[45px]'></div>
            </div>
        );
    }

    return null;
}
