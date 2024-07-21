export const getNRLInfo = async () => {
    const apiUrl = `${process.env.FLASK_API_URL}/api/nrlinfo`;
    
    const nrlInfoReq = await fetch(apiUrl, {cache: "no-store"});
    const nrlInfoReqJson = nrlInfoReq.json();

    return nrlInfoReqJson;
}

export const getShortCode = (name: string) => {
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

export const getNumberSuffix = (num: number) => {
    if ([1, 21].includes(num)) {
        return `${num}st`;
    }

    if ([2, 22].includes(num)) {
        return `${num}nd`;
    }

    if ([3, 23].includes(num)) {
        return `${num}rd`;
    }

    return `${num}th`;
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