#!/usr/bin/env node
/**
 * Renders a LUMI reel to a 1080x1920 H.264 MP4, frame by frame, with no wall-clock dependence.
 *
 *   node scripts/render-reel.mjs <id> [--url http://localhost:3100] [--fps 30] [--scale 2]
 *        [--blur 2] [--crf 14] [--out ~/Desktop/lumi-reels] [--stills 1.5,6,11]
 *
 * The page at /reel/<id> exposes window.__lumiReel = { ready, durationMs, seek(ms) }.
 * Each output frame is seek()ed, screenshotted at `scale`x (supersampling) and piped to ffmpeg,
 * which downsamples with lanczos. --blur N renders N sub-frames per frame across a 180° shutter
 * and averages them (motion blur). --stills writes PNGs at the given seconds instead of a video.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const WIDTH = 1080;
const HEIGHT = 1920;
const READY_TIMEOUT_MS = 120_000;
const FFMPEG_CANDIDATES = ["/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg", "ffmpeg"];
const SHUTTER = 0.5; // fraction of a frame the virtual shutter stays open

function parseArgs(argv) {
  const [id, ...rest] = argv;
  if (!id || id.startsWith("--")) throw new Error("Usage: node scripts/render-reel.mjs <id> [options]");
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`Invalid reel id "${id}"`);
  const opts = {
    id,
    url: "http://localhost:3100",
    fps: 30,
    scale: 2,
    blur: 2,
    crf: 14,
    out: join(homedir(), "Desktop", "lumi-reels"),
    stills: null,
  };
  for (let i = 0; i < rest.length; i += 2) {
    const key = rest[i]?.replace(/^--/, "");
    const value = rest[i + 1];
    if (value === undefined) throw new Error(`Missing value for --${key}`);
    if (key === "url") opts.url = value.replace(/\/$/, "");
    else if (key === "out") opts.out = resolve(value.replace(/^~(?=$|\/)/, homedir()));
    else if (key === "stills") opts.stills = value.split(",").map(Number).filter((n) => Number.isFinite(n) && n >= 0);
    else if (["fps", "scale", "blur", "crf"].includes(key)) {
      const n = Number(value);
      if (!Number.isFinite(n) || n <= 0) throw new Error(`--${key} must be a positive number`);
      opts[key] = key === "scale" ? n : Math.round(n);
    } else throw new Error(`Unknown option --${key}`);
  }
  return opts;
}

/** Playwright's pinned Chromium may not be downloaded; fall back to the newest one in the local cache. */
function findChromium() {
  if (process.env.LUMI_CHROMIUM && existsSync(process.env.LUMI_CHROMIUM)) return process.env.LUMI_CHROMIUM;
  const pinned = chromium.executablePath();
  if (existsSync(pinned)) return pinned;
  const cache = join(homedir(), "Library", "Caches", "ms-playwright");
  const dirs = existsSync(cache)
    ? readdirSync(cache)
        .filter((d) => /^chromium-\d+$/.test(d))
        .sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]))
    : [];
  for (const dir of dirs) {
    for (const arch of ["chrome-mac-arm64", "chrome-mac", "chrome-mac-x64"]) {
      const exe = join(cache, dir, arch, "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing");
      if (existsSync(exe)) return exe;
    }
  }
  throw new Error("No Chromium found. Set LUMI_CHROMIUM to a Chrome/Chromium executable.");
}

function findFfmpeg() {
  return FFMPEG_CANDIDATES.find((p) => p === "ffmpeg" || existsSync(p));
}

function log(msg) {
  process.stderr.write(`${msg}\n`);
}

