"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOY_MFG_LINKS, TOY_NAV } from "@/lib/toy/nav";

const INDUSTRIES = [
  { href: "#", label: "Automobile" },
  { href: "#", label: "Baby Care" },
  { href: "#", label: "Cosmetics" },
  { href: "#", label: "Electronics" },
  { href: "#", label: "FMCG" },
  { href: "#", label: "Industrial" },
  { href: "#", label: "Medical" },
  { href: "#", label: "Pharmaceutical" },
  { href: "#", label: "Stationery" },
  { href: "/toy", label: "Toys", current: true },
] as const;

export default function ToySidebar() {
  const pathname = usePathname();

  return (
    <aside className="aside" aria-label="Toy navigation">
      <div className="aside-card">
        <div className="aside-title">Toy pages</div>
        {TOY_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sublink${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="cta-aside">
        <h4>Toy Packaging Quote</h4>
        <p>
          Retail trays · Action figure packs · Protective packaging · Display
          trays · Custom molded — ISO 9001:2015 · Vapi.
        </p>
        <a
          href="mailto:contact@trizenpackaging.com"
          className="cta-aside-btn"
        >
          ✉ Get a Quote
        </a>
      </div>

      <div className="aside-card">
        <div className="aside-title">Industries</div>
        {INDUSTRIES.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`ind-link${"current" in item && item.current ? " cur" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="aside-card">
        <div className="aside-title">Capabilities</div>
        {TOY_MFG_LINKS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            style={{
              display: "block",
              fontSize: 12,
              color: "var(--accent)",
              padding: "5px 0",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {item.label} ↗
          </a>
        ))}
      </div>
    </aside>
  );
}
