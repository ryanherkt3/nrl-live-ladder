import { NUMS } from '@/lib/utils';
import SkeletonFixtures from './skeleton-fixtures';
import SkeletonLadderRow from './skeleton-ladder-row';
import Standings from '../ladder/standings';
import { useSearchParams } from 'next/navigation';

export default function SkeletonLadder({ predictorPage }: { predictorPage: boolean; }) {
    // Empty string means info about the NRL will be fetched
    const comp = useSearchParams().get('comp') ?? 'nrl';

    // Empty string means the current year will be fetched
    const season = useSearchParams().get('season');
    const drawSeason = season ? parseInt(season) : new Date().getFullYear();

    const teams = NUMS[comp].TEAMS(drawSeason);
    const finalsTeams = NUMS[comp].FINALS_TEAMS(drawSeason);
    const byes = NUMS[comp].BYES(drawSeason);

    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <div className="text-xl text-center">
                {
                    predictorPage ?
                        'Predict the outcome of every match and see how the ladder looks!' :
                        'Ladder auto-updates every few seconds'
                }
            </div>
            {
                byes === 0 || predictorPage ?
                    null :
                    <div className="flex flex-row self-end shimmer w-50 h-18 xs:h-7"></div>
            }
            <Standings
                topHalf={getLadderRow(1, finalsTeams)}
                bottomHalf={getLadderRow(finalsTeams + 1, teams)}
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
                <div className='rounded-lg border border-gray-200 shimmer w-31 h-11.25'></div>
                <div className='rounded-lg border border-gray-200 shimmer w-23.25 h-11.25'></div>
            </div>
        );
    }

    return null;
}
