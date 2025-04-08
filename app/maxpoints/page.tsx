import { Metadata } from 'next';
import DrawFetcher from '../ui/draw-fetcher';

export const metadata: Metadata = {
    title: 'Max Points',
    description: 'How high or low can each NRL / NRLW / NSW Cup / Q Cup team finish on the ladder',
};

export default function MaxPointsPage() {
    return <DrawFetcher pageName={'maxpoints'} />;
}
