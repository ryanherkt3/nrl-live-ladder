/**
 * @jest-environment jsdom
 */

// TODO cover the below lines from team-stats.ts (run jest --coverage for latest report)
// 102,131 - expect teams object to be ...
// 169 - localStorage.predictedMatches${currentYear}${currentComp}` to be ...
// 187-195 - cleanUpPredictions function to return ...

import { NUMS } from '../../app/lib/utils';
import { TeamData } from '../../app/lib/definitions';
import { constructTeamData, constructTeamStats, getMaxPoints, teamSortFunction } from '../../app/lib/team-stats';
import localStorageMock from '../mocks/localStorageMock';
import { sampleTestTeams } from '../mocks/mockTestTeamObjects';

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('test suite max points', () => {
    it('Returns rounds times 2 (plus bye points) as max points for an unbeaten team', () => {
        expect(getMaxPoints(0, 0, 'nrl', true)).toBe(54);
        expect(getMaxPoints(0, 0, 'nrlw', true)).toBe(22);
        expect(getMaxPoints(0, 0, 'nsw', true)).toBe(52);
        expect(getMaxPoints(0, 0, 'qld', true)).toBe(46);
    });

    it('Returns rounds times 2 as max points for an unbeaten team', () => {
        expect(getMaxPoints(0, 0, 'nrl', false)).toBe(48);
        expect(getMaxPoints(0, 0, 'nrlw', false)).toBe(22);
        expect(getMaxPoints(0, 0, 'nsw', false)).toBe(48);
        expect(getMaxPoints(0, 0, 'qld', false)).toBe(40);
    });

    it('Returns byes times 2 (plus bye points) as max points for a winless team', () => {
        expect(getMaxPoints(NUMS['nrl'].MATCHES, 0, 'nrl', true)).toBe(6);
        expect(getMaxPoints(NUMS['nrlw'].MATCHES, 0, 'nrlw', true)).toBe(0);
        expect(getMaxPoints(NUMS['nsw'].MATCHES, 0, 'nsw', true)).toBe(4);
        expect(getMaxPoints(NUMS['qld'].MATCHES, 0, 'qld', true)).toBe(6);
    });

    it('Returns byes times 2 as max points for a winless team', () => {
        expect(getMaxPoints(NUMS['nrl'].MATCHES, 0, 'nrl', false)).toBe(0);
        expect(getMaxPoints(NUMS['nrlw'].MATCHES, 0, 'nrlw', false)).toBe(0);
        expect(getMaxPoints(NUMS['nsw'].MATCHES, 0, 'nsw', false)).toBe(0);
        expect(getMaxPoints(NUMS['qld'].MATCHES, 0, 'qld', false)).toBe(0);
    });

    it('Returns 33 (inclusive of bye points) as max points for NRL team with 10 losses and 1 draw (13 wins)', () => {
        expect(getMaxPoints(10, 1, 'nrl', true)).toBe(33);
    });
    it('Returns 11 (inclusive of bye points) as max points for NRL team with 5 losses and 1 draw (5 wins)', () => {
        expect(getMaxPoints(5, 1, 'nrlw', true)).toBe(11);
    });
    it('Returns 31 (inclusive of bye points) as max points for NRL team with 10 losses and 1 draw (13 wins)', () => {
        expect(getMaxPoints(10, 1, 'nsw', true)).toBe(31);
    });
    it('Returns 25 (inclusive of bye points) as max points for NRL team with 10 losses and 1 draw (9 wins)', () => {
        expect(getMaxPoints(10, 1, 'qld', true)).toBe(25);
    });

    it('Returns 33 (exclusive of bye points) as max points for NRL team with 10 losses and 1 draw (13 wins)', () => {
        expect(getMaxPoints(10, 1, 'nrl', false)).toBe(27);
    });
    it('Returns 11 (exclusive of bye points) as max points for NRL team with 5 losses and 1 draw (5 wins)', () => {
        expect(getMaxPoints(5, 1, 'nrlw', false)).toBe(11);
    });
    it('Returns 31 (exclusive of bye points) as max points for NRL team with 10 losses and 1 draw (13 wins)', () => {
        expect(getMaxPoints(10, 1, 'nsw', false)).toBe(27);
    });
    it('Returns 25 (exclusive of bye points) as max points for NRL team with 10 losses and 1 draw (9 wins)', () => {
        expect(getMaxPoints(10, 1, 'qld', false)).toBe(19);
    });
});

