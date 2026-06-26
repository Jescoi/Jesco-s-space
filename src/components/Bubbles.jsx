import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import './Bubbles.css';

/* ── Bubble definitions ── */
const BUBBLE_TEXTS = [
  'GAMES', 'PHOTOGRAPHIC', 'ANIMATION', 'MUSIC',
  'AI', '3D Printing', 'Coding',
];

const MAX_SPEED   = 0.6;
const GRAVITY     = 0.05;
const DAMPING     = 0.997;
const RESTITUTION = 0.28;

const HUE_MIN = 205;
const HUE_MAX = 270;

const MOBILE_BREAK = 768;

/* ── spawn ── */
function spawnBubbles(w, h, baseR) {
  const cx = w / 2;
  const cy = h * 0.4;
  const spread = Math.min(w, h) * 0.28;

  return BUBBLE_TEXTS.map((text, i) => {
    const angle = ((i / BUBBLE_TEXTS.length) * Math.PI * 2) + Math.random() * 0.25;
    const dist  = spread * (0.35 + Math.random() * 0.65);
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * MAX_SPEED * 0.8,
      vy: (Math.random() - 0.5) * MAX_SPEED * 0.8,
      r: baseR,
      text,
      hue:       HUE_MIN + Math.random() * (HUE_MAX - HUE_MIN),
      hueSpeed:  0.15 + Math.random() * 0.35,
      hueDir:    Math.random() > 0.5 ? 1 : -1,
      scale: 1,
      hitFlash: 0,
      dragging: false,
    };
  });
}

/* ── elastic collision ── */
function collide(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const minDist = a.r + b.r;
  if (dist >= minDist || dist < 0.001) return;

  const nx = dx / dist;
  const ny = dy / dist;
  const dvx = a.vx - b.vx;
  const dvy = a.vy - b.vy;
  const dvn = dvx * nx + dvy * ny;
  if (dvn <= 0) return;

  a.vx -= dvn * nx;
  a.vy -= dvn * ny;
  b.vx += dvn * nx;
  b.vy += dvn * ny;

  const overlap = (minDist - dist) * 0.5;
  a.x -= overlap * nx;
  a.y -= overlap * ny;
  b.x += overlap * nx;
  b.y += overlap * ny;

  a.hitFlash = Math.min(1, a.hitFlash + 0.2);
  b.hitFlash = Math.min(1, b.hitFlash + 0.2);
}

/* ── clamp ── */
function clampSpeed(b) {
  const s = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
  if (s > MAX_SPEED) {
    b.vx = (b.vx / s) * MAX_SPEED;
    b.vy = (b.vy / s) * MAX_SPEED;
  }
}

/* ── HSL → CSS string ── */
function hslStr(h, s, l, a) {
  return `hsla(${Math.round(h)},${Math.round(s)}%,${Math.round(l)}%,${a.toFixed(3)})`;
}

