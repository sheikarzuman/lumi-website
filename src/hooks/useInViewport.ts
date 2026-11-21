"use client";

import { useEffect, useState, type RefObject } from "react";

/** True while the element is within (or near) the viewport. Used to pause WebGL when offscreen. */
export function useInViewport(ref: RefObject<Element | null>, rootMargin = "200px") {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return visible;
}
