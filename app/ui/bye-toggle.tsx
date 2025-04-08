import clsx from 'clsx';
import { COLOURCSSVARIANTS, MAINCOLOUR } from '../lib/utils';

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
                        [`border ${COLOURCSSVARIANTS[`${MAINCOLOUR}-border`]} w-7 rounded-full`],
                        {
                            [`${COLOURCSSVARIANTS[`${MAINCOLOUR}-bg`]}`]: byeValue === setByeValue
                        }
                    )
                }
            ></div>
            <div>{byeValue ? 'Byes' : 'No Byes'}</div>
        </div>
    );
}
