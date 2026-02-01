import { Match, ByeTeam, TeamData } from '../../lib/definitions';
import TeamImage from '../team-image';
import { COLOURCSSVARIANTS, NUMS } from '@/lib/utils';
import { getRoundFixtures } from '@/lib/nrl-draw-utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

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
        byes: ByeTeam[] | undefined,
        fixtures: Match[],
        teamList: TeamData[],
        updateCallback: (_showPreviousRound: boolean) => void
        lastRoundNo: number,
        modifiable: boolean,
        modifiedFixtureCb: undefined | ((_slug: string, _round: number, _team: string, _score: number) => void)
    }
) {
    const currentComp = useSelector((state: RootState) => state.currentComp.value);
    const { comp } = currentComp;

    const mainSiteColour = useSelector((state: RootState) => state.mainSiteColour.value);
    const { colour } = mainSiteColour;

    const { ROUNDS: lastRoundNum, FINALS_WEEKS } = NUMS[comp];
    const grandFinalRoundNum = lastRoundNum + FINALS_WEEKS;

    const inFinalsFootball = roundNum >= lastRoundNum + 1;

    let roundHeading = `Round ${String(roundNum)} Fixtures`;
    if (inFinalsFootball && roundNum <= grandFinalRoundNum - 1) {
        roundHeading = `Finals Week ${String(roundNum - lastRoundNum)} Fixtures`;
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
                            className={`w-8 h-8 cursor-pointer ${COLOURCSSVARIANTS[`${colour}-hover-text`]}`}
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
                            className={`w-8 h-8 cursor-pointer ${COLOURCSSVARIANTS[`${colour}-hover-text`]}`}
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
                inFinalsFootball || byes === undefined ?
                    null :
                    <div className="flex flex-col">
                        <span className="text-center text-lg text-white font-semibold bg-black">BYE TEAMS</span>
                        <div className="flex flex-row flex-wrap gap-6 justify-center py-2">
                            {
                                byes.map((byeTeam: ByeTeam) => {
                                    const { key } = byeTeam.theme;

                                    const foundTeam = teamList.find((team: TeamData) => {
                                        return team.theme.key === key;
                                    });
                                    const imageTooltip = foundTeam ? foundTeam.name : '';

                                    return (
                                        <TeamImage
                                            key={key}
                                            matchLink=''
                                            teamKey={key}
                                            tooltip={imageTooltip}
                                            useLight={false}
                                        />
                                    );
                                })
                            }
                        </div>
                    </div>
            }
        </div>
    );
}
