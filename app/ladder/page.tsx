import { Metadata } from 'next';
import DrawFetcher from '../../components/draw-fetcher';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'NRL Live Ladder',
    description: 'Live rugby league (NRL / NRLW / NSW Cup / Q Cup) ladder',
};

export default function LadderPage() {
    return (
        <Suspense>
            <DrawFetcher pageName={'ladder'} />
        </Suspense>
    );
}
