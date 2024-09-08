/**
 * Get the three letter code for a club
 *
 * @param {string} name 
 * @returns {String}
 */
export function getShortCode(name: string) {
    switch(name) {
        case 'Broncos':
            return 'BRI';
        case 'Raiders':
            return 'CAN';
        case 'Bulldogs':
            return 'CBY';
        case 'Sharks':
            return 'CRO';
        case 'Dolphins':
            return 'DOL';
        case 'Titans':
            return 'GLD';
        case 'Sea Eagles':
            return 'MAN';
        case 'Storm':
            return 'MEL';
        case 'Knights':
            return 'NEW';
        case 'Cowboys':
            return 'NQL';
        case 'Eels':
            return 'PAR';
        case 'Panthers':
            return 'PEN';
        case 'Rabbitohs':
            return 'SOU';
        case 'Dragons':
            return 'SGI';
        case 'Roosters':
            return 'SYD';
        case 'Warriors':
            return 'WAR';
        case 'Wests Tigers':
            return 'WST';
        default:
            return 'NRL';
    }
}

/**
 * Converts a cardinal to an ordinal one (e.g 2 -> 2nd)
 *
 * @param {number} cardinalNo 
 * @returns {String} the ordinal number
 */
export function getOrdinalNumber(cardinalNo: number) {
    if ([1, 21].includes(cardinalNo)) {
        return `${cardinalNo}st`;
    }

    if ([2, 22].includes(cardinalNo)) {
        return `${cardinalNo}nd`;
    }

    if ([3, 23].includes(cardinalNo)) {
        return `${cardinalNo}rd`;
    }

    return `${cardinalNo}th`;
}

export const NUMS = Object.freeze({
    ROUNDS: 27,
    FINALS_WEEKS: 4,
    BYES: 3,
    MATCHES: 24,
    TEAMS: 17,
    FINALS_TEAMS: 8,
    WIN_POINTS: 2,
});