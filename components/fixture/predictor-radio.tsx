import { PredictedMatch } from '@/lib/definitions';
import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useDebouncedCallback } from 'use-debounce';

export default function PredictorRadio(
    {
        modifiedFixtureCb,
        matchSlug,
        team,
        checked,
        onChange,
    }:
    {
        modifiedFixtureCb:
            undefined | ((_slug: string, _round: number, __payload: PredictedMatch) => void),
        matchSlug: string,
        team: string
        checked: boolean
        onChange: () => void,
    }
) {
    // Empty string means info about the NRL will be fetched
    const comp = useSearchParams().get('comp') ?? 'nrl';

    // Empty string means the current year will be fetched
    const season = useSearchParams().get('season');
    const drawSeason = season ? parseInt(season) : new Date().getFullYear();

    const teamsIndex = comp.includes('nrl') ? 4 : 6;
    const roundIndex = teamsIndex - 1;

    const slug = matchSlug.split('/').filter(i => i)[teamsIndex]; // homeTeam-v-awayTeam
    const round = parseInt(matchSlug.split('/').filter(i => i)[roundIndex].replace('round-', '')); // round-x

    const [homeTeam, awayTeam] = slug.split('-v-');

    const predictionsRaw = localStorage.getItem(`predictedMatches${String(drawSeason)}${comp}`);
    if (predictionsRaw) {
        type PredictionsType = Record<number, Record<string, string> | undefined> | undefined;
        const predictions: PredictionsType = JSON.parse(predictionsRaw) as PredictionsType;

        const roundPrediction = predictions?.[round]?.[slug] ?
            JSON.parse(predictions[round][slug] ?? '') as Record<string, string | number> :
            {};

        if (Object.values(roundPrediction).length) {
            checked = Number(roundPrediction[team]) > 0;
        }
    }
    else {
        checked = false;
    }

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

                    onChange();

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
