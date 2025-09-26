import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';

export default function TeamImage(
    {
        matchLink,
        teamKey,
        tooltip,
        useLight,
    }:
    {
        matchLink: string,
        teamKey: string,
        tooltip: string
        useLight: boolean
    }
) {
    const currentComp = useSelector((state: RootState) => state.currentComp.value);
    const { comp } = currentComp;

    let imageType = 'badge.png';
    if (comp.includes('nrl')) {
        const lightImageTeams = ['cowboys', 'dragons', 'rabbitohs', 'sharks', 'storm'];

        imageType = `badge-basic24${useLight && lightImageTeams.includes(teamKey) ? '-light' : ''}.svg`;
    }
    else if (comp === 'nsw') {
        if (teamKey === 'jets' || teamKey === 'north-sydney-bears' || teamKey === 'western-suburbs-magpies') {
            imageType = 'badge.svg';
        }
        else {
            const lightImageTeams = ['dragons', 'rabbitohs'];

            imageType = `badge-basic24${useLight && lightImageTeams.includes(teamKey) ? '-light' : ''}.svg`;
        }
    }
    else if (comp === 'qld') {
        if (teamKey === 'dolphins') {
            imageType = 'badge-basic24.svg';
        }
        else {
            imageType = 'badge.png';
        }
    }

    const imgUrl = `https://nrl.com/.theme/${teamKey}/${imageType}`;
    const image = <Image src={imgUrl} width={36} height={36} alt={teamKey} title={tooltip} />;

    if (matchLink) {
        matchLink = comp.includes('nrl') ? `https://nrl.com${matchLink}`: matchLink;

        return (
            <a href={matchLink} target="_blank">
                {image}
            </a>
        );
    }

    return image;
}
