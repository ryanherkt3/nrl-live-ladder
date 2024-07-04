export type TeamData = {
    clubProfileUrl: string;
    movement: string;
    next: NextTeam;
    stats: TeamStats;
    liveStats: LiveTeamStats;
    teamNickname: string;
    theme: TeamTheme;
    designation: 'homeTeam' | 'awayTeam' | undefined;
};

export type NextTeam = {
    fullName: string;
    teamId: number;
    nickname: string;
    theme: TeamTheme;
    matchCentreUrl: string;
    isBye: boolean;
};

export type TeamStats = {
    played: number,
    wins: number,
    drawn: number,
    lost: number,
    byes: number,
    'points for': number,
    'points against': number,
    'points difference': number,
    'home record': string,
    'away record': string,
    points: number,
    noByePoints: number,
    'bonus points': number,
    streak: string,
    form: string,
    'average losing margin': number,
    'average winning margin': number,
    'golden point': number,
    'close games': number,
    'day record': string,
    'night record': string,
    'players used': number
};

export type LiveTeamStats = {
    played: number,
    wins: number,
    drawn: number,
    lost: number,
    byes: number,
    'points for': number,
    'points against': number,
    'points difference': number
    points: number,
    noByePoints: number,
};

export type TeamTheme = {
    key: string;
    logos: string[];
};

export type Match = {
    isCurrentRound: boolean;
    roundTitle: string;
    type: string;
    matchMode: 'Pre' | 'Post' | 'Live';
    matchState: 'Upcoming' | 'FirstHalf'  | 'HalfTime' | 'SecondHalf' | 'FullTime';
    venue: string;
    venueCity: string;
    matchCentreUrl: string;
    callToAction: CTA;
    homeTeam: FixtureTeam;
    awayTeam: FixtureTeam;
    clock: MatchTime
};

export type ByeTeam = {
    isCurrentRound: boolean;
    roundTitle: string;
    teamNickName: string;
    theme: TeamTheme;
    type: string;
}

export type MatchTime = {
    kickOffTimeLong: string;
    gameTime: string;
}

export type CTA = {
    accessibleText: string;
    text: string;
    url: string;
    type: string;
}

export type FixtureTeam = {
    teamId: number;
    nickName: string;
    score: number;
    teamPosition: string;
    theme: TeamTheme;
}
