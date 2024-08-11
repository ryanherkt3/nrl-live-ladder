export default function TeamImage({ matchLink, teamKey, }: {matchLink: string, teamKey: string}) {
    const imgUrl = `https://www.nrl.com/.theme/${teamKey}/badge-basic24.svg`;
    const image = <img src={imgUrl} className="w-9"></img>;
    
    if (matchLink) {
        return (
            <a href={matchLink} target="_blank">
                {image}
            </a>
        );
    }

    return image;
}