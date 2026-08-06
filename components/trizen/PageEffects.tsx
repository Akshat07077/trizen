"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Violet UI chrome for every Toy route:
 * read progress, back-to-top, and pinned sidebar.
 * Re-binds on pathname so sticky works after client navigations.
 */
export default function PageEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    let spacer: HTMLElement | null = null;
    let cancelled = false;

    const getProgress = () =>
      document.querySelector(".read-progress span") as HTMLElement | null;
    const getBackTop = () => document.querySelector(".back-top");
    const getPageWrap = () =>
      document.querySelector(".toy-page .page-wrap") as HTMLElement | null;
    const getSidebar = () =>
      document.querySelector(".toy-page .aside") as HTMLElement | null;

    const clearPin = () => {
      const sidebar = getSidebar();
      sidebar?.classList.remove("is-pinned");
      sidebar?.style.removeProperty("top");
      sidebar?.style.removeProperty("left");
      sidebar?.style.removeProperty("width");
      sidebar?.style.removeProperty("max-height");
      if (spacer) {
        spacer.remove();
        spacer = null;
      }
    };

    const updateSidebarPin = () => {
      const pageWrap = getPageWrap();
      const sidebar = getSidebar();
      if (!pageWrap || !sidebar) return;

      const desktop = window.matchMedia("(min-width:701px)").matches;
      if (!desktop) {
        clearPin();
        return;
      }

      const wrapRect = pageWrap.getBoundingClientRect();
      const navOffset = 100;
      const sideWidth = sidebar.offsetWidth || 300;

      const shouldPin =
        wrapRect.top <= navOffset && wrapRect.bottom > navOffset + 120;

      if (!shouldPin) {
        clearPin();
        return;
      }

      if (!spacer || !spacer.isConnected) {
        spacer = document.createElement("div");
        spacer.className = "aside-spacer";
        spacer.style.width = `${sideWidth}px`;
        spacer.style.height = "1px";
        spacer.style.visibility = "hidden";
        spacer.style.pointerEvents = "none";
        pageWrap.insertBefore(spacer, sidebar);
      }

      const left = wrapRect.right - sideWidth;
      sidebar.classList.add("is-pinned");
      sidebar.style.setProperty("top", `${navOffset}px`, "important");
      sidebar.style.setProperty("left", `${Math.max(0, left)}px`, "important");
      sidebar.style.setProperty("width", `${sideWidth}px`, "important");
      sidebar.style.setProperty(
        "max-height",
        `calc(100vh - ${navOffset + 20}px)`,
        "important",
      );
    };

    const updatePageUi = () => {
      const progress = getProgress();
      const backTop = getBackTop();
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? window.scrollY / total : 0;
      if (progress) {
        progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
      }
      backTop?.classList.toggle("show", window.scrollY > 650);
      updateSidebarPin();
    };

    const decorateSections = () => {
      document
        .querySelectorAll(".toy-page .page-wrap main .sec")
        .forEach((section, index) => {
          if (index % 2 === 1) section.classList.add("tone-ice");
          const label = section.querySelector(".ey");
          if (label && !label.querySelector(".section-index")) {
            const number = document.createElement("span");
            number.className = "section-index";
            number.textContent = String(index + 1).padStart(2, "0");
            label.prepend(number);
          }
        });
    };

    const onBackTop = () =>
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });

    const backTop = getBackTop();
    backTop?.addEventListener("click", onBackTop);
    cleanups.push(() => backTop?.removeEventListener("click", onBackTop));

    window.addEventListener("scroll", updatePageUi, { passive: true });
    window.addEventListener("resize", updatePageUi, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("scroll", updatePageUi);
      window.removeEventListener("resize", updatePageUi);
      clearPin();
    });

    // Wait a frame so the new page DOM is mounted after navigation
    const boot = () => {
      if (cancelled) return;
      decorateSections();
      updatePageUi();
    };
    const raf = requestAnimationFrame(() => requestAnimationFrame(boot));
    cleanups.push(() => cancelAnimationFrame(raf));

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return (
    <>
      <div className="read-progress" aria-hidden="true">
        <span />
      </div>
      <button className="back-top" type="button" aria-label="Back to top">
        ↑
      </button>
    </>
  );
}
