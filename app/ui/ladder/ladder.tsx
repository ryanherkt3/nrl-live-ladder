import LadderRow from "./ladder-row";
import { TeamData, Match, DrawInfo } from "../../lib/definitions";
import Fixtures from "../fixture/fixtures";
import ByeToggleSection from "../bye-toggle";
import { useState } from "react";
import { NUMS } from "@/app/lib/utils";
import { constructTeamData, constructTeamStats, teamSortFunction } from "@/app/lib/nrl-draw-utils";

// TODO fix type
export default function Ladder({seasonDraw}: {seasonDraw: any}) {
    seasonDraw = Object.values(seasonDraw);

    // Construct list of teams manually
    const teamList: Array<TeamData> = constructTeamData(seasonDraw[0].filterTeams);
    
    // Get current round number (TODO fix type)
    const currentRoundInfo: Array<DrawInfo> = seasonDraw.filter((round: any) => {
        return round.byes[0].isCurrentRound
    });

    const {byes, fixtures, selectedRoundId: currentRoundNo} = currentRoundInfo[0];

    const updateAllTeams = (showByes: boolean) => {
        allTeams = allTeams.sort((a: TeamData, b: TeamData) => {
            return teamSortFunction(showByes, a, b)
        });
    }

    let nextRoundInfo;
    if (currentRoundNo < NUMS.ROUNDS) {
        nextRoundInfo = seasonDraw[currentRoundNo];
    }

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
    
    let allTeams = constructTeamStats(seasonDraw, currentRoundNo, teamList)
        .sort((a: TeamData, b: TeamData) => {
            return teamSortFunction(byePoints, a, b)
        });

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
                {
                    getLadderRow(
                        allTeams.slice(0, NUMS.FINALS_TEAMS),
                        liveMatch,
                        1,
                        byePoints,
                        currentRoundNo,
                        fixtures,
                        nextRoundInfo
                    )
                }
                <div className="border-2 border-green-400"></div>
                {
                    getLadderRow(
                        allTeams.slice(NUMS.FINALS_TEAMS), 
                        liveMatch, 
                        NUMS.FINALS_TEAMS + 1, 
                        byePoints,
                        currentRoundNo,
                        fixtures,
                        nextRoundInfo
                    )
                }
            </div>
            <Fixtures roundNum={currentRoundNo} byes={byes} fixtures={fixtures} ladder={allTeams} />
        </div>
    );
}

/**
 * Get a row in the ladder
 *
 * @param {Array<TeamData>} teamList 
 * @param {Array<Match> | undefined} liveMatch the ongoing match(es)
 * @param {number} indexAdd the increment for the team's ladder position (1 or 9)
 * @param {boolean} byePoints 
 * @param {number} currentRoundNo
 * @param {Array<Match>} fixtures the fixture list for the current round
 * @param {DrawInfo | undefined} nextRoundInfo information about the next round if it exists
 * @returns {LadderRow} React object
 */
function getLadderRow(
    teamList: Array<TeamData>,
    liveMatch: Array<Match> | undefined,
    indexAdd: number,
    byePoints: boolean,
    currentRoundNo: number,
    fixtures: Array<Match>,
    nextRoundInfo: DrawInfo | undefined,
) {
    return teamList.map((team: TeamData) => {
        // Check if team is currently playing
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
        
        // Get team's next fixture if there is one
        let filteredFixture = null;
        let nextTeam = '';
        let nextMatchUrl = '';

        if (team.stats.played + team.stats.byes === currentRoundNo) {
            if (nextRoundInfo) {
                filteredFixture = nextRoundInfo.fixtures.filter((fixture: Match) => {
                    return team.teamNickname === fixture.homeTeam.nickName ||
                        team.teamNickname === fixture.awayTeam.nickName;
                });
            }
            else if (currentRoundNo < NUMS.ROUNDS) {
                filteredFixture = fixtures.filter((fixture: Match) => {
                    return team.teamNickname === fixture.homeTeam.nickName ||
                        team.teamNickname === fixture.awayTeam.nickName;
                });
            }
        }
        else {
            filteredFixture = fixtures.filter((fixture: Match) => {
                return team.teamNickname === fixture.homeTeam.nickName ||
                    team.teamNickname === fixture.awayTeam.nickName;
            });
        }

        const ladderPos = teamList.indexOf(team) + indexAdd;

        if (filteredFixture && filteredFixture.length) {
            nextTeam = team.teamNickname === filteredFixture[0].homeTeam.nickName ?
                filteredFixture[0].awayTeam.theme.key :
                filteredFixture[0].homeTeam.theme.key;
            nextMatchUrl = `https://nrl.com${filteredFixture[0].matchCentreUrl}`
        }
        else if (currentRoundNo < NUMS.ROUNDS) {
            nextTeam = 'BYE';
        }
        else if (ladderPos <= NUMS.FINALS_TEAMS) {
            let finalsOppLadderPos = ladderPos;

            // Finals Week 1: 1v4, 2v3, 5v8, 6v7
            switch (ladderPos) {
                case 1:
                case 5:
                    finalsOppLadderPos += 3;
                    break;
                case 4:
                case 8:
                    finalsOppLadderPos -= 3;
                    break;
                case 2:
                case 6:
                    finalsOppLadderPos += 1;
                    break;
                case 3:
                case 7:
                    finalsOppLadderPos -= 1;
                    break;
                default:
                    break;
            }
            
            nextTeam = teamList[finalsOppLadderPos - 1].theme.key;
        }

        return <LadderRow
            key={team.theme.key}
            teamData={team}
            position={ladderPos.toString()}
            isPlaying={isPlaying}
            byePoints={byePoints}
            nextTeam={nextTeam}
            nextMatchUrl={nextMatchUrl}
        />;
    })
}
