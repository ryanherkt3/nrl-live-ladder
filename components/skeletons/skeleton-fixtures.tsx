import { NUMS } from '@/lib/utils';
import SkeletonRoundFixture from './skeleton-round-fixture';
import { useSearchParams } from 'next/navigation';

export default function SkeletonFixtures() {
    // Empty string means info about the NRL will be fetched
    const comp = useSearchParams().get('comp') ?? 'nrl';

    // Empty string means the current year will be fetched
    const season = useSearchParams().get('season');
    const drawSeason = season ? parseInt(season) : new Date().getFullYear();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-2 items-center justify-center">
                <div className="text-2xl font-semibold text-center">Fixtures</div>
            </div>
            <div className="text-lg text-center">All fixtures are in your local timezone</div>
            {
                getFixtures(comp, drawSeason)
            }
            {
                getByes(comp, drawSeason)
            }
        </div>
    );
}

function getFixtures(currentComp: string, drawSeason: number) {
    const fixtures = [];

    for (let i = 2; i <= NUMS[currentComp].TEAMS(drawSeason); i += 2) {
        fixtures.push(<SkeletonRoundFixture key={i} />);
    }

    return fixtures;
}

function getByes(currentComp: string, drawSeason: number) {
    if (!NUMS[currentComp].BYES(drawSeason)) {
        return null;
    }

    return (
        <div className="flex flex-col">
            <span className="text-center text-lg text-white font-semibold bg-black">BYE TEAMS</span>
            <div className="shimmer flex flex-row gap-6 justify-center h-9 mt-2 py-4"></div>
        </div>
    );
}
