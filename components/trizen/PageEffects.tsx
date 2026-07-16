"use client";

import { useEffect } from "react";

type Particle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulse: number;
};

/** Page chrome + particle/cursor/scroll interactions from the original HTML. */
export default function PageEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const cleanups: Array<() => void> = [];
    let rafId = 0;
    let cancelled = false;

    const loader = document.querySelector(".page-loader");
    loader?.classList.add("hidden");

    const progressBar = document.querySelector(
      ".top-progress span",
    ) as HTMLElement | null;
    const backTop = document.querySelector(".back-to-top");

    const onMouseMove = (event: MouseEvent) => {
      root.style.setProperty("--mouse-x", `${event.clientX}px`);
      root.style.setProperty("--mouse-y", `${event.clientY}px`);
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    cleanups.push(() => window.removeEventListener("mousemove", onMouseMove));

    const updateScroll = () => {
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
      root.style.setProperty("--scroll-pct", `${pct}%`);
      root.style.setProperty("--sidebar-progress", `${pct}%`);
      if (progressBar) progressBar.style.width = `${pct}%`;
      backTop?.classList.toggle("visible", window.scrollY > 520);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    cleanups.push(() => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(
        ".hero,.visual-band,.sec,.mid-cta,.bottom-cta,.side-card,.side-cta,.img-ph,.strip,.fq,.pc,.gtbl",
      )
      .forEach((el) => {
        el.classList.add("reveal-on-scroll");
        revealObserver.observe(el);
      });
    cleanups.push(() => revealObserver.disconnect());

    document.querySelector(".floating-action")?.addEventListener("click", () => {
      window.location.href = "mailto:contact@trizenpackaging.com";
    });
    backTop?.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );

    const canvas = document.getElementById(
      "hero-canvas",
    ) as HTMLCanvasElement | null;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        let particles: Particle[] = [];
        const mouse = { x: null as number | null, y: null as number | null };
        const onParticleMouse = (event: MouseEvent) => {
          mouse.x = event.clientX;
          mouse.y = event.clientY;
        };
        window.addEventListener("mousemove", onParticleMouse, { passive: true });
        cleanups.push(() =>
          window.removeEventListener("mousemove", onParticleMouse),
        );

        const initParticles = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          particles = [];
          const count = window.innerWidth < 768 ? 55 : 120;
          for (let i = 0; i < count; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 4 + 2,
              speedX: Math.random() * 0.3 - 0.15,
              speedY: Math.random() * 0.3 - 0.15,
              opacity: Math.random() * 0.5 + 0.3,
              pulse: Math.random() * 0.02,
            });
          }
        };

        const drawHexagon = (x: number, y: number, size: number) => {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (i * 2 * Math.PI) / 6;
            const px = x + size * Math.cos(a);
            const py = y + size * Math.sin(a);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
        };

        const animate = () => {
          if (cancelled) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particles.forEach((p, index) => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.opacity += p.pulse;
            if (p.opacity > 0.8 || p.opacity < 0.2) p.pulse *= -1;
            if (mouse.x != null && mouse.y != null) {
              const dx = mouse.x - p.x;
              const dy = mouse.y - p.y;
              const d = Math.sqrt(dx * dx + dy * dy);
              if (d < 300) {
                p.x += dx * 0.005;
                p.y += dy * 0.005;
                p.opacity = Math.min(0.9, p.opacity + 0.1);
              }
            }
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            drawHexagon(p.x, p.y, p.size);
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(27,31,115,${p.opacity * 0.5})`;
            ctx.fillStyle = `rgba(27,31,115,${p.opacity})`;
            ctx.fill();
            ctx.shadowBlur = 0;
            for (let j = index + 1; j < particles.length; j++) {
              const o = particles[j];
              const dx = p.x - o.x;
              const dy = p.y - o.y;
              const d = Math.sqrt(dx * dx + dy * dy);
              if (d < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(27,31,115,${0.2 * (1 - d / 150)})`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(o.x, o.y);
                ctx.stroke();
              }
            }
          });
          rafId = requestAnimationFrame(animate);
        };

        initParticles();
        animate();
        window.addEventListener("resize", initParticles);
        cleanups.push(() => {
          window.removeEventListener("resize", initParticles);
          cancelAnimationFrame(rafId);
        });
      }
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <div className="page-loader hidden" aria-hidden="true">
        <div>
          <div className="loader-mark" />
          <div className="loader-copy">Trizen Packaging</div>
        </div>
      </div>
      <div className="top-progress" aria-hidden="true">
        <span />
      </div>
      <div className="cursor-spotlight" aria-hidden="true" />
      <div className="ambient-blob one" aria-hidden="true" />
      <div className="ambient-blob two" aria-hidden="true" />
      <button
        className="floating-action magnetic"
        type="button"
        aria-label="Email Trizen Packaging"
      >
        <span className="material-symbols-outlined">mail</span>
      </button>
      <button className="back-to-top" type="button" aria-label="Back to top">
        <span className="material-symbols-outlined">keyboard_arrow_up</span>
      </button>
      <div className="benzene-pattern" />
      <div className="scan-effect" />
      <canvas id="hero-canvas" />
    </>
  );
}
