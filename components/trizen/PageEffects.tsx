"use client";

import { useEffect } from "react";

/**
 * Violet UI chrome: read progress, back-to-top,
 * and a reliable pinned sidebar (CSS sticky can fail with overflow ancestors).
 */
export default function PageEffects() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const progress = document.querySelector(
      ".read-progress span",
    ) as HTMLElement | null;
    const backTop = document.querySelector(".back-top");
    const pageWrap = document.querySelector(".page-wrap") as HTMLElement | null;
    const sidebar = document.querySelector(".aside") as HTMLElement | null;

    let spacer: HTMLElement | null = null;

    const clearPin = () => {
      if (!sidebar) return;
      sidebar.classList.remove("is-pinned");
      sidebar.style.removeProperty("top");
      sidebar.style.removeProperty("left");
      sidebar.style.removeProperty("width");
      sidebar.style.removeProperty("max-height");
      if (spacer) {
        spacer.remove();
        spacer = null;
      }
    };

    const updateSidebarPin = () => {
      if (!pageWrap || !sidebar) return;
      const desktop = window.matchMedia("(min-width:701px)").matches;
      if (!desktop) {
        clearPin();
        return;
      }

      const wrapRect = pageWrap.getBoundingClientRect();
      const navOffset = 100;
      const sideWidth = sidebar.offsetWidth || 300;

      // Pin while the article block is on screen
      const shouldPin =
        wrapRect.top <= navOffset && wrapRect.bottom > navOffset + 120;

      if (!shouldPin) {
        clearPin();
        return;
      }

      if (!spacer) {
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
      // Do NOT sync sidebar.scrollTop with page scroll
    };

    const updatePageUi = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? window.scrollY / total : 0;
      if (progress) {
        progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
      }
      backTop?.classList.toggle("show", window.scrollY > 650);
      updateSidebarPin();
    };

    updatePageUi();
    window.addEventListener("scroll", updatePageUi, { passive: true });
    window.addEventListener("resize", updatePageUi, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("scroll", updatePageUi);
      window.removeEventListener("resize", updatePageUi);
      clearPin();
    });

    const onBackTop = () =>
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    backTop?.addEventListener("click", onBackTop);
    cleanups.push(() => backTop?.removeEventListener("click", onBackTop));

    document.querySelectorAll(".page-wrap main .sec").forEach((section, index) => {
      if (index % 2 === 1) section.classList.add("tone-ice");
      const label = section.querySelector(".ey");
      if (label && !label.querySelector(".section-index")) {
        const number = document.createElement("span");
        number.className = "section-index";
        number.textContent = String(index + 1).padStart(2, "0");
        label.prepend(number);
      }
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

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
