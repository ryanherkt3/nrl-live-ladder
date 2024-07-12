import LadderRow from "./ladder-row";
import { TeamData, Match, APIInfo, DrawInfo, FilteredTeam, ByeTeam } from "../../lib/definitions";
import Fixtures from "../fixture/fixtures";
import ByeToggleSection from "../bye-toggle";
import { useState } from "react";

export default function Ladder({nrlInfo}: {nrlInfo: APIInfo}) {
    const [allTeams, setAllTeams] = useState(nrlInfo.ladder.positions);
    const [byePoints, setByePoints] = useState(true);
    let liveStatsUpdated = false;

    const drawInfo = nrlInfo.draw;
    const fixtures = drawInfo.fixtures;
    const currentRound = drawInfo.selectedRoundId;

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

    // Do not update ladder if finals football is on 
    const isFinalsFootball = currentRound > 27;

    // Update ladder based on live match before rendering it
    const [homeScore, setHomeScore] = useState(-1);
    const [awayScore, setAwayScore] = useState(-1);

    if (liveMatch && !isFinalsFootball) {
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
                updateTeamStats(true, team, liveMatch);
            }
    
            updateAllTeams(byePoints);
        }        
    }

    const updateByePoints = (newValue: boolean) => {
        // Do not set if the value is the same
        if (newValue === byePoints) {
            return; 
        }
        
        setByePoints(newValue);
        updateAllTeams(newValue);
    }

    // Update ladder if match is completed, but API not updated with result (bug appears on page refresh)
    const completedMatches = fixtures.filter((fixture: Match) => {
        return fixture.matchMode === 'Post' && fixture.matchState === 'FullTime';
    });
    const lastFinishedMatch = completedMatches[completedMatches.length - 1];

    if (lastFinishedMatch && !isFinalsFootball) {
        const teams = allTeams.filter((team: TeamData) => {
            team.designation = lastFinishedMatch.homeTeam.nickName === team.teamNickname ? 'homeTeam' : 'awayTeam';

            const homeTeam = lastFinishedMatch.homeTeam;
            const awayTeam = lastFinishedMatch.awayTeam;
            const ladderStatsNotUpdated = currentRound - team.stats.played - team.stats.byes === 1;

            return (homeTeam.nickName === team.teamNickname && ladderStatsNotUpdated) ||
                (awayTeam.nickName === team.teamNickname && ladderStatsNotUpdated);
        });

        if (teams.length && !liveStatsUpdated) {
            for (const team of teams) {
                updateTeamStats(false, team, lastFinishedMatch);
            }
            updateAllTeams(byePoints);
            liveStatsUpdated = true;
        }
    }

    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            {
                // Do not show bye toggle if in first or last round
                [1, 27].includes(currentRound) ? 
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
                    getLadderRow(allTeams.slice(0,8), liveMatch, 1, byePoints, currentRound, drawInfo)
                }
                <div className="border-2 border-green-400"></div>
                {
                    getLadderRow(allTeams.slice(8), liveMatch, 9, byePoints, currentRound, drawInfo)
                }
            </div>
            <Fixtures drawInfo={drawInfo} fixtures={fixtures} ladder={allTeams} />
        </div>
    );
}

