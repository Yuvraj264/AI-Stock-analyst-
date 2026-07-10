import React, { useState } from 'react';
import { Search, HelpCircle } from 'lucide-react';

/**
 * Autocomplete-ready interactive Search Bar.
 * Configured with Slate + Emerald style presets: 4px inputs, 6px buttons.
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
    { name: 'Apple Inc.', label: 'AAPL' },
    { name: 'Tesla Inc.', label: 'TSLA' },
    { name: 'NVIDIA Corporation', label: 'NVDA' },
    { name: 'Microsoft Corporation', label: 'MSFT' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        
        {/* Soft shadow background element */}
        <div className="absolute -inset-0.5 rounded-lg bg-[#10B981] opacity-5 group-hover:opacity-10 transition-opacity duration-200" />
        
        <div className="relative flex items-center bg-[#111827] border border-[#1F2937] focus-within:border-[#10B981] rounded-md overflow-hidden shadow-sm transition-all duration-150">
          <Search className="absolute left-4 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            placeholder="Search company by name (e.g. Nvidia, Tesla)..."
            className="w-full h-11 pl-11 pr-28 bg-transparent text-[#F8FAFC] placeholder-[#64748B] focus:outline-none text-xs font-semibold uppercase tracking-wider"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 px-4 py-1.5 rounded-md bg-[#10B981] text-[#0F172A] font-sans font-bold text-[10px] uppercase tracking-wider hover:bg-[#34D399] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-[#10B981] disabled:scale-100 transition-all duration-150 cursor-pointer shadow-sm shadow-emerald-950/20"
          >
            Analyze
          </button>
        </div>
      </form>

      {/* Quick Select Buttons */}
      <div className="mt-3 flex flex-wrap items-center gap-2 px-0.5">
        <span className="flex items-center gap-1 text-[10px] text-[#64748B] font-semibold uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5" />
          Try:
        </span>
        {popularStocks.map((stock) => (
          <button
            key={stock.label}
            type="button"
            onClick={() => handleQuickSelect(stock.name)}
            disabled={loading}
            className="px-2.5 py-1 rounded-md text-[10px] font-sans font-bold bg-[#111827] border border-[#1F2937] text-[#94A3B8] hover:text-[#10B981] hover:border-[#10B981] hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-sm"
          >
            {stock.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
