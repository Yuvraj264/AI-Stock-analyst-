import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, History, Columns, Sun, Moon, Sparkles } from 'lucide-react';

/**
 * Premium Navbar Shell.
 * Styled with Slate + Emerald tokens and consistent 6px corner radius buttons.
 */
export const Navbar = () => {
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1F2937] bg-[#111827] text-[#F8FAFC] transition-colors duration-200">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Link */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#10B981] text-[#0F172A] shadow-sm">
            <Activity className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <span className="font-bold text-sm tracking-tight uppercase">
            Equity<span className="text-[#10B981]">Mind</span>
          </span>
        </Link>

        {/* Navigation Tabs (rounded-md buttons) */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
              isActive('/')
                ? 'bg-[#0F172A] text-[#10B981] border border-[#1F2937]'
                : 'text-[#94A3B8] hover:text-[#34D399] hover:bg-[#0F172A]/50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Research
          </Link>
          <Link
            to="/history"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
              isActive('/history')
                ? 'bg-[#0F172A] text-[#10B981] border border-[#1F2937]'
                : 'text-[#94A3B8] hover:text-[#34D399] hover:bg-[#0F172A]/50'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            History
          </Link>
          <Link
            to="/compare"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
              isActive('/compare')
                ? 'bg-[#0F172A] text-[#10B981] border border-[#1F2937]'
                : 'text-[#94A3B8] hover:text-[#34D399] hover:bg-[#0F172A]/50'
            }`}
          >
            <Columns className="h-3.5 w-3.5" />
            Compare
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#1F2937] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F172A] transition-colors duration-150 cursor-pointer"
            aria-label="Toggle mode theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
