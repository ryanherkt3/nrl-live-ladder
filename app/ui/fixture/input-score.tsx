import { COLOURCSSVARIANTS, CURRENTYEAR, MAINCOLOUR } from '@/app/lib/utils';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function InputScore(
    {
        modifiedFixtureCb,
        matchSlug,
        team,
        isHomeTeam
    }:
    {
        modifiedFixtureCb: Function | undefined,
        matchSlug: string,
        team: string
        isHomeTeam: boolean
    }
) {
    const slug = matchSlug.split('/').filter(i => i)[4]; // homeTeam-v-awayTeam
    const round = parseInt(matchSlug.split('/').filter(i => i)[3].replace('round-', '')); // round-x
    const currentYear = CURRENTYEAR;

    let predictions;
    let predictedTeamScore: number | undefined;
    if (localStorage[`predictedMatches${currentYear}`]) {
        predictions = JSON.parse(localStorage[`predictedMatches${currentYear}`]);
        if (predictions[round] && predictions[round][slug]) {
            const score = predictions[round][slug][team];
            predictedTeamScore = score ?? '';
        }
    }

    const updatePrediction = useDebouncedCallback(() => {
        if (typeof modifiedFixtureCb === 'function') {
            modifiedFixtureCb(slug, round, team, score);
        }
    }, 500);

    const [score, setScore] = useState(predictedTeamScore ?? '');

    // Call useEffect to set the proper score any time the fixture toggles are used
    useEffect(() => {
        setScore(predictedTeamScore ?? '');
    }, [predictedTeamScore]);

    return <input
        className={
            clsx(
                // eslint-disable-next-line max-len
                [`max-md:text-2xl max-md:w-[50px] md:text-3xl md:w-[75px] text-center ${COLOURCSSVARIANTS[`${MAINCOLOUR}-bg`]}`],
                {
                    'sm:-order-1': !isHomeTeam,
                    'text-white': MAINCOLOUR === 'nrl-ctry' || MAINCOLOUR === 'nrl-wil' || MAINCOLOUR === 'nrl-bean'
                }
            )
        }
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

                setScore(newScore ?? '');
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
