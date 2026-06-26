import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Contact.css';

export default function Contact() {
  const [copiedTarget, setCopiedTarget] = useState(null);
  const { t } = useLanguage();

  const handleCopy = (text, target) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTarget(target);
      setTimeout(() => setCopiedTarget(null), 2000);
    });
  };

  return (
    <section className="contact" id="contact">
      {/* Background grid */}
      <div className="contact__bg-grid" />
      <div className="contact__bg-glow" />

      <div className="contact__inner container">
        {/* Top line */}
        <div className="contact__eyebrow">
          <span className="section-tag">Contact</span>
        </div>

        {/* Headline */}
        <h2 className="contact__title">
          Let's build<br />
          something <span>together</span>
        </h2>

        <p className="contact__sub">
          {t.contact.sub}
        </p>

        {/* Contact cards */}
        <div className="contact__cards">
          <div
            className="contact__card contact__card--link"
            onClick={() => handleCopy('lygggl@qq.com', 'email')}
          >
            <div className="contact__card-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M2 5a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm0 0l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="contact__card-body">
              <span className="contact__card-label">{t.contact.emailLabel}</span>
              <span className="contact__card-value">lygggl@qq.com</span>
            </div>
            <span className="contact__card-copy">
              {copiedTarget === 'email' ? t.contact.copied : t.contact.copy}
            </span>
          </div>

          <div className="contact__card">
            <div className="contact__card-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 1C6.025 1 2 5.025 2 10c0 7.72 9 11 9 11s9-3.28 9-11c0-4.975-4.025-9-9-9z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <circle cx="11" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <div className="contact__card-body">
              <span className="contact__card-label">{t.contact.universityLabel}</span>
              <span className="contact__card-value">{t.contact.universityValue}</span>
            </div>
          </div>

          <div
            className="contact__card contact__card--link"
            onClick={() => window.open('https://github.com/Jescoi', '_blank')}
          >
            <div className="contact__card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <div className="contact__card-body">
              <span className="contact__card-label">{t.contact.githubLabel}</span>
              <span className="contact__card-value">{t.contact.githubValue}</span>
            </div>
            <svg className="contact__card-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div
            className="contact__card contact__card--link"
            onClick={() => handleCopy('13650320608', 'phone')}
          >
            <div className="contact__card-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="5" y="1" width="12" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <circle cx="11" cy="17" r="1" fill="currentColor"/>
              </svg>
            </div>
            <div className="contact__card-body">
              <span className="contact__card-label">{t.contact.phoneLabel}</span>
              <span className="contact__card-value">{t.contact.phoneValue}</span>
            </div>
            <span className="contact__card-copy">
              {copiedTarget === 'phone' ? t.contact.copied : t.contact.copy}
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="contact__footer">
          <span className="contact__footer-copy">
            {t.contact.footerCopyright}
          </span>
          <span className="contact__footer-made">
            {t.contact.footerMade}
          </span>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="contact__corner contact__corner--tl" />
      <div className="contact__corner contact__corner--tr" />
    </section>
  );
}
