import clsx from "clsx";

export default function Score({score, winCondition}: {score: number, winCondition: boolean}) {
    return <div className={clsx('text-3xl', {'font-semibold': winCondition})}>{score}</div>;
}