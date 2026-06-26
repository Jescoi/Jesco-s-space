import React, { useState } from 'react';
import { FEATURED } from '../data/works';
import { useLanguage } from '../context/LanguageContext';
import './Projects.css';

export default function Projects() {
  const [hovered, setHovered] = useState(null);
  const { t } = useLanguage();

  const handleViewProject = (workId) => {
    // Set hash so Portfolio can pick it up
    window.location.hash = `work-${workId}`;
    // Auto-open the portfolio grid item and scroll to showcase after a tick
    setTimeout(() => {
      const el = document.getElementById(`work-${workId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="projects__header">
          <div className="section-tag">Selected Projects</div>
          <h2 className="section-title">
            Work I'm <span>proud of</span>
          </h2>
          <p className="projects__desc">
            {t.projects.desc}
          </p>
        </div>

        <div className="projects__grid">
          {FEATURED.map((project) => (
            <article
              key={project.id}
              className={`project-card ${hovered === project.id ? 'project-card--hovered' : ''}`}
              onMouseEnter={() => setHovered(project.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ '--card-accent': project.color }}
            >
              {/* Image area */}
              <div className="project-card__image">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="project-card__img" />
                ) : (
                  <div className="project-card__image-placeholder">
                    <div className="project-card__image-icon">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <rect x="4" y="8" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        <circle cx="13" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        <path d="M4 26l8-6 6 5 6-4 12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>{t.projects.imageComing}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="project-card__content">
                <div className="project-card__tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-card__tag">{tag}</span>
                  ))}
                </div>
                <h3 className="project-card__title">{t.works[project.id]?.title || project.title}</h3>
                <p className="project-card__subtitle">{t.works[project.id]?.subtitle || project.subtitle}</p>
                <p className="project-card__desc">{t.works[project.id]?.description || project.description}</p>

                <div className="project-card__footer">
                  <button
                    className="project-card__view"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProject(project.id);
                    }}
                  >
                    {t.projects.view}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Glow accent line */}
              <div className="project-card__accent-line" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
