import React, { Suspense, lazy } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SectionSkeleton from './components/SectionSkeleton';
import './index.css';
import './App.css';

/* ── Lazy-load below-fold sections ── */
const About    = lazy(() => import('./components/About'));
const Bubbles  = lazy(() => import('./components/Bubbles'));
const Projects = lazy(() => import('./components/Projects'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Contact  = lazy(() => import('./components/Contact'));

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <Navbar />
        <main>
          <Hero />
          <Suspense fallback={<SectionSkeleton height="70vh" />}>
            <About />
          </Suspense>
          <Suspense fallback={<SectionSkeleton height="50vh" />}>
            <Bubbles />
          </Suspense>
          <Suspense fallback={<SectionSkeleton height="60vh" />}>
            <Projects />
          </Suspense>
          <Suspense fallback={<SectionSkeleton height="80vh" />}>
            <Portfolio />
          </Suspense>
          <Suspense fallback={<SectionSkeleton height="40vh" />}>
            <Contact />
          </Suspense>
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;
