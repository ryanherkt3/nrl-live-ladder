/**
 * @jest-environment jsdom
 */

// TODO cover lines 95,124,162,180-188 from team-stats.ts

import { NUMS } from '../../app/lib/utils';
import { TeamData } from '../../app/lib/definitions';
import { constructTeamData, constructTeamStats, getMaxPoints, teamSortFunction } from '../../app/lib/team-stats';
import localStorageMock from '../localStorageMock';

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('test suite max points', () => {
    it('Returns rounds times 2 as max points for an unbeaten team', () => {
        expect(getMaxPoints(0, 0, 'nrl')).toBe(54);
        expect(getMaxPoints(0, 0, 'nrlw')).toBe(22);
        expect(getMaxPoints(0, 0, 'nsw')).toBe(52);
        expect(getMaxPoints(0, 0, 'qld')).toBe(46);
    });

    it('Returns byes times 2 as max points for a winless team', () => {
        expect(getMaxPoints(NUMS['nrl'].MATCHES, 0, 'nrl')).toBe(6);
        expect(getMaxPoints(NUMS['nrlw'].MATCHES, 0, 'nrlw')).toBe(0);
        expect(getMaxPoints(NUMS['nsw'].MATCHES, 0, 'nsw')).toBe(4);
        expect(getMaxPoints(NUMS['qld'].MATCHES, 0, 'qld')).toBe(6);
    });

    it('Returns 33 as max points for NRL team with 10 losses and 1 draw (13 wins)', () => {
        expect(getMaxPoints(10, 1, 'nrl')).toBe(33);
    });
    it('Returns 11 as max points for NRL team with 5 losses and 1 draw (5 wins)', () => {
        expect(getMaxPoints(5, 1, 'nrlw')).toBe(11);
    });
    it('Returns 31 as max points for NRL team with 10 losses and 1 draw (13 wins)', () => {
        expect(getMaxPoints(10, 1, 'nsw')).toBe(31);
    });
    it('Returns 25 as max points for NRL team with 10 losses and 1 draw (9 wins)', () => {
        expect(getMaxPoints(10, 1, 'qld')).toBe(25);
    });
});

describe('test suite team data construction', () => {
    const sampleTeams = [
        {
            name: 'Team1',
            theme: { key: 'theme1' },
            stats: {
                played: 0,
                wins: 0,
                drawn: 0,
                lost: 0,
                byes: 0,
                'points for': 0,
                'points against': 0,
                'points difference': 0,
                points: 0,
                noByePoints: 0,
                maxPoints: 54
            }
        },
        {
            name: 'Team2',
            theme: { key: 'theme2' },
            stats: {
                played: 0,
                wins: 0,
                drawn: 0,
                lost: 0,
                byes: 0,
                'points for': 0,
                'points against': 0,
                'points difference': 0,
                points: 0,
                noByePoints: 0,
                maxPoints: 54
            }
        }
    ];

    it('initialises empty team list', () => {
        const result = constructTeamData([], 'nrl');
        expect(result).toEqual([]);
    });

    it('initialises teams with correct structure', () => {
        const result = constructTeamData(sampleTeams, 'nrl');
        expect(result.length).toBe(2);
        expect(result[0].name).toBe('Team1');
        expect(result[0].theme.key).toBe('theme1');
    });

    it('initialises all stats to zero', () => {
        const result = constructTeamData(sampleTeams, 'nrl')[0].stats;
        expect(result.played).toBe(0);
        expect(result.wins).toBe(0);
        expect(result.drawn).toBe(0);
        expect(result.lost).toBe(0);
        expect(result.byes).toBe(0);
        expect(result['points for']).toBe(0);
        expect(result['points against']).toBe(0);
        expect(result['points difference']).toBe(0);
        expect(result.points).toBe(0);
        expect(result.noByePoints).toBe(0);
    });
});

