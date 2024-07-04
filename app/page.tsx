import { getNRLInfo } from "./lib/utils";
import Ladder from "./ui/ladder";

export default async function HomePage() {
    // TODO add byes toggle to show ladder w/o bye points
    let nrlInfo = await getNRLInfo();
    
    return (
        <div className="px-8 py-6 flex flex-col gap-6">
            <Ladder nrlInfo={nrlInfo} />
        </div>
    );
}
