import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal — adds a CSS class when the element scrolls into view.
 *
 * Usage:
 *   const ref = useScrollReveal({ threshold: 0.15, rootMargin: '0px' });
 *   <section ref={ref} className="reveal">...</section>
 *
 * CSS:
 *   .reveal { opacity: 0; transform: translateY(40px); transition: all 0.7s ease-out; }
 *   .reveal.reveal--visible { opacity: 1; transform: translateY(0); }
 *
 * Options:
 *   threshold   — IntersectionObserver threshold (default 0.1)
 *   rootMargin  — observer rootMargin (default "0px 0px -50px 0px")
 *   once        — only trigger once (default true)
 */
export default function useScrollReveal({
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  once = true,
} = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  // Attach the visible class via the ref callback + data attribute pattern
  // We return a callback ref that sets both the DOM ref and toggles a class
  const callbackRef = (node) => {
    ref.current = node;
    if (node) {
      if (visible) {
        node.classList.add('reveal--visible');
      } else {
        node.classList.remove('reveal--visible');
      }
    }
  };

  return callbackRef;
}
