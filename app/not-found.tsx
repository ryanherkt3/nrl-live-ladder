import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Not Found | NRL Live Ladder',
};

export default function NotFound() {
    return (
        <div className="font-inter page-min-height flex flex-col gap-6 items-center justify-center text-center p-10">
            <h1 className="text-4xl font-semibold">Not Found</h1>
            <p className="text-xl">This page does not exist, or has been moved.</p>
            <Link href="/">Home</Link>
        </div>
    );
}
