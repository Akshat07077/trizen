"use client";

import { useState } from "react";
import type { ToyFaq } from "@/lib/toy/types";

type FAQProps = {
  items: ToyFaq[];
};

export default function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="fql">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.q} className={`fq${open ? " open" : ""}`}>
            <button
              type="button"
              className="fqq"
              onClick={() => setOpenIndex(open ? -1 : index)}
            >
              {item.q} <span className="arr">▼</span>
            </button>
            <div className="fqa">
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
