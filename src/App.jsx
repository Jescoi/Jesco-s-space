import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Bubbles from './components/Bubbles';
import Projects from './components/Projects';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import './index.css';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Bubbles />
          <Projects />
          <Portfolio />
          <Contact />
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;
