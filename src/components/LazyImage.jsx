import React, { useRef, useState, useEffect } from 'react';

/**
 * Generate mobile src by inserting _mobile before the file extension.
 * e.g. "images/works/work1_cover.webp" → "images/works/work1_cover_mobile.webp"
 */
function getMobileSrc(src) {
  if (!src) return null;
  const lastDot = src.lastIndexOf('.');
  if (lastDot === -1) return null;
  return src.slice(0, lastDot) + '_mobile.webp';
}

/**
 * LazyImage — renders a placeholder until the image scrolls into view,
 * then loads with a fade-in transition.
 *
 * On mobile (≤768px), a smaller _mobile.webp variant is served via <picture>.
 *
 * Props:
 *   src, alt       — standard <img> attributes
 *   className      — forwarded to the wrapper <div>
 *   rootMargin     — IntersectionObserver rootMargin (default "200px")
 *   threshold      — IntersectionObserver threshold  (default 0.01)
 */
export default function LazyImage({ src, alt = '', className = '', rootMargin = '200px', threshold = 0.01, ...imgProps }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const mobileSrc = getMobileSrc(src);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} className={`lazy-img-wrapper ${className}`}>
      {/* Low-res / placeholder while loading */}
      {!loaded && <div className="lazy-img-placeholder" />}

      {visible && (
        mobileSrc ? (
          <picture>
            <source srcSet={mobileSrc} media="(max-width: 768px)" />
            <img
              src={src}
              alt={alt}
              className={`lazy-img ${loaded ? 'lazy-img--loaded' : ''}`}
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
              {...imgProps}
            />
          </picture>
        ) : (
          <img
            src={src}
            alt={alt}
            className={`lazy-img ${loaded ? 'lazy-img--loaded' : ''}`}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            {...imgProps}
          />
        )
      )}
    </div>
  );
}
