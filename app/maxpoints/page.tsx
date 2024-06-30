import { Metadata } from "next";
import { getNRLInfo } from "../lib/utils";
import { TeamData } from "../lib/definitions";

export const metadata: Metadata = {
    title: 'NRL Max Points',
}

export default async function MaxPointsPage() {
    let nrlInfo = await getNRLInfo();
    
    let allTeams = nrlInfo.ladder.positions;

    const topTeams = allTeams.splice(0, 8);

    const firstPlaceMaxPts = getMaxPoints(topTeams[0].stats.lost);
    const lastPlacePts = allTeams[allTeams.length - 1].stats.points;

    // TODO formatting

    return (
        <div className="px-8 py-6 flex flex-col gap-6 page-min-height">
            <div>
                <div className="flex flex-row gap-2 text-md pb-4 font-semibold text-center">
                    <div className="text-left font-semibold w-full">Team</div>
                </div>
                {
                    topTeams.map((team: TeamData) => {
                        const currentPoints = team.stats.points;
                        const maxPoints = getMaxPoints(team.stats.lost);
                        
                        return (
                            <div className="flex flex-row gap-2 py-1 text-md text-center">
                                <div className="text-left font-semibold w-[15%]">{team.teamNickname}</div>
                                {
                                    getPointCells(lastPlacePts, firstPlaceMaxPts, currentPoints, maxPoints)
                                }
                            </div>
                        ) 
                    })
                }
                <div className="border-2 border-green-400"></div>
                {
                    allTeams.map((team: TeamData) => {
                        const currentPoints = team.stats.points;
                        const maxPoints = getMaxPoints(team.stats.lost);
                        
                        return (
                            <div className="flex flex-row gap-2 py-1 text-md text-center">
                                <div className="text-left font-semibold w-[15%]">{team.teamNickname}</div>
                                {
                                    getPointCells(lastPlacePts, firstPlaceMaxPts, currentPoints, maxPoints)
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

function getMaxPoints(losses: number) {
    const rounds = 24;
    const byes = 3;
    
    return (2 * (rounds + byes)) - (2 * losses);
}

function getPointCells(min: number, max: number, currentPts: number, maxPoints: number) {
    let pointCells = [];
    
    for (var i = min; i <= max; i++) {
        if (i >= currentPts && i <= maxPoints) {
            pointCells.push(
                <div className="w-[2%] bg-green-400 font-semibold" key={i}>{i}</div>
            );
        }
        else {
            pointCells.push(
                <div className="w-[2%]" key={i}></div>
            );
        }
    }
    
    return pointCells; 
}
