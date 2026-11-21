import type Lenis from "lenis";

/** Module singleton so any component can trigger smooth scrolling. */
export const scrollApi: { lenis: Lenis | null } = { lenis: null };

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (scrollApi.lenis) {
    scrollApi.lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  el.scrollIntoView({ behavior: "smooth" });
}
