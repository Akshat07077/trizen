"use client";

import { useEffect } from "react";

/**
 * Next.js injects legacy scripts after hydration, so window `load` may already
 * have fired. Force-hide the full-screen page-loader and re-run critical UI init.
 */
export default function LegacyBootstrap() {
  useEffect(() => {
    const hideLoader = () => {
      document.querySelector(".page-loader")?.classList.add("hidden");
    };

    // Hide immediately, then again shortly after legacy scripts may re-show it
    hideLoader();
    const t1 = window.setTimeout(hideLoader, 100);
    const t2 = window.setTimeout(hideLoader, 500);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return null;
}
