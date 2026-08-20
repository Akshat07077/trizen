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

function currentIndustryId(pathname: string): string | null {
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

  const industryId = currentIndustryId(pathname);
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
  const menuId = useId();
  const industryId = currentIndustryId(pathname);
  const crumbs = crumbsFor(pathname);

  useEffect(() => {
    setOpen(false);
    setIndustriesOpen(false);
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
                <p className="site-nav-mega-kicker">Thermoforming sectors</p>
                <div className="site-nav-mega-grid">
                  {registry.allIndustriesNav.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      role="menuitem"
                      className={`site-nav-mega-item${item.id === industryId ? " is-current" : ""}`}
                      onClick={() => setIndustriesOpen(false)}
                    >
                      <strong>{item.label}</strong>
                      <span>View packaging pages</span>
                    </Link>
                  ))}
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
        {registry.allIndustriesNav.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={item.id === industryId ? "is-current" : undefined}
          >
            {item.label}
          </Link>
        ))}
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
