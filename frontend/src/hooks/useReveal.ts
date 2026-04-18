import { useEffect, useRef } from "react";

/**
 * Triggers staggered reveal of all `.reveal` descendants when the container
 * enters the viewport. If no `.reveal` children exist, the container itself
 * gets the `in-view` class.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(stagger = 120, threshold = 0.15) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = Array.from(el.querySelectorAll<HTMLElement>(".reveal, .reveal-fade, .reveal-scale, .reveal-left, .reveal-right"));
            if (items.length === 0) {
              el.classList.add("in-view");
            } else {
              items.forEach((item, i) => {
                setTimeout(() => item.classList.add("in-view"), i * stagger);
              });
            }
            io.disconnect();
          }
        });
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stagger, threshold]);

  return ref;
}
