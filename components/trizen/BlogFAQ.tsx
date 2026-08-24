"use client";

import { useState } from "react";
import type { BlogFaq } from "@/lib/blog/types";

type BlogFAQProps = {
  items: BlogFaq[];
};

export default function BlogFAQ({ items }: BlogFAQProps) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!items.length) return null;

  return (
    <div className="blog-faq">
      <h2 className="blog-h2">Frequently Asked Questions</h2>
      <div className="blog-faq-list">
        {items.map((item, index) => {
          const open = openIndex === index;
          return (
            <div
              key={item.q}
              className={`blog-faq-item${open ? " is-open" : ""}`}
            >
              <button
                type="button"
                className="blog-faq-q"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? -1 : index)}
              >
                <span>{item.q}</span>
                <span className="blog-faq-arr" aria-hidden="true">
                  ▼
                </span>
              </button>
              {open ? <div className="blog-faq-a">{item.a}</div> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
