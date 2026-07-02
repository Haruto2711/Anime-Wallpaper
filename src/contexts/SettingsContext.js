import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [sakuraEnabled, setSakuraEnabled] = useState(() => {
    const saved = localStorage.getItem('setting_sakura');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [accentColor, setAccentColor] = useState(() => {
    const saved = localStorage.getItem('setting_accent');
    return saved !== null ? saved : 'pink'; // 'pink', 'purple', 'blue'
  });

  const [sharpenEnabled, setSharpenEnabled] = useState(() => {
    const saved = localStorage.getItem('setting_sharpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('setting_sakura', JSON.stringify(sakuraEnabled));
  }, [sakuraEnabled]);

  useEffect(() => {
    localStorage.setItem('setting_accent', accentColor);
    
    // Apply CSS variables dynamically to document root
    const root = document.documentElement;
    if (accentColor === 'pink') {
      root.style.setProperty('--sakura-primary', '#ff85a2');
      root.style.setProperty('--sakura-primary-hover', '#ffb3c6');
      root.style.setProperty('--sakura-bg-dark', '#160a12');
      root.style.setProperty('--sakura-glass', 'rgba(255, 183, 197, 0.05)');
      root.style.setProperty('--sakura-glass-border', 'rgba(255, 183, 197, 0.2)');
      root.style.setProperty('--petal-color', '#ffb7c5');
      root.style.setProperty('--petal-glow', 'rgba(255, 183, 197, 0.5)');
    } else if (accentColor === 'purple') {
      root.style.setProperty('--sakura-primary', '#b5179e');
      root.style.setProperty('--sakura-primary-hover', '#c77dff');
      root.style.setProperty('--sakura-bg-dark', '#0c0517');
      root.style.setProperty('--sakura-glass', 'rgba(181, 23, 158, 0.05)');
      root.style.setProperty('--sakura-glass-border', 'rgba(181, 23, 158, 0.2)');
      root.style.setProperty('--petal-color', '#c77dff');
      root.style.setProperty('--petal-glow', 'rgba(199, 125, 255, 0.5)');
    } else if (accentColor === 'blue') {
      root.style.setProperty('--sakura-primary', '#00b4d8');
      root.style.setProperty('--sakura-primary-hover', '#90e0ef');
      root.style.setProperty('--sakura-bg-dark', '#020b18');
      root.style.setProperty('--sakura-glass', 'rgba(0, 180, 216, 0.05)');
      root.style.setProperty('--sakura-glass-border', 'rgba(0, 180, 216, 0.2)');
      root.style.setProperty('--petal-color', '#90e0ef');
      root.style.setProperty('--petal-glow', 'rgba(144, 224, 239, 0.5)');
    }
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem('setting_sharpen', JSON.stringify(sharpenEnabled));
    
    // Enable or disable sharpen SVG filter globally
    const root = document.documentElement;
    if (sharpenEnabled) {
      root.style.setProperty('--sharpen-filter', 'url(#sharpen-filter)');
      root.style.setProperty('--sharpen-filter-heavy', 'url(#sharpen-filter-heavy)');
    } else {
      root.style.setProperty('--sharpen-filter', 'none');
      root.style.setProperty('--sharpen-filter-heavy', 'none');
    }
  }, [sharpenEnabled]);

  return (
    <SettingsContext.Provider value={{
      sakuraEnabled, setSakuraEnabled,
      accentColor, setAccentColor,
      sharpenEnabled, setSharpenEnabled
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
