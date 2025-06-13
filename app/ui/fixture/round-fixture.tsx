'use client';

import clsx from 'clsx';
import { Match, TeamData } from '../../lib/definitions';
import moment from 'moment';
import { COLOURCSSVARIANTS, CURRENTCOMP, getOrdinalNumber, MAINCOLOUR } from '../../lib/utils';
import TeamSection from './team-section';

export default function RoundFixture(
    {
        data,
        winningTeam,
        ladder,
        isFinalsFootball,
        modifiable,
        modifiedFixtureCb
    }:
    {
        data: Match,
        winningTeam: string,
        ladder: Array<TeamData>
        isFinalsFootball: boolean,
        modifiable: boolean,
        modifiedFixtureCb: Function | undefined
    }
) {
    const { matchMode, matchState, homeTeam, awayTeam, clock } = data;
    let { matchCentreUrl } = data;
    const { nickName: homeTeamName, theme: homeTeamTheme } = homeTeam;
    const { nickName: awayTeamName, theme: awayTeamTheme } = awayTeam;

    const isLiveMatch = matchMode === 'Live';
    const isFullTime = matchState === 'FullTime';

    // Get ladder position of teams
    const homeTeamObj = ladder.filter((team: TeamData) => {
        return team.name === homeTeamName;
    });
    const awayTeamObj = ladder.filter((team: TeamData) => {
        return team.name === awayTeamName;
    });
    const homeTeamPos = getOrdinalNumber(ladder.indexOf(homeTeamObj[0]) + 1);
    const awayTeamPos = getOrdinalNumber(ladder.indexOf(awayTeamObj[0]) + 1);

    if (CURRENTCOMP.includes('nrl')) {
        matchCentreUrl = `https://nrl.com${matchCentreUrl}`;
    }

    return (
        <div className="flex flex-col">
            <a
                href={matchCentreUrl} target="_blank"
                className={
                    clsx(
                        'text-center text-lg text-white font-semibold',
                        {
                            'bg-indigo-400': modifiable && matchMode === 'Pre',
                            [`${COLOURCSSVARIANTS[`${MAINCOLOUR}-bg`]}`]: isFullTime,
                            'live-match': isLiveMatch && !isFullTime,
                            'bg-yellow-600': matchMode === 'Pre' && isFinalsFootball,
                            'bg-blue-400': matchMode === 'Pre' && !isFinalsFootball,
                        }
                    )
                }
            >
                {
                    getDateString(clock.kickOffTimeLong)
                }
            </a>
            <div className="flex flex-row text-lg items-center justify-center gap-4 p-2">
                <TeamSection
                    data={data}
                    teamName={homeTeamName}
                    imgKey={homeTeamTheme.key}
                    position={homeTeamPos}
                    isHomeTeam={true}
                    isWinning={winningTeam === 'homeTeam'}
                    modifiable={modifiable}
                    modifiedFixtureCb={modifiedFixtureCb}
                />
                {
                    getMatchState(data, modifiable)
                }
                <TeamSection
                    data={data}
                    teamName={awayTeamName}
                    imgKey={awayTeamTheme.key}
                    position={awayTeamPos}
                    isHomeTeam={false}
                    isWinning={winningTeam === 'awayTeam'}
                    modifiable={modifiable}
                    modifiedFixtureCb={modifiedFixtureCb}
                />
            </div>
        </div>
    );
}

/**
 * Get the date for a fixture (e.g. Friday 6th September)
 *
 * @param {string} date the fixture's date (e.g. 2024-09-05T09:50:00Z)
 * @returns {string}
 */
function getDateString(date: string) {
    const dateString = new Date(date).toLocaleString(
        'en-NZ',
        {
            weekday:'long',
            day: 'numeric',
            month: 'long'
        }
    );

    const number = parseInt(dateString.split(', ')[1].split(' ')[0]);

    return dateString.replace(',', '').replace(number.toString(), getOrdinalNumber(number));
}

/**
 * Get the match information to be displayed as part of a fixture.
 *
 * If the match has not kicked off, the kick off time is displayed. Otherwise,
 * the team scores will be displayed
 *
 * @param {Match} matchData data related to the match
 * @param {boolean} modifiable if the scores can be edited by the user (e.g. for the ladder predictor)
 * @returns HTML object
 */
function getMatchState(
    matchData: Match,
    modifiable: boolean
) {
    let commonClasses = 'flex flex-row max-md:gap-3 md:gap-6 py-2';
    const widthClasses = 'sm:w-[90px] md:w-[140px]';
    const alignmentClasses = 'items-center justify-center text-center';

    const { matchMode, matchState, clock } = matchData;

    if (modifiable || matchState === 'FullTime' || matchMode === 'Live') {
        commonClasses += ' pt-2';

        return (
            <div className={`${commonClasses} ${alignmentClasses} ${widthClasses} w-[60px]`}>
                {
                    getMatchContext(matchData, modifiable)
                }
            </div>
        );
    }

    const kickoffTime = moment(clock.kickOffTimeLong).format('LT');

    return (
        <div className={`${commonClasses} ${alignmentClasses} ${widthClasses} min-w-[60px]`}>
            <div>{kickoffTime}</div>
        </div>
    );
}

/**
 * Get the status of a match (e.g. 1st Half, Full Time)
 *
 * @param {Match} matchData data related to the match
 * @param {boolean} modifiable if the scores can be edited by the user (e.g. for the ladder predictor)
 * @returns HTML object
 */
function getMatchContext(matchData: Match, modifiable: boolean) {
    const { matchMode, matchState, clock } = matchData;

    if ((modifiable && matchState !== 'FullTime' && matchMode !== 'Live') || matchState === 'FullTime') {
        const isFullTime = matchState === 'FullTime';
        const string = isFullTime ? 'FULL TIME' : 'PREDICTION';
        const mobileString = isFullTime ? 'FT' : 'PRED';

        const trueClasses = `${COLOURCSSVARIANTS[`${MAINCOLOUR}-bg`]} ${COLOURCSSVARIANTS[`${MAINCOLOUR}-border`]}`;

        return (
            <div className={
                clsx(
                    'border rounded-md px-2 py-1 w-[60px] sm:w-[90px] md:w-[140px] text-white',
                    {
                        [`${trueClasses}`]: isFullTime,
                        'border-indigo-400 bg-indigo-400': !isFullTime
                    }
                )
            }>
                <span className="md:block max-md:hidden">{string}</span>
                <span className="md:hidden max-md:block">{mobileString}</span>
            </div>
        );
    }

    let matchPeriod = '';
    switch (matchState) {
        case 'FirstHalf':
            matchPeriod = 'H1';
            break;
        case 'HalfTime':
            matchPeriod = 'HT';
            break;
        case 'SecondHalf':
            matchPeriod = 'H2';
            break;
        case 'ExtraTime':
            matchPeriod = 'ET';
            break;
        default:
            break;
    }

    if (matchMode === 'Live' && matchPeriod) {
        const colourClasses = 'border-red-500 bg-red-500 text-white';
        const widthClasses = 'w-[60px] sm:w-[90px] md:w-[140px]';

        return (
            <div className="flex flex-col gap-2 items-center text-md">
                <div className={`border rounded-md px-2 py-1 ${colourClasses} ${widthClasses}`}>
                    <span className="md:block max-md:hidden">{matchPeriod} | {clock.gameTime}</span>
                    <span className="md:hidden max-md:block">{matchPeriod}</span>
                </div>
                <div className="md:hidden max-md:block">{clock.gameTime}</div>
            </div>
        );
    }

    return null;
}
