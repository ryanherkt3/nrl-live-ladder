import { COLOURCSSVARIANTS } from '@/lib/utils';
import { RootState } from '@/state/store';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';

export default function InputScore(
    {
        modifiedFixtureCb,
        matchSlug,
        team,
        isHomeTeam
    }:
    {
        modifiedFixtureCb: undefined | ((_slug: string, _round: number, _team: string, _score: number) => void),
        matchSlug: string,
        team: string
        isHomeTeam: boolean
    }
) {
    const currentComp = useSelector((state: RootState) => state.currentComp.value);
    const { comp } = currentComp;

    const currentYear = useSelector((state: RootState) => state.currentYear.value);
    const { year } = currentYear;

    const mainSiteColour = useSelector((state: RootState) => state.mainSiteColour.value);
    const { colour } = mainSiteColour;

    const teamsIndex = comp.includes('nrl') ? 4 : 6;
    const roundIndex = teamsIndex - 1;

    const slug = matchSlug.split('/').filter(i => i)[teamsIndex]; // homeTeam-v-awayTeam
    const round = parseInt(matchSlug.split('/').filter(i => i)[roundIndex].replace('round-', '')); // round-x

    let predictedTeamScore: number | undefined;

    const predictionsRaw = localStorage.getItem(`predictedMatches${String(year)}${comp}`);
    if (predictionsRaw) {
        type PredictionsType = Record<number, Record<string, string> | undefined> | undefined;
        const predictions: PredictionsType = JSON.parse(predictionsRaw) as PredictionsType;

        const roundPrediction = predictions?.[round]?.[slug] ?
            JSON.parse(predictions[round][slug] ?? '') as Record<string, string | number> :
            {};

        if (Object.values(roundPrediction).length) {
            predictedTeamScore = roundPrediction[team] ? Number(roundPrediction[team]) : undefined;
        }
    }

    const updatePrediction = useDebouncedCallback(() => {
        if (typeof modifiedFixtureCb === 'function') {
            modifiedFixtureCb(slug, round, team, typeof score === 'string' ? Number(score) : score);
        }
    }, 500);

    const [score, setScore] = useState(predictedTeamScore ?? '');

    // Call useEffect to set the proper score any time the fixture toggles are used
    useEffect(() => {
        setScore(predictedTeamScore ?? '');
    }, [predictedTeamScore]);

    const whiteTextBoxes = ['nrl-ctry', 'nrl-bean', 'nrl-wil', 'qld'];
    const mqStyles = 'max-md:text-2xl max-md:w-[50px] md:text-3xl md:w-[75px]';

    return (
        <input
            className={
                clsx(
                    [`${mqStyles} text-center ${COLOURCSSVARIANTS[`${colour}-bg`]}`],
                    {
                        'sm:-order-1': !isHomeTeam,
                        'text-white': whiteTextBoxes.includes(colour)
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

                    setScore(newScore);
                    updatePrediction();
                }
            }
            type='number'
            value={score}
            min='0'
            max='100'
            step='1'
        />
    );
}
