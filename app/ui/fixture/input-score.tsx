import { getCurrentYear } from '@/app/lib/utils';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function InputScore(
    {
        modifiedFixtureCb,
        matchSlug,
        team
    }:
    {
        modifiedFixtureCb: Function | undefined,
        matchSlug: string,
        team: string
    }
) {
    const slug = matchSlug.split('/').filter(i => i)[4]; // homeTeam-v-awayTeam
    const teamsArray = slug.split('-v-'); // [homeTeam, awayTeam]
    const round = parseInt(matchSlug.split('/').filter(i => i)[3].replace('round-', '')); // round-x
    const currentYear = getCurrentYear();

    let predictions;
    let predictedTeamScore: number | undefined;
    if (localStorage[`predictedMatches${currentYear}`]) {
        predictions = JSON.parse(localStorage[`predictedMatches${currentYear}`]);
        if (predictions[round] && predictions[round][slug]) {
            const score = predictions[round][slug][team];
            predictedTeamScore = score || '';
        }
    }

    const updatePrediction = useDebouncedCallback(() => {
        if (typeof modifiedFixtureCb === 'function') {
            modifiedFixtureCb(slug, teamsArray, round, team, score);
        }
    }, 500);

    const [score, setScore] = useState(predictedTeamScore ?? '');

    // Call useEffect to set the proper score any time the fixture toggles are used
    useEffect(() => {
        setScore(predictedTeamScore ?? '');
    }, [predictedTeamScore]);

    return <input
        className='text-3xl w-[75px] text-center bg-green-400'
        onChange={
            (e) => {
                let newScore: number = parseInt(e.target.value);

                if (isNaN(newScore)) {
                    e.target.value = '';
                }
                else if (newScore < 0) {
                    e.target.value = '0';
                    newScore = 0;
                }
                else if (newScore > 100) {
                    e.target.value = '100';
                    newScore = 100;
                }

                newScore = parseInt(e.target.value);

                setScore(newScore || '');
                updatePrediction();
            }
        }
        type='number'
        value={score ?? ''}
        min='0'
        max='100'
        step='1'
    />;
}
