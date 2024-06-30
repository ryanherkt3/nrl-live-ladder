export default function TeamImage({ imageLink, teamKey, }: {imageLink: string, teamKey: string}) {
    const imgUrl = `https://www.nrl.com/.theme/${teamKey}/badge-basic24.svg?bust=202406240046`;
    const image = <img src={imgUrl} className="w-9"></img>;
    
    if (imageLink) {
        return (
            <a href={imageLink} target="_blank">
                {image}
            </a>
        );
    }

    return image;
}