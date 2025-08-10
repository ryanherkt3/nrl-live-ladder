import { QualificationScenarios } from '../../lib/definitions';
import QualifiedTeams from './qualified-teams';

export default function LadderOutcomes({outcomes}: {outcomes: QualificationScenarios}) {
    const { eliminatedTeams, qualifiedTeams, topFourTeams, topTwoTeams } = outcomes;

    return (
        <div className="flex flex-col gap-2">
            <div className="text-xl font-semibold text-center">Possible outcomes this week</div>
            <div className="flex flex-col gap-4">
                <QualifiedTeams outcome={'Eliminated from Finals'} teams={eliminatedTeams} />
                <QualifiedTeams outcome={'Qualified for Finals'} teams={qualifiedTeams} />
                <QualifiedTeams outcome={'Top 4'} teams={topFourTeams} />
                <QualifiedTeams outcome={'Top 2'} teams={topTwoTeams} />
            </div>
        </div>
    );
}