describe('test suite team stats construction', () => {
    let sampleTeams: TeamData[];

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();

        sampleTeams = constructTeamData([
            {
                name: 'Home',
                theme: { key: 'home' },
                stats: {
                    played: 0,
                    wins: 0,
                    drawn: 0,
                    lost: 0,
                    byes: 0,
                    'points for': 0,
                    'points against': 0,
                    'points difference': 0,
                    points: 0,
                    noByePoints: 0,
                    maxPoints: 54
                }
            },
            {
                name: 'Away',
                theme: { key: 'away' },
                stats: {
                    played: 0,
                    wins: 0,
                    drawn: 0,
                    lost: 0,
                    byes: 0,
                    'points for': 0,
                    'points against': 0,
                    'points difference': 0,
                    points: 0,
                    noByePoints: 0,
                    maxPoints: 54
                }
            }
        ], 'nrl');
    });

    const mockDraw = [{
        selectedRoundId: 1,
        selectedSeasonId: 2023,
        filterTeams: [],
        byes: [],
        fixtures: [{
            matchMode: 'Post' as 'Post' | 'Pre' | 'Live',
            matchState: 'FullTime' as 'FullTime' | 'Upcoming' | 'FirstHalf' | 'HalfTime' | 'SecondHalf' | 'ExtraTime',
            matchCentreUrl: '/draw/nrl-premiership/2023/round-1/home-v-away/',
            roundTitle: 'Round 1',
            homeTeam: { nickName: 'Home', score: 20, theme: { key: 'home' } },
            awayTeam: { nickName: 'Away', score: 10, theme: { key: 'away' } },
            clock: {
                kickOffTimeLong: '2023-07-19T20:00:00Z',
                gameTime: '80:00'
            },
            isCurrentRound: true
        }]
    }];

    it('calculates win, loss, points, points for, points against, points difference correctly', () => {
        const result = constructTeamStats(mockDraw, 1, sampleTeams, false, 'nrl', 2023);
        const homeTeam = result[0];
        const awayTeam = result[1];

        expect(homeTeam.stats.wins).toBe(1);
        expect(homeTeam.stats.lost).toBe(0);
        expect(awayTeam.stats.wins).toBe(0);
        expect(awayTeam.stats.lost).toBe(1);

        expect(homeTeam.stats.points).toBe(2); // WIN_POINTS = 2 in NRL

        expect(homeTeam.stats['points for']).toBe(20);
        expect(homeTeam.stats['points against']).toBe(10);
        expect(homeTeam.stats['points difference']).toBe(10);

        expect(awayTeam.stats['points for']).toBe(10);
        expect(awayTeam.stats['points against']).toBe(20);
        expect(awayTeam.stats['points difference']).toBe(-10);
    });

    it('skips future rounds when not modifiable', () => {
        const futureRoundDraw = [{
            ...mockDraw[0],
            selectedRoundId: 2 // Greater than currentRoundNo
        }];

        const futureRoundResult = constructTeamStats(futureRoundDraw, 2, sampleTeams, false, 'nrl', 2023);
        expect(futureRoundResult[0].stats.played).toBe(1);
        expect(futureRoundResult[1].stats.played).toBe(1);
    });

    it('handles byes correctly when round has played fixtures', () => {
        const byeTeam = constructTeamData([{
            name: 'ByeTeam',
            theme: { key: 'bye' },
            stats: {
                played: 0,
                wins: 0,
                drawn: 0,
                lost: 0,
                byes: 0,
                'points for': 0,
                'points against': 0,
                'points difference': 0,
                points: 0,
                noByePoints: 0,
                maxPoints: 54
            }
        }], 'nrl');
        sampleTeams.push(byeTeam[0]);

        const drawWithBye = [{
            ...mockDraw[0],
            byes: [{
                teamNickName: 'ByeTeam',
                theme: { key: 'bye' },
                isCurrentRound: true
            }],
            fixtures: [{
                ...mockDraw[0].fixtures[0],
                matchMode: 'Post' as 'Post' | 'Pre' | 'Live'
            }]
        }];

        const byeResult = constructTeamStats(drawWithBye, 1, sampleTeams, false, 'nrl', 2023);

        expect(byeResult[2].stats.byes).toBe(1);
        expect(byeResult[2].stats.points).toBe(2); // WIN_POINTS = 2 in NRL for a bye
        expect(byeResult[2].stats.noByePoints).toBe(0);
    });

    it('handles predicted matches from localStorage', () => {
        const predictedMatch = {
            '1': {
                'home-v-away': {
                    'home': 30,
                    'away': 20
                }
            }
        };
        localStorage.setItem('predictedMatches2023nrl', JSON.stringify(predictedMatch));

        const preMatchDraw = [{
            ...mockDraw[0],
            fixtures: [{
                ...mockDraw[0].fixtures[0],
                matchMode: 'Pre' as 'Post' | 'Pre' | 'Live',
                matchCentreUrl: '/draw/nrl-premiership/2023/round-1/home-v-away/',
                homeTeam: { nickName: 'Home', score: '', theme: { key: 'home' } },
                awayTeam: { nickName: 'Away', score: '', theme: { key: 'away' } },
            }]
        }];

        const LSResult = constructTeamStats(preMatchDraw, 1, sampleTeams, true, 'nrl', 2023);

        expect(LSResult[0].stats.points).toBe(2);
        expect(LSResult[0].stats['points for']).toBe(30);
        expect(LSResult[0].stats['points against']).toBe(20);
        expect(LSResult[0].stats['points difference']).toBe(10);

        expect(LSResult[1].stats.points).toBe(0);
        expect(LSResult[1].stats['points for']).toBe(20);
        expect(LSResult[1].stats['points against']).toBe(30);
        expect(LSResult[1].stats['points difference']).toBe(-10);
    });

    it('cleans up invalid predictions from localStorage', () => {
        const invalidPrediction = {
            '1': {
                'home-v-away': {
                    'home': '',
                    'away': ''
                }
            }
        };
        localStorage.setItem('predictedMatches2023nrl', JSON.stringify(invalidPrediction));

        const preMatchDraw = [{
            ...mockDraw[0],
            fixtures: [{
                ...mockDraw[0].fixtures[0],
                matchMode: 'Pre' as 'Post' | 'Pre' | 'Live',
                matchCentreUrl: '/draw/nrl-premiership/2023/round-1/home-v-away/',
                homeTeam: { nickName: 'Home', score: '', theme: { key: 'home' } },
                awayTeam: { nickName: 'Away', score: '', theme: { key: 'away' } },
            }]
        }];

        constructTeamStats(preMatchDraw, 1, sampleTeams, true, 'nrl', 2023);

        expect(localStorage.getItem('predictedMatches2023nrl')).toBeUndefined();
    });
});

