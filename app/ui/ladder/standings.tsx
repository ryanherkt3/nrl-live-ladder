export default function Standings({topHalf, bottomHalf}: {topHalf: any, bottomHalf: any}) {
    return (
        <div>
            <div className="flex flex-row gap-2 text-xl pb-4 font-semibold text-center">
                <div className="w-[10%] md:w-[5%]" title="Position">#</div>
                <div className="hidden sm:block w-[15%] sm:w-[8%]">Team</div>
                <div className="w-[25%] sm:w-[15%]"></div>
                <div className="w-[15%] sm:w-[6%]" title="Played">P</div>
                <div className="hidden sm:block sm:w-[6%]" title="Won">W</div>
                <div className="hidden sm:block sm:w-[6%]" title="Drawn">D</div>
                <div className="hidden sm:block sm:w-[6%]" title="Lost">L</div>
                <div className="hidden sm:block sm:w-[6%]" title="Byes">B</div>
                <div className="hidden md:block w-[6%]" title="Points For">PF</div>
                <div className="hidden md:block w-[6%]" title="Points Against">PA</div>
                <div className="hidden xs:block w-[15%] sm:w-[6%]" title="Points Difference">PD</div>
                <div className="w-[25%] sm:w-[15%] md:w-[8%]">Next</div>
                <div className="w-[15%] sm:w-[6%]">Pts</div>
            </div>
            {topHalf}
            <div className="border-2 border-green-400"></div>
            {bottomHalf}
        </div>
    );
}
