/*
 * "From noise to judgement": the hero motion graphic, in raw WebGL2.
 *
 * Thousands of dots drift as a loose cloud: each is a model's answer. A thin
 * line sweeps across once, like an expert reading. As it passes, every dot is
 * graded. About one in six passes (the pass rate in the BankerToolBench paper)
 * and travels into precise hexagonal packing inside the seven circles of the
 * Priberry mark. The rest dim and settle. The pointer is an expert's lens:
 * dots under it enlarge, solid if they passed, hollow if they failed.
 *
 * Everything moves in the vertex shader; per frame the CPU only writes a few
 * uniforms. One draw call. No dependencies.
 */

export type FieldOptions = {
  canvas: HTMLCanvasElement;
  /** Element whose box the mark fills (shared with the static SVG fallback). */
  markBox: HTMLElement;
  /** Element whose box should stay calm behind the headline. */
  quietBox?: HTMLElement | null;
  /** Called every frame while the sweep runs, with its x in CSS px (or null when done). */
  onSweep?: (x: number | null) => void;
  /** Lower dot count for weak devices. */
  quality: "high" | "low";
  /** Skip the intro and start already graded (used when taking over from the static mark). */
  settled?: boolean;
};

export type Field = {
  setPointer(x: number, y: number, active: boolean): void;
  setScroll(progress: number): void;
  setRunning(running: boolean): void;
  destroy(): void;
};

// Brand geometry from public/brand/priberry-icon.svg (viewBox -118 -107 236 214).
const CIRCLES: ReadonlyArray<readonly [number, number, number]> = [
  // cx, cy, palette index (0 berry, 1 blush, 2 deep berry)
  [-40, -69, 0],
  [40, -69, 1],
  [-80, 0, 0],
  [0, 0, 2],
  [80, 0, 0],
  [-40, 69, 2],
  [40, 69, 0],
];
const R = 38;
const MARK_W = 236;
const MARK_H = 214;

const PASS_RATE = 0.16;
const SWEEP_START = 0.55; // s after start
const SWEEP_DURATION = 2.5; // s to cross the screen
const TRAVEL = 1.15; // s for a passing dot to reach its place

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const INK = hex("#1E1530");
const PALETTE = [...hex("#B3265F"), ...hex("#F29AB9"), ...hex("#8A1B49")];

const VERT = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_start;
layout(location=1) in vec2 a_target;
layout(location=2) in float a_pass;
layout(location=3) in float a_seed;
layout(location=4) in float a_color;
uniform vec2 u_res;
uniform float u_dpr;
uniform float u_time;
uniform vec3 u_sweep;      // x0, x1, start time
uniform float u_sweepDur;
uniform float u_travel;
uniform vec3 u_pointer;    // x, y, strength 0..1
uniform float u_lensR;
uniform float u_scroll;
uniform float u_dot;
uniform vec3 u_ink;
uniform vec3 u_palette[3];
out vec4 v_color;
out float v_ring;

float inOut(float x) { return x < 0.5 ? 4.0*x*x*x : 1.0 - pow(-2.0*x + 2.0, 3.0) * 0.5; }
float out3(float x) { return 1.0 - pow(1.0 - x, 3.0); }

