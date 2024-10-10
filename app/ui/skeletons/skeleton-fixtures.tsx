import { NUMS } from '@/app/lib/utils';
import SkeletonRoundFixture from './skeleton-round-fixture';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function SkeletonFixtures() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-2 justify-center">
                <ChevronLeftIcon className="w-8 h-8"/>
                <div className="text-2xl font-semibold">Fixtures</div>
                <ChevronRightIcon className="w-8 h-8"/>
            </div>
            <div className="text-lg text-center">All fixtures are in your local timezone</div>
            {
                getFixtures()
            }
            <div className="flex flex-col">
                <span className="text-center text-lg text-white font-semibold bg-black">BYE TEAMS</span>
                <div className="shimmer flex flex-row gap-6 justify-center h-9 mt-2 py-4"></div>
            </div>
        </div>
    );
}

function getFixtures() {
    const fixtures = [];

    for (let i = 2; i <= NUMS.TEAMS; i += 2) {
        fixtures.push(<SkeletonRoundFixture key={i} />);
    }

    return fixtures;
}

