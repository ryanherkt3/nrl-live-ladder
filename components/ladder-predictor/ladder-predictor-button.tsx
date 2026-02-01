import clsx from 'clsx';

export default function LadderPredictorButton(
    {
        text,
        activeClasses,
        disabledClasses,
        disabled,
        clickCallback
    }:
    {
        text: string,
        activeClasses: string,
        disabledClasses: string,
        disabled: boolean,
        clickCallback: () => void
    }
) {
    return (
        <button
            className={
                clsx(
                    'rounded-lg border font-semibold text-lg w-fit h-fit p-2',
                    {
                        [activeClasses]: disabled,
                        [`${disabledClasses} cursor-pointer`]: !disabled,
                    }
                )
            }
            onClick={clickCallback.bind(null)}
            disabled={disabled}
        >
            {text}
        </button>
    );
}
