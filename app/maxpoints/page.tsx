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

    return (
        <div className="px-6 py-8 flex flex-col gap-6 page-min-height">
            <div className="text-xl font-semibold text-center">
                See where your team stands in the race for Finals Football
            </div>
            <div className="flex flex-col">
                {
                    getTableRows(topTeams, firstPlaceMaxPts, lastPlacePts, allTeams, minPointsForSpots)
                }
                <div className="border-4 border-green-400"></div>
                {
                    getTableRows(bottomTeams, firstPlaceMaxPts, lastPlacePts, allTeams, minPointsForSpots)
                }
            </div>
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
        
        const nickname = team.teamNickname;
        const cssNickname = nickname.toLowerCase().replace(' ', '');

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
            <div key={nickname} className="flex flex-row text-md text-center">
                <div className="text-left flex items-center font-semibold w-[15%] mr-4">
                    <span className="hidden md:block">
                        {
                            nickname === 'Wests Tigers' ? 'Tigers' : nickname
                        } {qualificationStatus}
                    </span>
                    <span className="block md:hidden">
                        { getShortCode(nickname) } {qualificationStatus}
                    </span>
                </div>
                {
                    getPointCells(
                        lastPlacePts, firstPlaceMaxPts, currentPoints, 
                        maxPoints, cssNickname, qualificationStatus
                    )
                }
            </div>
        ) 
    });
}

function getPointCells(
    min: number,
    max: number,
    currentPts: number,
    maxPoints: number,
    nickname: string,
    qualificationStatus: string,
) {
    const pointCells = [];
    const isEliminated = qualificationStatus.includes('E');

    let commonClasses = 'w-[2%] sm:w-[2.5%] sm:w-[3%] py-1';
    
    for (let i = min; i <= max; i++) {
        if (i >= currentPts && i <= maxPoints) {
            const broncosAndNotEliminated = nickname === 'broncos' && !isEliminated;
            pointCells.push(
                <div 
                    className={
                        clsx(
                            `${commonClasses} relative font-semibold`,
                            {
                                'bg-faded': isEliminated,
                                [`bg-${nickname}`]: !isEliminated,
                                'text-black': broncosAndNotEliminated,
                                'text-white': !broncosAndNotEliminated,
                            }
                        )        
                    }
                >
                    <span 
                        className={
                            clsx(
                                {
                                    'left-2': i === currentPts,
                                    'right-5 sm:right-3 md:right-2': i === maxPoints,
                                    'absolute z-20': i === currentPts || i === maxPoints,
                                    'relative': i !== currentPts || i !== maxPoints,
                                }
                            )        
                        }
                    >
                        {i === currentPts || i === maxPoints ? i : ''}
                    </span>
                </div>
            )
        }
        else {
            pointCells.push(
                <div className={commonClasses}></div>
            )
        }
    }
    
    return pointCells;
}
