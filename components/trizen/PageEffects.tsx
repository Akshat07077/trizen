"use client";

import { useEffect } from "react";

/** Violet UI chrome: read progress + back-to-top. Sidebar stays CSS-sticky only. */
export default function PageEffects() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const progress = document.querySelector(
      ".read-progress span",
    ) as HTMLElement | null;
    const backTop = document.querySelector(".back-top");

    const updatePageUi = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? window.scrollY / total : 0;
      if (progress) {
        progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
      }
      backTop?.classList.toggle("show", window.scrollY > 650);
    };

    updatePageUi();
    window.addEventListener("scroll", updatePageUi, { passive: true });
    window.addEventListener("resize", updatePageUi, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("scroll", updatePageUi);
      window.removeEventListener("resize", updatePageUi);
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
