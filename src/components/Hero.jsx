import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Hero.css';
import PhotoWall from './PhotoWall';

export default function Hero() {
  const sectionRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const items = section.querySelectorAll('.hero__fade-item');
    items.forEach((el, i) => {
      if (el.classList.contains('hero__title')) {
        el.style.animationDelay = '0.15s';
      } else {
        el.style.animationDelay = `${0.6 + i * 0.15}s`;
      }
    });
  }, []);

  const handleScroll = (href) => {
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero" ref={sectionRef}>
      {/* Full-screen video background */}
      <div className="hero__video-wrap">
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero__overlay" />
        <div className="hero__grid" />
      </div>

      {/* Photo wall — between video bg and foreground content */}
      <PhotoWall />

      {/* Top-left: eyebrow + title */}
      <div className="hero__top-right">
        <div className="hero__eyebrow hero__fade-item">
          <span className="hero__eyebrow-dot" />
          <span>{t.hero.eyebrow}</span>
        </div>

        <h2 className="hero__title hero__fade-item">
          WELCOME TO<br />
          <span>JESCO'S</span> SPACE
        </h2>
      </div>

      {/* Bottom-left button */}
      <button
        className="hero__btn hero__btn--primary hero__btn--bl hero__fade-item"
        onClick={() => handleScroll('#projects')}
      >
        <span>{t.hero.btnWork}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Bottom-right button */}
      <button
        className="hero__btn hero__btn--ghost hero__btn--br hero__fade-item"
        onClick={() => handleScroll('#contact')}
      >
        {t.hero.btnContact}
      </button>

      {/* Decorative corners */}
      <div className="hero__corner hero__corner--tl" />
      <div className="hero__corner hero__corner--tr" />
      <div className="hero__corner hero__corner--bl" />
      <div className="hero__corner hero__corner--br" />
    </section>
  );
}
