import LadderRow from "./ladder-row";
import { TeamData, Match } from "../lib/definitions";
import Fixtures from "./fixtures";
import ByeToggleSection from "./byetoggle";
// import { useState } from "react";

export default function Ladder({nrlInfo}: {nrlInfo: any}) {
    let allTeams = nrlInfo.ladder.positions;

    const currentRound = nrlInfo.draw;
    const fixtures = currentRound.fixtures;

    const liveMatch = fixtures.filter((fixture: Match) => {
        return fixture.matchMode === 'Live';
    })[0];

    // Update ladder based on live match before rendering it
    if (liveMatch) {
        const activeTeams = allTeams.filter((team: TeamData) => {
            team.designation = liveMatch.homeTeam.nickName === team.teamNickname ? 'homeTeam' : 'awayTeam';
            
            return liveMatch.awayTeam.nickName === team.teamNickname ||
                liveMatch.homeTeam.nickName === team.teamNickname;
        });

        const draw = liveMatch.homeTeam.score === liveMatch.awayTeam.score;
        const homeTeamWinning = liveMatch.homeTeam.score > liveMatch.awayTeam.score;
        const awayTeamWinning = liveMatch.homeTeam.score < liveMatch.awayTeam.score;

        // Only updating stats that are displayed on the ladder
        for (const team of activeTeams) {
            const isHomeTeam = team.designation === 'homeTeam';
            
            team.stats.played = team.stats.played + 1;
            team.stats.wins = isHomeTeam ? 
                (homeTeamWinning ? (team.stats.wins + 1) : team.stats.wins) :
                (awayTeamWinning ? (team.stats.wins + 1) : team.stats.wins);
            team.stats.drawn = draw ? (team.stats.drawn + 1) : team.stats.drawn;
            team.stats.lost = isHomeTeam ? 
                (!homeTeamWinning ? (team.stats.lost + 1) : team.stats.lost) :
                (!awayTeamWinning ? (team.stats.lost + 1) : team.stats.lost);
            
            team.stats['points for'] = team.stats['points for'] + (
                isHomeTeam ? liveMatch.homeTeam.score : liveMatch.awayTeam.score
            );
            team.stats['points against'] = team.stats['points against'] + (
                isHomeTeam ? liveMatch.awayTeam.score : liveMatch.homeTeam.score
            );
            team.stats['points difference'] = team.stats['points for'] - team.stats['points against'];
            
            team.stats.points = isHomeTeam ? 
                (homeTeamWinning ? 
                    (team.stats.points + 2) : 
                    (draw ? (team.stats.points + 1) : team.stats.points)) :
                (awayTeamWinning ? 
                        (team.stats.points + 2) : 
                        (draw ? (team.stats.points + 1) : team.stats.points)) ;
        }

        allTeams = allTeams.sort((a: TeamData, b: TeamData) => {
            return b.stats.points - a.stats.points || b.stats['points difference'] - a.stats['points difference'];
        });
    }

    // const [byePoints, setByePoints] = useState(false);
    let byePoints = false;

    const updateByePoints = (val: boolean) => {
        // setByePoints(val);
        // setAllTeams(allTeams.sort((a: TeamData, b: TeamData) => {
        //     const diffSort = b.stats['points difference'] - a.stats['points difference'];
        //     const ptsSort = byePoints ? b.stats.points - a.stats.points : b.stats.noByePoints - a.stats.noByePoints;
            
        //     return ptsSort || diffSort;
        // }));
    }

    return (
        <>
            {/* <ByeToggleSection setByeValue={byePoints} byeValueCb={updateByePoints} /> */}
            <div>
                <div className="flex flex-row gap-2 text-xl pb-4 font-semibold text-center">
                    <div className="w-[10%] md:w-[5%]">Pos</div>
                    <div className="w-[15%] sm:w-[8%]">Team</div>
                    <div className="w-[25%] sm:w-[15%]"></div>
                    <div className="w-[9%] sm:w-[6%]">Pld</div>
                    <div className="hidden sm:block sm:w-[6%]">W</div>
                    <div className="hidden sm:block sm:w-[6%]">D</div>
                    <div className="hidden sm:block sm:w-[6%]">L</div>
                    <div className="hidden sm:block sm:w-[6%]">B</div>
                    <div className="hidden md:block w-[6%]">PF</div>
                    <div className="hidden md:block w-[6%]">PA</div>
                    <div className="w-[9%] sm:w-[6%]">PD</div>
                    <div className="w-[15%] md:w-[8%]">Next</div>
                    <div className="w-[9%] sm:w-[6%]">Pts</div>
                </div>
                {
                    getLadderRow(allTeams.slice(0,8), liveMatch, 1, byePoints)
                }
                <div className="border-2 border-green-400"></div>
                {
                    getLadderRow(allTeams.slice(8), liveMatch, 9, byePoints)
                }
            </div>
            <Fixtures currentRound={currentRound} fixtures={fixtures} />
        </>
    );
}

function getLadderRow(teamList: Array<TeamData>, liveMatch: Match | undefined, indexAdd: number, byePoints: boolean) {
    return teamList.map((team: TeamData) => {
        let isPlaying = false;

        if (liveMatch) {
            isPlaying = liveMatch.awayTeam.nickName === team.teamNickname ||
                liveMatch.homeTeam.nickName === team.teamNickname;
        }

        team.stats.noByePoints = (team.stats.wins * 2) + team.stats.drawn;

        const ladderPos = teamList.indexOf(team) + indexAdd;
        return <LadderRow
            key={team.theme.key}
            data={team}
            position={ladderPos.toString()}
            isPlaying={isPlaying}    
            byePoints={byePoints}    
        />
    })
}