/* ── draw one bubble ── */
function drawBubble(ctx, b) {
  const r     = b.r * b.scale;
  const x     = b.x;
  const y     = b.y;
  const hue   = b.hue;
  const flash = b.hitFlash;

  const borderA = 0.22 + flash * 0.22;
  const glowA   = 0.12 + flash * 0.14;
  const fillA   = 0.08 + flash * 0.10;
  const textA   = 0.80 + flash * 0.14;

  ctx.save();

  /* -- outer glow -- */
  const glowR = r * 1.35;
  const glowGrad = ctx.createRadialGradient(x, y, r * 0.5, x, y, glowR);
  glowGrad.addColorStop(0, hslStr(hue, 60, 65, glowA));
  glowGrad.addColorStop(1, hslStr(hue, 60, 65, 0));
  ctx.beginPath();
  ctx.arc(x, y, glowR, 0, Math.PI * 2);
  ctx.fillStyle = glowGrad;
  ctx.fill();

  /* -- main fill -- */
  const fillGrad = ctx.createRadialGradient(x - r * 0.28, y - r * 0.28, r * 0.05, x, y, r);
  fillGrad.addColorStop(0, hslStr(hue, 50, 75, fillA * 0.9));
  fillGrad.addColorStop(0.5, hslStr(hue, 45, 55, fillA));
  fillGrad.addColorStop(1, hslStr(230, 20, 15, 0.22));
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fillGrad;
  ctx.fill();

  /* -- border -- */
  ctx.strokeStyle = hslStr(hue, 50, 65, borderA);
  ctx.lineWidth = 1.1;
  ctx.stroke();

  /* -- inner rim -- */
  ctx.beginPath();
  ctx.arc(x, y, r - 3, 0, Math.PI * 2);
  ctx.strokeStyle = hslStr(hue, 40, 80, borderA * 0.45);
  ctx.lineWidth = 0.6;
  ctx.stroke();

  /* -- glassy highlight arc -- */
  ctx.beginPath();
  ctx.arc(x - r * 0.22, y - r * 0.22, r * 0.22, -Math.PI * 0.7, Math.PI * 0.3);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  /* -- text -- */
  ctx.fillStyle = `rgba(255,255,255,${textA.toFixed(3)})`;
  const fontSize = b.text.length > 8
    ? Math.floor(r * 0.16)
    : Math.floor(r * 0.18);
  ctx.font = `bold ${fontSize}px "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(b.text, x, y);

  ctx.restore();
}

/* ═══════════════════════════════════════════
   React component
   ═══════════════════════════════════════════ */
export default function Bubbles() {
  const canvasRef  = useRef(null);
  const bubblesRef = useRef([]);
  const rafRef     = useRef(null);
  const mouseRef   = useRef({ x: -9999, y: -9999 });
  const dragRef    = useRef({ target: null, px: 0, py: 0, vx: 0, vy: 0 });
  const dimRef     = useRef({ w: 800, h: 480 });
  const { t }      = useLanguage();
  const sectionRef  = useScrollReveal({ threshold: 0.1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = 0, h = 0;

    /* ── resize ── */
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = rect.width;
      const isMobile = w < MOBILE_BREAK;
      h = isMobile
        ? Math.max(360, Math.round(rect.width * 0.72))
        : Math.max(540, Math.round(rect.width * 0.48));
      const baseR = isMobile ? 58 : 100;
      dimRef.current = { w, h };
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (bubblesRef.current.length === 0) {
        bubblesRef.current = spawnBubbles(w, h, baseR);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    /* ── mouse helpers ── */
    const getPos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const hitBubble = (mx, my) => {
      const bs = bubblesRef.current;
      for (let i = bs.length - 1; i >= 0; i--) {
        const dx = mx - bs[i].x;
        const dy = my - bs[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < bs[i].r) return i;
      }
      return -1;
    };

    /* ── mouse events ── */
    const onDown = (e) => {
      const pos = getPos(e);
      mouseRef.current = pos;
      const idx = hitBubble(pos.x, pos.y);
      if (idx >= 0) {
        const b = bubblesRef.current[idx];
        b.dragging = true;
        dragRef.current = { target: b, px: pos.x, py: pos.y, vx: 0, vy: 0 };
        canvas.style.cursor = 'grabbing';
        bubblesRef.current.splice(idx, 1);
        bubblesRef.current.push(b);
      }
    };

    const onMove = (e) => {
      const pos = getPos(e);
      mouseRef.current = pos;
      const d = dragRef.current;
      if (d.target && d.target.dragging) {
        d.vx = pos.x - d.px;
        d.vy = pos.y - d.py;
        d.target.x = pos.x;
        d.target.y = pos.y;
        d.target.vx = d.vx;
        d.target.vy = d.vy;
        d.px = pos.x;
        d.py = pos.y;
      } else {
        const idx = hitBubble(pos.x, pos.y);
        canvas.style.cursor = idx >= 0 ? 'grab' : 'default';
      }
    };

    const onUp = () => {
      const d = dragRef.current;
      if (d.target) {
        d.target.dragging = false;
        d.target.vx = d.vx * 0.9;
        d.target.vy = d.vy * 0.9;
        d.target.scale = 1.15;
        d.target.hitFlash = 0.6;
        dragRef.current = { target: null, px: 0, py: 0, vx: 0, vy: 0 };
        canvas.style.cursor = 'default';
      }
    };

    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    /* ── touch events (mobile) ── */
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        onDown({ clientX: touch.clientX, clientY: touch.clientY });
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        onMove({ clientX: touch.clientX, clientY: touch.clientY });
      }
    };

    const onTouchEnd = (e) => {
      e.preventDefault();
      onUp();
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });

    /* ── animation loop ── */
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      const bs = bubblesRef.current;

      for (const b of bs) {
        if (b.dragging) {
          b.hitFlash *= 0.92;
          b.scale += (1 - b.scale) * 0.06;
          b.hue += b.hueSpeed * b.hueDir;
          if (b.hue >= HUE_MAX) { b.hue = HUE_MAX; b.hueDir = -1; }
          if (b.hue <= HUE_MIN) { b.hue = HUE_MIN; b.hueDir = 1; }
          continue;
        }

        b.vy += GRAVITY;
        b.hue += b.hueSpeed * b.hueDir;
        if (b.hue >= HUE_MAX) { b.hue = HUE_MAX; b.hueDir = -1; }
        if (b.hue <= HUE_MIN) { b.hue = HUE_MIN; b.hueDir = 1; }

        clampSpeed(b);
        b.vx *= DAMPING;
        b.vy *= DAMPING;

        if (b.x - b.r < 0)  { b.x = b.r;      b.vx = Math.abs(b.vx) * RESTITUTION; }
        if (b.x + b.r > w)  { b.x = w - b.r;   b.vx = -Math.abs(b.vx) * RESTITUTION; }
        if (b.y - b.r < 0)  { b.y = b.r;      b.vy = Math.abs(b.vy) * RESTITUTION; }
        if (b.y + b.r > h)  { b.y = h - b.r;   b.vy = -Math.abs(b.vy) * RESTITUTION; }

        b.x += b.vx;
        b.y += b.vy;
        b.scale    += (1 - b.scale) * 0.06;
        b.hitFlash *= 0.9;
      }

      for (let i = 0; i < bs.length; i++) {
        for (let j = i + 1; j < bs.length; j++) {
          collide(bs[i], bs[j]);
        }
      }

      for (const b of bs) {
        drawBubble(ctx, b);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="bubbles-section reveal" id="bubbles" ref={sectionRef}>
      <div className="bubbles__header">
        <h2 className="section-title">
          My <span>Bubbles</span>
        </h2>
        <p className="bubbles__subtitle">{t.bubbles.subtitle}</p>
      </div>
      <div className="bubbles__canvas-wrap">
        <canvas ref={canvasRef} />
      </div>
    </section>
  );
}
