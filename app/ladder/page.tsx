import { Metadata } from 'next';
import DrawFetcher from '../../ui/draw-fetcher';

export const metadata: Metadata = {
    title: 'NRL Live Ladder',
    description: 'Live rugby league (NRL / NRLW / NSW Cup / Q Cup) ladder',
};

export default function LadderPage() {
    return <DrawFetcher pageName={'ladder'} />;
}
