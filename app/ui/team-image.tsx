import Image from 'next/image';

export default function TeamImage({ matchLink, teamKey, }: {matchLink: string, teamKey: string}) {
    const imgUrl = `https://www.nrl.com/.theme/${teamKey}/badge-basic24.svg`;
    const image = <Image src={imgUrl} width={36} height={36} alt={teamKey} />;

    if (matchLink) {
        return (
            <a href={matchLink} target="_blank">
                {image}
            </a>
        );
    }

    return image;
}