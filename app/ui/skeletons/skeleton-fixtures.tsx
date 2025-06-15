import { NUMS } from '@/app/lib/utils';
import SkeletonRoundFixture from './skeleton-round-fixture';
import { RootState } from '../../state/store';
import { useSelector } from 'react-redux';

export default function SkeletonFixtures() {
    const currentComp = useSelector((state: RootState) => state.currentComp.value);
    const { comp } = currentComp;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-2 items-center justify-center">
                <div className="text-2xl font-semibold text-center">Fixtures</div>
            </div>
            <div className="text-lg text-center">All fixtures are in your local timezone</div>
            {
                getFixtures(comp)
            }
            {
                getByes(comp)
            }
        </div>
    );
}

function getFixtures(currentComp: string) {
    const fixtures = [];

    for (let i = 2; i <= NUMS[currentComp].TEAMS; i += 2) {
        fixtures.push(<SkeletonRoundFixture key={i} />);
    }

    return fixtures;
}

function getByes(currentComp: string) {
    if (!NUMS[currentComp].BYES) {
        return null;
    }

    return (
        <div className="flex flex-col">
            <span className="text-center text-lg text-white font-semibold bg-black">BYE TEAMS</span>
            <div className="shimmer flex flex-row gap-6 justify-center h-9 mt-2 py-4"></div>
        </div>
    );
}
