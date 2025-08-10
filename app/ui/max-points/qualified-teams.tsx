import { ReactElement } from 'react';
import { QualificationConditions, QualificationDisplay, QualificationResultSets } from '../../lib/definitions';

export default function QualifiedTeams({outcome, teams}: {outcome: string; teams: Array<QualificationConditions>}) {
    if (!teams.length) {
        return null;
    }

    return (
        <div>
            <div className="flex flex-row border-b-2 border-black py-2">
                <span className="text-lg font-semibold">{outcome}</span>
            </div>
            {
                getOutcomeDivs(teams)
            }
        </div>
    );
}

/**
 * Get a list of teams who can qualify for a particular criteria
 * (finals, top 2/4, elimination).
 *
 * @param {Array<QualificationConditions>} teams
 * @returns {Array<ReactElement>}
 */
function getOutcomeDivs(teams: Array<QualificationConditions>) {
    const outcomeDivs: ReactElement[] = [];

    teams.map((team: QualificationConditions) => {
        const resultStrings: QualificationDisplay[] = [];
        let resultString = '';

        // Helper function to add dependent results to a result string
        const addDependentResults = (outcome: QualificationResultSets, resultString: string) => {
            // Remove last item from the teamName array ('' - empty quotes)
            let teamsArray: string[] = outcome.teamName.split(',');
            teamsArray = teamsArray.slice(0, teamsArray.length - 1);

            for (let i = 0; i < teamsArray.length; i++) {
                // Split the team name and the results
                const teamAndResults = teamsArray[i].split('&');

                resultString += `${teamAndResults[0].replace('-', ' ')} `;

                // Split the results from each other if required
                const results = teamAndResults[1].split('|');

                for (let j = 0; j < results.length; j++) {
                    resultString += results[j];

                    if (j < results.length - 1) {
                        resultString += ' or ';
                    }
                }

                if (i < teamsArray.length - 1) {
                    resultString += ', ';
                }
            }

            return resultString;
        };

        team.resultSets.map((outcome) => {
            const qualificationDisplay: QualificationDisplay = {
                teamName: team.teamName,
                requirementString: '',
                requirementSatisfied: outcome.requirementSatisfied,
            };

            if (outcome.teamName === 'self') {
                if (outcome.result.startsWith('D')) {
                    resultString = 'Draw';

                    if (outcome.result.includes('W')) {
                        resultString += ' or win';
                    }
                    if (outcome.result.includes('L')) {
                        resultString += ' or loss';
                    }
                }
                else if (outcome.result === 'W') {
                    resultString = 'Win';
                }
                else if (outcome.result === 'L') {
                    resultString = 'Loss';
                }

                // Add dependent results
                if (outcome.dependentResults !== null) {
                    for (const result of outcome.dependentResults) {
                        qualificationDisplay.teamName += ',' + result.teamName.replace(/&[^,]*/g, '');
                        resultString += ' AND ' + addDependentResults(result, '');
                    }
                }

                resultString += '.';

                if (resultString.length) {
                    qualificationDisplay.requirementString = resultString;
                }
            }
            else if (outcome.teamName !== 'self') { // i.e. another team's result
                qualificationDisplay.teamName = outcome.teamName.replace(/&[^,]*/g, '');
                qualificationDisplay.requirementString = addDependentResults(outcome, '') + '.';
            }

            resultStrings.push(qualificationDisplay);
        });

        outcomeDivs.push(
            <div key={team.teamName} className='flex flex-col'>
                <div className="text-lg py-1">{team.teamName}</div>
                {
                    getListOfResults(resultStrings)
                }
            </div>
        );
    });

    return outcomeDivs;
}

/**
 * Get a list of results for a team which could see them qualify for a particular criteria
 * (finals, top 2/4, elimination).
 *
 * @param {Array<QualificationDisplay>} results
 * @returns {Array<ReactElement>}
 */
function getListOfResults(results: Array<QualificationDisplay>) {
    const resultDivs: ReactElement[] = [];

    const resultAchieved = results.filter((res) => {
        return res.requirementSatisfied === true;
    }).length;

    results.map((result) => {
        const { requirementString } = result;

        // If one result has been achieved, set all others to Not Applicable (N/A)
        // TODO if a W/D/L result has been satisfied, set the DW/DL results to N/A
        let { requirementSatisfied } = result;
        requirementSatisfied = resultAchieved && requirementSatisfied !== true ? 'N/A' : requirementSatisfied;

        let spanContent = '';
        switch (requirementSatisfied) {
            case true:
                spanContent += '✅ ';
                break;
            case false:
                spanContent += '❌ ';
                break;
            case 'TBC':
                spanContent += '🟠 ';
                break;
            case 'N/A': // other requirement satisfied
            default:
                spanContent += '➖ ';
                break;
        }
        spanContent += requirementString;

        resultDivs.push(
            <span key={results.indexOf(result)} className="text-lg py-1 pl-5">{spanContent}</span>
        );
    });

    return resultDivs;
}
