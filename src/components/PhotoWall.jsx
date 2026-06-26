import React, { useEffect, useRef, useState, useMemo } from 'react';
import './PhotoWall.css';

/* ── All gallery images (auto-served from /public/gallery) ── */
const ALL_IMAGES = [
  'gallery/0b30efcabfe9f922863860673f176b51.jpg',
  'gallery/33074e4a61778958d4a11cc4b2e131f8.jpg',
  'gallery/3f43e8ca8f53d8c1e98b7dcf527cc8ff.webp',
  'gallery/5b9916f44f0dacef0d0e67463725caa9.jpg',
  'gallery/9dedb4450f1737b3e03faabb2f21f454.jpg',
  'gallery/9f38e8db4f5370adf71de7e26ce1c118.jpg',
  'gallery/a467c74b787d781cb18ff2e53cfb81aa.webp',
  'gallery/ac92916579d0e38f174fd53077b82292.webp',
  'gallery/b58d97bc44de41386fffc90b685cc822.webp',
  'gallery/b94ba0bc68f9f68a5e278979deaff12c.webp',
  'gallery/bd7ea480b489bdbd68150393c3e6e870.webp',
];

const ROWS = 3;
const REFRESH_INTERVAL = 10000; // ms

/** Fisher-Yates shuffle */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Split images into n rows; duplicate 4× for seamless loop */
function buildRows(images, n) {
  const rows = [];
  for (let r = 0; r < n; r++) {
    const rowImgs = shuffle(images);
    rows.push([...rowImgs, ...rowImgs, ...rowImgs, ...rowImgs]);
  }
  return rows;
}

export default function PhotoWall() {
  /* ── Double-buffer: two complete track sets per row ── */
  const initialRows = useMemo(() => {
    const setA = buildRows(ALL_IMAGES, ROWS);
    // Clone so each buffer has independent DOM arrays (same initial content)
    const setB = setA.map(row => [...row]);
    return [setA, setB];
  }, []);

  // Which buffer is currently visible (0 or 1)
  const [activeBuf, setActiveBuf] = useState(0);
  const activeBufRef = useRef(0);

  // rowRefs[rowIdx][bufIdx] = DOM element
  const rowRefs = useRef([]);

  // Hover state
  const [hoveredRow, setHoveredRow] = useState(-1);
  const [hoveredImg, setHoveredImg] = useState(null);

  /* ── Zero-stutter shuffle via double-buffer ── */
  useEffect(() => {
    const shuffleImages = async () => {
      const curBuf = activeBufRef.current;
      const nextBuf = curBuf === 0 ? 1 : 0;
      const newRows = buildRows(ALL_IMAGES, ROWS);

      // Phase 1 — preload & decode all new images
      const preloaders = [];
      rowRefs.current.forEach((bufs, rowIdx) => {
        const hiddenTrack = bufs?.[nextBuf];
        if (!hiddenTrack) return;
        const newRow = newRows[rowIdx];
        const imgs = hiddenTrack.querySelectorAll('img');
        imgs.forEach((img, i) => {
          if (i < newRow.length) {
            const pre = new Image();
            pre.src = newRow[i];
            preloaders.push(
              pre.decode().then(() => ({ img, src: newRow[i] })).catch(() => ({ img, src: newRow[i] }))
            );
          }
        });
      });

      const swaps = await Promise.all(preloaders);

      // Phase 2 — swap src on the HIDDEN buffer only (invisible → no flash)
      swaps.forEach(({ img, src }) => { img.src = src; });

      // Phase 3 — crossfade: show hidden buffer, hide current
      activeBufRef.current = nextBuf;
      setActiveBuf(nextBuf);
    };

    const id = setInterval(shuffleImages, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="photo-wall">
      {initialRows[0].map((_, rowIdx) => {
        const isPaused = hoveredRow === rowIdx;
        const direction = rowIdx % 2 === 0 ? 'left' : 'right';

        return (
          <div key={rowIdx} className="photo-wall__row-slot">
            {[0, 1].map(bufIdx => {
              const row = initialRows[bufIdx][rowIdx];
              const isActive = bufIdx === activeBuf;

              return (
                <div
                  key={bufIdx}
                  ref={el => {
                    if (!rowRefs.current[rowIdx]) rowRefs.current[rowIdx] = [];
                    rowRefs.current[rowIdx][bufIdx] = el;
                  }}
                  className={
                    'photo-wall__track'
                    + ` photo-wall__track--${direction}`
                    + (isActive ? ' photo-wall__track--active' : '')
                    + (isActive && isPaused ? ' photo-wall__track--paused' : '')
                  }
                  onMouseEnter={() => { if (isActive) setHoveredRow(rowIdx); }}
                  onMouseLeave={() => { setHoveredRow(-1); setHoveredImg(null); }}
                >
                  {row.map((src, imgIdx) => {
                    const itemId = `${rowIdx}-${bufIdx}-${imgIdx}`;
                    const isHovered = isActive && hoveredImg === itemId;
                    return (
                      <div
                        key={itemId}
                        className={`photo-wall__item${isHovered ? ' photo-wall__item--hovered' : ''}`}
                        onMouseEnter={() => { if (isActive) setHoveredImg(itemId); }}
                        onMouseLeave={() => setHoveredImg(null)}
                      >
                        <img src={src} alt="" width="300" height="200" draggable={false} loading="lazy" />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
