import Link from "next/link";

export default function NotFound() {
  return (
    <div className="c-404">
      <div>
        <h1>This page is not part of the loop.</h1>
        <Link href="/">Back to Clyra</Link>
      </div>
    </div>
  );
}
