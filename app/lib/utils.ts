export const getLadderStats = async () => {
    const apiUrl = "http://127.0.0.1:8080/api/ladderdata";
    
    const ladderReq = await fetch(apiUrl, {cache: "no-store"});
    const ladderJson = await ladderReq.json();
    const ladderStats = ladderJson.positions;

    return ladderStats;
}

export const getCurrentRound = async () => {
    const apiUrl = "http://127.0.0.1:8080/api/drawdata";
    
    const drawReq = await fetch(apiUrl, {cache: "no-store"});
    const drawJson = await drawReq.json();

    return drawJson;
}
