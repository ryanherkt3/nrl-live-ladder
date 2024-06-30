import { Metadata } from "next";
import { getLadderStats, getCurrentRound } from "./lib/utils";
import LadderRow from "./ui/ladder-row";
import { TeamData, Match } from "./lib/definitions";
import RoundFixture from "./ui/round-fixture";

export const metadata: Metadata = {
    title: 'NRL Live Ladder',
};

export default async function HomePage() {
    const ladderStats = await getLadderStats();
    const topTeams = ladderStats.splice(0, 8);

    const currentRound = await getCurrentRound();
    const fixtures = currentRound.fixtures;
    
    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <div>
                <div className="flex flex-row gap-2 text-xl pb-4 font-semibold text-center">
                    <div className="w-[5%]">Pos</div>
                    <div className="w-[8%]">Team</div>
                    <div className="w-[15%]"></div>
                    <div className="w-[6%]">Pld</div>
                    <div className="w-[6%]">W</div>
                    <div className="w-[6%]">D</div>
                    <div className="w-[6%]">L</div>
                    <div className="w-[6%]">B</div>
                    <div className="w-[6%]">PF</div>
                    <div className="w-[6%]">PA</div>
                    <div className="w-[6%]">PD</div>
                    <div className="w-[8%]">Next</div>
                    <div className="w-[6%]">Pts</div>
                </div>
                {
                    topTeams.map((team: TeamData) => {
                        return <LadderRow key={team.theme.key} data={team} position={topTeams.indexOf(team) + 1} />
                    })
                }
                <div className="border-2 border-green-400"></div>
                {
                    ladderStats.map((team: TeamData) => {
                        return <LadderRow key={team.theme.key} data={team} position={ladderStats.indexOf(team) + 9} />
                    })
                }
            </div>

            <div className="flex flex-col gap-4">
                <div className="text-2xl font-semibold text-center">Round {currentRound.selectedRoundId} Fixtures</div>
                {
                    fixtures.map((fixture: Match) => {
                        return <RoundFixture key={fixtures.indexOf(fixture)} data={fixture} />
                    })
                }
            </div>
        </div>
    );
}
