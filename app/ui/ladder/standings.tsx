import { COLOURCSSVARIANTS } from '@/app/lib/utils';
import { RootState } from '@/app/state/store';
import clsx from 'clsx';
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';

export default function Standings(
    {
        topHalf,
        bottomHalf,
        predictorPage
    }:
    {
        topHalf: Array<ReactElement>,
        bottomHalf: Array<ReactElement>,
        predictorPage: Boolean
    }
) {
    const mainSiteColour = useSelector((state: RootState) => state.mainSiteColour.value);
    const { colour } = mainSiteColour;

    return (
        <div>
            <div className="flex flex-row gap-2 text-xl pb-4 font-semibold text-center">
                <div className="w-[10%] md:w-[5%]" title="Position">#</div>
                <div className={
                    clsx(
                        'block text-left',
                        {
                            'w-[33%]': predictorPage,
                            'w-[43%] sm:w-[23%]': !predictorPage
                        }
                    )
                }>Team</div>
                <div className="w-[15%] sm:w-[6%]" title="Played">P</div>
                <div className="max-sm:hidden sm:block sm:w-[6%]" title="Won">W</div>
                <div className="max-sm:hidden sm:block sm:w-[6%]" title="Drawn">D</div>
                <div className="max-sm:hidden sm:block sm:w-[6%]" title="Lost">L</div>
                <div className="max-sm:hidden sm:block sm:w-[6%]" title="Byes">B</div>
                <div className="max-md:hidden md:block w-[6%]" title="Points For">PF</div>
                <div className="max-md:hidden md:block w-[6%]" title="Points Against">PA</div>
                <div className={
                    clsx(
                        'xs:block w-[15%] sm:w-[6%]',
                        {
                            'max-sm:hidden': !predictorPage
                        }
                    )
                } title="Points Difference">PD</div>
                <div className={
                    clsx(
                        'w-[25%] sm:w-[15%] md:w-[8%]',
                        {
                            'hidden': predictorPage
                        }
                    )
                }>Next</div>
                <div className="w-[15%] sm:w-[6%]" title="Points">PTS</div>
            </div>
            {topHalf}
            <div className={`border-2 ${COLOURCSSVARIANTS[`${colour}-border`]} mx-[-8px]`}></div>
            {bottomHalf}
        </div>
    );
}
