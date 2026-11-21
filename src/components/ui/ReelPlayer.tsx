"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useInViewport } from "@/hooks/useInViewport";

interface ReelPlayerProps {
  src: string;
  poster: string;
  /** Accessible description of what the reel shows */
  label: string;
}

/**
 * 9:16 silent reel in a phone-style frame. Autoplays (muted) only while on screen,
 * never autoplays for reduced-motion users, and always offers a play/pause button.
 */
export function ReelPlayer({ src, poster, label }: ReelPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const visible = useInViewport(ref, "0px");
  const reduced = useReducedMotion() ?? false;
  // null = follow autoplay rules; true/false = the viewer chose
  const [choice, setChoice] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const wantPlay = visible && (choice ?? !reduced);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!wantPlay) {
      video.pause();
      return;
    }
    // play() can reject (autoplay policy, data saver); the poster stays and the button still works
    video.play().catch(() => setPlaying(false));
  }, [wantPlay]);

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-[2.5rem] border-[6px] border-plum bg-plum shadow-lift">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={() => setChoice(!playing)}
        aria-label={playing ? `Pause: ${label}` : `Play: ${label}`}
        className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-cream/90 text-plum shadow-soft transition-transform hover:scale-110 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sun"
      >
        {playing ? <Pause size={20} aria-hidden /> : <Play size={20} aria-hidden className="translate-x-px" />}
      </button>
    </div>
  );
}
