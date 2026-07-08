import React, { useState } from 'react';
import { Search, HelpCircle } from 'lucide-react';

/**
 * Autocomplete-ready interactive Search Bar.
 * Incorporates helper tags for instant query submission.
 */
export const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    onSearch(query.trim());
  };

  const handleQuickSelect = (name) => {
    if (loading) return;
    setQuery(name);
    onSearch(name);
  };

  const popularStocks = [
    { name: 'Apple Inc.', label: 'Apple' },
    { name: 'Tesla Inc.', label: 'Tesla' },
    { name: 'NVIDIA Corporation', label: 'Nvidia' },
    { name: 'Microsoft Corporation', label: 'Microsoft' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        
        {/* Glow effect on hover */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-300"></div>
        
        <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-100/50 dark:shadow-none transition-all duration-300">
          <Search className="absolute left-5 h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors duration-200" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            placeholder="Search company by name (e.g. Nvidia, Tesla)..."
            className="w-full h-14 pl-14 pr-32 bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none text-base"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-3 px-5 py-2 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-all duration-200 shadow-md shadow-slate-900/10 dark:shadow-emerald-500/10"
          >
            Analyze
          </button>
        </div>
      </form>

      {/* Quick Select Buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-2 px-1">
        <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
          <HelpCircle className="h-3.5 w-3.5" />
          Try:
        </span>
        {popularStocks.map((stock) => (
          <button
            key={stock.label}
            type="button"
            onClick={() => handleQuickSelect(stock.name)}
            disabled={loading}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-200"
          >
            {stock.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
