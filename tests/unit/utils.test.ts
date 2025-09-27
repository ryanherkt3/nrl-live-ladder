import { getShortCode, getOrdinalNumber } from '../../lib/utils';

describe('test suite short codes', () => {
    it('Returns correct codes for NRL teams', () => {
        expect(getShortCode('Broncos', 'nrl')).toBe('BRI');
        expect(getShortCode('Raiders', 'nrl')).toBe('CAN');
        expect(getShortCode('Dolphins', 'nrl')).toBe('DOL');
        expect(getShortCode('Titans', 'nrl')).toBe('GLD');
        expect(getShortCode('Sea Eagles', 'nrl')).toBe('MAN');
        expect(getShortCode('Storm', 'nrl')).toBe('MEL');
        expect(getShortCode('Knights', 'nrl')).toBe('NEW');
        expect(getShortCode('Cowboys', 'nrl')).toBe('NQL');
        expect(getShortCode('Eels', 'nrl')).toBe('PAR');
        expect(getShortCode('Panthers', 'nrl')).toBe('PEN');
        expect(getShortCode('Rabbitohs', 'nrl')).toBe('SOU');
        expect(getShortCode('Dragons', 'nrl')).toBe('SGI');
        expect(getShortCode('Roosters', 'nrl')).toBe('SYD');
        expect(getShortCode('Warriors', 'nrl')).toBe('WAR');
        expect(getShortCode('Wests Tigers', 'nrl')).toBe('WST');
        expect(getShortCode('Sharks', 'nrl')).toBe('CRO');
        expect(getShortCode('Bulldogs', 'nrl')).toBe('CBY');
    });

    it('Returns correct NSW Cup code for Bears, Jets and Magpies', () => {
        expect(getShortCode('Bears', 'nsw')).toBe('NSB');
        expect(getShortCode('Jets', 'nsw')).toBe('NWT');
        expect(getShortCode('Magpies', 'nsw')).toBe('WSM');
    });

    it('Returns correct QLD Cup code for Bears, Jets and Magpies', () => {
        expect(getShortCode('Bears', 'qld')).toBe('BUR');
        expect(getShortCode('Jets', 'qld')).toBe('IPS');
        expect(getShortCode('Magpies', 'qld')).toBe('MAG');
    });

    it('Returns correct code for Q Cup only teams', () => {
        expect(getShortCode('Blackhawks', 'qld')).toBe('BLA');
        expect(getShortCode('Capras', 'qld')).toBe('CAP');
        expect(getShortCode('Clydesdales', 'qld')).toBe('CLY');
        expect(getShortCode('Cutters', 'qld')).toBe('CUT');
        expect(getShortCode('Devils', 'qld')).toBe('DEV');
        expect(getShortCode('Falcons', 'qld')).toBe('FAL');
        expect(getShortCode('Hunters', 'qld')).toBe('PNG');
        expect(getShortCode('Pride', 'qld')).toBe('PRI');
        expect(getShortCode('Seagulls', 'qld')).toBe('SEA');
        expect(getShortCode('Tigers', 'qld')).toBe('TIG');
        expect(getShortCode('WM Seagulls', 'qld')).toBe('SEA');
    });

    it('Returns NRL for other teams', () => {
        expect(getShortCode('Unknown Team', 'nrl')).toBe('NRL');
        expect(getShortCode('', 'nrl')).toBe('NRL');
    });
});

describe('test suite ordinal numbers', () => {
    it('Returns 1st as ordinal number for 1', () => {
        expect(getOrdinalNumber(1)).toBe('1st');
    });
    it('Returns 2nd as ordinal number for 2', () => {
        expect(getOrdinalNumber(2)).toBe('2nd');
    });
    it('Returns 3rd as ordinal number for 3', () => {
        expect(getOrdinalNumber(3)).toBe('3rd');
    });

    it('Returns 11th as ordinal number for 11', () => {
        expect(getOrdinalNumber(11)).toBe('11th');
    });
    it('Returns 12th as ordinal number for 12', () => {
        expect(getOrdinalNumber(12)).toBe('12th');
    });
    it('Returns 13th as ordinal number for 13', () => {
        expect(getOrdinalNumber(13)).toBe('13th');
    });

    it('Returns 7th as ordinal number for 7', () => {
        expect(getOrdinalNumber(7)).toBe('7th');
    });
    it('Returns 30th as ordinal number for 30', () => {
        expect(getOrdinalNumber(30)).toBe('30th');
    });
    it('Returns 31st as ordinal number for 31', () => {
        expect(getOrdinalNumber(31)).toBe('31st');
    });
});