void main() {
  float t = u_time;
  // Unhurried drift with a per-dot phase, so the cloud never moves in unison.
  vec2 flow = vec2(
    sin(t*0.31 + a_seed*12.0 + a_start.y*0.004),
    cos(t*0.27 + a_seed*9.0 + a_start.x*0.003)
  ) * 13.0;
  vec2 cloud = a_start + flow;

  // Moment the sweep reaches this dot (the sweep moves at constant speed).
  float tg = u_sweep.z + u_sweepDur * clamp((a_start.x - u_sweep.x) / (u_sweep.y - u_sweep.x), 0.0, 1.0);
  float k = clamp((t - tg) / u_travel, 0.0, 1.0);

  vec2 pos; vec3 col; float alpha; float size;
  if (a_pass > 0.5) {
    float e = inOut(k);
    vec2 settle = vec2(sin(t*0.7 + a_seed*40.0), cos(t*0.6 + a_seed*31.0)) * 0.55;
    pos = mix(cloud, a_target + settle, e);
    pos.y -= sin(e * 3.14159) * 46.0 * (a_seed - 0.5);   // a gentle arc in flight
    col = mix(u_ink, u_palette[int(a_color)], smoothstep(0.0, 0.3, k));
    alpha = mix(0.42, 1.0, smoothstep(0.0, 0.5, k));
    size = u_dot * mix(1.0, 1.12, k);
  } else {
    float e = out3(k);
    pos = cloud + vec2(0.0, 9.0 * e);
    col = u_ink;
    alpha = mix(0.42, 0.13, e);
    size = u_dot * mix(1.0, 0.82, e);
  }

  // Scroll parallax: the graded-out cloud lifts away faster than the mark.
  float depth = mix(0.35, 1.0, fract(a_seed * 7.13));
  pos.y -= u_scroll * u_res.y * (a_pass > 0.5 ? 0.1 : 0.42 * depth);

  // The expert's lens.
  vec2 d = pos - u_pointer.xy;
  float dist = length(d);
  float lens = u_pointer.z * (1.0 - smoothstep(0.0, u_lensR, dist));
  pos += (dist > 0.001 ? d / dist : vec2(0.0)) * lens * 9.0;
  size *= 1.0 + lens * 1.7;
  v_ring = a_pass > 0.5 ? 0.0 : lens;
  if (a_pass < 0.5) alpha = max(alpha, lens * 0.85);

  alpha *= 1.0 - smoothstep(0.5, 0.95, u_scroll);
  v_color = vec4(col * alpha, alpha);
  vec2 clip = pos / u_res * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = size * u_dpr;
}`;

const FRAG = `#version 300 es
precision mediump float;
in vec4 v_color;
in float v_ring;
out vec4 o;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float r = length(p);
  float aa = max(fwidth(r), 0.02);
  float disc = 1.0 - smoothstep(1.0 - aa * 1.5, 1.0, r);
  float hole = smoothstep(0.5 - aa, 0.5 + aa, r);
  o = v_color * disc * mix(1.0, hole, v_ring);
}`;

// Small deterministic PRNG so the composition is identical on every visit.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Layout = { data: Float32Array; count: number; failCount: number; dot: number };

/** Builds every dot: passes packed inside the mark, failures scattered in the cloud. */
function buildLayout(w: number, h: number, mark: DOMRect, quiet: DOMRect | null, quality: "high" | "low"): Layout {
  const rand = mulberry32(7);
  const scale = Math.min(mark.width / MARK_W, mark.height / MARK_H);
  const cx = mark.left + mark.width / 2;
  const cy = mark.top + mark.height / 2;
  const small = w < 768;

  // Hexagonal packing inside each circle. Spacing sets the pass-dot count.
  // ~11px apart at desktop size: reads as a fine halftone and keeps the
  // total near 10k dots (about 1.7k pass). Phones and the low tier use fewer.
  const spacing = Math.max(small ? 7 : 8, (quality === "low" ? 13 : 11) * (scale / 2.4));
  const targets: [number, number, number][] = [];
  const rPx = R * scale - spacing * 0.35;
  const rowH = spacing * Math.sqrt(3) / 2;
  for (const [ux, uy, color] of CIRCLES) {
    const ox = cx + ux * scale;
    const oy = cy + uy * scale;
    for (let row = -Math.ceil(rPx / rowH); row <= Math.ceil(rPx / rowH); row++) {
      const y = row * rowH;
      const shift = row & 1 ? spacing / 2 : 0;
      for (let x = -rPx - shift; x <= rPx; x += spacing) {
        const px = x + shift;
        if (px * px + y * y <= rPx * rPx) targets.push([ox + px, oy + y, color]);
      }
    }
  }

  const passCount = targets.length;
  const total = Math.round(passCount / PASS_RATE);
  const failCount = total - passCount;
  const data = new Float32Array(total * 7);

  // Cloud positions: weighted towards the mark, thinned behind the headline.
  const cloudPoint = (): [number, number] => {
    for (let i = 0; i < 12; i++) {
      let x: number, y: number;
      if (rand() < 0.55) {
        // gaussian-ish around the mark
        const a = rand() * Math.PI * 2;
        const rr = Math.sqrt(-2 * Math.log(rand() + 1e-6)) * (mark.width * 0.42);
        x = cx + Math.cos(a) * rr;
        y = cy + Math.sin(a) * rr * 0.8;
      } else {
        x = rand() * w;
        y = rand() * h;
      }
      if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue;
      const inQuiet = quiet && x > quiet.left - 24 && x < quiet.right + 24 && y > quiet.top - 24 && y < quiet.bottom + 24;
      if (inQuiet && rand() < 0.9) continue;
      return [x, y];
    }
    return [rand() * w, rand() * h];
  };

  // Failures first (so they draw beneath, and the low tier can skip some).
  let o = 0;
  for (let i = 0; i < failCount; i++) {
    const [x, y] = cloudPoint();
    data.set([x, y, x, y, 0, rand(), 0], o);
    o += 7;
  }
  // Shuffle targets so neighbours in the cloud land in different circles.
  for (let i = targets.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [targets[i], targets[j]] = [targets[j]!, targets[i]!];
  }
  for (const [tx, ty, color] of targets) {
    const [x, y] = cloudPoint();
    data.set([x, y, tx, ty, 1, rand(), color], o);
    o += 7;
  }

  const dot = Math.max(2.4, Math.min(4.2, spacing * 0.5));
  return { data, count: total, failCount, dot };
}

/**
 * Compiles and links without blocking the main thread where the browser
 * supports KHR_parallel_shader_compile: we poll for completion between frames.
 */
async function buildProgram(gl: WebGL2RenderingContext): Promise<WebGLProgram | null> {
  const program = gl.createProgram()!;
  const vs = gl.createShader(gl.VERTEX_SHADER)!;
  const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(vs, VERT);
  gl.shaderSource(fs, FRAG);
  gl.compileShader(vs);
  gl.compileShader(fs);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  const ext = gl.getExtension("KHR_parallel_shader_compile") as { COMPLETION_STATUS_KHR: number } | null;
  if (ext) {
    while (!gl.getProgramParameter(program, ext.COMPLETION_STATUS_KHR)) {
      await new Promise((r) => requestAnimationFrame(r));
    }
  }
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  return program;
}

export async function startField(opts: FieldOptions): Promise<Field | null> {
  const { canvas, markBox, quietBox, onSweep, quality, settled } = opts;
  const gl = canvas.getContext("webgl2", { antialias: false, premultipliedAlpha: true, alpha: true, powerPreference: "high-performance" });
  if (!gl) return null;

  const program = await buildProgram(gl);
  if (!program) return null;
  gl.useProgram(program);

  const u = (n: string) => gl.getUniformLocation(program, n);
  const U = {
    res: u("u_res"), dpr: u("u_dpr"), time: u("u_time"), sweep: u("u_sweep"), sweepDur: u("u_sweepDur"),
    travel: u("u_travel"), pointer: u("u_pointer"), lensR: u("u_lensR"), scroll: u("u_scroll"),
    dot: u("u_dot"), ink: u("u_ink"), palette: u("u_palette"),
  };
  gl.uniform3fv(U.ink, INK);
  gl.uniform3fv(U.palette, PALETTE);
  gl.uniform1f(U.sweepDur, SWEEP_DURATION);
  gl.uniform1f(U.travel, TRAVEL);

  const vao = gl.createVertexArray();
  const vbo = gl.createBuffer();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  const stride = 7 * 4;
  const attr = (loc: number, size: number, offset: number) => {
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset * 4);
  };
  attr(0, 2, 0);
  attr(1, 2, 2);
  attr(2, 1, 4);
  attr(3, 1, 5);
  attr(4, 1, 6);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  let layout: Layout;
  let w = 0, h = 0, dpr = 1, x0 = 0, x1 = 0;
  let skip = 0; // failures skipped by the frame-rate watchdog

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, quality === "low" ? 1.5 : 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    // Mark and quiet zone in canvas-local coordinates.
    const toLocal = (r: DOMRect) => new DOMRect(r.left - rect.left, r.top - rect.top, r.width, r.height);
    layout = buildLayout(w, h, toLocal(markBox.getBoundingClientRect()), quietBox ? toLocal(quietBox.getBoundingClientRect()) : null, quality);
    gl.bufferData(gl.ARRAY_BUFFER, layout.data, gl.STATIC_DRAW);
    x0 = -w * 0.04;
    x1 = w * 1.04;
    gl.uniform2f(U.res, w, h);
    gl.uniform1f(U.dpr, dpr);
    gl.uniform1f(U.dot, layout.dot);
    gl.uniform1f(U.lensR, Math.max(80, Math.min(130, w * 0.08)));
  };
  resize();

  // Pointer is eased so the lens glides rather than jitters.
  const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, s: 0, ts: 0 };
  let scroll = 0;
  let running = true;
  let raf = 0;
  // A settled start begins the clock after the intro has finished.
  const t0 = performance.now() - (settled ? (SWEEP_START + SWEEP_DURATION + TRAVEL + 1) * 1000 : 0);
  let pausedAt = 0;
  let pausedTotal = 0;
  let frames = 0;
  let slowFrames = 0;
  let last = t0;

  const frame = (now: number) => {
    raf = 0;
    const t = (now - t0 - pausedTotal) / 1000;
    pointer.x += (pointer.tx - pointer.x) * 0.2;
    pointer.y += (pointer.ty - pointer.y) * 0.2;
    pointer.s += (pointer.ts - pointer.s) * 0.12;

    gl.uniform1f(U.time, t);
    gl.uniform3f(U.sweep, x0, x1, SWEEP_START);
    gl.uniform3f(U.pointer, pointer.x, pointer.y, pointer.s);
    gl.uniform1f(U.scroll, scroll);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, skip, layout.count - skip);

    // The DOM sweep line follows the same clock.
    const sp = (t - SWEEP_START) / SWEEP_DURATION;
    onSweep?.(sp >= 0 && sp <= 1 ? x0 + (x1 - x0) * sp : null);

    // Watchdog: if frames run slow after the intro, draw fewer background dots.
    const dt = now - last;
    last = now;
    if (t > SWEEP_START + 0.5 && frames < 180) {
      frames++;
      if (dt > 24) slowFrames++;
      if (frames === 180 && slowFrames > 60) skip = Math.floor(layout.failCount * 0.6);
    }
    if (running) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 150);
  };
  window.addEventListener("resize", onResize);

  return {
    setPointer(x, y, active) {
      pointer.tx = x;
      pointer.ty = y;
      if (pointer.x < -9000) {
        pointer.x = x;
        pointer.y = y;
      }
      pointer.ts = active ? 1 : 0;
    },
    setScroll(p) {
      scroll = p;
    },
    setRunning(next) {
      if (next === running) return;
      running = next;
      if (running) {
        pausedTotal += performance.now() - pausedAt;
        last = performance.now();
        if (!raf) raf = requestAnimationFrame(frame);
      } else {
        pausedAt = performance.now();
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    destroy() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
