'use client';

import { useDispatch } from 'react-redux';
import { NUMS } from '../lib/utils';
import { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { resetDraw } from '@/state/draw/drawData';

export default function SeasonAndYearPicker() {
    const dispatch = useDispatch();

    const currentYear = new Date().getFullYear();

    // Empty string means the current year will be fetched
    const season = useSearchParams().get('season');
    const drawSeason = season ? parseInt(season) : currentYear;

    // Empty string means info about the NRL will be fetched
    const comp = useSearchParams().get('comp') ?? 'nrl';

    // Empty string means info about the NRL will be fetched
    const round = parseInt(useSearchParams().get('round') ?? '');

    // Find earliest start year for comp
    let earliestYear = 1998;
    if (comp === 'nrlw') {
        earliestYear = 2020;
    }
    if (comp === 'nsw' || comp === 'qld') {
        earliestYear = currentYear;
    }

    // Generate year options
    const yearOptions = [];
    for (let year = currentYear; year >= earliestYear; year--) {
        yearOptions.push(year);
    }

    // Get number of rounds for selected year/comp
    const numRounds = NUMS[comp].ROUNDS(drawSeason) || 1;
    const roundOptions = [];
    for (let round = 1; round <= numRounds; round++) {
        roundOptions.push(round);
    }

    const defaultRound = drawSeason === currentYear ? -1 : NUMS[comp].ROUNDS(drawSeason);

    const [selectedRound, setSelectedRound] = useState(round || defaultRound);
    const [selectedYear, setSelectedYear] = useState(drawSeason);

    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="flex flex-row gap-6 justify-center text-xl">
            <label>
                Season:
                <select
                    className="ml-2 border rounded px-2 py-1"
                    value={selectedYear}
                    onChange={e => {
                        const season = e.target.value;

                        setSelectedYear(Number(season));

                        // Update URL params and trigger a re-fetch
                        const params = new URLSearchParams(window.location.search);

                        const maxRoundsNewSeason = NUMS[comp].ROUNDS(Number(season));

                        if (pathname.includes('ladder-predictor') && Number(season) !== currentYear) {
                            params.set('season', season);
                            params.set('round', String(maxRoundsNewSeason));
                        }
                        else if (Number(season) === currentYear) {
                            // If set to current season, remove both parameters
                            params.delete('round');
                            params.delete('season');
                        }
                        else {
                            params.set('season', season);

                            // Ensure selectedRound is not greater than numRounds
                            if (selectedRound > maxRoundsNewSeason) {
                                setSelectedRound(maxRoundsNewSeason);
                                params.set('round', String(maxRoundsNewSeason));
                            }
                        }

                        router.replace(`${window.location.pathname}?${params.toString()}`);

                        dispatch(resetDraw());
                    }}
                    disabled={comp === 'nsw' || comp === 'qld'}
                >
                    {
                        yearOptions.map(year => (
                            <option key={year} value={year} className={'text-sm'}>{year}</option>
                        ))
                    }
                </select>
            </label>
            {!pathname.includes('ladder-predictor') && drawSeason !== currentYear && (
                <label>
                    Round:
                    <select
                        className="ml-2 border rounded px-2 py-1"
                        value={selectedRound}
                        onChange={e => {
                            const newRound = Number(e.target.value);
                            setSelectedRound(newRound);

                            // Update round param in URL
                            const params = new URLSearchParams(window.location.search);
                            params.set('round', String(newRound));
                            router.replace(`${window.location.pathname}?${params.toString()}`);
                        }}
                    >
                        {
                            roundOptions.map(round => (
                                <option key={round} value={round} className={'text-sm'}>{round}</option>
                            ))
                        }
                    </select>
                </label>
            )}
        </div>
    );
}
