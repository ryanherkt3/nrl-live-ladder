import clsx from 'clsx';

export default function Score(
    {
        score,
        winCondition,
        isHomeTeam
    }:
    {
        score: number | string,
        winCondition: boolean,
        isHomeTeam: boolean
    }
) {
    return <div className={
        clsx(
            'max-md:text-2xl md:text-3xl w-9.5 text-center',
            {
                'font-semibold': winCondition,
                'sm:-order-1': !isHomeTeam,
            }
        )
    }>{score}</div>;
}
