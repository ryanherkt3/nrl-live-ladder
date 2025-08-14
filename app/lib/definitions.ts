/* eslint-disable no-unused-vars */
export type TeamData = {
    stats: TeamStats;
    name: string;
    theme: TeamTheme;
    qualificationStatus: '' | '(Q)' | '(E)' | '(T4)' | '(T2)';
};

export type NextTeam = {
    nickname: string;
    theme: TeamTheme;
    matchCentreUrl: string;
    isBye: boolean;
};

export type TeamStats = {
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
    noByeMaxPoints: number;
};

export type TeamTheme = {
    key: string;
};

export type Match = {
    matchMode: 'Pre' | 'Post' | 'Live';
    matchState: 'Upcoming' | 'FirstHalf' | 'HalfTime' | 'SecondHalf' | 'FullTime' | 'ExtraTime';
    matchCentreUrl: string;
    roundTitle: string;
    homeTeam: FixtureTeam;
    awayTeam: FixtureTeam;
    clock: MatchTime;
    isCurrentRound: boolean;
};

export type ByeTeam = {
    isCurrentRound: boolean;
    roundTitle: string;
    teamNickName: string;
    theme: TeamTheme;
}

export type MatchTime = {
    kickOffTimeLong: string;
    gameTime: string;
}

export type FixtureTeam = {
    nickName: string;
    score: number | string;
    theme: TeamTheme;
}

export type DrawInfo = {
    fixtures: Match[];
    byes: ByeTeam[];
    selectedRoundId: number;
    selectedSeasonId: number;
    filterTeams: TeamData[];
}

export type TeamStatuses = {
    topTwo: number,
    topFour: number,
    finalsQualification: number,
    eliminated: number,
}

export type QualificationConditions = {
    teamName: string,
    resultSets: Array<QualificationResultSets>
}

export type QualificationDisplay = {
    teamName: string,
    requirementString: string,
    requirementSatisfied: boolean | 'TBC' | 'N/A'
}

export type QualificationResultSets = {
    result: 'W' | 'D' | 'L' | 'DL' | 'DW' | '',
    teamName: string | 'self',
    dependentResults: Array<QualificationResultSets> | null
    requirementSatisfied: boolean | 'TBC'
}

export type QualificationScenarios = {
    eliminatedTeams: Array<QualificationConditions>,
    qualifiedTeams: Array<QualificationConditions>,
    topFourTeams: Array<QualificationConditions>,
    topTwoTeams: Array<QualificationConditions>
}

export type TeamPoints = {
    lowestCurrentPoints: number,
    highestMaxPoints: number,
    currentPoints: number,
    maxPoints: number,
    currentNoByePoints: number,
    maxNoByePoints: number,
}

export type PageVariables = {
    currentRoundInfo: DrawInfo[],
    byes: ByeTeam[]
    fixtures: Match[],
    currentRoundNo: number,
    nextRoundInfo: DrawInfo | undefined,
    liveMatches: Match[],
    allTeams: TeamData[]
}

export type CompInfo = {
    DRAW_POINTS: number;
    ROUNDS: number,
    FINALS_WEEKS: number,
    BYES: number,
    MATCHES: number,
    TEAMS: number,
    FINALS_TEAMS: number,
    WIN_POINTS: number,
}

export type MainSiteColour = {
    colour: string,
    updateStatus: ReduxUpdateFlags
}

export type CurrentComp = {
    comp: string,
    updateStatus: ReduxUpdateFlags
}

export type CurrentYear = {
    year: number,
    updateStatus: ReduxUpdateFlags
}

export enum ReduxUpdateFlags {
    NotUpdated = 0,
    InitialUpdate = 1,
    FinalUpdate = 2,
}

