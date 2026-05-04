import { useState, useEffect } from 'react';

export function useDarkMode(): [boolean, (val: boolean) => void] {
  const [dark, setDarkState] = useState<boolean>(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(dark));
  }, [dark]);

  return [dark, setDarkState];
}
