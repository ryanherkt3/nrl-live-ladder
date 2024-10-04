export default function PageDescription({cssClasses, description}: {cssClasses: string, description: string}) {
    return <div className={cssClasses}>{description}</div>;
}