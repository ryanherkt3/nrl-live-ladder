import Link from 'next/link';
import { COLOURCSSVARIANTS } from '../lib/utils';

export default function CompButton({compKey}: {compKey: string}) {
    let buttonTitle = '';

    switch (compKey) {
        case 'nrl':
            buttonTitle = 'NRL';
            break;
        case 'nrlw':
            buttonTitle = 'NRL-W';
            break;
        case 'nsw':
            buttonTitle = 'NSW Cup';
            break;
        case 'qld':
            buttonTitle = 'Q Cup';
            break;
        default:
            buttonTitle = 'NRL';
            break;
    }

    const hoverBgStyle = COLOURCSSVARIANTS[`${compKey || 'nrl'}-hover-bg`];
    const borderClasses = `border rounded-lg border-2 ${COLOURCSSVARIANTS[`${compKey || 'nrl'}-border`]}`;
    const textClasses = `text-center text-xl hover:text-white ${COLOURCSSVARIANTS[`${compKey || 'nrl'}-text`]}`;

    return (
        <Link
            key={compKey}
            href={{ pathname: '/ladder', query: {['comp']: compKey}}}
            className={`p-6 cursor-pointer font-bold ${borderClasses} ${textClasses} ${hoverBgStyle}`}
        >
            {buttonTitle}
        </Link>
    );
}
