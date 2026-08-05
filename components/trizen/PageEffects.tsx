"use client";

import { useEffect } from "react";

/** Violet UI chrome: read progress, back-to-top, sticky sidebar dock. */
export default function PageEffects() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const progress = document.querySelector(
      ".read-progress span",
    ) as HTMLElement | null;
    const backTop = document.querySelector(".back-top");
    const pageWrap = document.querySelector(".page-wrap");
    const sidebar = document.querySelector(".aside");

    const updatePageUi = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? window.scrollY / total : 0;
      if (progress) {
        progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
      }
      backTop?.classList.toggle("show", window.scrollY > 650);
    };

    const updateSidebar = () => {
      if (!pageWrap || !sidebar) return;
      const desktop = window.matchMedia("(min-width:701px)").matches;
      const dockAt = (pageWrap as HTMLElement).offsetTop - 100;
      const fixed = desktop && window.scrollY >= dockAt;
      sidebar.classList.toggle("sidebar-fixed", fixed);
      if (fixed) {
        const pageRange = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight - dockAt,
        );
        const pageProgress = Math.min(
          1,
          Math.max(0, (window.scrollY - dockAt) / pageRange),
        );
        const sidebarRange = Math.max(
          0,
          sidebar.scrollHeight - sidebar.clientHeight,
        );
        sidebar.scrollTop = pageProgress * sidebarRange;
      } else {
        sidebar.scrollTop = 0;
      }
    };

    const onScroll = () => {
      updatePageUi();
      updateSidebar();
    };

    updatePageUi();
    updateSidebar();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
