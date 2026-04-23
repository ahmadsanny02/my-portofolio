'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 bg-surface border border-secondary/10 rounded-xl hover:text-primary transition-all shadow-sm flex items-center justify-center group"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={20} className="group-hover:rotate-45 transition-transform" />
      ) : (
        <Moon size={20} className="group-hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
}
