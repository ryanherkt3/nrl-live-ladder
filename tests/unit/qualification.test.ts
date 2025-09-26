import { TeamData, TeamStatuses } from '../../lib/definitions';
import { qualificationTestTeams } from '../qualificationObject';
import { getMinPointsForSpots, getQualificationStatus } from '../../lib/qualification';

describe('test suite qualification', () => {
    let sampleTeams: TeamData[];
    let minPointsForSpots: TeamStatuses;

    beforeEach(() => {
        sampleTeams = qualificationTestTeams;
        minPointsForSpots = getMinPointsForSpots(sampleTeams, 'nsw');
    });

    it('Returns the correct points required to achieve a certain status', () => {
        expect(minPointsForSpots.eliminated).toBe(25);
        expect(minPointsForSpots.finalsQualification).toBe(33);
        expect(minPointsForSpots.topFour).toBe(35);
        expect(minPointsForSpots.topTwo).toBe(40);
    });

    it('Assigns the correct qualification statuses', () => {
        const warriorsQualiStatus = getQualificationStatus(sampleTeams[0], sampleTeams, minPointsForSpots, 'nsw');
        const dragonsQualiStatus = getQualificationStatus(sampleTeams[1], sampleTeams, minPointsForSpots, 'nsw');
        const eelsQualiStatus = getQualificationStatus(sampleTeams[2], sampleTeams, minPointsForSpots, 'nsw');
        const panthersQualiStatus = getQualificationStatus(sampleTeams[4], sampleTeams, minPointsForSpots, 'nsw');
        const rabbitohsQualiStatus = getQualificationStatus(sampleTeams[12], sampleTeams, minPointsForSpots, 'nsw');

        expect(warriorsQualiStatus).toBe('(T2)');
        expect(dragonsQualiStatus).toBe('(T4)');
        expect(eelsQualiStatus).toBe('(Q)');
        expect(panthersQualiStatus).toBe('');
        expect(rabbitohsQualiStatus).toBe('(E)');
    });
});
