import { Match, ByeTeam, TeamData } from "../../lib/definitions";
import RoundFixture from "./round-fixture";
import TeamImage from "../team-image";
import { NUMS } from "@/app/lib/utils";

export default function Fixtures(
    {
        roundNum,
        byes,
        fixtures,
        ladder
    }:
    {
        roundNum: number,
        byes: Array<ByeTeam>,
        fixtures: Array<Match>,
        ladder: Array<TeamData>
    }
) {
    const {ROUNDS: lastRoundNum, FINALS_WEEKS} = NUMS;
    const grandFinalRoundNum = lastRoundNum + FINALS_WEEKS;

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
                // TODO this is duplicated elsewhere so fix it
                fixtures.map((fixture: Match) => {
                    const homeTeamWon = fixture.homeTeam.score > fixture.awayTeam.score;
                    const awayTeamWon = fixture.homeTeam.score < fixture.awayTeam.score;
                    const winningTeam = homeTeamWon ? 'homeTeam' : (awayTeamWon ? 'awayTeam' : 'draw');

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
                inFinalsFootball ?
                    null :
                    <div className="flex flex-col">
                        <span className="text-center text-lg text-white font-semibold bg-black">BYE TEAMS</span>
                        <div className="flex flex-row flex-wrap gap-6 justify-center py-2">
                            {
                                byes.map((team: ByeTeam) => {
                                    const {key} = team.theme;
                                    return <TeamImage key={key} matchLink='' teamKey={key} />;
                                })
                            }
                        </div>
                    </div>
            }
        </div>
    );
}
