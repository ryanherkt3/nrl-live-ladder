import { NUMS } from '@/app/lib/utils';
import SkeletonMaxPointsRow from './skeleton-max-points-row';

export default function SkeletonMaxPoints() {
    const {FINALS_TEAMS, TEAMS} = NUMS;

    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <div className="text-xl font-semibold text-center">
                See where your team stands in the race for Finals Football
            </div>
            <div className="flex flex-col">
                {
                    getMaxPointsRow(1, FINALS_TEAMS)
                }
                <div className="border-4 border-green-400"></div>
                {
                    getMaxPointsRow(FINALS_TEAMS + 1, TEAMS)
                }
            </div>
        </div>
    );
}

function getMaxPointsRow(startPos: number, endPos: number) {
    const rows = [];

    for (let i = startPos; i <= endPos; i++) {
        rows.push(<SkeletonMaxPointsRow />);
    }

    return rows;
}

