// src/useTheme.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'dark');
  const [persona, setPersona] = useState(() => localStorage.getItem('app-persona') || 'female');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-persona', persona);
    localStorage.setItem('app-persona', persona);
  }, [persona]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const togglePersona = () => {
    setPersona((prev) => (prev === 'female' ? 'male' : 'female'));
  };

  return (
    <ThemeContext.Provider value={{ theme, persona, toggleTheme, togglePersona, setPersona }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);