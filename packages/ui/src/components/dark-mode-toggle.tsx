'use client';
import { useEffect, useState } from 'react';
import { Button } from './button';

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  function toggle() {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  return (
    <Button onClick={toggle} variant="secondary" size="icon" aria-label="Toggle dark mode">
      {isDark ? '🌙' : '☀️'}
    </Button>
  );
}
