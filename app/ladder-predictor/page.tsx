import { Metadata } from 'next';
import DrawFetcher from '../ui/draw-fetcher';

export const metadata: Metadata = {
    title: 'NRL Ladder Predictor',
    description: 'Predict the outcome of NRL matches and see how your predictions affect the NRL ladder',
};

export default function LadderPredictorPage() {
    return <DrawFetcher pageName={'ladder-predictor'} />;
}
