import { getShortCode } from '@/app/lib/utils';
import TeamImage from '../team-image';
import clsx from 'clsx';
import { Match } from '@/app/lib/definitions';
import InputScore from './input-score';
import Score from './score';
import { RootState } from '@/app/state/store';
import { useSelector } from 'react-redux';

export default function TeamSection(
    {
        data,
        teamName,
        position,
        imgKey,
        isHomeTeam,
        isWinning,
        modifiable,
        modifiedFixtureCb
    }:
    {
        data: Match,
        teamName: string,
        position: string,
        imgKey: string
        isHomeTeam: boolean
        isWinning: boolean
        modifiable: boolean,
        modifiedFixtureCb: Function | undefined
    }
) {
    const currentComp = useSelector((state: RootState) => state.currentComp.value);
    const { comp } = currentComp;

    const mqStyles = 'max-sm:flex-col sm:flex-row max-sm:gap-2 sm:gap-6';

    return (
        <div className={`flex ${mqStyles} pb-0 items-center justify-between min-w-[35%]`}>
            <div className='flex flex-col text-center'>
                <div className="font-semibold">
                    <span className="md:block max-md:hidden">{teamName}</span>
                    <span className="md:hidden max-md:block">{getShortCode(teamName, comp)}</span>
                </div>
                <div>{position}</div>
            </div>
            <div className={
                clsx(
                    {
                        '-order-1': isHomeTeam,
                        'max-sm:-order-2': !isHomeTeam
                    }
                )
            }>
                <TeamImage matchLink='' teamKey={imgKey} tooltip={teamName} />
            </div>
            {
                getScoreSegment(
                    data,
                    isHomeTeam,
                    isWinning,
                    modifiable,
                    modifiedFixtureCb,
                    data.matchCentreUrl
                )
            }
        </div>
    );
}

/**
 * Get the score segment for display (either the team score or an input field if on
 * the ladder predictor page)
 *
 * @param {String} matchData data pertaining to the match (e.g. match state, match mode)
 * @param {String} isHomeTeam if the team is the home team or not
 * @param {String} winCondition e.g. home team is winning
 * @param {String} modifiable if the score can be modified by the user
 * @param {Function | undefined} modifiedFixtureCb
 * @param {String} matchSlug e.g. panthers-v-storm
 * @returns React component
 */
function getScoreSegment(
    matchData: Match,
    isHomeTeam: boolean,
    winCondition: boolean,
    modifiable: boolean,
    modifiedFixtureCb: Function | undefined,
    matchSlug: string
) {
    const { matchState, matchMode } = matchData;
    const team = isHomeTeam ? matchData.homeTeam : matchData.awayTeam;

    const teamSlug = team.nickName.toLowerCase().replace(' ', '-');

    if (modifiable && matchState !== 'FullTime' && matchMode !== 'Live') {
        return (
            <InputScore
                modifiedFixtureCb={modifiedFixtureCb}
                matchSlug={matchSlug}
                team={teamSlug}
                isHomeTeam={isHomeTeam}
            />
        );
    }

    const score = matchState !== 'Upcoming' && matchMode !== 'Pre' ? team.score : '';

    return <Score score={score} winCondition={winCondition} isHomeTeam={isHomeTeam} />;
}
