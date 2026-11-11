"use client";
import { useEffect, useState } from "react";
import type { ChapterEntry } from "@/lib/case-studies";

export function ChapterIndex({ chapters }: { chapters: ChapterEntry[] }) {
  const [active, setActive] = useState(chapters[0]?.id);
  useEffect(() => {
    const sections = chapters
      .map(({ id }) => document.getElementById(id))
      .filter((node): node is HTMLElement => !!node);
    const update = () => {
      const current = sections.filter((node) => node.getBoundingClientRect().top <= window.innerHeight * 0.35).at(-1);
      setActive(current?.id ?? sections[0]?.id);
    };
    const observer = new IntersectionObserver(update, {
      rootMargin: "-15% 0px -55% 0px",
      threshold: 0,
    });
    sections.forEach((node) => observer.observe(node));
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, [chapters]);
  return (
    <nav aria-label="Case study chapters" className="cs-index">
      <p className="mb-5 eyebrow">In this case study</p>
      <ol>
        {chapters.map(({ id, number, title }) => (
          <li key={id}>
            <a href={`#${id}`} aria-current={active === id ? "location" : undefined} className="cs-index-link">
              <span className="meta">{number}</span>
              <span>{title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
