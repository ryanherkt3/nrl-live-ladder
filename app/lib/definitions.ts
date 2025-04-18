export type TeamData = {
    stats: TeamStats;
    name: string;
    theme: TeamTheme;
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
    topEight: number,
    eliminated: number,
}

export type TeamPoints = {
    lowestCurrentPoints: number,
    highestMaxPoints: number,
    currentPoints: number,
    maxPoints: number,
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
