import { getShortCode } from '@/lib/utils';
import TeamImage from '../team-image';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';

export default function TeamSection(
    {
        teamName,
        position,
        imgKey,
        isHomeTeam,
    }:
    {
        teamName: string,
        position: string,
        imgKey: string
        isHomeTeam: boolean
    }
) {
    // Empty string means info about the NRL will be fetched
    const comp = useSearchParams().get('comp') ?? 'nrl';

    const mqStyles = 'max-sm:flex-col max-sm:gap-2 sm:flex-row sm:gap-10 lg:w-[280px] md:w-[240px] sm:w-[160px]';

    return (
        <div className={
            clsx(
                `flex ${mqStyles} pb-0 items-center`,
                {
                    'justify-end': !isHomeTeam
                }
            )
        }>
            <div className='flex flex-col text-center lg:w-40 md:w-30'>
                <div className="font-semibold">
                    <span className="md:block max-md:hidden">{teamName}</span>
                    <span className="md:hidden max-md:block">{getShortCode(teamName, comp)}</span>
                </div>
                <div>{position}</div>
            </div>
            <div className={
                clsx(
                    {
                        '-order-1': isHomeTeam,
                        'max-sm:-order-2': !isHomeTeam
                    }
                )
            }>
                <TeamImage matchLink='' teamKey={imgKey} tooltip={teamName} useLight={false} />
            </div>
        </div>
    );
}
