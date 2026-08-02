import { PredictedMatch } from '@/lib/definitions';
import { useSearchParams } from 'next/navigation';

export default function PredictorRadio(
    {
        modifiedFixtureCb,
        matchSlug,
        team,
        checked,
    }:
    {
        modifiedFixtureCb:
            undefined | ((_slug: string, _round: number, __payload: PredictedMatch) => void),
        matchSlug: string,
        team: string
        checked: boolean
    }
) {
    // Empty string means info about the NRL will be fetched
    const comp = useSearchParams().get('comp') ?? 'nrl';

    const teamsIndex = comp.includes('nrl') ? 4 : 6;
    const roundIndex = teamsIndex - 1;

    const slug = matchSlug.split('/').filter(i => i)[teamsIndex]; // homeTeam-v-awayTeam
    const round = parseInt(matchSlug.split('/').filter(i => i)[roundIndex].replace('round-', '')); // round-x

    const [homeTeam, awayTeam] = slug.split('-v-');

    return (
        <input
            className='text-blue-600 w-9.5 h-9.5 border-gray-300 rounded-full focus:ring-blue-500 focus:ring-offset-2'
            onChange={
                () => {
                    const payload: PredictedMatch = {
                        result: team,
                        homeScore: team === homeTeam ? 12 : 0,
                        awayScore: team === awayTeam ? 12 : 0,
                    };

                    if (typeof modifiedFixtureCb === 'function') {
                        modifiedFixtureCb(slug, round, payload);
                    }
                }
            }
            value={team}
            checked={checked}
            type='radio'
        />
    );
}
