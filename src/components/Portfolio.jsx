import React, { useState, useEffect } from 'react';
import { WORKS, ALL, CATEGORIES } from '../data/works';
import { useLanguage } from '../context/LanguageContext';
import './Portfolio.css';

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const { t } = useLanguage();

  // Listen for hash changes (from Projects "View Project" clicks)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#work-')) {
        const id = parseInt(hash.replace('#work-', ''), 10);
        setExpandedId(id);
        setActiveCategory('All');
        // Scroll to the showcase item after render
        setTimeout(() => {
          document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    };
    // Handle initial load
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const filtered =
    activeCategory === 'All'
      ? WORKS
      : WORKS.filter((i) => i.category === activeCategory);

  return (
    <section className="portfolio" id="portfolio">
      <div className="container">
        {/* Header */}
        <div className="portfolio__header">
          <div className="section-tag">Portfolio</div>
          <h2 className="section-title">
            All <span>Creations</span>
          </h2>
        </div>

        {/* Filter */}
        <div className="portfolio__filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`portfolio__filter ${activeCategory === cat ? 'portfolio__filter--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="portfolio__grid">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`portfolio-item ${expandedId === item.id ? 'portfolio-item--expanded' : ''}`}
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              {/* Cover image */}
              <div className="portfolio-item__thumb">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="portfolio-item__thumb-img" />
                ) : (
                  <div className="portfolio-item__thumb-inner">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <rect x="3" y="6" width="26" height="20" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                      <circle cx="10" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                      <path d="M3 21l7-5 5 4 5-3 9 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <span className="portfolio-item__category">{item.category}</span>
              </div>

              {/* Info */}
              <div className="portfolio-item__info">
                <div className="portfolio-item__top">
                  <h3 className="portfolio-item__title">{t.works[item.id]?.title || item.title}</h3>
                  <span className="portfolio-item__toggle">
                    {expandedId === item.id ? '−' : '+'}
                  </span>
                </div>
                <p className="portfolio-item__subtitle">{t.works[item.id]?.subtitle || item.subtitle}</p>

                {/* Expanded detail */}
                {expandedId === item.id && (
                  <div className="portfolio-item__detail">
                    <p className="portfolio-item__desc">{t.works[item.id]?.description || item.description}</p>
                    <div className="portfolio-item__tags">
                      {item.tags.map((tag) => (
                        <span key={tag} className="portfolio-item__tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Expanded individual showcase section */}
        <div className="portfolio__showcase">
          <div className="showcase__divider">
            <span>{t.portfolio.showcaseDivider}</span>
          </div>
          {ALL.map((item, index) => (
            <div key={item.id} className="showcase-item" id={`work-${item.id}`}>
              <div className="showcase-item__number">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="showcase-item__image">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="showcase-item__img" />
                ) : (
                  <div className="showcase-item__image-placeholder">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <rect x="4" y="8" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <circle cx="13" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <path d="M4 26l8-6 6 5 6-4 12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{t.portfolio.dropImage}</span>
                  </div>
                )}
              </div>
              <div className="showcase-item__content">
                <div className="showcase-item__meta">
                  <span className="showcase-item__cat">{item.category}</span>
                </div>
                <h3 className="showcase-item__title">{t.works[item.id]?.title || item.title}</h3>
                <p className="showcase-item__subtitle">{t.works[item.id]?.subtitle || item.subtitle}</p>
                <p className="showcase-item__desc">{t.works[item.id]?.description || item.description}</p>
                <div className="showcase-item__tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="showcase-item__tag">{tag}</span>
                  ))}
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="showcase-item__link"
                  >
                    {t.portfolio.visitProject}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3.5 1.5h7v7M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
              </div>

              {/* Photo slots — from item.photos */}
              {item.photos && item.photos.length > 0 && (
                <div className="showcase-item__photos">
                  {item.photos.slice(0, 3).map((src, i) => (
                    <div key={i} className="showcase-item__photo-slot showcase-item__photo-slot--filled">
                      <img src={src} alt={`${item.title} ${i + 1}`} className="showcase-item__photo-img" />
                    </div>
                  ))}
                </div>
              )}

              {/* Extra photo slots for Work #2 — next 3 photos */}
              {item.id === 2 && item.photos && item.photos.length > 3 && (
                <div className="showcase-item__photos">
                  {item.photos.slice(3, 6).map((src, i) => (
                    <div key={`extra-${i}`} className="showcase-item__photo-slot showcase-item__photo-slot--filled">
                      <img src={src} alt={`${item.title} extra ${i + 1}`} className="showcase-item__photo-img" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