async function openReel(opts) {
  const browser = await chromium.launch({
    executablePath: findChromium(),
    args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader", "--hide-scrollbars"],
  });
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: opts.scale });
  page.on("pageerror", (err) => log(`[page error] ${err.message}`));
  const res = await page.goto(`${opts.url}/reel/${opts.id}`, { waitUntil: "load" });
  if (!res || !res.ok()) throw new Error(`GET /reel/${opts.id} failed with ${res ? res.status() : "no response"}`);
  await page.waitForFunction(() => window.__lumiReel?.ready === true || Boolean(window.__lumiReel?.error), null, {
    timeout: READY_TIMEOUT_MS,
  });
  const info = await page.evaluate(() => ({
    durationMs: window.__lumiReel.durationMs,
    error: window.__lumiReel.error,
    renderer: (() => {
      const gl = document.createElement("canvas").getContext("webgl2");
      const ext = gl?.getExtension("WEBGL_debug_renderer_info");
      return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "unknown";
    })(),
  }));
  if (info.error) throw new Error(`Reel failed to initialise: ${info.error}`);
  return { browser, page, ...info };
}

async function capture(page, ms) {
  await page.evaluate((t) => window.__lumiReel.seek(t), ms);
  return page.screenshot({ type: "png", clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
}

async function renderStills(page, opts) {
  const dir = join(opts.out, `${opts.id}-stills`);
  mkdirSync(dir, { recursive: true });
  for (const s of opts.stills) {
    const file = join(dir, `${opts.id}-${s.toFixed(2)}s.png`);
    writeFileSync(file, await capture(page, s * 1000));
    log(`still ${file}`);
  }
}

function startFfmpeg(opts, file) {
  const ffmpeg = findFfmpeg();
  const filters = [];
  // average each group of `blur` sub-frames, keep the last frame of every group
  if (opts.blur > 1) filters.push(`tmix=frames=${opts.blur}`, `select=eq(mod(n\\,${opts.blur})\\,${opts.blur - 1})`);
  filters.push(`scale=${WIDTH}:${HEIGHT}:flags=lanczos`, "format=yuv420p");
  const args = [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-c:v", "png", "-framerate", String(opts.fps * opts.blur), "-i", "-",
    "-vf", filters.join(","),
    "-r", String(opts.fps),
    "-c:v", "libx264", "-preset", "slow", "-crf", String(opts.crf), "-profile:v", "high",
    "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
    "-movflags", "+faststart", "-an",
    file,
  ];
  const proc = spawn(ffmpeg, args, { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((ok, fail) => {
    proc.on("error", fail);
    proc.on("close", (code) => (code === 0 ? ok() : fail(new Error(`ffmpeg exited with ${code}`))));
  });
  return { proc, done };
}

function write(stream, buf) {
  return stream.write(buf) ? Promise.resolve() : new Promise((ok) => stream.once("drain", ok));
}

async function renderVideo(page, durationMs, opts) {
  mkdirSync(opts.out, { recursive: true });
  const file = join(opts.out, `${opts.id}.mp4`);
  const frames = Math.round((durationMs / 1000) * opts.fps);
  const frameMs = 1000 / opts.fps;
  const { proc, done } = startFfmpeg(opts, file);
  const started = Date.now();
  try {
    for (let f = 0; f < frames; f++) {
      for (let s = 0; s < opts.blur; s++) {
        const offset = opts.blur > 1 ? (s / (opts.blur - 1) - 0.5) * SHUTTER * frameMs : 0;
        const t = Math.min(Math.max(f * frameMs + offset, 0), durationMs);
        await write(proc.stdin, await capture(page, t));
      }
      if (f % opts.fps === 0 || f === frames - 1) {
        const rate = (f + 1) / ((Date.now() - started) / 1000);
        log(`frame ${f + 1}/${frames}  ${rate.toFixed(2)} fps`);
      }
    }
  } finally {
    proc.stdin.end();
  }
  await done;
  return file;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { browser, page, durationMs, renderer } = await openReel(opts);
  log(`reel "${opts.id}" ${durationMs} ms, renderer: ${renderer}, scale ${opts.scale}x, blur ${opts.blur}`);
  try {
    if (opts.stills) await renderStills(page, opts);
    else log(`wrote ${await renderVideo(page, durationMs, opts)}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  log(`render-reel failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
