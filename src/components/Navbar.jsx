import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggle, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <a href="#hero" className="navbar__logo" onClick={(e) => handleClick(e, '#hero')}>
          <span className="navbar__logo-mark">J</span>
          <span className="navbar__logo-text">ESCO</span>
        </a>

        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="navbar__link"
                onClick={(e) => handleClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar__right">
          {/* ── Language toggle ── */}
          <button
            className="navbar__lang-toggle"
            onClick={toggle}
            aria-label="Toggle language"
          >
            <span className={`navbar__lang-option ${lang === 'en' ? 'navbar__lang-option--active' : ''}`}>
              EN
            </span>
            <span className={`navbar__lang-option ${lang === 'zh' ? 'navbar__lang-option--active' : ''}`}>
              中
            </span>
          </button>

          <a
            href="#contact"
            className="navbar__cta"
            onClick={(e) => handleClick(e, '#contact')}
          >
            {t.nav.cta}
          </a>
        </div>
      </div>
    </nav>
  );
}
