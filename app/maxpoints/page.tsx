import { Metadata } from 'next';
import DrawFetcher from '../ui/draw-fetcher';

export const metadata: Metadata = {
    title: 'NRL Max Points',
    description: 'How high or low can each NRL team finish on the ladder',
};

export default function MaxPointsPage() {
    return <DrawFetcher pageName={'maxpoints'} />;
}