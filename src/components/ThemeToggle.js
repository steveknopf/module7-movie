import { useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

function getSavedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getSavedTheme);

  // Put the theme on <html> so the CSS variables in App.css can switch colors.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage can be blocked (e.g. private browsing); the toggle still works for this visit.
    }
  }, [theme]);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      <i className="fa-solid fa-circle-half-stroke"></i>
    </button>
  );
}

export default ThemeToggle;
