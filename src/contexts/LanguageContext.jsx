// src/contexts/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    // Get from localStorage or default to ID
    return localStorage.getItem('language') || 'ID';
  });

  const toggleLanguage = () => {
    const newLang = lang === 'ID' ? 'EN' : 'ID';
    setLang(newLang);
    localStorage.setItem('language', newLang);
  };

  const setLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('language', newLang);
  };

  useEffect(() => {
    // Save to localStorage whenever language changes
    localStorage.setItem('language', lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
