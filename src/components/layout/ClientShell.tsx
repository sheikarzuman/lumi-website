"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Nav } from "./Nav";
import { Preloader } from "./Preloader";
import { ScrollProgress } from "./ScrollProgress";
import { SmoothScroll } from "./SmoothScroll";

const IntroContext = createContext({ ready: false });

/** `ready` flips true once the opening curtain lifts; hero motion waits for it. */
export const useIntro = () => useContext(IntroContext);

/** `intro={false}` skips the opening curtain (secondary pages such as /investors). */
export function ClientShell({ children, intro = true }: { children: ReactNode; intro?: boolean }) {
  const [ready, setReady] = useState(!intro);

  const handleDone = useCallback(() => {
    setReady(true);
    // pinned sections measure after the curtain has released scroll
    window.requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return (
    <IntroContext value={{ ready }}>
      <SmoothScroll />
      {intro && <Preloader onDone={handleDone} />}
      <ScrollProgress />
      <Nav />
      {children}
    </IntroContext>
  );
}
