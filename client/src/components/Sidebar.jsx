import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Brain, 
  Search, 
  BarChart3, 
  History, 
  Columns, 
  Bookmark, 
  Settings, 
  Menu, 
  X,
  Lock
} from 'lucide-react';

/**
 * Premium Sidebar Navigation.
 * Tailored for a luxury hedge-fund terminal aesthetic.
 */
export const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: 'Research', path: '/', icon: Search, enabled: true },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3, enabled: true },
    { name: 'History', path: '/history', icon: History, enabled: true },
    { name: 'Compare', path: '/compare', icon: Columns, enabled: true },
    { name: 'Watchlist', path: '/watchlist', icon: Bookmark, enabled: true },
    { name: 'Settings', path: '/settings', icon: Settings, enabled: true }
  ];

  return (
    <>
      {/* Mobile Top Header bar */}
      <div className="flex h-14 w-full items-center justify-between px-4 bg-[#171A21] border-b border-white/5 md:hidden shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-[#F5F5F5] text-[#0F1115]">
            <Brain className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm font-sans tracking-tight">Equity<span className="text-[#9AA4B2]">Mind</span></span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-md border border-white/5 text-[#D1D5DB] hover:text-[#FFFFFF] hover:bg-[#1E232D]"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Overlay background */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-[#0F1115]/85 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#171A21] border-r border-white/5 flex flex-col justify-between transition-transform duration-200 ease-out shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-0 max-md:-translate-x-full'}
          md:translate-x-0`}
      >
        <div className="flex flex-col flex-1">
          {/* Logo container */}
          <div className="h-16 flex items-center px-6 border-b border-white/5">
            <Link to="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F5F5F5] text-[#0F1115] shadow-sm">
                <Brain className="h-4.5 w-4.5" />
              </div>
              <span className="font-bold text-base font-sans tracking-tight">
                Equity<span className="text-[#9AA4B2]">Mind</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path) && item.enabled;

              if (!item.enabled) {
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold text-[#9AA4B2]/40 cursor-not-allowed select-none"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                    <Lock className="h-3 w-3" />
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 relative group
                    ${active 
                      ? 'bg-[#1E232D] text-[#FFFFFF] border-l-2 border-[#F5F5F5]' 
                      : 'text-[#D1D5DB] hover:text-[#FFFFFF] hover:bg-[#1E232D]/40'}`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-[#FFFFFF]' : 'text-[#9AA4B2] group-hover:text-[#FFFFFF]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info tag */}
        <div className="p-4 border-t border-white/5 text-[9px] font-sans font-medium text-[#9AA4B2] uppercase tracking-widest text-center">
          Institutional Platform v1.1
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
