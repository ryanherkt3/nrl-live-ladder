import clsx from 'clsx';
import { ReactElement } from 'react';

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
    return (
        <div>
            <div className="flex flex-row gap-2 text-xl pb-4 font-semibold text-center">
                <div className="w-[10%] md:w-[5%]" title="Position">#</div>
                <div className="hidden sm:block w-[8%]">Team</div>
                <div className={
                    clsx(
                        'w-[33%]',
                        {
                            'sm:w-[23%]': predictorPage,
                            'sm:w-[15%]': !predictorPage
                        }
                    )
                }></div>
                <div className="w-[15%] sm:w-[6%]" title="Played">P</div>
                <div className="hidden sm:block sm:w-[6%]" title="Won">W</div>
                <div className="hidden sm:block sm:w-[6%]" title="Drawn">D</div>
                <div className="hidden sm:block sm:w-[6%]" title="Lost">L</div>
                <div className="hidden sm:block sm:w-[6%]" title="Byes">B</div>
                <div className="hidden md:block w-[6%]" title="Points For">PF</div>
                <div className="hidden md:block w-[6%]" title="Points Against">PA</div>
                <div className={
                    clsx(
                        'xs:block w-[15%] sm:w-[6%]',
                        {
                            'hidden': !predictorPage
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
            <div className="border-2 border-green-400"></div>
            {bottomHalf}
        </div>
    );
}
