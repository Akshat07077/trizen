"use client";

import { useEffect, useRef } from "react";

type LegacyShellProps = {
  beforeHtml: string;
  contentHtml: string;
  sidebarHtml: string;
  afterHtml: string;
};

/**
 * Client-only mount of legacy markup with React-owned layout shell.
 * This prevents hydration/HTML-repair from moving the sidebar out of place.
 */
export default function LegacyShell({
  beforeHtml,
  contentHtml,
  sidebarHtml,
  afterHtml,
}: LegacyShellProps) {
  const beforeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (beforeRef.current) beforeRef.current.innerHTML = beforeHtml;
    if (contentRef.current) contentRef.current.innerHTML = contentHtml;
    if (sidebarRef.current) sidebarRef.current.innerHTML = sidebarHtml;
    if (afterRef.current) afterRef.current.innerHTML = afterHtml;
  }, [beforeHtml, contentHtml, sidebarHtml, afterHtml]);

  return (
    <>
      <div ref={beforeRef} className="legacy-before" />
      <div className="layout">
        <main ref={contentRef} className="content" />
        <aside
          ref={sidebarRef}
          className="sidebar"
          aria-label="Toy navigation"
        />
      </div>
      <div ref={afterRef} className="legacy-after" />
    </>
  );
}
