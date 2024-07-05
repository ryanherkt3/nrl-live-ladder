'use client';

import clsx from "clsx";
import { Match, TeamData } from "../lib/definitions";
import TeamImage from "./team-image";
import moment from "moment";
import { getNumberSuffix } from "../lib/utils";

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
    const isLiveMatch = data.matchMode === "Live";
    const isFullTime = !isLiveMatch && data.matchState === "FullTime";

    // Get ladder position of teams
    const homeTeamObj = ladder.filter((team: TeamData) => {
        return team.teamNickname === data.homeTeam.nickName;
    });
    const awayTeamObj = ladder.filter((team: TeamData) => {
        return team.teamNickname === data.awayTeam.nickName;
    });
    const homeTeamPos = getNumberSuffix(ladder.indexOf(homeTeamObj[0]) + 1);
    const awayTeamPos = getNumberSuffix(ladder.indexOf(awayTeamObj[0]) + 1);
    
    return (
        <div className="flex flex-col">
            <span 
                className={
                    clsx(
                        'text-center text-lg text-white font-semibold',
                        {
                            'live-match': isLiveMatch,
                            'bg-green-400': isFullTime,
                            'bg-gray-400': !isLiveMatch && !isFullTime,
                        }
                    )
                }
            >
                {
                    getDateString(data.clock.kickOffTimeLong)
                }
            </span>
            <div className="flex flex-col md:flex-row text-lg items-center justify-between p-2">
                <TeamSection teamName={data.homeTeam.nickName} imgKey={data.homeTeam.theme.key} position={homeTeamPos} />
                {
                    getMatchState(data, winningTeam)
                }   
                <TeamSection teamName={data.awayTeam.nickName} imgKey={data.awayTeam.theme.key} position={awayTeamPos} />
            </div>
        </div>
    );
}

function getDateString(date: string) {
    let dateString = new Date(date).toLocaleString(
        'en-NZ', 
        {
            weekday:'long',
            day: 'numeric',
            month: 'long'
        }
    );

    const number = parseInt(dateString.split(', ')[1].split(' ')[0]);

    return dateString.replace(',', '').replace(number.toString(), getNumberSuffix(number));
}

function getMatchState(matchData: Match, winningTeam: string) {
    let commonClasses = 'flex flex-col md:flex-row gap-6 py-2 md:py-0 items-center justify-center w-full md:w-[34%]';
    
    if (matchData.matchState === 'FullTime' || matchData.matchMode === 'Live') {
        commonClasses += ' pt-2';

        return (
            <div className={commonClasses}>
                <Score score={matchData.homeTeam.score} winCondition={winningTeam === 'homeTeam'} />
                {
                    getMatchContext(matchData)
                }
                <Score score={matchData.awayTeam.score} winCondition={winningTeam === 'awayTeam'} />
            </div>
        );
    }

    const kickoffTime = moment(matchData.clock.kickOffTimeLong).format('LT');

    return (
        <div className={commonClasses}>
            <div>{kickoffTime}</div>
        </div>
    )
}

function getMatchContext(matchData: Match) {
    if (matchData.matchState === 'FullTime') {
        return (
            <div className="border rounded-md p-1 border-green-400 bg-green-400 text-white">FULL TIME</div>
        );
    }

    let matchPeriod = '';
    switch(matchData.matchState) {
        case 'FirstHalf':
            matchPeriod = '1ST HALF';
            break;
        case 'HalfTime':
            matchPeriod = 'HALF TIME';
            break;
        case 'SecondHalf':
            matchPeriod = '2ND HALF';
            break;
        default:
            matchPeriod = 'UPCOMING';
            break;
    }

    if (matchData.matchMode === 'Live') {
        return (
            <div className="flex flex-col gap-2 items-center text-md">
                <div className="border rounded-md p-1 border-red-500 bg-red-500 text-white">{matchPeriod}</div>
                <div>{matchData.clock.gameTime}</div>
            </div>
        )
    }

    return null;
}

// Internal components

function Score({score, winCondition}: {score: number, winCondition: boolean}) {
    return <div className={clsx('text-3xl', {'font-semibold': winCondition})}>{score}</div>;
}

function TeamSection({teamName, position, imgKey} : {teamName: string, position: string, imgKey: string}) {
    return (
        <div className="flex flex-row gap-6 pb-0 items-center justify-center w-full md:w-[33%]">
            <div className="flex flex-col text-center order-1 md:order-0 md:w-[35%]">
                <div className="font-semibold">{teamName}</div>
                <div>{position}</div>
            </div>
            <TeamImage imageLink='' teamKey={imgKey} />
        </div>
    )
}
