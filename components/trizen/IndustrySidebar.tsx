"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PLACEHOLDER_INDUSTRIES, registry } from "@/lib/industries/registry";
import type { IndustryMeta } from "@/lib/industries/types";

const CAPABILITY_LINKS = [
  { href: "/manufacturing/thermoforming-packaging", label: "Thermoforming" },
  { href: "/manufacturing/clamshell-packaging", label: "Clamshell Packaging" },
  { href: "/manufacturing/materials", label: "Materials" },
  { href: "/expertise/cleanroom", label: "Cleanroom" },
  {
    href: "/expertise/contract-manufacturing",
    label: "Contract Manufacturing",
  },
] as const;

type IndustrySidebarProps = {
  industryId: string;
  meta: IndustryMeta;
};

export default function IndustrySidebar({
  industryId,
  meta,
}: IndustrySidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="aside" aria-label={`${meta.label} navigation`}>
      <div className="aside-card">
        <div className="aside-title">{meta.sidebarTitle}</div>
        {meta.nav.map((item) => {
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
        <h4>{meta.ctaTitle}</h4>
        <p>{meta.ctaText}</p>
        <a
          href="mailto:contact@trizenpackaging.com"
          className="cta-aside-btn"
        >
          ✉ Get a Quote
        </a>
      </div>

      <div className="aside-card">
        <div className="aside-title">Industries</div>
        {PLACEHOLDER_INDUSTRIES.map((item) => (
          <Link key={item.label} href={item.href} className="ind-link">
            {item.label}
          </Link>
        ))}
        {registry.allIndustriesNav.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`ind-link${item.id === industryId ? " cur" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="aside-card">
        <div className="aside-title">Capabilities</div>
        {CAPABILITY_LINKS.map((item) => (
          <Link
            key={item.href}
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
          </Link>
        ))}
      </div>
    </aside>
  );
}
