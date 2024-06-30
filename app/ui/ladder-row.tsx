import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { TeamData, NextTeam } from "../lib/definitions";
import TeamImage from "./team-image";

export default function LadderRow({ data, position }: { data: TeamData; position: String}) {
    return (
        <div className="flex flex-row gap-2 py-1 items-center text-center text-lg">
            <div className="w-[5%] flex justify-center flex-row gap-2 font-semibold">
                <span>{position}</span>
                {
                    getMovement(data.movement)
                }
            </div>
            <div className="w-[8%] flex justify-center">
                <TeamImage imageLink='' teamKey={data.theme.key} />
            </div>
            <div className="w-[15%] text-left">{data.teamNickname}</div>
            <div className="w-[6%]">{data.stats.played}</div>
            <div className="w-[6%]">{data.stats.wins}</div>
            <div className="w-[6%]">{data.stats.drawn}</div>
            <div className="w-[6%]">{data.stats.lost}</div>
            <div className="w-[6%]">{data.stats.byes}</div>
            <div className="w-[6%]">{data.stats['points for']}</div>
            <div className="w-[6%]">{data.stats['points against']}</div>
            <div className="w-[6%]">{data.stats['points difference']}</div>
            <div className="w-[8%] flex justify-center">
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

function getImageUrl(link: string, teamKey: string) {
    const imgUrl = `https://www.nrl.com/.theme/${teamKey}/badge-basic24.svg?bust=202406240046`;
    const image = <img src={imgUrl} className="w-9"></img>;
    
    if (link) {
        return (
            <a href={link} target="_blank">
                {image}
            </a>
        );
    }

    return image;
}

function getMovement(movement: string) {
    if (movement === 'up') {
        return <ChevronUpIcon className="w-6 text-green-600 font-semibold"></ChevronUpIcon>;
    }
    if (movement === 'down') {
        return <ChevronDownIcon className="w-6 text-red-600 font-semibold"></ChevronDownIcon>;
    }

    return null;
}
