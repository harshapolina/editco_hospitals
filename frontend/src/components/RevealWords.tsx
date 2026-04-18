import { useEffect, useRef } from "react";

interface Props {
  text: string;
  className?: string;
  stagger?: number;
  /** Words (1-indexed positions) to wrap with `.hl` highlight sweep */
  highlight?: number[];
  /** Words to render bold/dark instead of light gray */
  bold?: number[];
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

/**
 * Renders text where each word is animated in with a stagger when the
 * container enters the viewport.
 */
const RevealWords = ({ text, className = "", stagger = 70, highlight = [], bold = [], as: Tag = "h2" }: Props) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".word, .hl"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((item, i) => {
              setTimeout(() => item.classList.add("in-view"), i * stagger);
            });
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stagger]);

  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={className}>
      {words.map((w, i) => {
        const idx = i + 1;
        const isHl = highlight.includes(idx);
        const isBold = bold.includes(idx);
        return (
          <span key={i} className="inline-block">
            <span
              className={`word ${isHl ? "hl px-1" : ""} ${isBold ? "text-foreground font-medium" : ""}`}
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {w}
            </span>
            {i < words.length - 1 && <span> </span>}
          </span>
        );
      })}
    </Tag>
  );
};

export default RevealWords;
