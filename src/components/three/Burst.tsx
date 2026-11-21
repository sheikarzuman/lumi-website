"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seededRandom } from "@/lib/tween";

/** What the burst should show this frame; `t` is seconds since the burst started. */
export interface BurstFrame {
  t: number;
  colorA: string;
  colorB: string;
}

interface BurstProps {
  /** Called every frame; return null to hide */
  read: () => BurstFrame | null;
  count?: number;
  seed?: number;
  /** Seconds until the longest-lived particle fades out */
  duration?: number;
  /** Launch speed multiplier */
  spread?: number;
  /** Point size in world-ish units */
  size?: number;
  additive?: boolean;
  position?: [number, number, number];
}

const VERTEX = /* glsl */ `
  uniform float uT;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uDuration;
  attribute vec3 aVel;
  attribute float aSeed;
  varying float vAlpha;
  varying float vMix;
  void main() {
    float life = uDuration * (0.55 + 0.45 * aSeed);
    float k = clamp(uT / life, 0.0, 1.0);
    vec3 p = aVel * (1.0 - exp(-2.6 * uT)) / 2.6;
    p.y -= 0.35 * uT * uT;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.65 + 0.35 * sin(uT * 18.0 + aSeed * 40.0);
    vAlpha = (1.0 - k) * smoothstep(0.0, 0.06, uT) * twinkle;
    vMix = fract(aSeed * 7.31);
    gl_PointSize = uSize * (0.45 + aSeed) * uPixelRatio * (1.0 - 0.45 * k) / -mv.z;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vMix;
  void main() {
    vec2 q = gl_PointCoord - 0.5;
    float core = smoothstep(0.5, 0.0, length(q));
    vec2 aq = abs(q);
    float star = max(
      smoothstep(0.05, 0.0, aq.x) * smoothstep(0.5, 0.0, aq.y),
      smoothstep(0.05, 0.0, aq.y) * smoothstep(0.5, 0.0, aq.x)
    );
    float a = max(core * core, star) * vAlpha;
    if (a < 0.003) discard;
    gl_FragColor = vec4(mix(uColorA, uColorB, vMix), a);
    #include <colorspace_fragment>
  }
`;

function buildGeometry(count: number, seed: number, spread: number) {
  const rand = seededRandom(seed);
  const vel = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // directions on a sphere, biased upward so the burst fountains out of the shell
    const u = rand() * 2 - 1;
    const theta = rand() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    const speed = (2.2 + rand() * 4.2) * spread;
    vel[i * 3] = r * Math.cos(theta) * speed;
    vel[i * 3 + 1] = (u * 0.8 + 0.45) * speed;
    vel[i * 3 + 2] = r * Math.sin(theta) * speed * 0.7;
    seeds[i] = rand();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  g.setAttribute("aVel", new THREE.BufferAttribute(vel, 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  return g;
}

/** GPU particle burst: positions are a pure function of time, so a given `t` always draws the same frame. */
export function Burst({
  read,
  count = 180,
  seed = 7,
  duration = 1.8,
  spread = 1,
  size = 60,
  additive = false,
  position = [0, 0, 0],
}: BurstProps) {
  const [geometry] = useState(() => buildGeometry(count, seed, spread));
  const [material] = useState(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
        uniforms: {
          uT: { value: 0 },
          uSize: { value: size },
          uPixelRatio: { value: 1 },
          uDuration: { value: duration },
          uColorA: { value: new THREE.Color() },
          uColorB: { value: new THREE.Color() },
        },
      }),
  );
  const pointsRef = useRef<THREE.Points>(null);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    const f = read();
    const live = f !== null && f.t >= 0 && f.t <= duration;
    points.visible = live;
    if (!live) return;
    const u = (points.material as THREE.ShaderMaterial).uniforms;
    u.uT.value = f.t;
    u.uPixelRatio.value = state.gl.getPixelRatio() * (state.size.height / 1000);
    (u.uColorA.value as THREE.Color).set(f.colorA);
    (u.uColorB.value as THREE.Color).set(f.colorB);
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      position={position}
      frustumCulled={false}
      visible={false}
      renderOrder={5}
    />
  );
}
