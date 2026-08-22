"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { IndustryProduct, IndustryTable } from "@/lib/industries/types";

export type ComponentSlide = {
  title: string;
  meta: { label: string; value: string }[];
};

type ComponentSliderProps = {
  table?: IndustryTable;
  slides?: ComponentSlide[];
  ariaLabel?: string;
};

function slidesFromTable(table: IndustryTable): ComponentSlide[] {
  const [titleHeader, ...metaHeaders] = table.headers;
  return table.rows.map((row) => ({
    title: row[0] ?? "",
    meta: metaHeaders.map((label, index) => ({
      label,
      value: row[index + 1] ?? "",
    })),
  }));
}

function slidesFromProducts(products: IndustryProduct[]): ComponentSlide[] {
  return products.map((product) => ({
    title: product.name,
    meta: [
      { label: "Description", value: product.desc },
      { label: "Packaging page", value: product.link ?? "View sub-page" },
    ],
  }));
}

export function buildToySliderSlides(
  section: {
    table?: IndustryTable;
    products?: IndustryProduct[];
  },
): ComponentSlide[] {
  if (section.table?.rows.length) return slidesFromTable(section.table);
  if (section.products?.length) return slidesFromProducts(section.products);
  return [];
}

export default function ComponentSlider({
  table,
  slides: slidesProp,
  ariaLabel = "Product packaging slider",
}: ComponentSliderProps) {
  const slides =
    slidesProp ?? (table?.rows.length ? slidesFromTable(table) : []);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startXRef = useRef(0);

  const go = useCallback(
    (index: number) => {
      if (slides.length === 0) return;
      setCurrent(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const restart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timerRef.current = setInterval(() => {
      setCurrent((value) => (value + 1) % slides.length);
    }, 5200);
  }, [slides.length]);

  useEffect(() => {
    restart();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [restart, current]);

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <div className="component-slider" aria-label={ariaLabel}>
      <div className="component-viewport"
        onPointerDown={(event) => {
          startXRef.current = event.clientX;
        }}
        onPointerUp={(event) => {
          const delta = event.clientX - startXRef.current;
          if (Math.abs(delta) <= 45) return;
          go(current + (delta < 0 ? 1 : -1));
          restart();
        }}
      >
        <div
          className="component-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((item, index) => (
            <article key={`${item.title}-${index}`} className="component-slide">
              <div className="component-card">
                <div className="component-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="component-copy">
                  <h3>{item.title}</h3>
                  <div className="component-meta">
                    {item.meta.map((field) => (
                      <div key={field.label}>
                        <small>{field.label}</small>
                        <p>{field.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="slider-controls">
        <button
          type="button"
          className="slider-button slider-prev"
          aria-label="Previous slide"
          onClick={() => {
            go(current - 1);
            restart();
          }}
        >
          ←
        </button>
        <span className="slider-status">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </span>
        <div className="slider-dots" aria-label="Choose slide">
          {slides.map((item, index) => (
            <button
              key={`dot-${item.title}-${index}`}
              type="button"
              className={`slider-dot${index === current ? " active" : ""}`}
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === current ? "true" : undefined}
              onClick={() => {
                go(index);
                restart();
              }}
            />
          ))}
        </div>
        <button
          type="button"
          className="slider-button slider-next"
          aria-label="Next slide"
          onClick={() => {
            go(current + 1);
            restart();
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
