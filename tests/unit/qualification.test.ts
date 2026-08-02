/* eslint-disable @typescript-eslint/no-unsafe-call */

import { TeamData, TeamStatuses } from '../../lib/definitions';
import { qualificationTestTeams } from '../qualificationObject';
import { getMinPointsForSpots, getQualificationStatus } from '../../lib/qualification';
import { expect, describe } from '@jest/globals';

describe('test suite qualification', () => {
    let sampleTeams: TeamData[];
    let minPointsForSpots: TeamStatuses;

    beforeEach(() => {
        sampleTeams = qualificationTestTeams;
        minPointsForSpots = getMinPointsForSpots(sampleTeams, 'nsw', 2026);
    });

    it('Returns the correct points required to achieve a certain status', () => {
        expect(minPointsForSpots.finalsQualification).toBe(37);
        expect(minPointsForSpots.topFour).toBe(35);
        expect(minPointsForSpots.topTwo).toBe(41);
    });

    it('Assigns the correct qualification statuses', () => {
        const panthersQualiStatus = getQualificationStatus(sampleTeams[0], sampleTeams, minPointsForSpots, 'nsw', 2026);
        // const dragonsQualiStatus =
        //  getQualificationStatus(sampleTeams[1], sampleTeams, minPointsForSpots, 'nsw', 2026);
        // const eelsQualiStatus = getQualificationStatus(sampleTeams[2], sampleTeams, minPointsForSpots, 'nsw', 2026);
        const warriorsQualiStatus = getQualificationStatus(sampleTeams[5], sampleTeams, minPointsForSpots, 'nsw', 2026);
        const stormQualiStatus =
            getQualificationStatus(sampleTeams[12], sampleTeams, minPointsForSpots, 'nsw', 2026);

        // expect(dragonsQualiStatus).toBe('(T2)');
        expect(panthersQualiStatus).toBe('(T4)');
        // expect(eelsQualiStatus).toBe('(Q)');
        expect(warriorsQualiStatus).toBe('');
        expect(stormQualiStatus).toBe('(E)');
    });
});
