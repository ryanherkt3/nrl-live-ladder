export const getNRLInfo = async () => {
    const apiUrl = "http://127.0.0.1:8080/api/nrlinfo";
    
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
