import Image from 'next/image';
import { CURRENTCOMP } from '../lib/utils';

export default function TeamImage({ matchLink, teamKey, }: {matchLink: string, teamKey: string}) {
    let imageType = 'badge.png';
    if (CURRENTCOMP === 'nrl' || CURRENTCOMP === 'nrlw') {
        imageType = 'badge-basic24.svg';
    }
    else if (CURRENTCOMP === 'nsw') {
        if (teamKey === 'jets' || teamKey === 'north-sydney-bears' || teamKey === 'western-suburbs-magpies') {
            imageType = 'badge.svg';
        }
        else {
            imageType = 'badge-basic24.svg';
        }
    }
    else if (CURRENTCOMP === 'qld') {
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
        matchLink = CURRENTCOMP === 'nrl' || CURRENTCOMP === 'nrlw' ? `https://nrl.com${matchLink}`: matchLink;

        return (
            <a href={matchLink} target="_blank">
                {image}
            </a>
        );
    }

    return image;
}
