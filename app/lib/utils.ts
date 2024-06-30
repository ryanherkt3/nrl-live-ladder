export const getLadderStats = async () => {
    // TODO fix issues
    // const apiUrl = "http://127.0.0.1:8080/api/ladderdata";
    const apiUrl = "https://corsproxy.io/?https://www.nrl.com/ladder//data";
    
    const ladderReq = await fetch(apiUrl, {cache: "no-store"});
    const ladderJson = await ladderReq.json();
    const ladderStats = ladderJson.positions;

    return ladderStats;
}

export const getCurrentRound = async () => {
    // TODO fix issues
    // const apiUrl = "http://127.0.0.1:8080/api/drawdata";
    const apiUrl = "https://corsproxy.io/?https://www.nrl.com/draw//data";
    
    const drawReq = await fetch(apiUrl, {cache: "no-store"});
    const drawJson = await drawReq.json();

    return drawJson;
}