describe('test suite team sort function', () => {
    const team1: TeamData = {
        name: 'Team1',
        theme: { key: 'theme1' },
        stats: {
            points: 10,
            noByePoints: 8,
            'points difference': 40,
            'points for': 40,
            'points against': 20,
            played: 20,
            wins: 5,
            drawn: 0,
            lost: 15,
            byes: 1,
            maxPoints: 54
        }
    };

    const team2: TeamData = {
        name: 'Team2',
        theme: { key: 'theme2' },
        stats: {
            points: 8,
            noByePoints: 8,
            'points difference': 40,
            'points for': 40,
            'points against': 20,
            played: 20,
            wins: 4,
            drawn: 0,
            lost: 16,
            byes: 0,
            maxPoints: 54
        }
    };

    it('sorts by points when showByes is true', () => {
        expect(teamSortFunction(true, team1, team2)).toBeLessThan(0);
    });

    it('sorts by points difference when points are equal', () => {
        const equalPointsTeam = {
            ...team2,
            stats: {
                ...team2.stats,
                points: 10,
                'points difference': 30 // Lower than team1's 40
            }
        };
        expect(teamSortFunction(true, team1, equalPointsTeam)).toBeLessThan(0);
    });

    it('sorts by points ratio when points and points difference are equal with byes', () => {
        const equalDiffTeam = {
            ...team2,
            stats: {
                ...team2.stats,
                points: 10,
                'points difference': 40,
                'points for': 60,
                'points against': 20 // Ratio 3.0, lower than team1's ratio of 40/20 = 2.0
            }
        };
        expect(teamSortFunction(true, equalDiffTeam, team1)).toBeLessThan(0);
    });

    it('sorts by points ratio when points and points difference are equal without byes', () => {
        const equalDiffTeam = {
            ...team2,
            stats: {
                ...team2.stats,
                noByePoints: 8,
                'points difference': 40,
                'points for': 60,
                'points against': 20 // Ratio 3.0, lower than team1's ratio of 40/20 = 2.0
            }
        };
        expect(teamSortFunction(false, equalDiffTeam, team1)).toBeLessThan(0);
    });

    it('sorts by noByePoints when showByes is false', () => {
        // Since we're comparing floating point numbers from division,
        // we check if the difference is very small
        expect(Math.abs(teamSortFunction(false, team1, team2))).toBeLessThan(0.001);
    });

    it('sorts by points difference when noByePoints are not equal and showByes is false', () => {
        const diffNoByePointsTeam = {
            ...team2,
            stats: {
                ...team2.stats,
                noByePoints: 12,
                byes: 3
            }
        };
        expect(teamSortFunction(false, diffNoByePointsTeam, team1)).toBeLessThan(0);
    });

    it('sorts by points difference when noByePoints are equal and showByes is false', () => {
        const equalNoByePointsTeam = {
            ...team2,
            stats: {
                ...team2.stats,
                noByePoints: 8, // Equal to team1's noByePoints
                'points difference': 30, // Lower than team1's 40
                'points for': 50,
                'points against': 20
            }
        };
        expect(teamSortFunction(false, team1, equalNoByePointsTeam)).toBeLessThan(0);
    });
});