describe('test suite team data construction', () => {
    const sampleTeams = sampleTestTeams;

    it('initialises empty team list', () => {
        const result = constructTeamData([], 'nrl');
        expect(result).toEqual([]);
    });

    it('initialises teams with correct structure', () => {
        const result = constructTeamData(sampleTeams, 'nrl');
        expect(result.length).toBe(2);
        expect(result[0].name).toBe('Team1');
        expect(result[0].theme.key).toBe('team1');
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

        sampleTeams = constructTeamData(sampleTestTeams, 'nrl');
    });

    const mockDraw = [{
        selectedRoundId: 1,
        selectedSeasonId: 2023,
        filterTeams: [],
        byes: [],
        fixtures: [{
            matchMode: 'Post' as 'Post' | 'Pre' | 'Live',
            matchState: 'FullTime' as 'FullTime' | 'Upcoming' | 'FirstHalf' | 'HalfTime' | 'SecondHalf' | 'ExtraTime',
            matchCentreUrl: '/draw/nrl-premiership/2023/round-1/team1-v-team2/',
            roundTitle: 'Round 1',
            homeTeam: { nickName: 'Team1', score: 20, theme: { key: 'team1' } },
            awayTeam: { nickName: 'Team2', score: 10, theme: { key: 'team2' } },
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
                maxPoints: 54,
                noByeMaxPoints: 48,
            },
            qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
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
                'team1-v-team2': {
                    'team1': 30,
                    'team2': 20
                }
            }
        };
        localStorage.setItem('predictedMatches2023nrl', JSON.stringify(predictedMatch));

        const preMatchDraw = [{
            ...mockDraw[0],
            fixtures: [{
                ...mockDraw[0].fixtures[0],
                matchMode: 'Pre' as 'Post' | 'Pre' | 'Live',
                matchCentreUrl: '/draw/nrl-premiership/2023/round-1/team1-v-team2/',
                homeTeam: { nickName: 'Team1', score: '', theme: { key: 'team1' } },
                awayTeam: { nickName: 'Team2', score: '', theme: { key: 'team2' } },
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
                'team1-v-team2': {
                    'team1': '',
                    'team2': ''
                }
            }
        };
        localStorage.setItem('predictedMatches2023nrl', JSON.stringify(invalidPrediction));

        const preMatchDraw = [{
            ...mockDraw[0],
            fixtures: [{
                ...mockDraw[0].fixtures[0],
                matchMode: 'Pre' as 'Post' | 'Pre' | 'Live',
                matchCentreUrl: '/draw/nrl-premiership/2023/round-1/team1-v-team2/',
                homeTeam: { nickName: 'Team1', score: '', theme: { key: 'team1' } },
                awayTeam: { nickName: 'Team1', score: '', theme: { key: 'team2' } },
            }]
        }];

        constructTeamStats(preMatchDraw, 1, sampleTeams, true, 'nrl', 2023);

        expect(localStorage.getItem('predictedMatches2023nrl')).toBeUndefined();
    });
});

describe('test suite team sort function', () => {
    const team1: TeamData = {
        name: 'Team1',
        theme: { key: 'team1' },
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
            maxPoints: 54,
            noByeMaxPoints: 48,
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    };

    const team2: TeamData = {
        name: 'Team2',
        theme: { key: 'team2' },
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
            maxPoints: 54,
            noByeMaxPoints: 48,
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
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
