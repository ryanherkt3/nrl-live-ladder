export type TeamData = {
    clubProfileUrl: string;
    movement: string;
    next: NextTeam;
    stats: TeamStats;
    liveStats: TeamStats;
    teamNickname: string;
    theme: TeamTheme;
    designation: 'homeTeam' | 'awayTeam' | undefined;
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
};

export type TeamTheme = {
    key: string;
};

export type Match = {
    matchMode: 'Pre' | 'Post' | 'Live';
    matchState: 'Upcoming' | 'FirstHalf' | 'HalfTime' | 'SecondHalf' | 'FullTime';
    matchCentreUrl: string;
    homeTeam: FixtureTeam;
    awayTeam: FixtureTeam;
    clock: MatchTime;
};

export type ByeTeam = {
    teamNickName: string;
    theme: TeamTheme;
}

export type MatchTime = {
    kickOffTimeLong: string;
    gameTime: string;
}

export type FixtureTeam = {
    nickName: string;
    score: number;
    theme: TeamTheme;
}

export type APIInfo = {
    draw: DrawInfo;
    ladder: LadderInfo;
}

export type DrawInfo = {
    fixtures: Match[];
    byes: ByeTeam[];
    selectedRoundId: number;
}

export type LadderInfo = {
    positions: TeamData[];
}
