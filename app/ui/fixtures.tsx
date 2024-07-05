import { Match, ByeTeam, TeamData } from "../lib/definitions";
import RoundFixture from "./round-fixture";
import TeamImage from "./team-image";

export default function Fixtures(
    { 
        currentRound,
        fixtures,
        ladder
    }:
    { 
        currentRound: any; 
        fixtures: Array<Match>,
        ladder: Array<TeamData>
    }
) {
    return (
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
                            ladder={ladder}
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
    );
}
