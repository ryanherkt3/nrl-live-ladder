/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Match } from '@/lib/definitions';
import MatchContext from './match-context';
import moment from 'moment';
import PredictorRadio from './predictor-radio';
import Score from './score';
import { useSearchParams } from 'next/navigation';

export default function MatchState(
    {
        matchData,
        modifiable,
        mainSiteColour,
        modifiedFixtureCb
    }:
    {
        matchData: Match,
        modifiable: boolean,
        mainSiteColour: string,
        modifiedFixtureCb: undefined | (() => void),
    }
) {
    let commonClasses = 'py-2';
    const widthClasses = 'w-fit';
    const alignmentClasses = 'items-center max-sm:justify-between justify-center text-center';

    // Empty string means info about the NRL will be fetched
    const comp = useSearchParams().get('comp') ?? 'nrl';

    // Empty string means the current year will be fetched
    const season = useSearchParams().get('season');
    const drawSeason = season ? parseInt(season) : new Date().getFullYear();

    const { matchMode, matchState, clock } = matchData;

    const homeTeam = matchData.homeTeam.nickName.toLowerCase().replace(' ', '-');
    const awayTeam = matchData.awayTeam.nickName.toLowerCase().replace(' ', '-');

    let selectedWinner = '';
    const teamsIndex = comp.includes('nrl') ? 4 : 6;
    const roundIndex = teamsIndex - 1;

    const slug = matchData.matchCentreUrl.split('/').filter(i => i)[teamsIndex]; // homeTeam-v-awayTeam
    const round = parseInt(
        matchData.matchCentreUrl.split('/').filter(i => i)[roundIndex].replace('round-', '')
    ); // round-x

    const predictionsRaw = localStorage.getItem(`predictedMatches${String(drawSeason)}${comp}`);
    if (predictionsRaw) {
        type PredictionsType = Record<number, Record<string, string> | undefined> | undefined;
        const predictions: PredictionsType = JSON.parse(predictionsRaw) as PredictionsType;

        const roundPrediction = predictions?.[round]?.[slug] ?
            JSON.parse(predictions[round][slug] ?? '') as Record<string, number> :
            {};

        if (Object.entries(roundPrediction).length) {
            selectedWinner = Object.keys(
                Object.fromEntries(
                    Object.entries(roundPrediction).filter(([key, value]) => value > 0)
                )
            )[0];
        }
    }

    if (modifiable || matchState === 'FullTime' || matchMode === 'Live') {
        commonClasses += ' flex flex-row gap-4 pt-2 max-sm:order-3 max-sm:w-full';

        return (
            <div className={`${commonClasses} ${alignmentClasses} ${widthClasses}`}>
                {
                    (modifiable && matchState !== 'FullTime' && matchMode !== 'Live') ?
                        (
                            <PredictorRadio
                                modifiedFixtureCb={modifiedFixtureCb}
                                matchSlug={matchData.matchCentreUrl}
                                team={homeTeam}
                                checked={selectedWinner === homeTeam}
                            />
                        ) :
                        (
                            <Score
                                score={matchState !== 'Upcoming' && matchMode !== 'Pre' ? matchData.homeTeam.score : ''}
                                winCondition={matchData.homeTeam.score > matchData.awayTeam.score}
                                isHomeTeam={true}
                            />
                        )
                }
                <MatchContext matchData={matchData} modifiable={modifiable} mainSiteColour={mainSiteColour} />
                {
                    (modifiable && matchState !== 'FullTime' && matchMode !== 'Live') ?
                        (
                            <PredictorRadio
                                modifiedFixtureCb={modifiedFixtureCb}
                                matchSlug={matchData.matchCentreUrl}
                                team={awayTeam}
                                checked={selectedWinner === awayTeam}
                            />
                        ) :
                        (
                            <Score
                                score={matchState !== 'Upcoming' && matchMode !== 'Pre' ? matchData.awayTeam.score : ''}
                                winCondition={matchData.awayTeam.score > matchData.homeTeam.score}
                                isHomeTeam={true}
                            />
                        )
                }
            </div>
        );
    }

    const kickoffTime = moment(clock.kickOffTimeLong).format('LT');

    return (
        <div className={`${commonClasses} ${alignmentClasses} ${widthClasses} min-w-15 md:w-62 sm:w-49.5`}>
            <div>{kickoffTime}</div>
        </div>
    );
}
