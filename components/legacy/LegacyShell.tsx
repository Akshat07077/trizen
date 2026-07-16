type LegacyShellProps = {
  beforeHtml: string;
  contentHtml: string;
  sidebarHtml: string;
  afterHtml: string;
};

/**
 * React owns .layout > main + aside so the sidebar stays on the RIGHT.
 * Legacy HTML is injected into those slots only (cannot eject <aside>).
 */
export default function LegacyShell({
  beforeHtml,
  contentHtml,
  sidebarHtml,
  afterHtml,
}: LegacyShellProps) {
  return (
    <>
      <div
        className="legacy-before"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: beforeHtml }}
      />

      <div className="layout">
        <main
          className="content"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        <aside
          className="sidebar"
          aria-label="Toy navigation"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: sidebarHtml }}
        />
      </div>

      <div
        className="legacy-after"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: afterHtml }}
      />
    </>
  );
}
