/* eslint-disable max-len */

import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const comp = searchParams.get('comp');
    let compRounds = searchParams.get('rounds');

    if (!compRounds || !comp || isNaN(parseInt(compRounds)) || isNaN(parseInt(comp))) {
        return new Response(JSON.stringify({ 'error': 'Invalid arguments' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const season = searchParams.get('season');
    let showPastSeason = comp == '161' || comp == '111';
    if (showPastSeason && season && parseInt(season) < new Date().getFullYear()) {
        // Do not show 2018 or 2019 NRLW season results, as there's a NRL site bug
        // where the Warriors don't exist
        if (comp == '161' && [2018, 2019].includes(parseInt(season))) {
            showPastSeason = false;
        }
        else {
            type CompKey = '111' | '161';
            const totalSeasonRounds: Record<CompKey, { ROUNDS: (_year: number) => string; }> = {
                // Return one round higher than actual number
                111: { // NRL
                    ROUNDS: (year: number) => {
                        if (year < 1998 || year > new Date().getFullYear()) {
                            return '';
                        }
                        if (year === 2020) {
                            return '25';
                        }
                        if ([2007, 2018, 2019, 2021, 2022].includes(year)) {
                            return '30';
                        }
                        if ([1998, 2023, 2024, 2025, 2026].includes(year)) {
                            return '32';
                        }
                        return '31'; // 1999-2006, 2008-17
                    },
                },
                161: { // NRL-W
                    ROUNDS: (year: number) => {
                        if (year < 2018 || year > new Date().getFullYear()) {
                            return '';
                        }
                        if ([2018, 2019, 2020].includes(year)) {
                            return '5';
                        }
                        if ([2021, 2022].includes(year)) {
                            return '8';
                        }
                        if ([2023, 2024].includes(year)) {
                            return '12';
                        }
                        return '15'; // 2025-present
                    },
                }
            };

            // If season < currentYear, set rounds to max
            const pastSeasonRounds = totalSeasonRounds[comp as CompKey].ROUNDS(parseInt(season));

            // If the season is legitimate (i.e. pastSeasonRounds is not empty),
            // show the past results
            if (pastSeasonRounds) {
                compRounds = pastSeasonRounds;
            }
            else {
                showPastSeason = false;
            }
        }
    }

    // Make nrl.com think I am not a bot
    const uaString = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

    const rounds = [];

    for (let i = 1; i < parseInt(compRounds); i++) {
        const apiUrl =
            `https://www.nrl.com/draw/data?competition=${comp}&round=${String(i)}${showPastSeason && season ? `&season=${season}`: ''}`;

        const roundData = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'user-agent': uaString,
            }
        });

        const roundDataResult: unknown = await roundData.json();

        rounds.push(roundDataResult);
    }

    return new Response(JSON.stringify({ 'success': true, 'data': rounds }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
