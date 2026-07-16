import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "40px", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ marginBottom: "12px" }}>Trizen Next.js Migration Demo</h1>
      <p style={{ marginBottom: "16px" }}>
        Demo category migrated: Toy (main + 5 child pages).
      </p>
      <Link href="/toy">Open Toy Category</Link>
    </div>
  );
}
