'use client';

import clsx from 'clsx';
import { Match, PredictedMatch, TeamData } from '../../lib/definitions';
import { COLOURCSSVARIANTS, getOrdinalNumber, WHITETEXTCOLOURS } from '../../lib/utils';
import TeamSection from './team-section';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';
import { usePathname, useSearchParams } from 'next/navigation';
import MatchState from './match-state';

export default function RoundFixture(
    {
        data,
        ladder,
        isFinalsFootball,
        modifiable,
        modifiedFixtureCb
    }:
    {
        data: Match,
        ladder: TeamData[]
        isFinalsFootball: boolean,
        modifiable: boolean,
        modifiedFixtureCb: undefined | ((_slug: string, _round: number, __payload: PredictedMatch) => void)
    }
) {
    // Empty string means info about the NRL will be fetched
    const comp = useSearchParams().get('comp') ?? 'nrl';

    const pathname = usePathname();

    const mainSiteColour = useSelector((state: RootState) => state.mainSiteColour.value);
    const { colour } = mainSiteColour;

    const round = parseInt(useSearchParams().get('round') ?? '');
    const fixtureRound = parseInt(data.roundTitle.split(' ')[1]);

    const { homeTeam, awayTeam, clock } = data;
    let { matchMode, matchState } = data;
    let { matchCentreUrl } = data;

    const { nickName: homeTeamName, theme: homeTeamTheme } = homeTeam;
    const { nickName: awayTeamName, theme: awayTeamTheme } = awayTeam;

    // Override matchMode and matchState if viewing up to a certain round
    if (round && round < fixtureRound) {
        matchMode = 'Pre';
        matchState = 'Upcoming';
    }

    const isLiveMatch = matchMode === 'Live';
    const isFullTime = matchState === 'FullTime';
    const canPredictResult = modifiable && matchMode === 'Pre';

    // Get ladder position of teams
    const homeTeamObj = ladder.filter((team: TeamData) => {
        return team.name === homeTeamName;
    });
    const awayTeamObj = ladder.filter((team: TeamData) => {
        return team.name === awayTeamName;
    });
    const homeTeamPos = getOrdinalNumber(ladder.indexOf(homeTeamObj[0]) + 1);
    const awayTeamPos = getOrdinalNumber(ladder.indexOf(awayTeamObj[0]) + 1);

    if (comp.includes('nrl')) {
        matchCentreUrl = `https://nrl.com${matchCentreUrl}`;
    }

    const teamSectionData = pathname.includes('ladder-predictor') ? data : {
        matchMode, matchState, homeTeam, awayTeam, clock,
        matchCentreUrl,
        roundTitle: data.roundTitle,
        isCurrentRound: data.isCurrentRound
    };

    const commonClasses = 'flex flex-row text-lg items-center justify-center gap-4 p-2';
    const responsiveClasses = 'max-sm:flex-wrap max-sm:px-8';

    return (
        <div className="flex flex-col">
            <a
                href={matchCentreUrl} target="_blank"
                className={
                    clsx(
                        'text-center text-lg font-semibold',
                        {
                            'bg-indigo-400': canPredictResult,
                            [COLOURCSSVARIANTS[`${colour}-bg`]]: isFullTime,
                            'text-white': !isFullTime || WHITETEXTCOLOURS.includes(colour),
                            'text-black': isFullTime && colour === 'nrl-mclt',
                            'live-match': isLiveMatch && !isFullTime,
                            'bg-yellow-600': matchMode === 'Pre' && isFinalsFootball,
                            'bg-blue-400': matchMode === 'Pre' && !isFinalsFootball,
                        }
                    )
                }
            >
                {
                    getDateString(clock.kickOffTimeLong)
                }
            </a>
            <div className={`${commonClasses} ${responsiveClasses}`}>
                {/* home icon, name & ladder pos */}
                <TeamSection
                    teamName={homeTeamName}
                    imgKey={homeTeamTheme?.key ?? ''}
                    position={homeTeamPos}
                    isHomeTeam={true}
                />
                {/* score and match status (pred / live / ft) */}
                <MatchState
                    matchData={teamSectionData}
                    modifiable={modifiable}
                    mainSiteColour={colour}
                    modifiedFixtureCb={modifiedFixtureCb as () => void}
                />
                {/* away icon, name & ladder pos */}
                <TeamSection
                    teamName={awayTeamName}
                    imgKey={awayTeamTheme?.key ?? ''}
                    position={awayTeamPos}
                    isHomeTeam={false}
                />
            </div>
        </div>
    );
}

/**
 * Get the date for a fixture (e.g. Friday 6th September)
 *
 * @param {string} date the fixture's date (e.g. 2024-09-05T09:50:00Z)
 * @returns {string}
 */
function getDateString(date: string) {
    const dateString = new Date(date).toLocaleString(
        'en-NZ',
        {
            weekday:'long',
            day: 'numeric',
            month: 'long'
        }
    );

    const number = parseInt(dateString.split(', ')[1].split(' ')[0]);

    return dateString.replace(',', '').replace(number.toString(), getOrdinalNumber(number));
}
