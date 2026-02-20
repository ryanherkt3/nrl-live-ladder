import { Metadata } from 'next';
import DrawFetcher from '../../components/draw-fetcher';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Finals Race | NRL Live Ladder',
    description: 'How high or low can each NRL / NRLW / NSW Cup / Q Cup team finish on the ladder',
};

export default function FinalsRacePage() {
    return (
        <Suspense>
            <DrawFetcher pageName={'finals-race'} />
        </Suspense>
    );
}
