import clsx from 'clsx';

export default function ByeToggleSection({setByeValue, byeValueCb}: {setByeValue: boolean, byeValueCb: Function}) {
    return (
        <div className="flex flex-col xs:flex-row gap-4 items-end xs:justify-end">
            <ByeToggle setByeValue={setByeValue} byeValue={true} byeValueCb={byeValueCb} />
            <ByeToggle setByeValue={setByeValue} byeValue={false} byeValueCb={byeValueCb} />
        </div>
    );
}

function ByeToggle(
    {
        setByeValue,
        byeValue,
        byeValueCb
    }:
    {
        setByeValue: boolean,
        byeValue: boolean,
        byeValueCb: Function
    }
) {
    return (
        <div
            className="flex flex-row gap-3 font-semibold text-xl cursor-pointer"
            onClick={() => byeValueCb(byeValue)}
        >
            <div
                className={
                    clsx(
                        'border border-green-400 w-7 rounded-full',
                        {
                            'bg-green-400': byeValue === setByeValue
                        }
                    )
                }
            ></div>
            <div>{byeValue ? 'Byes' : 'No Byes'}</div>
        </div>
    );
}
