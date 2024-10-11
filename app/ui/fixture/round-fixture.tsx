'use client';

import clsx from 'clsx';
import { FixtureTeam, Match, TeamData } from '../../lib/definitions';
import moment from 'moment';
import { getOrdinalNumber } from '../../lib/utils';
import Score from './score';
import TeamSection from './team-section';
import InputScore from './input-score';

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
    const { matchMode, matchState, homeTeam, awayTeam, matchCentreUrl, clock } = data;
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

    const gameLink = `https://nrl.com${matchCentreUrl}`;

    return (
        <div className="flex flex-col">
            <a
                href={gameLink} target="_blank"
                className={
                    clsx(
                        'text-center text-lg text-white font-semibold',
                        {
                            'bg-orange-400': modifiable && matchMode === 'Pre',
                            'bg-green-400': isFullTime,
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
            <div className="flex flex-col md:flex-row text-lg items-center justify-between p-2">
                <TeamSection teamName={homeTeamName} imgKey={homeTeamTheme.key} position={homeTeamPos} />
                {
                    getMatchState(data, winningTeam, modifiable, modifiedFixtureCb, matchCentreUrl)
                }
                <TeamSection teamName={awayTeamName} imgKey={awayTeamTheme.key} position={awayTeamPos} />
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
 * @param {string} winningTeam the team (if any) that is winning
 * @param {boolean} modifiable if the scores can be edited by the user (e.g. for the ladder predictor)
 * @param {Function | undefined} modifiedFixtureCb
 * @param {string} matchSlug e.g. panthers-v-storm
 * @returns HTML object
 */
function getMatchState(
    matchData: Match,
    winningTeam: string,
    modifiable: boolean,
    modifiedFixtureCb: Function | undefined,
    matchSlug: string
) {
    let commonClasses = 'flex flex-col md:flex-row gap-6 py-2 md:py-0 items-center justify-center w-full md:w-[34%]';
    const { matchMode, matchState, homeTeam, awayTeam, clock } = matchData;

    if (matchState === 'FullTime' || matchMode === 'Live') {
        commonClasses += ' pt-2';

        return (
            <div className={commonClasses}>
                {
                    getScoreSegment(
                        matchData,
                        homeTeam,
                        winningTeam === 'homeTeam',
                        modifiable,
                        modifiedFixtureCb,
                        matchSlug
                    )
                }
                {
                    getMatchContext(matchData, modifiable)
                }
                {
                    getScoreSegment(
                        matchData,
                        awayTeam,
                        winningTeam === 'awayTeam',
                        modifiable,
                        modifiedFixtureCb,
                        matchSlug
                    )
                }
            </div>
        );
    }

    const kickoffTime = moment(clock.kickOffTimeLong).format('LT');

    return (
        <div className={commonClasses}>
            <div>{kickoffTime}</div>
        </div>
    );
}

/**
 * Get the score segment for display (either the team score or an input field if on
 * the ladder predictor page)
 *
 * @param {String} matchData data pertaining to the match (e.g. match state, match mode)
 * @param {String} team
 * @param {String} winCondition e.g. home team is winning
 * @param {String} modifiable if the score can be modified by the user
 * @param {Function | undefined} modifiedFixtureCb
 * @param {String} matchSlug e.g. panthers-v-storm
 * @returns React component
 */
function getScoreSegment(
    matchData: Match,
    team: FixtureTeam,
    winCondition: boolean,
    modifiable: boolean,
    modifiedFixtureCb: Function | undefined,
    matchSlug: string
) {
    const { matchState, matchMode } = matchData;
    const teamSlug = team.nickName.toLowerCase().replace(' ', '-');

    if (modifiable && matchState !== 'FullTime' && matchMode !== 'Live') {
        return <InputScore modifiedFixtureCb={modifiedFixtureCb} matchSlug={matchSlug} team={teamSlug} />;
    }

    return <Score score={team.score} winCondition={winCondition} />;
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

    if (modifiable && matchState !== 'FullTime' && matchMode !== 'Live') {
        return (
            <div className="border rounded-md px-2 py-1 w-fit border-orange-400 bg-orange-400 text-white">
                PREDICTION
            </div>
        );
    }

    if (matchState === 'FullTime') {
        return (
            <div className="border rounded-md px-2 py-1 w-fit border-green-400 bg-green-400 text-white">
                FULL TIME
            </div>
        );
    }

    let matchPeriod = '';
    switch (matchState) {
        case 'FirstHalf':
            matchPeriod = '1ST HALF';
            break;
        case 'HalfTime':
            matchPeriod = 'HALF TIME';
            break;
        case 'SecondHalf':
            matchPeriod = '2ND HALF';
            break;
        case 'ExtraTime':
            matchPeriod = 'EXTRA TIME';
            break;
        default:
            matchPeriod = 'UPCOMING';
            break;
    }

    if (matchMode === 'Live') {
        return (
            <div className="flex flex-col gap-2 items-center text-md">
                <div className="border rounded-md px-2 py-1 w-fit border-red-500 bg-red-500 text-white">
                    {matchPeriod}
                </div>
                <div>{clock.gameTime}</div>
            </div>
        );
    }

    return null;
}
