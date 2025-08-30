import { TeamData, DrawInfo } from '../../lib/definitions';
import Fixtures from '../fixture/fixtures';
import ByeToggleSection from '../bye-toggle';
import { useEffect, useState } from 'react';
import { NUMS } from '@/app/lib/utils';
import { getLadderRow, getPageVariables, updateFixturesToShow } from '@/app/lib/nrl-draw-utils';
import PageDescription from '../page-desc';
import Standings from './../ladder/standings';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { teamSortFunction } from '@/app/lib/team-stats';

export default function Ladder({seasonDraw}: {seasonDraw: Array<DrawInfo>}) {
    const currentComp = useSelector((state: RootState) => state.currentComp.value);
    const { comp } = currentComp;

    const currentYear = useSelector((state: RootState) => state.currentYear.value);
    const { year } = currentYear;

    const pageVariables = getPageVariables(Object.values(seasonDraw), false, comp, year);
    const { byes, fixtures, currentRoundNo, allTeams } = pageVariables;

    const [byePoints, setByePoints] = useState(true);
    const [ladderTeams, setLadderTeams] = useState(allTeams);
    const [roundIndex, setRoundIndex] = useState(currentRoundNo);
    const [fixturesToShow, setFixturesToShow] = useState(fixtures);
    const [byeTeams, setByeTeams] = useState(byes);

    const updateByePoints = (newValue: boolean) => {
        // Do not set if the value is the same
        if (newValue === byePoints) {
            return;
        }

        // Update ladder teams object and bye points value
        setByePoints(newValue);
        setLadderTeams(allTeams.sort((a: TeamData, b: TeamData) => {
            return teamSortFunction(newValue, a, b);
        }));
    };

    // Update ladder teams after each re-render if the fixtures get changed (i.e. the score updates)
    useEffect(() => {
        if (JSON.stringify(allTeams) === JSON.stringify(ladderTeams)) {
            return;
        }

        setLadderTeams(allTeams.sort((a: TeamData, b: TeamData) => {
            return teamSortFunction(byePoints, a, b);
        }));
    }, [fixtures]);

    // Update ladder teams, round index, fixtures and byes
    // when the competition has changed (e.g. from NRL to NRLW)
    useEffect(() => {
        setLadderTeams(allTeams.sort((a: TeamData, b: TeamData) => {
            return teamSortFunction(byePoints, a, b);
        }));
        setRoundIndex(currentRoundNo);
        setFixturesToShow(fixtures);
        if (byes) {
            setByeTeams(byes);
        }
    }, [currentComp]);

    const updateFixturesCb = (showPreviousRound: boolean) => {
        updateFixturesToShow(
            showPreviousRound, roundIndex, seasonDraw, setRoundIndex, setFixturesToShow, setByeTeams
        );
    };

    const { ROUNDS, BYES } = NUMS[comp];

    // Last round for the toggle. Is last round of regular season if not finals football,
    // otherwise it is set to the current finals football week
    const lastFixtureRound = currentRoundNo <= ROUNDS ? ROUNDS : currentRoundNo;

    const topTeams = getLadderRow(true, ladderTeams, byePoints, pageVariables, comp, false);
    const bottomTeams = getLadderRow(false, ladderTeams, byePoints, pageVariables, comp, false);

    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <PageDescription
                cssClasses={'text-xl text-center'}
                description={'Ladder auto-updates every few seconds'}
            />
            {
                // Do not show bye toggle if:
                // 1. The competition does not have byes, (BYES = 0) OR
                // 2. The competition is in round 1 or the last round and beyond
                BYES === 0 || (currentRoundNo === 1 || currentRoundNo >= ROUNDS) ?
                    null :
                    <ByeToggleSection setByeValue={byePoints} byeValueCb={updateByePoints} />
            }
            <Standings
                topHalf={topTeams}
                bottomHalf={bottomTeams}
                predictorPage={false}
            />
            <Fixtures
                roundNum={roundIndex}
                byes={byeTeams}
                fixtures={roundIndex === currentRoundNo ? fixtures : fixturesToShow}
                teamList={ladderTeams}
                updateCallback={updateFixturesCb}
                lastRoundNo={lastFixtureRound}
                modifiable={false}
                modifiedFixtureCb={undefined}
            />
        </div>
    );
}

