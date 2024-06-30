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
                        'text-center text-lg bg-gray-400 text-white font-semibold',
                        {
                            'bg-red-500': isLiveMatch,
                            'bg-gray-400': !isLiveMatch,
                        }
                    )
                }
            >
                {
                    getDateString(data.clock.kickOffTimeLong)
                }
            </span>

            <div className="flex flex-row text-lg items-center justify-between">
                <div className="flex flex-row gap-6 p-2 pb-0 items-center justify-center w-[33%]">
                    <div className="flex flex-col text-center w-[35%]">
                        <div className="font-semibold">{data.homeTeam.nickName}</div>
                        <div>{data.homeTeam.teamPosition}</div>
                    </div>
                    <TeamImage imageLink='' teamKey={data.homeTeam.theme.key} />
                </div>
                
                {
                    getMatchState(data)
                }   
                
                <div className="flex flex-row gap-6 p-2 pb-0 items-center justify-center w-[33%]">
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
            <div className="flex flex-row gap-6 p-2 pb-0 items-center justify-center w-[34%]">
                <div className="font-semibold">{matchData.homeTeam.score}</div>
                <div>
                    { 
                        matchData.matchState === 'FullTime' ? 
                            'FULL TIME' :
                            (matchData.matchMode === 'Live' ? '' : matchData.clock.gameTime )
                    }
                </div>
                <div className="font-semibold">{matchData.awayTeam.score}</div>
            </div>
        );
    }

    const kickoffTime = new Date(matchData.clock.kickOffTimeLong).toLocaleString('en-NZ', { timeStyle:'short' });

    return (
        <div className="flex flex-row gap-6 p-2 pb-0 items-center justify-center w-[34%]">
            <div>{kickoffTime}</div>
        </div>
    )
}
