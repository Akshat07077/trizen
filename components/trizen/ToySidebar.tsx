"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOY_MFG_LINKS, TOY_NAV } from "@/lib/toy/nav";

export default function ToySidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar" aria-label="Toy navigation">
      <div className="sidebar-progress" aria-hidden="true">
        <span />
      </div>

      <div className="side-card">
        <div className="side-title">
          <span className="material-symbols-outlined">toys</span>
          Toy Pages
        </div>
        {TOY_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sublink${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="side-cta">
        <h3>Toy Packaging Quote</h3>
        <p>
          Retail toy trays, action figure inserts, protective packaging, display
          trays and custom molded toy packaging from Vapi.
        </p>
        <a href="mailto:contact@trizenpackaging.com">Get a Quote</a>
      </div>

      <div className="side-card">
        <div className="side-title">
          <span className="material-symbols-outlined">factory</span>
          Manufacturing Links
        </div>
        {TOY_MFG_LINKS.map((item) => (
          <a key={item.label} href={item.href} className="ind-link">
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
