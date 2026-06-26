import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18N } from '../data/i18n';

const LS_KEY = 'jesco-site-lang';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved === 'zh' ? 'zh' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, lang); } catch {}
  }, [lang]);

  const toggle = () => setLang(prev => (prev === 'en' ? 'zh' : 'en'));

  const t = I18N[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
