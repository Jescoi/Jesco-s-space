import React from 'react';
import { PROFILE } from '../data/profile';
import { useLanguage } from '../context/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import './About.css';

export default function About() {
  const { t } = useLanguage();
  const { name, stats, skills, socials, avatar } = PROFILE;
  const sectionRef = useScrollReveal({ threshold: 0.1 });

  const bioParagraphs = t.profileBio;
  const statLabels = t.about.stats;
  const skillCatLabels = t.about.skillCategories;

  return (
    <section className="about reveal" id="about" ref={sectionRef}>
      <div className="container">
        <div className="about__inner">

          {/* Left – avatar / visual */}
          <div className="about__visual">
            <div className="about__avatar-frame">
              {avatar ? (
                <img src={avatar} alt={name} className="about__avatar-img" loading="lazy" />
              ) : (
                <div className="about__avatar-placeholder">
                  <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                    <circle cx="36" cy="28" r="16" stroke="#4fc3f7" strokeWidth="1.5" fill="none"/>
                    <path d="M8 68c0-15.464 12.536-28 28-28s28 12.536 28 28" stroke="#4fc3f7" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  </svg>
                  <span>{t.about.photoPlaceholder}</span>
                </div>
              )}
              <div className="about__avatar-ring" />
            </div>

            {/* Mini stat cards */}
            <div className="about__stats">
              {stats.map((s) => (
                <div key={s.label} className="about__stat">
                  <span className="about__stat-num">{s.value}</span>
                  <span className="about__stat-label">{statLabels[s.label] || s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right – bio & skills */}
          <div className="about__content">
            <div className="section-tag">About Me</div>
            <h2 className="section-title">
              Hi, I'm <span>{name}</span><span className="about__cn-name">（黎宇刚）</span>
            </h2>

            <div className="about__bio">
              {bioParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Skills */}
            <div className="about__skills">
              {skills.map((group) => (
                <div key={group.category} className="about__skill-group">
                  <span className="about__skill-category">{skillCatLabels[group.category] || group.category}</span>
                  <div className="about__skill-tags">
                    {group.items.map((item) => (
                      <span key={item} className="about__skill-tag">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="about__links">
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="about__link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                {t.about.github}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
