/**
 * Get the three letter code for a club
 *
 * @param {string} name
 * @returns {String}
 */
export function getShortCode(name: string) {
    switch (name) {
        // NRL/W clubs:
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
        // NSW & Q Cup
        case 'Bears':
            return (CURRENTCOMP === 'nsw' ? 'NSB' : 'BUR');
        case 'Jets':
            return (CURRENTCOMP === 'nsw' ? 'NWT' : 'IPS');
        case 'Magpies':
            return (CURRENTCOMP === 'nsw' ? 'WSM' : 'MAG');
        // Q Cup only
        case 'Blackhawks':
            return 'BLA';
        case 'Capras':
            return 'CAP';
        case 'Clydesdales':
            return 'CLY';
        case 'Cutters':
            return 'CUT';
        case 'Devils':
            return 'DEV';
        case 'Falcons':
            return 'FAL';
        case 'Hunters':
            return 'PNG';
        case 'Pride':
            return 'PRI';
        case 'Seagulls':
            return 'SEA';
        case 'Tigers':
            return 'TIG';
        case 'WM Seagulls':
            return 'SEA';
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
export let MAINCOLOUR: string = 'nrl';
/**
 * Set the main colour to be used across the site for the team divider, upcoming games, predictor boxes etc.
 *
 * Special rounds:
 * Multicultural (mclt), Magic Round (magic), Women in League (wil)
 * Beanies for Brain Cancer (bean), Indigenous (ind), Country (ctry)
 *
 * @param {string} comp the competition ID (e.g. 111 for NRL)
 * @param {number} currentRoundNo the current round number (e.g. 7)
 */
export function setMainColour(comp: number, currentRoundNo: number) {
    let prefix = '';

    const { NSW, NRLW, NRL, QLD } = COMPID;

    if (comp === NRLW) {
        const NRLWROUNDID : { [key: number]: string } = Object.freeze({
            6: 'ind',
            7: 'ind',
            8: 'ctry'
        });

        prefix = 'nrlw';
        if (NRLWROUNDID[currentRoundNo]) {
            prefix += `-${NRLWROUNDID[currentRoundNo]}`;
        }
    }
    else if (comp === NRL) {
        const NRLROUNDID : { [key: number]: string } = Object.freeze({
            5: 'mclt',
            9: 'magic',
            10: 'wil',
            17: 'bean',
            23: 'ind',
            24: 'ind',
            25: 'ctry'
        });

        prefix = 'nrl';
        if (NRLROUNDID[currentRoundNo]) {
            prefix += `-${NRLROUNDID[currentRoundNo]}`;
        }
    }
    else if (comp === NSW || comp === QLD) {
        prefix = comp === NSW ? 'nsw' : 'qld';
    }
    else {
        prefix = 'nrl';
    }

    MAINCOLOUR = prefix;
}

export let CURRENTCOMP: string = 'nrl';
/**
 * Set the current competition (set to nrl by default if the value provided is invalid)
 *
 * @param {string} comp the competition (e.g. nrlw)
 */
export function setCurrentComp(comp: string) {
    CURRENTCOMP = Object.keys(COMPID).includes(comp.toUpperCase()) ? comp : 'nrl';
}

export const COMPID : { [key: string]: number } = Object.freeze({
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

    'nrl-magic-bg': 'bg-nrl-magic',
    'nrl-magic-border': 'border-nrl-magic',
    'nrl-magic-text': 'text-nrl-magic',
    'nrl-magic-hover-bg': 'hover:bg-nrl-magic',
    'nrl-magic-hover-text': 'hover:text-nrl-magic',

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NUMS : { [key: string]: any } = Object.freeze({
    nrl: {
        ROUNDS: 27,
        FINALS_WEEKS: 4,
        BYES: 3,
        MATCHES: 24,
        TEAMS: 17,
        FINALS_TEAMS: 8,
        WIN_POINTS: 2,
    },
    nrlw: {
        ROUNDS: 11,
        FINALS_WEEKS: 3,
        BYES: 0,
        MATCHES: 11,
        TEAMS: 12,
        FINALS_TEAMS: 6,
        WIN_POINTS: 2,
    },
    nsw: {
        ROUNDS: 26,
        FINALS_WEEKS: 4,
        BYES: 2,
        MATCHES: 24,
        TEAMS: 13,
        FINALS_TEAMS: 5,
        WIN_POINTS: 2,
    },
    qld: {
        ROUNDS: 23,
        FINALS_WEEKS: 4,
        BYES: 3,
        MATCHES: 20,
        TEAMS: 15,
        FINALS_TEAMS: 8,
        WIN_POINTS: 2,
    },
});
