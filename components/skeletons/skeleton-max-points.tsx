import { COLOURCSSVARIANTS, NUMS } from '@/lib/utils';
import SkeletonMaxPointsRow from './skeleton-max-points-row';
import { RootState } from '../../state/store';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';

export default function SkeletonMaxPoints() {
    // Empty string means info about the NRL will be fetched
    const comp = useSearchParams().get('comp') ?? 'nrl';

    const mainSiteColour = useSelector((state: RootState) => state.mainSiteColour.value);
    const { colour } = mainSiteColour;

    // Empty string means the current year will be fetched
    const season = useSearchParams().get('season');
    const drawSeason = season ? parseInt(season) : new Date().getFullYear();

    const teams = NUMS[comp].TEAMS(drawSeason);
    const finalsTeams = NUMS[comp].FINALS_TEAMS(drawSeason);

    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <div className="text-xl font-semibold text-center">
                See where your team stands in the race for Finals Football
            </div>
            <div className="flex flex-col">
                {
                    getMaxPointsRow(1, finalsTeams)
                }
                <div className={`border-4 ${COLOURCSSVARIANTS[`${colour}-border`]}`}></div>
                {
                    getMaxPointsRow(finalsTeams + 1, teams)
                }
            </div>
        </div>
    );
}

function getMaxPointsRow(startPos: number, endPos: number) {
    const rows = [];

    for (let i = startPos; i <= endPos; i++) {
        rows.push(<SkeletonMaxPointsRow key={i} />);
    }

    return rows;
}

