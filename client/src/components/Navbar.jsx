import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, History, Columns, Sun, Moon, Sparkles } from 'lucide-react';

/**
 * Premium Top Navigation Bar.
 * Structured with Inter typography, thin active platinum indicators, and no glowing borders.
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
    <header className="sticky top-0 z-50 w-full border-b border-[#2D2D2D] bg-[#1A1A1A] text-[#FFFFFF] transition-colors duration-150">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Link */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#C0C0C0] text-[#111111] shadow-sm shadow-[#C0C0C0]/5">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <span className="font-bold text-sm tracking-tight font-sans">
            Equity<span className="text-[#C0C0C0]">Mind</span>
          </span>
        </Link>

        {/* Minimal Underlined Navigation Tabs */}
        <nav className="hidden md:flex items-center h-full gap-1">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-4 h-14 border-b-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
              isActive('/')
                ? 'border-[#C0C0C0] text-[#FFFFFF] bg-[#222222]/30'
                : 'border-transparent text-[#B5B5B5] hover:text-[#FFFFFF]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#C0C0C0]" />
            Research
          </Link>
          <Link
            to="/history"
            className={`flex items-center gap-1.5 px-4 h-14 border-b-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
              isActive('/history')
                ? 'border-[#C0C0C0] text-[#FFFFFF] bg-[#222222]/30'
                : 'border-transparent text-[#B5B5B5] hover:text-[#FFFFFF]'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            History
          </Link>
          <Link
            to="/compare"
            className={`flex items-center gap-1.5 px-4 h-14 border-b-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
              isActive('/compare')
                ? 'border-[#C0C0C0] text-[#FFFFFF] bg-[#222222]/30'
                : 'border-transparent text-[#B5B5B5] hover:text-[#FFFFFF]'
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
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#2D2D2D] text-[#B5B5B5] hover:text-[#FFFFFF] hover:bg-[#222222] transition-all duration-150 cursor-pointer"
            aria-label="Toggle Mode"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
