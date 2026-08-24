"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { registry } from "@/lib/industries/registry";

const CAPABILITY_LINKS = [
  { id: "manufacturing", href: "/manufacturing", label: "Manufacturing" },
  { id: "expertise", href: "/expertise", label: "Expertise" },
] as const;

type OpenMenu = "industries" | "manufacturing" | "expertise" | null;

const INDUSTRY_NAV = registry.allIndustriesNav.filter(
  (item) => item.id !== "manufacturing" && item.id !== "expertise",
);

function industryIdFromPath(pathname: string): string | null {
  const first = pathname.split("/").filter(Boolean)[0];
  if (!first) return null;
  return INDUSTRY_NAV.some((item) => item.id === first) ? first : null;
}

function capabilityIdFromPath(pathname: string): string | null {
  if (pathname.startsWith("/manufacturing")) return "manufacturing";
  if (pathname.startsWith("/expertise")) return "expertise";
  return null;
}

function crumbsFor(pathname: string): Array<{ label: string; href?: string }> {
  if (pathname === "/") return [];
  if (pathname === "/about") {
    return [
      { href: "/", label: "Home" },
      { label: "About Us" },
    ];
  }
  if (pathname === "/contact") {
    return [
      { href: "/", label: "Home" },
      { label: "Contact" },
    ];
  }
  if (pathname === "/blog" || pathname.startsWith("/blog/")) {
    const items: Array<{ label: string; href?: string }> = [
      { href: "/", label: "Home" },
      { href: "/blog", label: "Blog" },
    ];
    if (pathname !== "/blog") {
      items.push({ label: "Article" });
    }
    return items;
  }

  const capabilityId = capabilityIdFromPath(pathname);
  if (capabilityId) {
    const meta = registry.industries[capabilityId];
    const items: Array<{ label: string; href?: string }> = [
      { href: "/", label: "Home" },
      { href: meta.route, label: meta.label },
    ];
    const match = meta.nav.find(
      (item) => item.href === pathname && item.href !== meta.route,
    );
    if (match) items.push({ href: match.href, label: match.label });
    return items;
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
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [activeMegaId, setActiveMegaId] = useState(
    () => industryIdFromPath(pathname) ?? INDUSTRY_NAV[0]?.id ?? "toy",
  );
  const [drawerGroup, setDrawerGroup] = useState<string | null>(null);
  const menuId = useId();
  const industryId = industryIdFromPath(pathname);
  const capabilityId = capabilityIdFromPath(pathname);
  const crumbs = crumbsFor(pathname);
  const megaIndustry =
    registry.industries[activeMegaId] ??
    registry.industries[INDUSTRY_NAV[0]?.id ?? "toy"];

  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
    setDrawerGroup(null);
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
    if (!openMenu) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(".site-nav-drop")) return;
      setOpenMenu(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  const closeMenus = () => setOpenMenu(null);

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
              className={`site-nav-drop${openMenu === "industries" ? " is-open" : ""}`}
              onMouseEnter={() => setOpenMenu("industries")}
              onMouseLeave={closeMenus}
            >
              <button
                type="button"
                className={`site-nav-link${industryId ? " is-current" : ""}`}
                aria-expanded={openMenu === "industries"}
                aria-haspopup="true"
                onClick={() =>
                  setOpenMenu((value) =>
                    value === "industries" ? null : "industries",
                  )
                }
                onBlur={(event) => {
                  const next = event.relatedTarget as Element | null;
                  if (!next?.closest(".site-nav-drop")) closeMenus();
                }}
              >
                Industries
                <span aria-hidden="true">▾</span>
              </button>
              <div className="site-nav-mega" role="menu">
                <div className="site-nav-mega-panel">
                  <p className="site-nav-mega-kicker">Thermoforming sectors</p>
                  <div className="site-nav-mega-list">
                    {INDUSTRY_NAV.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        role="menuitem"
                        className={`site-nav-mega-item${
                          item.id === activeMegaId ? " is-active" : ""
                        }${item.id === industryId ? " is-current" : ""}`}
                        onMouseEnter={() => setActiveMegaId(item.id)}
                        onFocus={() => setActiveMegaId(item.id)}
                        onClick={closeMenus}
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
                          onClick={closeMenus}
                        >
                          {page.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {CAPABILITY_LINKS.map((link) => {
              const meta = registry.industries[link.id];
              const isOpen = openMenu === link.id;
              const current = capabilityId === link.id;
              return (
                <div
                  key={link.id}
                  className={`site-nav-drop${isOpen ? " is-open" : ""}`}
                  onMouseEnter={() => setOpenMenu(link.id)}
                  onMouseLeave={closeMenus}
                >
                  <button
                    type="button"
                    className={`site-nav-link${current ? " is-current" : ""}`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() =>
                      setOpenMenu((value) =>
                        value === link.id ? null : link.id,
                      )
                    }
                    onBlur={(event) => {
                      const next = event.relatedTarget as Element | null;
                      if (!next?.closest(".site-nav-drop")) closeMenus();
                    }}
                  >
                    {link.label}
                    <span aria-hidden="true">▾</span>
                  </button>
                  <div className="site-nav-flyout" role="menu">
                    <p className="site-nav-mega-kicker">{link.label} pages</p>
                    <div className="site-nav-mega-sub-list">
                      {(meta?.nav ?? []).map((page) => {
                        const pageCurrent = pathname === page.href;
                        return (
                          <Link
                            key={page.href}
                            href={page.href}
                            role="menuitem"
                            className={`site-nav-mega-sub-item${pageCurrent ? " is-current" : ""}`}
                            onClick={closeMenus}
                          >
                            {page.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="site-nav-actions">
            <Link
              href="/about"
              className={`site-nav-link${pathname === "/about" ? " is-current" : ""}`}
              onMouseEnter={closeMenus}
            >
              About
            </Link>
            <Link
              href="/blog"
              className={`site-nav-link${pathname?.startsWith("/blog") ? " is-current" : ""}`}
              onMouseEnter={closeMenus}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className={`site-nav-link site-nav-contact${pathname === "/contact" ? " is-current" : ""}`}
              onMouseEnter={closeMenus}
            >
              Contact
            </Link>
            <a
              href="mailto:contact@trizenpackaging.com"
              className="ncta"
              onMouseEnter={closeMenus}
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
                    <span aria-current={last ? "page" : undefined}>
                      {item.label}
                    </span>
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
        {INDUSTRY_NAV.map((item) => {
          const meta = registry.industries[item.id];
          const expanded = drawerGroup === item.id;
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
                      setDrawerGroup((value) =>
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
                      className={
                        pathname === page.href ? "is-current" : undefined
                      }
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

        {CAPABILITY_LINKS.map((link) => {
          const meta = registry.industries[link.id];
          const expanded = drawerGroup === link.id;
          return (
            <div key={link.id} className="site-nav-drawer-group">
              <div className="site-nav-drawer-row">
                <Link
                  href={link.href}
                  className={capabilityId === link.id ? "is-current" : undefined}
                >
                  {link.label}
                </Link>
                {meta?.nav?.length ? (
                  <button
                    type="button"
                    className="site-nav-drawer-toggle"
                    aria-expanded={expanded}
                    aria-label={`${expanded ? "Hide" : "Show"} ${link.label} pages`}
                    onClick={() =>
                      setDrawerGroup((value) =>
                        value === link.id ? null : link.id,
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
                      className={
                        pathname === page.href ? "is-current" : undefined
                      }
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
        <Link
          href="/about"
          className={pathname === "/about" ? "is-current" : undefined}
        >
          About
        </Link>
        <Link
          href="/blog"
          className={pathname?.startsWith("/blog") ? "is-current" : undefined}
        >
          Blog
        </Link>
        <Link
          href="/contact"
          className={pathname === "/contact" ? "is-current" : undefined}
        >
          Contact
        </Link>
        <a href="mailto:contact@trizenpackaging.com" className="ncta">
          Get a Quote
        </a>
      </div>
    </header>
  );
}
