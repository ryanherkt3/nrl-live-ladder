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

    const firstPlaceMaxPts = getMaxPoints(topTeams[0].stats.lost, topTeams[0].stats.drawn);
    const lastPlacePts = allTeams[allTeams.length - 1].stats.points;

    return (
        <div className="px-6 py-8 page-min-height">
            <table>
                <tbody>
                    <tr className="text-md font-semibold text-center">
                        <th style={{width: '15%'}} className="text-left pb-4 font-semibold">Team</th>
                        <th className="text-left pb-4 font-semibold">Points</th>
                    </tr>
                    {
                        getTableRows(topTeams, firstPlaceMaxPts, lastPlacePts)
                    }
                    <tr style={{width: '100%'}} className="border-4 border-green-400"></tr>
                    {
                        getTableRows(allTeams, firstPlaceMaxPts, lastPlacePts)
                    }
                </tbody>
            </table>
        </div>
    );
}

function getMaxPoints(losses: number, draws: number) {
    const rounds = 24;
    const byes = 3;
    const perfectSeasonPts = 2 * rounds;

    const pointsLost = perfectSeasonPts - (2 * losses) - draws;
    const byePointsToAdd = 2 * byes;
    
    return pointsLost + byePointsToAdd;
}

function getPointCells(min: number, max: number, currentPts: number, maxPoints: number, nickname: string) {
    const pointCells = [];
    const bgClass = `bg-${nickname} font-semibold ${nickname === 'broncos' ? 'text-black' : 'text-white'}`;

    for (let i = min; i <= max; i++) {
        if (i >= currentPts && i <= maxPoints) {
            pointCells.push(
                <td style={{width: '10px'}} className={bgClass}>
                    {i === currentPts || i === maxPoints ? i : ''}
                </td>
            )
        }
        else {
            pointCells.push(
                <td style={{width: '10px'}}></td>
            )
        }
    }
    
    return pointCells;
}

function getTableRows(teamList: Array<TeamData>, firstPlaceMaxPts: number, lastPlacePts: number) {
    return teamList.map((team: TeamData) => {
        const currentPoints = team.stats.points;
        const maxPoints = getMaxPoints(team.stats.lost, team.stats.drawn);
        const cssNickname = team.teamNickname.toLowerCase().replace(' ', '');
        
        return (
            <tr key={team.teamNickname} className="text-md text-center">
                <td style={{width: '15%'}} className="text-left font-semibold">{team.teamNickname}</td>
                {
                    getPointCells(
                        lastPlacePts, firstPlaceMaxPts, currentPoints, maxPoints, cssNickname
                    )
                }
            </tr>
        ) 
    });
}
