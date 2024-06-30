import { TeamData, NextTeam } from "../lib/definitions";
import { getShortCode } from "../lib/utils";
import TeamImage from "./team-image";

export default function LadderRow({ data, position, isPlaying }: { data: TeamData; position: String; isPlaying: boolean}) {
    return (
        <div className="flex flex-row gap-2 py-1 items-center text-center text-lg">
            <div className="w-[10%] md:w-[5%] flex justify-center flex-row gap-2 font-semibold">
                {
                    getLiveStatus(isPlaying)
                }
                <span>{position}</span>
            </div>
            <div className="w-[8%] flex justify-center">
                <TeamImage imageLink='' teamKey={data.theme.key} />
            </div>
            <div className="w-[15%] text-left">
                <span className='hidden md:block'>{data.teamNickname}</span>
                <span className='block md:hidden'>
                    {
                        getShortCode(data.teamNickname)
                    }
                </span>
            </div>
            <div className="w-[6%]">{data.stats.played}</div>
            {/* TODO hide W-D-L for phones (sm) */}
            <div className="w-[6%]">{data.stats.wins}</div>
            <div className="w-[6%]">{data.stats.drawn}</div>
            <div className="w-[6%]">{data.stats.lost}</div>
            <div className="w-[6%]">{data.stats.byes}</div>
            <div className="hidden md:block w-[6%]">{data.stats['points for']}</div>
            <div className="hidden md:block w-[6%]">{data.stats['points against']}</div>
            <div className="w-[6%]">{data.stats['points difference']}</div>
            <div className="w-[15%] md:w-[8%] flex justify-center">
                {
                    getNextFixture(data.next)
                }
            </div>
            <div className="w-[6%] font-semibold">{data.stats.points}</div>
        </div>
    );
}

function getNextFixture(nextFixture: NextTeam) {
    if (nextFixture.isBye) {
        return 'BYE';
    }

    return <TeamImage imageLink={nextFixture.matchCentreUrl} teamKey={nextFixture.theme.key} />;
}

function getLiveStatus(isPlaying: boolean) {
    if (isPlaying) {
        return <div className="w-6 border rounded-full live-match border-red-600"></div>;
    }

    return null;
}
