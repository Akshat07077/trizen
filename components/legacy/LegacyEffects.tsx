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

/**
 * Ports the original HTML particle canvas + cursor / scroll / FAQ interactions
 * into React so they work reliably under Next.js App Router.
 */
export default function LegacyEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const cleanups: Array<() => void> = [];
    let rafId = 0;
    let cancelled = false;

    // Wait one frame so LegacyShell can fill innerHTML first
    const startId = window.setTimeout(() => {
      init();
    }, 50);
    cleanups.push(() => window.clearTimeout(startId));

    function init() {
      // --- FAQ accordion ---
      const onFaqClick = (event: MouseEvent) => {
        const button = (event.target as HTMLElement | null)?.closest?.(".fqq");
        if (!button) return;
        const item = button.closest(".fq");
        if (!item) return;
        const wasOpen = item.classList.contains("open");
        document
          .querySelectorAll(".fq.open")
          .forEach((el) => el.classList.remove("open"));
        if (!wasOpen) item.classList.add("open");
      };
      document.addEventListener("click", onFaqClick);
      cleanups.push(() => document.removeEventListener("click", onFaqClick));

      // --- Cursor CSS vars ---
      const onMouseMove = (event: MouseEvent) => {
        root.style.setProperty("--mouse-x", `${event.clientX}px`);
        root.style.setProperty("--mouse-y", `${event.clientY}px`);
      };
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      cleanups.push(() =>
        window.removeEventListener("mousemove", onMouseMove),
      );

      // --- Scroll progress ---
      const progressBar = document.querySelector(
        ".top-progress span",
      ) as HTMLElement | null;
      const backTop = document.querySelector(".back-to-top");

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

      // --- Reveal on scroll ---
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
          ".hero,.visual-band,.sec,.mid-cta,.bottom-cta,.side-card,.side-cta,.img-ph,.strip,.fq,.hc,.gtbl,.pc,.cert",
        )
        .forEach((el) => {
          el.classList.add("reveal-on-scroll");
          revealObserver.observe(el);
        });

      document
        .querySelectorAll(".pc,.strip,.cert,.fq,.lead,.st,.visual-placeholder")
        .forEach((el, index) => {
          el.classList.add(index % 3 === 0 ? "slide-in" : "fade-up");
          (el as HTMLElement).style.setProperty(
            "--stagger",
            `${Math.min(index % 8, 7) * 55}ms`,
          );
          revealObserver.observe(el);
        });

      cleanups.push(() => revealObserver.disconnect());

      // --- Magnetic buttons ---
      const magneticButtons = Array.from(
        document.querySelectorAll(
          ".magnetic,.bp,.bg2,.mid-cta-btn,.btn-gold,.btn-wht,.side-cta a",
        ),
      ) as HTMLElement[];

      magneticButtons.forEach((button) => {
        button.classList.add("magnetic");
        if (!button.querySelector(".arrow")) {
          button.insertAdjacentHTML(
            "beforeend",
            '<span class="arrow">→</span>',
          );
        }
        const onMove = (event: MouseEvent) => {
          const rect = button.getBoundingClientRect();
          const tx = (event.clientX - rect.left - rect.width / 2) * 0.12;
          const ty = (event.clientY - rect.top - rect.height / 2) * 0.18;
          button.style.transform = `translate(${tx}px,${ty}px) translateY(-4px)`;
        };
        const onLeave = () => {
          button.style.transform = "";
        };
        button.addEventListener("mousemove", onMove);
        button.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          button.removeEventListener("mousemove", onMove);
          button.removeEventListener("mouseleave", onLeave);
        });
      });

      // --- Card tilt (content only) ---
      const tiltCards = Array.from(
        document.querySelectorAll(
          ".hc,.pc,.cert,.strip,.fq,.visual-placeholder,table.gtbl",
        ),
      ) as HTMLElement[];

      tiltCards.forEach((card) => {
        const isTable = card.tagName === "TABLE";
        const onMove = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          const rx = isTable ? 2.2 : 5;
          const ry = isTable ? 2.6 : 6;
          card.style.transform = `perspective(900px) rotateX(${-y * rx}deg) rotateY(${x * ry}deg) translateY(-8px)`;
        };
        const onLeave = () => {
          card.style.transform = "";
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      // --- FAB + back to top ---
      const fab = document.querySelector(".floating-action");
      const onFab = () => {
        window.location.href = "mailto:contact@trizenpackaging.com";
      };
      const onBackTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
      fab?.addEventListener("click", onFab);
      backTop?.addEventListener("click", onBackTop);
      cleanups.push(() => {
        fab?.removeEventListener("click", onFab);
        backTop?.removeEventListener("click", onBackTop);
      });

      // --- Hexagon particle canvas ---
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
          window.addEventListener("mousemove", onParticleMouse, {
            passive: true,
          });
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

          const animateParticles = () => {
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
            rafId = requestAnimationFrame(animateParticles);
          };

          initParticles();
          animateParticles();
          window.addEventListener("resize", initParticles);
          cleanups.push(() => {
            window.removeEventListener("resize", initParticles);
            cancelAnimationFrame(rafId);
          });
        }
      }
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
