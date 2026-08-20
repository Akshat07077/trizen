"use client";

import { useState } from "react";

type FaqItem = {
  q: string;
  a: string;
  badge?: string;
};

type ContactFAQProps = {
  items: readonly FaqItem[];
};

export default function ContactFAQ({ items }: ContactFAQProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="contact-faq-list">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={item.q}
            className={`contact-faq-item${open ? " is-open" : ""}${item.badge ? " is-new" : ""}`}
          >
            <button
              type="button"
              className="contact-faq-q"
              onClick={() => setOpenIndex(open ? -1 : index)}
            >
              <span>
                {item.q}
                {item.badge ? (
                  <span className="contact-faq-badge">{item.badge}</span>
                ) : null}
              </span>
              <span className="contact-faq-arr" aria-hidden="true">
                ▼
              </span>
            </button>
            <div className="contact-faq-a">{item.a}</div>
          </div>
        );
      })}
    </div>
  );
}
