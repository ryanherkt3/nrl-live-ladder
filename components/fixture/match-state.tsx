import { Match } from '@/lib/definitions';
import MatchContext from './match-context';
import moment from 'moment';
import PredictorRadio from './predictor-radio';
import Score from './score';
import { useState } from 'react';

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
    let commonClasses = 'flex flex-row gap-4 py-2 max-sm:order-3';
    const widthClasses = 'max-sm:w-full w-fit';
    const alignmentClasses = 'items-center max-sm:justify-between justify-center text-center';

    const { matchMode, matchState, clock } = matchData;

    const [selectedWinner, setSelectedWinner] = useState('');

    if (modifiable || matchState === 'FullTime' || matchMode === 'Live') {
        commonClasses += ' pt-2';

        return (
            <div className={`${commonClasses} ${alignmentClasses} ${widthClasses}`}>
                {
                    (modifiable && matchState !== 'FullTime' && matchMode !== 'Live') ?
                        (
                            <PredictorRadio
                                modifiedFixtureCb={modifiedFixtureCb}
                                matchSlug={matchData.matchCentreUrl}
                                team={matchData.homeTeam.nickName.toLowerCase().replace(' ', '-')}
                                checked={
                                    selectedWinner === matchData.homeTeam.nickName.toLowerCase().replace(' ', '-')
                                }
                                onChange={
                                    () => {
                                        setSelectedWinner(matchData.homeTeam.nickName.toLowerCase().replace(' ', '-'));
                                    }
                                }
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
                                team={matchData.awayTeam.nickName.toLowerCase().replace(' ', '-')}
                                checked={
                                    selectedWinner === matchData.awayTeam.nickName.toLowerCase().replace(' ', '-')
                                }
                                onChange={
                                    () => {
                                        setSelectedWinner(matchData.awayTeam.nickName.toLowerCase().replace(' ', '-'));
                                    }
                                }
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
        <div className={`${commonClasses} ${alignmentClasses} ${widthClasses} min-w-15`}>
            <div>{kickoffTime}</div>
        </div>
    );
}
