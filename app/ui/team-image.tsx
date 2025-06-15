import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';

export default function TeamImage({ matchLink, teamKey, }: {matchLink: string, teamKey: string}) {
    const currentComp = useSelector((state: RootState) => state.currentComp.value);

    let imageType = 'badge.png';
    if (currentComp.includes('nrl')) {
        imageType = 'badge-basic24.svg';
    }
    else if (currentComp === 'nsw') {
        if (teamKey === 'jets' || teamKey === 'north-sydney-bears' || teamKey === 'western-suburbs-magpies') {
            imageType = 'badge.svg';
        }
        else {
            imageType = 'badge-basic24.svg';
        }
    }
    else if (currentComp === 'qld') {
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
        matchLink = currentComp.includes('nrl') ? `https://nrl.com${matchLink}`: matchLink;

        return (
            <a href={matchLink} target="_blank">
                {image}
            </a>
        );
    }

    return image;
}
