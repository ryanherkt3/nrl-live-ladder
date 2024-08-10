export type TeamData = {
    stats: TeamStats;
    teamNickname: string;
    theme: TeamTheme;
    value: number; // TODO what is this for (?)
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

export type LadderInfo = {
    positions: TeamData[];
}

export type DrawInfo = {
    fixtures: Match[];
    byes: ByeTeam[];
    selectedRoundId: number;
    filterTeams: FilteredTeam[];
}

export type FilteredTeam = {
    name: string;
    value: number;
}
