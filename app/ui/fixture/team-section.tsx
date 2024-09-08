import TeamImage from "../team-image";

export default function TeamSection({teamName, position, imgKey} : {teamName: string, position: string, imgKey: string}) {
    return (
        <div className="flex flex-row gap-6 pb-0 items-center justify-center w-full md:w-[33%]">
            <div className="flex flex-col text-center order-1 md:order-0 md:w-[35%]">
                <div className="font-semibold">{teamName}</div>
                <div>{position}</div>
            </div>
            <TeamImage matchLink='' teamKey={imgKey} />
        </div>
    )
}