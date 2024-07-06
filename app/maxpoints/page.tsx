import { Metadata } from "next";
import { getNRLInfo, getShortCode } from "../lib/utils";
import { TeamData } from "../lib/definitions";
import clsx from "clsx";

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

    const minPointsForSpots = {
        t2: getMaxPoints(topTeams[1].stats.lost, topTeams[1].stats.drawn),
        t4: getMaxPoints(topTeams[4].stats.lost, topTeams[4].stats.drawn),
        t8: getMaxPoints(bottomTeams[0].stats.lost, bottomTeams[0].stats.drawn),
        elim: topTeams[7].stats.points,
    };

    const thClass = 'table-cell md:hidden text-centre md:text-left pb-4 font-semibold w-[20%]';

    return (
        <div className="px-6 py-8 flex flex-col gap-6 page-min-height">
            <div className="text-xl font-semibold text-center">
                See where your team stands in the race for Finals Football
            </div>
            <table>
                <tbody>
                    <tr className="text-md font-semibold text-center">
                        <th className="text-left pb-4 font-semibold w-[15%]">Team</th>
                        <th className="hidden md:table-cell text-left pb-4 font-semibold">Points</th>
                        <th className={thClass}>Points</th>
                        <th className={thClass}>Max</th>
                        <th className={thClass}>Best</th>
                    </tr>
                    {
                        getTableRows(topTeams, firstPlaceMaxPts, lastPlacePts, allTeams, minPointsForSpots)
                    }
                    <tr style={{width: '100%'}} className="border-4 border-green-400"></tr>
                    {
                        getTableRows(bottomTeams, firstPlaceMaxPts, lastPlacePts, allTeams, minPointsForSpots)
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
    allTeams: Array<TeamData>,
    minPointsForSpots: any // TODO fix type
) {
    return teamList.map((team: TeamData) => {
        const currentPoints = team.stats.points;
        const maxPoints = getMaxPoints(team.stats.lost, team.stats.drawn);
        const cssNickname = team.teamNickname.toLowerCase().replace(' ', '');

        const bestFinish = allTeams.filter((team2: TeamData) => {
            return maxPoints < team2.stats.points;
        }).length + 1;

        // Display if a team is eliminated, qualified for finals football, or in the top 2/4 of the ladder
        let qualificationStatus = '';
        if (maxPoints < minPointsForSpots.elim) {
            qualificationStatus = '(E)';
        }
        else if (currentPoints > minPointsForSpots.t2) {
            qualificationStatus = '(T2)';
        }
        else if (currentPoints > minPointsForSpots.t4) {
            qualificationStatus = '(T4)';
        }
        else if (currentPoints > minPointsForSpots.t8) {
            qualificationStatus = '(Q)';
        }
        
        return (
            <tr key={team.teamNickname} className="text-md text-center">
                <td className="text-left font-semibold w-[15%]">
                    <span className="hidden md:block">{team.teamNickname} {qualificationStatus}</span>
                    <span className="block md:hidden">
                        { getShortCode(team.teamNickname) } {qualificationStatus}
                    </span>
                </td>
                {
                    getPointCells(
                        lastPlacePts, firstPlaceMaxPts, currentPoints, 
                        maxPoints, cssNickname, bestFinish, qualificationStatus
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
    qualificationStatus: string,
) {
    const pointCells = [];
    const isEliminated = qualificationStatus.includes('E');

    let commonClasses = 'hidden md:table-cell w-[10px]';
    
    for (let i = min; i <= max; i++) {
        if (i >= currentPts && i <= maxPoints) {
            const broncosAndNotEliminated = nickname === 'broncos' && !isEliminated;
            pointCells.push(
                <td 
                    className={
                        clsx(
                            `${commonClasses} font-semibold`,
                            {
                                'bg-faded': isEliminated,
                                [`bg-${nickname}`]: !isEliminated,
                                'text-black': broncosAndNotEliminated,
                                'text-white': !broncosAndNotEliminated,
                            }
                        )        
                    }
                >
                    {i === currentPts || i === maxPoints ? i : ''}
                </td>
            )
        }
        else {
            pointCells.push(
                <td className={commonClasses}></td>
            )
        }
    }

    const tdClass = 'table-cell md:hidden text-centre md:text-left pb-1 font-semibold w-[20%]';
    pointCells.push(
        <td className={tdClass}>{currentPts}</td>,
        <td className={tdClass}>{maxPoints}</td>,
        <td className={tdClass}>
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
