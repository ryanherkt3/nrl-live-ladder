import LadderRow from "./ladder-row";
import { TeamData, Match } from "../lib/definitions";
import Fixtures from "./fixtures";
import ByeToggleSection from "./byetoggle";
import { useState } from "react";

export default function Ladder({nrlInfo}: {nrlInfo: any}) {
    const [allTeams, setAllTeams] = useState(nrlInfo.ladder.positions);
    const [byePoints, setByePoints] = useState(true);

    const currentRound = nrlInfo.draw;
    const fixtures = currentRound.fixtures;

    const liveMatch = fixtures.filter((fixture: Match) => {
        return fixture.matchMode === 'Live';
    })[0];

    const updateAllTeams = (showByes: boolean) => {
        setAllTeams(allTeams.sort((a: TeamData, b: TeamData) => {
            if (liveMatch) {
                if (b.liveStats && a.liveStats) {
                    if (byePoints) {
                        return b.liveStats.points - a.liveStats.points || 
                            b.liveStats['points difference'] - a.liveStats['points difference'];
                    }

                    return b.liveStats.noByePoints - a.liveStats.noByePoints || 
                        b.liveStats['points difference'] - a.liveStats['points difference'];
                }
                    
                if (a.liveStats) {
                    if (showByes) {
                        return b.stats.points - a.liveStats.points || 
                            b.stats['points difference'] - a.liveStats['points difference'];
                    }

                    return b.stats.noByePoints - a.liveStats.noByePoints || 
                        b.stats['points difference'] - a.liveStats['points difference'];
                }
                
                if (b.liveStats) {
                    if (showByes) {
                        return b.liveStats.points - a.stats.points || 
                            b.liveStats['points difference'] - a.stats['points difference'];
                    }

                    return b.liveStats.noByePoints - a.stats.noByePoints || 
                        b.liveStats['points difference'] - a.stats['points difference'];
                }
            }
            
            if (showByes) {
                return b.stats.points - a.stats.points || 
                    b.stats['points difference'] - a.stats['points difference'];
            }

            return b.stats.noByePoints - a.stats.noByePoints || 
                b.stats['points difference'] - a.stats['points difference'];
        }));
    }

    // Update ladder based on live match before rendering it
    const [homeScore, setHomeScore] = useState(-1);
    const [awayScore, setAwayScore] = useState(-1);

    if (liveMatch) {
        // Only update stats if either score has changed
        if (liveMatch.homeTeam.score !== homeScore || liveMatch.awayTeam.score !== awayScore) {
            if (liveMatch.homeTeam.score !== homeScore) {
                setHomeScore(liveMatch.homeTeam.score);
            }
            if (liveMatch.awayTeam.score !== awayScore) {
                setAwayScore(liveMatch.awayTeam.score);                
            }            
            
            const playingTeams = allTeams.filter((team: TeamData) => {
                return liveMatch.awayTeam.nickName === team.teamNickname ||
                    liveMatch.homeTeam.nickName === team.teamNickname;
            });

            for (const team of playingTeams) {
                team.designation = liveMatch.homeTeam.nickName === team.teamNickname ? 'homeTeam' : 'awayTeam';
                setTeamStats(team, liveMatch);
            }
    
            updateAllTeams(byePoints);
        }        
    }

    const updateByePoints = (newValue: boolean) => {
        if (newValue === byePoints) {
            return; // do not set
        }
        
        setByePoints(!byePoints);
        updateAllTeams(!byePoints);
    }
    
    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <ByeToggleSection setByeValue={byePoints} byeValueCb={updateByePoints} />
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
            <Fixtures currentRound={currentRound} fixtures={fixtures} ladder={allTeams} />
        </div>
    );
}

function setTeamStats(team: TeamData, match: Match) {
    const draw = match.homeTeam.score === match.awayTeam.score;
    const homeTeamWinning = match.homeTeam.score > match.awayTeam.score;
    const awayTeamWinning = match.homeTeam.score < match.awayTeam.score;        
    
    const isHomeTeam = team.designation === 'homeTeam';

    // Set team's live stats if not defined (deep clone team.stats - no reference to it)
    if (!team.liveStats) {
        team.liveStats = JSON.parse(JSON.stringify(team.stats));
    }

    team.liveStats.played = team.stats.played + 1;

    team.liveStats.wins = (isHomeTeam && homeTeamWinning) || (!isHomeTeam && awayTeamWinning) ? 
        (team.stats.wins + 1) : team.stats.wins;

    team.liveStats.drawn = draw ? (team.stats.drawn + 1) : team.stats.drawn;

    team.liveStats.lost = (isHomeTeam && !homeTeamWinning && !draw) || (!isHomeTeam && !awayTeamWinning && !draw) ?
        (team.stats.lost + 1) : team.stats.lost;
    
    team.liveStats['points for'] = team.stats['points for'] + (
        isHomeTeam ? match.homeTeam.score : match.awayTeam.score
    );
    team.liveStats['points against'] = team.stats['points against'] + (
        isHomeTeam ? match.awayTeam.score : match.homeTeam.score
    );
    team.liveStats['points difference'] = team.liveStats['points for'] - team.liveStats['points against'];
    
    team.liveStats.points = isHomeTeam ? 
        (homeTeamWinning ? (team.stats.points + 2) : 
            (draw ? (team.stats.points + 1) : team.stats.points)) :
        (awayTeamWinning ? (team.stats.points + 2) : 
                (draw ? (team.stats.points + 1) : team.stats.points));

    team.liveStats.byes = team.stats.byes;
    team.liveStats.noByePoints = (team.liveStats.wins * 2) + team.liveStats.drawn;    
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
        />;
    })
}
