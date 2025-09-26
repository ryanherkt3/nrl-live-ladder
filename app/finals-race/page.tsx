import { Metadata } from 'next';
import DrawFetcher from '../../ui/draw-fetcher';

export const metadata: Metadata = {
    title: 'Finals Race | NRL Live Ladder',
    description: 'How high or low can each NRL / NRLW / NSW Cup / Q Cup team finish on the ladder',
};

export default function FinalsRacePage() {
    return <DrawFetcher pageName={'finals-race'} />;
}
