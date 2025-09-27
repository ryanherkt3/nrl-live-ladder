import { Metadata } from 'next';
import CompButton from '../components/comp-button';
import PageDescription from '../components/page-desc';

export const metadata: Metadata = {
    title: 'Home | NRL Live Ladder',
    description: 'NRL Live Ladder App',
};

export default function HomePage() {
    return (
        <div className='page-min-height flex flex-col gap-4 px-6 py-4 justify-center'>
            <PageDescription
                cssClasses={'text-xl text-center font-bold'}
                description={'Choose the competition you want to see the live ladder for'}
            />
            <div className='flex flex-col gap-4 w-[60%] self-center'>
                <CompButton compKey={'nrl'} />
                <CompButton compKey={'nsw'} />
                <CompButton compKey={'qld'} />
                <CompButton compKey={'nrlw'} />
            </div>
        </div>
    );
}
