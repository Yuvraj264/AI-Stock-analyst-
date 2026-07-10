import React, { useState } from 'react';
import { Search, HelpCircle } from 'lucide-react';

/**
 * Autocomplete-ready interactive Search Bar.
 * Configured with Perplexity-style large rounded search inputs and platinum accent buttons.
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
      <form onSubmit={handleSubmit} className="relative group animate-fadeIn">
        
        <div className="relative flex items-center bg-[#1E232D] border border-white/5 focus-within:border-[#F5F5F5]/30 rounded-full overflow-hidden shadow-lg shadow-black/25 transition-all duration-150">
          <Search className="absolute left-5 h-5 w-5 text-[#9AA4B2]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            placeholder="Search company by name or symbol (e.g. Apple, Nvidia)..."
            className="w-full h-13 pl-14 pr-32 bg-transparent text-[#FFFFFF] placeholder-[#9AA4B2]/60 focus:outline-none text-sm font-medium tracking-wide"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 px-5 py-2 rounded-full bg-[#F5F5F5] text-[#0F1115] font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#FFFFFF] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-[#F5F5F5] disabled:scale-100 transition-all duration-150 cursor-pointer shadow-md"
          >
            Analyze
          </button>
        </div>
      </form>

      {/* Quick Select Buttons */}
      <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
        <span className="flex items-center gap-1 text-[10px] text-[#9AA4B2]/85 font-bold uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5 text-[#F5F5F5]" />
          Popular Stocks:
        </span>
        {popularStocks.map((stock) => (
          <button
            key={stock.label}
            type="button"
            onClick={() => handleQuickSelect(stock.name)}
            disabled={loading}
            className="px-3 py-1 rounded-md text-[10px] font-sans font-bold bg-[#1E232D] border border-white/5 text-[#D1D5DB] hover:text-[#FFFFFF] hover:border-[#FFFFFF]/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-sm shadow-black/10"
          >
            {stock.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
