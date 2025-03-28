import clsx from 'clsx';

export default function Score({score, winCondition}: {score: number | string, winCondition: boolean}) {
    return <div className={clsx('text-3xl w-[45px] text-center', {'font-semibold': winCondition})}>{score}</div>;
}
