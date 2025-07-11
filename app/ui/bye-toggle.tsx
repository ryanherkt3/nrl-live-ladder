import clsx from 'clsx';
import { COLOURCSSVARIANTS } from '../lib/utils';
import { RootState } from '../state/store';
import { useSelector } from 'react-redux';

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
    const mainSiteColour = useSelector((state: RootState) => state.mainSiteColour.value);
    const { colour } = mainSiteColour;

    return (
        <div
            className="flex flex-row gap-3 font-semibold text-xl cursor-pointer"
            onClick={() => byeValueCb(byeValue)}
        >
            <div
                className={
                    clsx(
                        [`border ${COLOURCSSVARIANTS[`${colour}-border`]} w-7 rounded-full`],
                        {
                            [`${COLOURCSSVARIANTS[`${colour}-bg`]}`]: byeValue === setByeValue
                        }
                    )
                }
            ></div>
            <div>{byeValue ? 'Byes' : 'No Byes'}</div>
        </div>
    );
}
