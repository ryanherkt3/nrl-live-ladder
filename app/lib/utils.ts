/**
 * Get the three letter code for a club
 *
 * @param {string} name
 * @returns {String}
 */
export function getShortCode(name: string) {
    switch (name) {
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
    switch (cardinalNo) {
        case 1:
        case 21:
            return `${cardinalNo}st`;
        case 2:
        case 22:
            return `${cardinalNo}nd`;
        case 3:
        case 23:
            return `${cardinalNo}rd`;
        default:
            return `${cardinalNo}th`;
    }
}

export let CURRENTYEAR: Number = new Date(Date.now()).getFullYear();
/**
 * Set the current year
 *
 * @param {number} the year from the draw (e.g. 2025)
 */
export function setCurrentYear(year: Number) {
    CURRENTYEAR = year;
}

// TODO move colours code to new file (lib/colours.ts)
export let MAINCOLOUR: String = 'nrl-colour';
/**
 * Set the main colour.
 *
 * Special round colours:
 * Multicultural - round 5
 * Women in League - round 10
 * Beanies for Brain Cancer - round 17
 * Indigenous - round 23-24 | 6-7
 * Country - round 25 | 8
 *
 * @param {string} comp the competition ID (e.g. 111 for NRL)
 * @param {number} currentRoundNo the current round number (e.g. 7)
 */
export function setMainColour(comp: number, currentRoundNo: number) {
    let prefix = '';

    const nrlSpecials = [5, 10, 17, 23, 24, 25];
    const nrlwSpecials = [6, 7, 8];

    if (comp === COMPID.NRLW && nrlwSpecials.includes(currentRoundNo)) {
        prefix += `nrlw-${currentRoundNo === 8 ? '-ctry' : '-ind'}`;
    }
    else if (comp === COMPID.NRL && nrlSpecials.includes(currentRoundNo)) {
        prefix = 'nrl';
        switch (currentRoundNo) {
            case 5:
                prefix += '-mclt';
                break;
            case 10:
                prefix += '-wil';
                break;
            case 17:
                prefix += '-bean';
                break;
            case 23:
            case 24:
                prefix += '-ind';
                break;
            case 25:
                prefix += '-ctry';
                break;
            default:
                break;
        }
    }
    else if (comp === COMPID.NSW || comp === COMPID.QLD) {
        prefix = comp === COMPID.NSW ? 'nsw' : 'qld';
    }
    else {
        prefix = 'nrl';
    }

    MAINCOLOUR = prefix;
}

export const COMPID = Object.freeze({
    NRL: 111,
    NRLW: 161,
    NSW: 113,
    QLD: 114,
});

// TODO is there a more efficient way to do this?
export const COLOURCSSVARIANTS : { [key: string]: unknown } = Object.freeze({
    'nrl-bg': 'bg-nrl',
    'nrl-border': 'border-nrl',
    'nrl-text': 'text-nrl',
    'nrl-hover-bg': 'hover:bg-nrl',
    'nrl-hover-text': 'hover:text-nrl',

    'nrlw-bg': 'bg-nrlw',
    'nrlw-border': 'border-nrlw',
    'nrlw-text': 'text-nrlw',
    'nrlw-hover-bg': 'hover:bg-nrlw',
    'nrlw-hover-text': 'hover:text-nrlw',

    'nsw-bg': 'bg-nsw',
    'nsw-border': 'border-nsw',
    'nsw-text': 'text-nsw',
    'nsw-hover-bg': 'hover:bg-nsw',
    'nsw-hover-text': 'hover:text-nsw',

    'qld-bg': 'bg-qld',
    'qld-border': 'border-qld',
    'qld-text': 'text-qld',
    'qld-hover-bg': 'hover:bg-qld',
    'qld-hover-text': 'hover:text-qld',

    'nrl-mclt-bg': 'bg-nrl-mclt',
    'nrl-mclt-border': 'border-nrl-mclt',
    'nrl-mclt-text': 'text-nrl-mclt',
    'nrl-mclt-hover-bg': 'hover:bg-nrl-mclt',
    'nrl-mclt-hover-text': 'hover:text-nrl-mclt',

    'nrl-wil-bg': 'bg-nrl-wil',
    'nrl-wil-border': 'border-nrl-wil',
    'nrl-wil-text': 'text-nrl-wil',
    'nrl-wil-hover-bg': 'hover:bg-nrl-wil',
    'nrl-wil-hover-text': 'hover:text-nrl-wil',

    'nrl-bean-bg': 'bg-nrl-bean',
    'nrl-bean-border': 'border-nrl-bean',
    'nrl-bean-text': 'text-nrl-bean',
    'nrl-bean-hover-bg': 'hover:bg-nrl-bean',
    'nrl-bean-hover-text': 'hover:text-nrl-bean',

    'nrl-ind-bg': 'bg-nrl-ind',
    'nrl-ind-border': 'border-nrl-ind',
    'nrl-ind-text': 'text-nrl-ind',
    'nrl-ind-hover-bg': 'hover:bg-nrl-ind',
    'nrl-ind-hover-text': 'hover:text-nrl-ind',

    'nrl-ctry-bg': 'bg-nrl-ctry',
    'nrl-ctry-border': 'border-nrl-ctry',
    'nrl-ctry-text': 'text-nrl-ctry',
    'nrl-ctry-hover-bg': 'hover:bg-nrl-ctry',
    'nrl-ctry-hover-text': 'hover:text-nrl-ctry',

    'nrlw-ind-bg': 'bg-nrlw-ind',
    'nrlw-ind-border': 'border-nrlw-ind',
    'nrlw-ind-text': 'text-nrlw-ind',
    'nrlw-ind-hover-bg': 'hover:bg-nrlw-ind',
    'nrlw-ind-hover-text': 'hover:text-nrlw-ind',

    'nrlw-ctry-bg': 'bg-nrlw-ctry',
    'nrlw-ctry-border': 'border-nrlw-ctry',
    'nrlw-ctry-hover-bg': 'hover:bg-nrlw-ctry',
    'nrlw-ctry-text': 'text-nrlw-ctry',
    'nrlw-ctry-hover-text': 'hover:text-nrlw-ctry',
});

export const NUMS = Object.freeze({
    ROUNDS: 27,
    FINALS_WEEKS: 4,
    BYES: 3,
    MATCHES: 24,
    TEAMS: 17,
    FINALS_TEAMS: 8,
    WIN_POINTS: 2,
});
