import { NUMS } from "@/app/lib/utils";
import SkeletonFixtures from "./skeleton-fixtures";
import SkeletonLadderRow from "./skeleton-ladder-row";

export default function SkeletonLadder() {
    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <div className="flex flex-row self-end shimmer w-[200px] h-[72px] xs:h-7"></div>
            <div>
                <div className="flex flex-row gap-2 text-xl pb-4 font-semibold text-center">
                    <div className="w-[10%] md:w-[5%]">Pos</div>
                    <div className="hidden sm:block w-[15%] sm:w-[8%]">Team</div>
                    <div className="w-[25%] sm:w-[15%]"></div>
                    <div className="w-[15%] sm:w-[6%]">Pld</div>
                    <div className="hidden sm:block sm:w-[6%]">W</div>
                    <div className="hidden sm:block sm:w-[6%]">D</div>
                    <div className="hidden sm:block sm:w-[6%]">L</div>
                    <div className="hidden sm:block sm:w-[6%]">B</div>
                    <div className="hidden md:block w-[6%]">PF</div>
                    <div className="hidden md:block w-[6%]">PA</div>
                    <div className="hidden xs:block w-[15%] sm:w-[6%]">PD</div>
                    <div className="w-[25%] sm:w-[15%] md:w-[8%]">Next</div>
                    <div className="w-[15%] sm:w-[6%]">Pts</div>
                </div>
                {
                    getLadderRow(1, NUMS.FINALS_TEAMS)
                }
                <div className="border-2 border-green-400"></div>
                {
                    getLadderRow(NUMS.FINALS_TEAMS + 1, NUMS.TEAMS)
                }
            </div>
            <SkeletonFixtures />
        </div>
    );
}

function getLadderRow(startPos: number, endPos: number) {
    const rows = [];

    for (let i = startPos; i <= endPos; i++) {
        rows.push(
            <SkeletonLadderRow
                key={i}
                position={i.toString()}
            />
        )
    }
    
    return rows;
}
