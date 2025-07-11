import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';

export default function TeamImage({ matchLink, teamKey, }: {matchLink: string, teamKey: string}) {
    const currentComp = useSelector((state: RootState) => state.currentComp.value);
    const { comp } = currentComp;

    let imageType = 'badge.png';
    if (comp.includes('nrl')) {
        imageType = 'badge-basic24.svg';
    }
    else if (comp === 'nsw') {
        if (teamKey === 'jets' || teamKey === 'north-sydney-bears' || teamKey === 'western-suburbs-magpies') {
            imageType = 'badge.svg';
        }
        else {
            imageType = 'badge-basic24.svg';
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
    const image = <Image src={imgUrl} width={36} height={36} alt={teamKey} />;

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