function updateTeamStats(updateLive: boolean, team: TeamData, match: Match) {
    const isHomeTeam = team.designation === 'homeTeam';
    const draw = match.homeTeam.score === match.awayTeam.score;
    const homeTeamWinning = match.homeTeam.score > match.awayTeam.score;
    const awayTeamWinning = match.homeTeam.score < match.awayTeam.score;

    const homeWin = isHomeTeam && homeTeamWinning;
    const awayWin = !isHomeTeam && awayTeamWinning;
    const winning = homeWin || awayWin;

    const homeLost = isHomeTeam && !homeTeamWinning && !draw;
    const awayLost = !isHomeTeam && homeTeamWinning;
    const losing = homeLost || awayLost;

    // Set team's live stats if not defined (deep clone team.stats - no reference to it)
    if (!team.liveStats) {
        team.liveStats = JSON.parse(JSON.stringify(team.stats));
    }

    const statsToUpdate = updateLive ? team.liveStats : team.stats;

    if (updateLive) {
        if (team.liveStats.played === team.stats.played) {
            team.liveStats.played += 1;
        }

        if (team.liveStats.wins - team.stats.wins === 1 && !winning) {
            // Win to draw/loss
            team.liveStats.wins = team.liveStats.wins - 1;
        }
        else if (team.liveStats.wins === team.stats.wins && winning) {
            // Draw/loss to win
            team.liveStats.wins = team.liveStats.wins + 1;
        }

        if (team.liveStats.drawn === team.stats.drawn && draw) {
            // Win/loss to draw
            team.liveStats.drawn = team.liveStats.drawn + 1;
        }
        else if (team.liveStats.drawn - team.stats.drawn === 1 && !draw) {
            // Draw to win/loss
            team.liveStats.drawn = team.liveStats.drawn - 1;
        }

        if (team.liveStats.lost - team.stats.lost === 1 && (draw || winning)) {
            // Loss to win/draw
            team.liveStats.lost = team.liveStats.lost - 1;
        }
        else if (team.liveStats.lost === team.stats.lost && losing) {
            // Win/draw to loss
            team.liveStats.lost = team.liveStats.lost + 1;
        }

        team.liveStats['points for'] = team.stats['points for'] + (
            isHomeTeam ? match.homeTeam.score : match.awayTeam.score
        );
        team.liveStats['points against'] = team.stats['points against'] + (
            isHomeTeam ? match.awayTeam.score : match.homeTeam.score
        );
        team.liveStats['points difference'] = team.liveStats['points for'] - team.liveStats['points against'];

        if (team.liveStats.points === team.stats.points) {
            if (winning) {
                // Loss to win
                team.liveStats.points = team.liveStats.points + 2;
            }
            else if (draw) {
                // Loss to draw
                team.liveStats.points = team.liveStats.points + 1;
            }
        } 
        else if ((team.liveStats.points - team.stats.points === 2 && draw) || 
            (team.liveStats.points - team.stats.points === 1 && losing)) {
            // 1. Win to draw
            // 2. Draw to loss
            team.liveStats.points = team.liveStats.points - 1;
        } 
        else if (team.liveStats.points - team.stats.points === 1 && winning) {
            // Draw to win
            team.liveStats.points = team.liveStats.points + 1;
        }
    }
    else {
        const teamScore = (isHomeTeam ? match.homeTeam.score : match.awayTeam.score) || 0;
        const oppScore = (isHomeTeam ? match.awayTeam.score : match.homeTeam.score) || 0;
        
        team.stats.played += 1;
        team.stats.wins = winning ? team.stats.wins + 1 : team.stats.wins;
        team.stats.drawn = draw ? team.stats.drawn + 1 : team.stats.drawn;
        team.stats.lost = losing ? team.stats.lost + 1 : team.stats.lost;
        team.stats['points for'] += teamScore;
        team.stats['points against'] += oppScore;
        team.stats['points difference'] += teamScore - oppScore;
        team.stats.points = winning ?
            team.stats.points + 2 :
            (draw ? team.stats.points + 1 : team.stats.points);
    }

    statsToUpdate.byes = statsToUpdate.byes;
    statsToUpdate.noByePoints = (statsToUpdate.wins * 2) + statsToUpdate.drawn;
}

function getLadderRow(
    teamList: Array<TeamData>,
    liveMatch: Match | undefined,
    indexAdd: number,
    byePoints: boolean,
    currentRound: number,
    drawInfo: DrawInfo,
) {
    return teamList.map((team: TeamData) => {
        let isPlaying = false;

        if (liveMatch) {
            isPlaying = liveMatch.awayTeam.nickName === team.teamNickname ||
                liveMatch.homeTeam.nickName === team.teamNickname;
        }

        team.stats.noByePoints = (team.stats.wins * 2) + team.stats.drawn;

        const ladderPos = teamList.indexOf(team) + indexAdd;
        
        const filteredTeamInfo = drawInfo.filterTeams.filter((filterTeam: FilteredTeam) => {
            return team.theme.key.replace('-', ' ') === filterTeam.name.toLowerCase()
        });

        const isOnBye = !!(
            drawInfo.byes.filter((filterTeam: ByeTeam) => {
                return filterTeam.theme.key === team.theme.key
            }).length
        );

        return <LadderRow
            key={team.theme.key}
            teamData={team}
            position={ladderPos.toString()}
            isPlaying={isPlaying}
            isOnBye={isOnBye}
            byePoints={byePoints}
            currentRound={currentRound}
            teamId={filteredTeamInfo[0].value}
        />;
    })
}
