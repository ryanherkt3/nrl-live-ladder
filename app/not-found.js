import { redirect } from "next/navigation";

export default function NotFound() {
    // Redirect to main page if existing one is not found
    redirect('/');
}