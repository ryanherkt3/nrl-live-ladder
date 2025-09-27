import { Metadata } from 'next';
import DrawFetcher from '../../components/draw-fetcher';

export const metadata: Metadata = {
    title: 'Ladder Predictor',
    description: 'Predict the outcome of rugby league matches and see how your predictions affect the ladder',
};

export default function LadderPredictorPage() {
    return <DrawFetcher pageName={'ladder-predictor'} />;
}
