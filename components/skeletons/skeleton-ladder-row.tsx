export default function SkeletonLadderRow({position}: {position: string}) {
    return (
        <div className="flex flex-row gap-2 py-1 items-center text-center text-lg">
            <div className="w-[10%] md:w-[5%] flex justify-center flex-row gap-2 font-semibold">
                <span>{position}</span>
            </div>
            <div className="shimmer w-full h-9"></div>
        </div>
    );
}
