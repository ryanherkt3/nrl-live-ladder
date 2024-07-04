import SkeletonFixtures from "./skeleton-fixtures";
import SkeletonLadderRow from "./skeleton-ladder-row";

export default function SkeletonLadder() {
    return (
        <>
            <div>
                <div className="flex flex-row gap-2 text-xl pb-4 font-semibold text-center">
                    <div className="w-[10%] md:w-[5%]">Pos</div>
                    <div className="w-[15%] sm:w-[8%]">Team</div>
                    <div className="w-[25%] sm:w-[15%]"></div>
                    <div className="w-[9%] sm:w-[6%]">Pld</div>
                    <div className="hidden sm:block sm:w-[6%]">W</div>
                    <div className="hidden sm:block sm:w-[6%]">D</div>
                    <div className="hidden sm:block sm:w-[6%]">L</div>
                    <div className="hidden sm:block sm:w-[6%]">B</div>
                    <div className="hidden md:block w-[6%]">PF</div>
                    <div className="hidden md:block w-[6%]">PA</div>
                    <div className="w-[9%] sm:w-[6%]">PD</div>
                    <div className="w-[15%] md:w-[8%]">Next</div>
                    <div className="w-[9%] sm:w-[6%]">Pts</div>
                </div>
                {
                    getLadderRow(1, 8)
                }
                <div className="border-2 border-green-400"></div>
                {
                    getLadderRow(9, 17)
                }
            </div>
            <SkeletonFixtures />
        </>
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
