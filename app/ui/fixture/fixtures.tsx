import { Match, ByeTeam, TeamData, DrawInfo } from "../../lib/definitions";
import RoundFixture from "./round-fixture";
import TeamImage from "../team-image";
import { NUMS } from "@/app/lib/utils";

export default function Fixtures(
    { 
        drawInfo,
        fixtures,
        ladder
    }:
    { 
        drawInfo: DrawInfo,
        fixtures: Array<Match>,
        ladder: Array<TeamData>
    }
) {
    const roundNum = drawInfo.selectedRoundId;

    const lastRoundNum = NUMS.ROUNDS;
    const grandFinalRoundNum = lastRoundNum + NUMS.FINALS_WEEKS;

    const inFinalsFootball = roundNum >= lastRoundNum + 1;

    let roundHeading = `Round ${roundNum} Fixtures`;
    if (inFinalsFootball && roundNum <= grandFinalRoundNum - 1) {
        roundHeading = `Finals Week ${roundNum - lastRoundNum} Fixtures`;
    }
    else if (roundNum === grandFinalRoundNum) {
        roundHeading = 'GRAND FINAL';
    }

    // No fixtures to display in off-season
    if (roundNum > grandFinalRoundNum) {
        return null; 
    }
    
    return (
        <div className="flex flex-col gap-4">
            <div className="text-2xl font-semibold text-center">{roundHeading}</div>
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
            {
                getByesSection(drawInfo, inFinalsFootball)
            }
        </div>
    );
}

function getByesSection(drawInfo: DrawInfo, inFinalsFootball: boolean) {
    // No teams on byes in finals football
    if (inFinalsFootball) {
        return null;
    }
    
    return (
        <div className="flex flex-col">
            <span className="text-center text-lg text-white font-semibold bg-black">BYE TEAMS</span>
            <div className="flex flex-row flex-wrap gap-6 justify-center py-2">
                {
                    drawInfo.byes.map((team: ByeTeam) => {
                        return <TeamImage key={team.theme.key} imageLink='' teamKey={team.theme.key} />;
                    })
                }
            </div>
        </div>
    );
}
