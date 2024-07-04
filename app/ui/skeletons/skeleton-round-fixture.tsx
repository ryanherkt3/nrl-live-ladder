export default function SkeletonRoundFixture() {
    return (
        <div className="flex flex-col">
            <span className="shimmer-date h-7"></span>
            <div className="flex flex-col md:flex-row text-lg items-center justify-between py-2 h-[72px]">
                <div className="shimmer flex flex-row gap-6 pb-0 items-center justify-center w-full h-14"></div>
            </div>
        </div>
    );
}
