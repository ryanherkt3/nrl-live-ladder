import LadderRow from "./ladder-row";
import { TeamData, Match, DrawInfo, FilteredTeam } from "../../lib/definitions";
import Fixtures from "../fixture/fixtures";
import ByeToggleSection from "../bye-toggle";
import { useState } from "react";
import { NUMS } from "@/app/lib/utils";
import { constructTeamData, constructTeamStats, teamSortFunction } from "@/app/lib/nrl-draw-utils";

export default function Ladder({nrlInfo}: {nrlInfo: any}) {
    nrlInfo = Object.values(nrlInfo);

    // Construct list of teams manually
    const teamList: Array<TeamData> = constructTeamData(nrlInfo[0].filterTeams);
    
    // Get current round number
    const currentRoundInfo: Array<DrawInfo> = nrlInfo.filter((round: any) => {
        return round.byes[0].isCurrentRound
    });

    const currentRoundNo = currentRoundInfo[0].selectedRoundId;

    const updateAllTeams = (showByes: boolean) => {
        setAllTeams(allTeams.sort((a: TeamData, b: TeamData) => {
            return teamSortFunction(showByes, a, b)
        }));
    }
    
    const drawInfo = currentRoundInfo[0];
    const fixtures = drawInfo.fixtures;

    const liveMatch = fixtures.filter((fixture: Match) => {
        return fixture.matchMode === 'Live';
    });

    const updateByePoints = (newValue: boolean) => {
        // Do not set if the value is the same
        if (newValue === byePoints) {
            return; 
        }
        
        setByePoints(newValue);
        updateAllTeams(newValue);
    }

    const [byePoints, setByePoints] = useState(true);
    
    const [allTeams, setAllTeams] = useState(
        constructTeamStats(nrlInfo, currentRoundNo, teamList)
            .sort((a: TeamData, b: TeamData) => {
                return teamSortFunction(byePoints, a, b)
            })
    );

    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <div className="text-center text-xl">Ladder auto-updates every few seconds</div>
            {
                // Do not show bye toggle if in first or last round
                [1, NUMS.ROUNDS].includes(currentRoundNo) ? 
                    null : 
                    <ByeToggleSection setByeValue={byePoints} byeValueCb={updateByePoints} />
            }
            <div>
                <div className="flex flex-row gap-2 text-xl pb-4 font-semibold text-center">
                    <div className="w-[10%] md:w-[5%]">#</div>
                    <div className="hidden sm:block w-[15%] sm:w-[8%]">Team</div>
                    <div className="w-[25%] sm:w-[15%]"></div>
                    <div className="w-[15%] sm:w-[6%]">P</div>
                    <div className="hidden sm:block sm:w-[6%]">W</div>
                    <div className="hidden sm:block sm:w-[6%]">D</div>
                    <div className="hidden sm:block sm:w-[6%]">L</div>
                    <div className="hidden sm:block sm:w-[6%]">B</div>
                    <div className="hidden md:block w-[6%]">PF</div>
                    <div className="hidden md:block w-[6%]">PA</div>
                    <div className="hidden xs:block w-[15%] sm:w-[6%]">PD</div>
                    <div className="w-[25%] sm:w-[15%] md:w-[8%]">Next</div>
                    <div className="w-[15%] sm:w-[6%]">Pts</div>
                </div>
                {
                    getLadderRow(allTeams.slice(0, NUMS.FINALS_TEAMS), liveMatch, 1, byePoints, drawInfo)
                }
                <div className="border-2 border-green-400"></div>
                {
                    getLadderRow(
                        allTeams.slice(NUMS.FINALS_TEAMS), 
                        liveMatch, 
                        NUMS.FINALS_TEAMS + 1, 
                        byePoints,
                        drawInfo
                    )
                }
            </div>
            <Fixtures drawInfo={drawInfo} fixtures={fixtures} ladder={allTeams} />
        </div>
    );
}

function getLadderRow(
    teamList: Array<TeamData>,
    liveMatch: Array<Match> | undefined,
    indexAdd: number,
    byePoints: boolean,
    drawInfo: DrawInfo,
) {
    return teamList.map((team: TeamData) => {
        let isPlaying = false;

        if (liveMatch) {
            for (const match of liveMatch) {
                isPlaying = match.awayTeam.nickName === team.teamNickname ||
                    match.homeTeam.nickName === team.teamNickname;
                    
                if (isPlaying) {
                    break;
                }
            }
        }

        const ladderPos = teamList.indexOf(team) + indexAdd;
        
        const filteredTeamInfo = drawInfo.filterTeams.filter((filterTeam: FilteredTeam) => {
            return team.theme.key.replace('-', ' ') === filterTeam.name.toLowerCase()
        });

        return <LadderRow
            key={team.theme.key}
            teamData={team}
            position={ladderPos.toString()}
            isPlaying={isPlaying}
            byePoints={byePoints}
            teamId={filteredTeamInfo[0].value}
        />;
    })
}
