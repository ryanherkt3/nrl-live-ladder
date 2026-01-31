import { CompInfo } from './definitions';

/**
 * Get the three letter code for a club
 *
 * @param {string} name
 * @param {string} currentComp the competition for which the shortcodes are required
 * @returns {String}
 */
export function getShortCode(name: string, currentComp: string) {
    const isNSWCup = currentComp === 'nsw';

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
            return (isNSWCup ? 'NSB' : 'BUR');
        case 'Jets':
            return (isNSWCup ? 'NWT' : 'IPS');
        case 'Magpies':
            return (isNSWCup ? 'WSM' : 'MAG');
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
 * Converts a cardinal to an ordinal number (e.g 2 -> 2nd). Used for showing dates and ladder positions
 *
 * @param {number} cardinalNo
 * @returns {String} the ordinal number
 */
export function getOrdinalNumber(cardinalNo: number) {
    if (cardinalNo % 10 === 1 && cardinalNo !== 11) {
        return `${cardinalNo}st`;
    }
    if (cardinalNo % 10 === 2 && cardinalNo !== 12) {
        return `${cardinalNo}nd`;
    }
    if (cardinalNo % 10 === 3 && cardinalNo !== 13) {
        return `${cardinalNo}rd`;
    }

    return `${cardinalNo}th`;
}

export const COMPID : Record<string, number> = Object.freeze({
    NRL: 111,
    NRLW: 161,
    NSW: 113,
    QLD: 114,
});

// TODO
// 1. Is there a more efficient way to do this?
// 2. Move colours code to new file (lib/colours.ts)
export const COLOURCSSVARIANTS : Record<string, string> = Object.freeze({
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

export const NUMS : Record<string, CompInfo> = Object.freeze({
    nrl: {
        ROUNDS: 27,
        FINALS_WEEKS: 4,
        WEEK_ONE_FINALS_FORMAT: [[1, 4], [2, 3], [5, 8], [6, 7]],
        BYES: 3,
        MATCHES: 24,
        TEAMS: 17,
        FINALS_TEAMS: 8,
        WIN_POINTS: 2,
    },
    nrlw: {
        ROUNDS: 11,
        FINALS_WEEKS: 3,
        WEEK_ONE_FINALS_FORMAT: [[3, 6], [4, 5]],
        BYES: 0,
        MATCHES: 11,
        TEAMS: 12,
        FINALS_TEAMS: 6,
        WIN_POINTS: 2,
    },
    nsw: {
        ROUNDS: 26,
        FINALS_WEEKS: 4,
        WEEK_ONE_FINALS_FORMAT: [[2, 3], [4, 5]],
        BYES: 2,
        MATCHES: 24,
        TEAMS: 13,
        FINALS_TEAMS: 5,
        WIN_POINTS: 2,
    },
    qld: {
        ROUNDS: 23,
        FINALS_WEEKS: 4,
        WEEK_ONE_FINALS_FORMAT: [[1, 4], [2, 3], [5, 8], [6, 7]],
        BYES: 3,
        MATCHES: 20,
        TEAMS: 15,
        FINALS_TEAMS: 8,
        WIN_POINTS: 2,
    },
});

export const LINKS = [
    {
        url: '/',
        title: 'Home'
    },
    {
        url: '/ladder',
        title: 'Live Ladder'
    },
    {
        url: '/finals-race',
        title: 'Finals Race'
    },
    {
        url: '/ladder-predictor',
        title: 'Ladder Predictor'
    }
];
