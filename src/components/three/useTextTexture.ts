"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

interface TextTextureOptions {
  width?: number;
  height?: number;
  /** Font size in canvas pixels */
  size?: number;
  weight?: number;
  /** Vertical nudge in canvas pixels (Poppins sits a little high) */
  offsetY?: number;
}

/**
 * Poppins text drawn in white on a transparent canvas; tint it with the material colour.
 * Redraws once the web font has loaded so the first frame never sticks with the fallback face.
 */
export function useTextTexture(text: string, { width = 512, height = 200, size = 170, weight = 800, offsetY = 8 }: TextTextureOptions = {}) {
  const [texture] = useState(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  });

  useEffect(() => {
    const family =
      getComputedStyle(document.documentElement).getPropertyValue("--font-poppins").trim() || "sans-serif";
    const font = `${weight} ${size}px ${family}`;
    const draw = () => drawText(texture, text, font, offsetY);
    draw();
    document.fonts.load(font).then(draw).catch(() => undefined);
  }, [texture, text, size, weight, offsetY]);

  useEffect(() => () => texture.dispose(), [texture]);

  return texture;
}

function drawText(texture: THREE.CanvasTexture, text: string, font: string, offsetY: number) {
  const canvas = texture.image as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = font;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + offsetY);
  texture.needsUpdate = true;
}
