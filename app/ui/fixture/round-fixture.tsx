'use client';

import clsx from "clsx";
import { Match, TeamData } from "../../lib/definitions";
import moment from "moment";
import { getOrdinalNumber } from "../../lib/utils";
import Score from "./score";
import TeamSection from "./team-section";

export default function RoundFixture(
    {
        data,
        winningTeam,
        ladder
    }:
    {
        data: Match,
        winningTeam: string,
        ladder: Array<TeamData>
    }
) {
    const {matchMode, matchState, homeTeam, awayTeam, matchCentreUrl, clock} = data;
    const {nickName: homeTeamName, theme: homeTeamTheme} = homeTeam;
    const {nickName: awayTeamName, theme: awayTeamTheme} = awayTeam;

    const isLiveMatch = matchMode === "Live";
    const isFullTime = matchState === "FullTime";

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
        <a className="flex flex-col" href={gameLink} target="_blank">
            <span
                className={
                    clsx(
                        'text-center text-lg text-white font-semibold',
                        {
                            'bg-green-400': isFullTime,
                            'live-match': isLiveMatch && !isFullTime,
                            'bg-blue-400': !isLiveMatch && !isFullTime,
                        }
                    )
                }
            >
                {
                    getDateString(clock.kickOffTimeLong)
                }
            </span>
            <div className="flex flex-col md:flex-row text-lg items-center justify-between p-2">
                <TeamSection teamName={homeTeamName} imgKey={homeTeamTheme.key} position={homeTeamPos} />
                {
                    getMatchState(data, winningTeam)
                }
                <TeamSection teamName={awayTeamName} imgKey={awayTeamTheme.key} position={awayTeamPos} />
            </div>
        </a>
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
 * @returns HTML object
 */
function getMatchState(matchData: Match, winningTeam: string) {
    let commonClasses = 'flex flex-col md:flex-row gap-6 py-2 md:py-0 items-center justify-center w-full md:w-[34%]';
    const {matchMode, matchState, homeTeam, awayTeam, clock} = matchData;

    if (matchState === 'FullTime' || matchMode === 'Live') {
        commonClasses += ' pt-2';

        return (
            <div className={commonClasses}>
                <Score score={homeTeam.score} winCondition={winningTeam === 'homeTeam'} />
                {
                    getMatchContext(matchData)
                }
                <Score score={awayTeam.score} winCondition={winningTeam === 'awayTeam'} />
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
 * Get the status of a match (e.g. 1st Half, Full Time)
 *
 * @param {Match} matchData data related to the match
 * @returns HTML object
 */
function getMatchContext(matchData: Match) {
    const {matchMode, matchState, clock} = matchData;

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
                {/* TODO modify to tick every second */}
                <div>{clock.gameTime}</div>
            </div>
        );
    }

    return null;
}
