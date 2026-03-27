import { createContext, useContext, useState } from 'react';
import fr from '../i18n/fr.js';
import en from '../i18n/en.js';

const translations = { fr, en };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('fr');

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
