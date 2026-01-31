/* eslint-disable no-unused-vars */
export interface TeamData {
    stats: TeamStats;
    name: string;
    theme: TeamTheme;
}

export interface NextTeam {
    nickname: string;
    theme: TeamTheme;
    matchCentreUrl: string;
    isBye: boolean;
}

export interface TeamStats {
    played: number;
    wins: number;
    drawn: number;
    lost: number;
    byes: number;
    'points for': number;
    'points against': number;
    'points difference': number;
    points: number;
    noByePoints: number;
    maxPoints: number;
}

export interface TeamTheme {
    key: string;
}

export interface Match {
    matchMode: 'Pre' | 'Post' | 'Live';
    matchState: 'Upcoming' | 'FirstHalf' | 'HalfTime' | 'SecondHalf' | 'FullTime' | 'ExtraTime';
    matchCentreUrl: string;
    roundTitle: string;
    homeTeam: FixtureTeam;
    awayTeam: FixtureTeam;
    clock: MatchTime;
    isCurrentRound: boolean;
}

export interface ByeTeam {
    isCurrentRound: boolean;
    teamNickName: string;
    theme: TeamTheme;
}

export interface MatchTime {
    kickOffTimeLong: string;
    gameTime: string;
}

export interface FixtureTeam {
    nickName: string;
    score: number | string;
    theme: TeamTheme;
}

export interface DrawInfo {
    fixtures: Match[];
    byes: ByeTeam[];
    selectedRoundId: number;
    selectedSeasonId: number;
    filterTeams: TeamData[];
}

export interface TeamStatuses {
    topTwo: number,
    topFour: number,
    finalsQualification: number,
    eliminated: number,
}

export interface TeamPoints {
    lowestCurrentPoints: number,
    highestMaxPoints: number,
    currentPoints: number,
    maxPoints: number,
}

export interface PageVariables {
    currentRoundInfo: DrawInfo[],
    byes: ByeTeam[]
    fixtures: Match[],
    currentRoundNo: number,
    nextRoundInfo: DrawInfo | undefined,
    liveMatches: Match[],
    allTeams: TeamData[]
}

export interface CompInfo {
    ROUNDS: number,
    FINALS_WEEKS: number,
    WEEK_ONE_FINALS_FORMAT: number[][],
    BYES: number,
    MATCHES: number,
    TEAMS: number,
    FINALS_TEAMS: number,
    WIN_POINTS: number,
}

export interface MainSiteColour {
    colour: string,
    updateStatus: ReduxUpdateFlags
}

export interface CurrentComp {
    comp: string,
    updateStatus: ReduxUpdateFlags
}

export interface CurrentYear {
    year: number,
    updateStatus: ReduxUpdateFlags
}

export enum ReduxUpdateFlags {
    NotUpdated = 0,
    InitialUpdate = 1,
    FinalUpdate = 2,
}

