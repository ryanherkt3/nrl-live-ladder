import clsx from "clsx";
import { Match } from "../lib/definitions";
import TeamImage from "./team-image";

export default function RoundFixture({ data, winningTeam }: { data: Match; winningTeam: string}) {
    const isLiveMatch = data.matchMode === "Live";
    
    return (
        <div className="flex flex-col">
            <span 
                className={
                    clsx(
                        'text-center text-lg text-white font-semibold',
                        {
                            'live-match': isLiveMatch,
                            'bg-gray-400': !isLiveMatch,
                        }
                    )
                }
            >
                {
                    getDateString(data.clock.kickOffTimeLong)
                }
            </span>
            <div className="flex flex-col md:flex-row text-lg items-center justify-between p-2">
                <div className="flex flex-row gap-6 pb-0 items-center justify-center w-full md:w-[33%]">
                    <div className="flex flex-col text-center order-1 md:order-0 md:w-[35%]">
                        <div className="font-semibold">{data.homeTeam.nickName}</div>
                        <div>{data.homeTeam.teamPosition}</div>
                    </div>
                    <TeamImage imageLink='' teamKey={data.homeTeam.theme.key} />
                </div>
                
                {
                    getMatchState(data, winningTeam)
                }   
                
                <div className="flex flex-row gap-6 pb-0 items-center justify-center w-full md:w-[33%]">
                    <TeamImage imageLink='' teamKey={data.awayTeam.theme.key} />
                    <div className="flex flex-col text-center md:w-[35%]">
                        <div className="font-semibold">{data.awayTeam.nickName}</div>
                        <div>{data.awayTeam.teamPosition}</div>
                    </div>
                </div>
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

    let number = parseInt(dateString.split(', ')[1].split(' ')[0]);
    let numberString = '';

    if ([1, 21].includes(number)) {
        numberString = `${number}st`;
    }
    else if ([2, 22].includes(number)) {
        numberString = `${number}nd`;
    }
    else if ([3, 23].includes(number)) {
        numberString = `${number}rd`;
    }
    else {
        numberString = `${number}th`;
    }

    // dateString.replace(',', '').replace(number.toString(), numberString);

    return dateString.replace(',', '').replace(number.toString(), numberString);
}

function getMatchState(matchData: Match, winningTeam: string) {
    let commonClasses = 'flex flex-col md:flex-row gap-6 py-2 md:py-0 items-center justify-center w-full md:w-[34%]';
    
    if (matchData.matchState === 'FullTime' || matchData.matchMode === 'Live') {
        commonClasses += 'pt-2';

        return (
            <div className={commonClasses}>
                <div 
                    className={
                        clsx(
                            'text-3xl',
                            {
                                'font-semibold': winningTeam === 'homeTeam'
                            }
                        )
                    }
                >
                    {matchData.homeTeam.score}
                </div>
                {
                    getMatchContext(matchData)
                }
                <div 
                    className={
                        clsx(
                            'text-3xl',
                            {
                                'font-semibold': winningTeam === 'awayTeam'
                            }
                        )
                    }
                >
                    {matchData.awayTeam.score}
                </div>
            </div>
        );
    }

    const kickoffTime = new Date(matchData.clock.kickOffTimeLong).toLocaleString('en-NZ', { timeStyle:'short' });

    return (
        <div className={commonClasses}>
            <div>{kickoffTime}</div>
        </div>
    )
}

function getMatchContext(matchData: Match) {
    if (matchData.matchState === 'FullTime') {
        return <div>FULL TIME</div>
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
            <div className="flex flex-col md:flex-row gap-2 items-center text-md">
                <div className="border rounded-md p-1 border-red-500 bg-red-500 text-white">{matchPeriod}</div>
                <div>{matchData.clock.gameTime}</div>
            </div>
        )
    }

    return null;
}