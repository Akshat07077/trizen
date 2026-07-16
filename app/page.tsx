import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 40, fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ marginBottom: 12 }}>Trizen Next.js Migration</h1>
      <p style={{ marginBottom: 16 }}>
        Toy category rebuilt as Next.js TSX components (no HTML injection).
      </p>
      <Link href="/toy">Open Toy Category →</Link>
    </div>
  );
}
