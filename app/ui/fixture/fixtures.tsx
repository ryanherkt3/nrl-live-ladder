import { Match, ByeTeam, TeamData } from '../../lib/definitions';
import TeamImage from '../team-image';
import { NUMS } from '@/app/lib/utils';
import { getRoundFixtures } from '@/app/lib/nrl-draw-utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function Fixtures(
    {
        roundNum,
        byes,
        fixtures,
        teamList,
        updateCallback,
        lastRoundNo,
        modifiable,
        modifiedFixtureCb,
    }:
    {
        roundNum: number,
        byes: Array<ByeTeam>,
        fixtures: Array<Match>,
        teamList: Array<TeamData>,
        updateCallback: Function
        lastRoundNo: number,
        modifiable: boolean,
        modifiedFixtureCb: Function | undefined
    }
) {
    const { ROUNDS: lastRoundNum, FINALS_WEEKS } = NUMS;
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
            <div className="flex flex-row gap-2 items-center justify-center">
                {
                    roundNum === 1 ?
                        <div className="w-8"></div> :
                        <ChevronLeftIcon
                            className="w-8 h-8 cursor-pointer"
                            onClick={() => {
                                updateCallback(true);
                            }}
                        />
                }
                <div className="text-2xl font-semibold text-center">{roundHeading}</div>
                {
                    roundNum === lastRoundNo ?
                        <div className="w-8"></div> :
                        <ChevronRightIcon
                            className="w-8 h-8 cursor-pointer"
                            onClick={() => {
                                updateCallback(false);
                            }}
                        />
                }
            </div>
            <div className="text-lg text-center">All fixtures are in your local timezone</div>
            {
                getRoundFixtures(fixtures, teamList, inFinalsFootball, modifiable, modifiedFixtureCb)
            }
            {
                inFinalsFootball ?
                    null :
                    <div className="flex flex-col">
                        <span className="text-center text-lg text-white font-semibold bg-black">BYE TEAMS</span>
                        <div className="flex flex-row flex-wrap gap-6 justify-center py-2">
                            {
                                byes.map((team: ByeTeam) => {
                                    const { key } = team.theme;
                                    return <TeamImage key={key} matchLink='' teamKey={key} />;
                                })
                            }
                        </div>
                    </div>
            }
        </div>
    );
}
