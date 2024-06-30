import clsx from "clsx";
import { Match } from "../lib/definitions";
import TeamImage from "./team-image";

export default function RoundFixture({ data, }: { data: Match}) {
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

            {/* TODO do not bold the non-winner's score */}
            <div className="flex flex-row text-lg items-center justify-between p-2">
                <div className="flex flex-row gap-6 pb-0 items-center justify-center w-[33%]">
                    <div className="flex flex-col text-center w-[35%]">
                        <div className="font-semibold">{data.homeTeam.nickName}</div>
                        <div>{data.homeTeam.teamPosition}</div>
                    </div>
                    <TeamImage imageLink='' teamKey={data.homeTeam.theme.key} />
                </div>
                
                {
                    getMatchState(data)
                }   
                
                <div className="flex flex-row gap-6 pb-0 items-center justify-center w-[33%]">
                    <TeamImage imageLink='' teamKey={data.awayTeam.theme.key} />
                    <div className="flex flex-col text-center w-[35%]">
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

function getMatchState(matchData: Match) {
    if (matchData.matchState === 'FullTime' || matchData.matchMode === 'Live') {
        return (
            <div className="flex flex-row gap-6 pb-0 pt-2 items-center justify-center w-[34%]">
                <div className="font-semibold text-3xl">{matchData.homeTeam.score}</div>
                {
                    getMatchContext(matchData)
                }
                <div className="font-semibold text-3xl">{matchData.awayTeam.score}</div>
            </div>
        );
    }

    const kickoffTime = new Date(matchData.clock.kickOffTimeLong).toLocaleString('en-NZ', { timeStyle:'short' });

    return (
        <div className="flex flex-row gap-6 pb-0 items-center justify-center w-[34%]">
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
            <div className="flex flex-col gap-2 items-center text-md">
                <div className="border rounded-md p-1 border-red-500 bg-red-500 text-white">{matchPeriod}</div>
                <div>{matchData.clock.gameTime}</div>
            </div>
        )
    }

    return null;
}