import { Metadata } from "next";
import { getNRLInfo, getShortCode } from "../lib/utils";
import { TeamData } from "../lib/definitions";

export const metadata: Metadata = {
    title: 'NRL Max Points',
}

export default async function MaxPointsPage() {
    let nrlInfo = await getNRLInfo();
    
    let allTeams = nrlInfo.ladder.positions;
    
    const topTeams = [...allTeams];
    const bottomTeams = topTeams.splice(8);

    const firstPlaceMaxPts = getMaxPoints(topTeams[0].stats.lost, topTeams[0].stats.drawn);
    const lastPlacePts = allTeams[allTeams.length - 1].stats.points;

    const thClass = 'table-cell md:hidden text-centre md:text-left pb-4 font-semibold';

    return (
        <div className="px-6 py-8 flex flex-col gap-6 page-min-height">
            <div className="text-xl font-semibold text-center">
                See where your team stands in the race for Finals Football
            </div>
            <table>
                <tbody>
                    <tr className="text-md font-semibold text-center">
                        <th style={{width: '15%'}} className="text-left pb-4 font-semibold">Team</th>
                        <th className="hidden md:table-cell text-left pb-4 font-semibold">Points</th>
                        <th style={{width: '20%'}} className={thClass}>Points</th>
                        <th style={{width: '20%'}} className={thClass}>Max</th>
                        <th style={{width: '20%'}} className={thClass}>Best</th>
                    </tr>
                    {
                        getTableRows(topTeams, firstPlaceMaxPts, lastPlacePts, allTeams)
                    }
                    <tr style={{width: '100%'}} className="border-4 border-green-400"></tr>
                    {
                        getTableRows(bottomTeams, firstPlaceMaxPts, lastPlacePts, allTeams)
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

function getTableRows(
    teamList: Array<TeamData>,
    firstPlaceMaxPts: number,
    lastPlacePts: number,
    allTeams: Array<TeamData>
) {
    return teamList.map((team: TeamData) => {
        const currentPoints = team.stats.points;
        const maxPoints = getMaxPoints(team.stats.lost, team.stats.drawn);
        const cssNickname = team.teamNickname.toLowerCase().replace(' ', '');

        const bestFinish = allTeams.filter((team2: TeamData) => {
            return maxPoints < team2.stats.points;
        }).length + 1;
        
        return (
            <tr key={team.teamNickname} className="text-md text-center">
                <td style={{width: '15%'}} className="text-left font-semibold">
                    <span className="hidden md:block">{team.teamNickname}</span>
                    <span className="block md:hidden">
                        {
                            getShortCode(team.teamNickname)
                        }
                    </span>
                </td>
                {
                    getPointCells(
                        lastPlacePts, firstPlaceMaxPts, currentPoints, maxPoints, cssNickname, bestFinish
                    )
                }
            </tr>
        ) 
    });
}

function getPointCells(
    min: number,
    max: number,
    currentPts: number,
    maxPoints: number,
    nickname: string,
    bestFinish: number,
) {
    const pointCells = [];
    
    // TODO if qualified put (T2/4/8 next to name)
    const bgClass = `hidden md:table-cell ${bestFinish >= 9 ? 'bg-faded' : `bg-${nickname}`} font-semibold ${nickname === 'broncos' && bestFinish < 9 ? 'text-black' : 'text-white'}`;

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
                <td style={{width: '10px'}} className='hidden md:table-cell'></td>
            )
        }
    }

    const tdClass = 'table-cell md:hidden text-centre md:text-left pb-1 font-semibold';
    pointCells.push(
        <td style={{width: '20%'}} className={tdClass}>{currentPts}</td>,
        <td style={{width: '20%'}} className={tdClass}>{maxPoints}</td>,
        <td style={{width: '20%'}} className={tdClass}>
            {
                convertNumberToPosition(bestFinish)
            }
        </td>,
    )
    
    return pointCells;
}

function convertNumberToPosition(pos: number) {
    switch(pos) {
        case 1:
            return `1st`;
        case 2:
            return `2nd`;
        case 3:
            return `3rd`;
        default:
            return `${pos}th`;
    }
}
