import { getNRLInfo } from "./lib/utils";
import LadderRow from "./ui/ladder-row";
import { TeamData, Match, ByeTeam } from "./lib/definitions";
import RoundFixture from "./ui/round-fixture";
import TeamImage from "./ui/team-image";

export default async function HomePage() {
    let nrlInfo = await getNRLInfo();
    
    let allTeams = nrlInfo.ladder.positions;

    const currentRound = nrlInfo.draw;
    const fixtures = currentRound.fixtures;

    const liveMatch = fixtures.filter((fixture: Match) => {
        return fixture.matchMode === 'Live';
    })[0];

    // TODO useEffect update page every 45 seconds
    // useEffect(() => {
    //     
    // }, []);

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
                (homeTeamWinning && !draw ? (team.stats.wins + 1) : team.stats.wins) :
                (awayTeamWinning && !draw ? (team.stats.wins + 1) : team.stats.wins);
            team.stats.drawn = draw ? (team.stats.drawn + 1) : team.stats.drawn;
            team.stats.lost = isHomeTeam ? 
                (!homeTeamWinning && !draw ? (team.stats.lost + 1) : team.stats.lost) :
                (!awayTeamWinning && !draw ? (team.stats.lost + 1) : team.stats.lost);
            
            team.stats['points for'] = team.stats['points for'] + (
                isHomeTeam ? liveMatch.homeTeam.score : liveMatch.awayTeam.score
            );
            team.stats['points against'] = team.stats['points against'] + (
                isHomeTeam ? liveMatch.awayTeam.score : liveMatch.homeTeam.score
            );
            team.stats['points difference'] = team.stats['points for'] - team.stats['points against'];
            
            team.stats.points = isHomeTeam ? 
                (homeTeamWinning && !draw ? (team.stats.points + 2) : team.stats.points) :
                (awayTeamWinning && !draw ? (team.stats.points + 2) : team.stats.points);
        }

        allTeams = allTeams.sort((a: TeamData, b: TeamData) => {
            return b.stats.points - a.stats.points || b.stats['points difference'] - a.stats['points difference'];
        });
    }

    const topTeams = allTeams.splice(0, 8);

    return (
        <div className="px-8 py-6 flex flex-col gap-6">
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
                    topTeams.map((team: TeamData) => {
                        let isPlaying = false;
                        
                        if (liveMatch) {
                            isPlaying = liveMatch.awayTeam.nickName === team.teamNickname ||
                                liveMatch.homeTeam.nickName === team.teamNickname;
                        }
                        
                        return <LadderRow
                            key={team.theme.key}
                            data={team}
                            position={topTeams.indexOf(team) + 1}
                            isPlaying={isPlaying}    
                        />
                    })
                }
                <div className="border-2 border-green-400"></div>
                {
                    allTeams.map((team: TeamData) => {
                        let isPlaying = false;
                        
                        if (liveMatch) {
                            isPlaying = liveMatch.awayTeam.nickName === team.teamNickname ||
                                liveMatch.homeTeam.nickName === team.teamNickname;
                        }
                        
                        return <LadderRow 
                            key={team.theme.key}
                            data={team}
                            position={allTeams.indexOf(team) + 9}
                            isPlaying={isPlaying}    
                        />
                    })
                }
            </div>

            <div className="flex flex-col gap-4">
                <div className="text-2xl font-semibold text-center">Round {currentRound.selectedRoundId} Fixtures</div>
                <div className="text-lg text-center">All fixtures are in your local timezone</div>
                {
                    fixtures.map((fixture: Match) => {
                        const homeTeamWon = fixture.homeTeam.score > fixture.awayTeam.score;
                        const awayTeamWon = fixture.homeTeam.score < fixture.awayTeam.score;

                        let winningTeam = homeTeamWon ? 'homeTeam' : (awayTeamWon ? 'awayTeam' : 'draw');

                        return (
                            <RoundFixture 
                                key={fixtures.indexOf(fixture)}
                                data={fixture}
                                winningTeam={winningTeam}
                            />
                        );
                    })
                }
                <div className="flex flex-col">
                    <span className="text-center text-lg text-white font-semibold bg-black">BYE TEAMS</span>
                    <div className="flex flex-row gap-6 justify-center py-2">
                        {
                            currentRound.byes.map((team: ByeTeam) => {
                                return <TeamImage key={team.theme.key} imageLink='' teamKey={team.theme.key} />;
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
