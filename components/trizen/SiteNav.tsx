"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { registry } from "@/lib/industries/registry";

const PRIMARY_LINKS = [
  { href: "/manufacturing", label: "Manufacturing" },
  { href: "/expertise", label: "Expertise" },
  { href: "/contact", label: "Contact" },
] as const;

function industryIdFromPath(pathname: string): string | null {
  const first = pathname.split("/").filter(Boolean)[0];
  if (!first) return null;
  return registry.allIndustriesNav.some((item) => item.id === first)
    ? first
    : null;
}

function crumbsFor(pathname: string): Array<{ label: string; href?: string }> {
  if (pathname === "/") return [];
  if (pathname === "/contact") {
    return [
      { href: "/", label: "Home" },
      { label: "Contact" },
    ];
  }

  const industryId = industryIdFromPath(pathname);
  if (!industryId) return [{ href: "/", label: "Home" }];

  const industry = registry.industries[industryId];
  const items: Array<{ label: string; href?: string }> = [
    { href: "/", label: "Home" },
    { href: "/", label: "Industries" },
    { href: industry.route, label: industry.label },
  ];

  const match = industry.nav.find(
    (item) => item.href === pathname && item.href !== industry.route,
  );
  if (match) items.push({ href: match.href, label: match.label });

  return items;
}

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [activeMegaId, setActiveMegaId] = useState(
    () => industryIdFromPath(pathname) ?? registry.allIndustriesNav[0]?.id ?? "toy",
  );
  const [drawerIndustry, setDrawerIndustry] = useState<string | null>(null);
  const menuId = useId();
  const industryId = industryIdFromPath(pathname);
  const crumbs = crumbsFor(pathname);
  const megaIndustry =
    registry.industries[activeMegaId] ??
    registry.industries[registry.allIndustriesNav[0]?.id ?? "toy"];

  useEffect(() => {
    setOpen(false);
    setIndustriesOpen(false);
    setDrawerIndustry(null);
    const fromPath = industryIdFromPath(pathname);
    if (fromPath) setActiveMegaId(fromPath);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!industriesOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(".site-nav-drop")) return;
      setIndustriesOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIndustriesOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [industriesOpen]);

  return (
    <header className="site-chrome">
      <nav className="snav site-nav" aria-label="Primary">
        <div className="ni site-nav-inner">
          <Link href="/" className="logo" aria-label="Trizen Packaging home">
            <div className="lm">T</div>
            <div className="ln">
              Trizen<em>.</em>
            </div>
          </Link>

          <div className="site-nav-links">
            <div
              className={`site-nav-drop${industriesOpen ? " is-open" : ""}`}
              onMouseEnter={() => setIndustriesOpen(true)}
              onMouseLeave={() => setIndustriesOpen(false)}
            >
              <button
                type="button"
                className={`site-nav-link${industryId ? " is-current" : ""}`}
                aria-expanded={industriesOpen}
                aria-haspopup="true"
                onClick={() => setIndustriesOpen((value) => !value)}
                onBlur={(event) => {
                  const next = event.relatedTarget as Element | null;
                  if (!next?.closest(".site-nav-drop")) {
                    setIndustriesOpen(false);
                  }
                }}
              >
                Industries
                <span aria-hidden="true">▾</span>
              </button>
              <div className="site-nav-mega" role="menu">
                <div className="site-nav-mega-panel">
                  <p className="site-nav-mega-kicker">Thermoforming sectors</p>
                  <div className="site-nav-mega-list">
                    {registry.allIndustriesNav.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        role="menuitem"
                        className={`site-nav-mega-item${
                          item.id === activeMegaId ? " is-active" : ""
                        }${item.id === industryId ? " is-current" : ""}`}
                        onMouseEnter={() => setActiveMegaId(item.id)}
                        onFocus={() => setActiveMegaId(item.id)}
                        onClick={() => setIndustriesOpen(false)}
                      >
                        <strong>{item.label}</strong>
                        <span>Hover for pages</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="site-nav-mega-sub" aria-live="polite">
                  <p className="site-nav-mega-kicker">
                    {megaIndustry?.label ?? "Pages"}
                  </p>
                  <div className="site-nav-mega-sub-list">
                    {(megaIndustry?.nav ?? []).map((page) => {
                      const current = pathname === page.href;
                      return (
                        <Link
                          key={page.href}
                          href={page.href}
                          role="menuitem"
                          className={`site-nav-mega-sub-item${current ? " is-current" : ""}`}
                          onClick={() => setIndustriesOpen(false)}
                        >
                          {page.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {PRIMARY_LINKS.filter((link) => link.href !== "/contact").map(
              (link) => {
              const current = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`site-nav-link${current ? " is-current" : ""}`}
                  onMouseEnter={() => setIndustriesOpen(false)}
                  onFocus={() => setIndustriesOpen(false)}
                >
                  {link.label}
                </Link>
              );
            },
            )}
          </div>

          <div className="site-nav-actions">
            <Link
              href="/contact"
              className={`site-nav-link site-nav-contact${pathname === "/contact" ? " is-current" : ""}`}
              onMouseEnter={() => setIndustriesOpen(false)}
            >
              Contact
            </Link>
            <a
              href="mailto:contact@trizenpackaging.com"
              className="ncta"
              onMouseEnter={() => setIndustriesOpen(false)}
            >
              Get a Quote
            </a>
            <button
              type="button"
              className="site-nav-toggle"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {crumbs.length > 0 ? (
        <div className="site-crumbs" aria-label="Breadcrumb">
          <ol>
            {crumbs.map((item, index) => {
              const last = index === crumbs.length - 1;
              return (
                <li key={`${item.label}-${index}`}>
                  {last || !item.href ? (
                    <span aria-current={last ? "page" : undefined}>{item.label}</span>
                  ) : (
                    <Link href={item.href}>{item.label}</Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      <div
        id={menuId}
        className={`site-nav-drawer${open ? " is-open" : ""}`}
        hidden={!open}
      >
        <p className="site-nav-mega-kicker">Industries</p>
        {registry.allIndustriesNav.map((item) => {
          const meta = registry.industries[item.id];
          const expanded = drawerIndustry === item.id;
          return (
            <div key={item.id} className="site-nav-drawer-group">
              <div className="site-nav-drawer-row">
                <Link
                  href={item.href}
                  className={item.id === industryId ? "is-current" : undefined}
                >
                  {item.label}
                </Link>
                {meta?.nav?.length ? (
                  <button
                    type="button"
                    className="site-nav-drawer-toggle"
                    aria-expanded={expanded}
                    aria-label={`${expanded ? "Hide" : "Show"} ${item.label} pages`}
                    onClick={() =>
                      setDrawerIndustry((value) =>
                        value === item.id ? null : item.id,
                      )
                    }
                  >
                    {expanded ? "−" : "+"}
                  </button>
                ) : null}
              </div>
              {expanded && meta?.nav ? (
                <div className="site-nav-drawer-sub">
                  {meta.nav.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      className={pathname === page.href ? "is-current" : undefined}
                    >
                      {page.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
        <hr />
        {PRIMARY_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "is-current" : undefined}
          >
            {link.label}
          </Link>
        ))}
        <a href="mailto:contact@trizenpackaging.com" className="ncta">
          Get a Quote
        </a>
      </div>
    </header>
  );
}
