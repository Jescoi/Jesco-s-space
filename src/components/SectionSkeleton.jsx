/**
 * Loading skeleton — shown while lazy-loaded sections are loading.
 */
import React from 'react';

export default function SectionSkeleton({ height = '60vh' }) {
  return (
    <div className="section-skeleton" style={{ height }}>
      <div className="section-skeleton__shimmer" />
    </div>
  );
}
