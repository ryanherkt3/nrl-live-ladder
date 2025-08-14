export const sampleTestTeams = [
    {
        name: 'Team1',
        theme: { key: 'team1' },
        stats: {
            played: 0,
            wins: 0,
            drawn: 0,
            lost: 0,
            byes: 0,
            'points for': 0,
            'points against': 0,
            'points difference': 0,
            points: 0,
            noByePoints: 0,
            maxPoints: 54,
            noByeMaxPoints: 48,
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    },
    {
        name: 'Team2',
        theme: { key: 'team2' },
        stats: {
            played: 0,
            wins: 0,
            drawn: 0,
            lost: 0,
            byes: 0,
            'points for': 0,
            'points against': 0,
            'points difference': 0,
            points: 0,
            noByePoints: 0,
            maxPoints: 54,
            noByeMaxPoints: 48,
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    }
];

export const qualificationTestTeams = [
    // Warriors (T2)
    {
        'stats': {
            'played': 20,
            'wins': 18,
            'drawn': 1,
            'lost': 1,
            'byes': 2,
            'points for': 671,
            'points against': 320,
            'points difference': 351,
            'points': 41,
            'noByePoints': 37,
            'maxPoints': 49,
            'noByeMaxPoints': 43,
        },
        'name': 'Warriors',
        'theme': {
            'key': 'warriors'
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    },
    // Dragons (T4)
    {
        'stats': {
            'played': 21,
            'wins': 15,
            'drawn': 2,
            'lost': 4,
            'byes': 2,
            'points for': 632,
            'points against': 438,
            'points difference': 194,
            'points': 36,
            'noByePoints': 32,
            'maxPoints': 42,
            'noByeMaxPoints': 38,
        },
        'name': 'Dragons',
        'theme': {
            'key': 'dragons'
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    },
    // Eels (Q)
    {
        'stats': {
            'played': 21,
            'wins': 14,
            'drawn': 1,
            'lost': 6,
            'byes': 2,
            'points for': 589,
            'points against': 475,
            'points difference': 114,
            'points': 33,
            'noByePoints': 29,
            'maxPoints': 39,
            'noByeMaxPoints': 35,
        },
        'name': 'Eels',
        'theme': {
            'key': 'eels'
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    },
    // Jets
    {
        'stats': {
            'played': 21,
            'wins': 13,
            'drawn': 1,
            'lost': 7,
            'byes': 1,
            'points for': 559,
            'points against': 424,
            'points difference': 135,
            'points': 29,
            'noByePoints': 27,
            'maxPoints': 37,
            'noByeMaxPoints': 35,
        },
        'name': 'Jets',
        'theme': {
            'key': 'jets'
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    },
    // Panthers
    {
        'stats': {
            'played': 20,
            'wins': 11,
            'drawn': 0,
            'lost': 9,
            'byes': 2,
            'points for': 532,
            'points against': 440,
            'points difference': 92,
            'points': 26,
            'noByePoints': 22,
            'maxPoints': 34,
            'noByeMaxPoints': 30,
        },
        'name': 'Panthers',
        'theme': {
            'key': 'panthers'
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    },
    // Roosters
    {
        'stats': {
            'played': 20,
            'wins': 10,
            'drawn': 0,
            'lost': 10,
            'byes': 2,
            'points for': 430,
            'points against': 529,
            'points difference': -99,
            'points': 24,
            'noByePoints': 20,
            'maxPoints': 32,
            'noByeMaxPoints': 28,
        },
        'name': 'Roosters',
        'theme': {
            'key': 'roosters'
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    },
    // Raiders
    {
        'stats': {
            'played': 21,
            'wins': 9,
            'drawn': 0,
            'lost': 12,
            'byes': 2,
            'points for': 570,
            'points against': 524,
            'points difference': 46,
            'points': 22,
            'noByePoints': 18,
            'maxPoints': 28,
            'noByeMaxPoints': 24,
        },
        'name': 'Raiders',
        'theme': {
            'key': 'raiders'
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    },
    // Bulldogs
    {
        'stats': {
            'played': 20,
            'wins': 8,
            'drawn': 2,
            'lost': 10,
            'byes': 2,
            'points for': 552,
            'points against': 559,
            'points difference': -7,
            'points': 22,
            'noByePoints': 18,
            'maxPoints': 30,
            'noByeMaxPoints': 26,
        },
        'name': 'Bulldogs',
        'theme': {
            'key': 'bulldogs'
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    },
    // Bears
    {
        'stats': {
            'played': 21,
            'wins': 8,
            'drawn': 0,
            'lost': 13,
            'byes': 2,
            'points for': 472,
            'points against': 540,
            'points difference': -68,
            'points': 20,
            'noByePoints': 16,
            'maxPoints': 26,
            'noByeMaxPoints': 22,
        },
        'name': 'Bears',
        'theme': {
            'key': 'north-sydney-bears'
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    },
    // Magpies
    {
        'stats': {
            'played': 21,
            'wins': 8,
            'drawn': 1,
            'lost': 12,
            'byes': 1,
            'points for': 466,
            'points against': 602,
            'points difference': -136,
            'points': 19,
            'noByePoints': 17,
            'maxPoints': 27,
            'noByeMaxPoints': 25,
        },
        'name': 'Magpies',
        'theme': {
            'key': 'western-suburbs-magpies'
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    },
    // Knights (E)
    {
        'stats': {
            'played': 20,
            'wins': 5,
            'drawn': 0,
            'lost': 15,
            'byes': 2,
            'points for': 444,
            'points against': 565,
            'points difference': -121,
            'points': 14,
            'noByePoints': 10,
            'maxPoints': 22,
            'noByeMaxPoints': 18,
        },
        'name': 'Knights',
        'theme': {
            'key': 'knights'
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    },
    // Sea Eagles (E)
    {
        'stats': {
            'played': 21,
            'wins': 6,
            'drawn': 0,
            'lost': 15,
            'byes': 1,
            'points for': 456,
            'points against': 651,
            'points difference': -195,
            'points': 14,
            'noByePoints': 12,
            'maxPoints': 22,
            'noByeMaxPoints': 20,
        },
        'name': 'Sea Eagles',
        'theme': {
            'key': 'sea-eagles'
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    },
    // Rabbitohs (E)
    {
        'stats': {
            'played': 21,
            'wins': 5,
            'drawn': 0,
            'lost': 16,
            'byes': 1,
            'points for': 370,
            'points against': 676,
            'points difference': -306,
            'points': 12,
            'noByePoints': 10,
            'maxPoints': 20,
            'noByeMaxPoints': 18,
        },
        'name': 'Rabbitohs',
        'theme': {
            'key': 'rabbitohs'
        },
        qualificationStatus: '' as '' | '(Q)' | '(E)' | '(T4)' | '(T2)'
    }
];
