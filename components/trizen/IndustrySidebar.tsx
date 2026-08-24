"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PLACEHOLDER_INDUSTRIES, registry } from "@/lib/industries/registry";
import type { IndustryMeta } from "@/lib/industries/types";

const MANUFACTURING_LINKS = [
  { href: "/manufacturing", label: "Manufacturing Overview" },
  { href: "/manufacturing/thermoforming-packaging", label: "Thermoforming" },
  { href: "/manufacturing/vacuum-forming", label: "Vacuum Forming" },
  { href: "/manufacturing/pressure-forming", label: "Pressure Forming" },
  { href: "/manufacturing/blister-packaging", label: "Blister Packaging" },
  { href: "/manufacturing/clamshell-packaging", label: "Clamshell Packaging" },
  { href: "/manufacturing/plastic-packaging", label: "Plastic Packaging" },
  { href: "/manufacturing/materials", label: "Materials" },
] as const;

const EXPERTISE_LINKS = [
  { href: "/expertise/hub", label: "Expertise Hub" },
  { href: "/expertise/unique-offer", label: "A Unique Offer" },
  { href: "/expertise/cleanroom", label: "Cleanroom Capability" },
  { href: "/expertise/contract-manufacturing", label: "Contract Manufacturing" },
  { href: "/expertise/rnd-innovation", label: "R&D Innovation" },
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
        {registry.allIndustriesNav
          .filter(
            (item) => item.id !== "manufacturing" && item.id !== "expertise",
          )
          .map((item) => (
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
        <div className="aside-title">Manufacturing</div>
        {MANUFACTURING_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sublink${pathname === item.href ? " active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="aside-card">
        <div className="aside-title">Expertise</div>
        {EXPERTISE_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sublink${pathname === item.href ? " active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
