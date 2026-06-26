import React, { useRef, useState, useEffect } from 'react';

/**
 * LazyImage — renders a placeholder until the image scrolls into view,
 * then loads the actual src with a fade-in transition.
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
        <img
          src={src}
          alt={alt}
          className={`lazy-img ${loaded ? 'lazy-img--loaded' : ''}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)} /* show placeholder on error too */
          {...imgProps}
        />
      )}
    </div>
  );
}
