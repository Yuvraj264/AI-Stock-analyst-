import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useAnalysis } from '../hooks/useAnalysis.js';
import { Shield, Cpu, BarChart3, ArrowRight } from 'lucide-react';

/**
 * Landing Page component.
 * Houses the main search interface and value propositions panels.
 */
export const Home = () => {
  const navigate = useNavigate();
  const { analyzeStock, loading, error } = useAnalysis();
  const [searchedName, setSearchedName] = useState('');

  const handleSearchSubmit = async (companyName) => {
    setSearchedName(companyName);
    try {
      const data = await analyzeStock(companyName);
      // Navigate to analytical dashboard passing the result payload in location state
      navigate('/dashboard', { state: { analysis: data } });
    } catch (err) {
      console.error('Home page research trigger crashed:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300">
        <LoadingSpinner companyName={searchedName} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Hero Container */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 mb-6">
          <Cpu className="h-3.5 w-3.5" />
          Powered by LangGraph Multi-Agent Systems
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
          AI-Powered{' '}
          <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
            Investment Research
          </span>{' '}
          Agent
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Instantly execute deep quantitative screenings, scan headlines sentiment, and map operational risk dimensions inside a stateful orchestration workflow.
        </p>

        {/* Centralized Search bar */}
        <div className="mt-10">
          <SearchBar onSearch={handleSearchSubmit} loading={loading} />
        </div>

        {error && (
          <div className="mt-6 max-w-md mx-auto p-4 rounded-xl border border-red-200/50 bg-red-50 text-red-600 text-sm font-semibold dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}
      </section>

      {/* Feature Value Props Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white mb-4">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Quantitative Ratios</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Evaluates YoY growth rates, return on equity matrices, free cash flows, and multiples to score financial status.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500 text-white mb-4">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Sentiment Extraction</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Scans news sources, normalizing article headers, and maps positive or negative media catalysts via Gemini.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white mb-4">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Operational Moat & Risk</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Flags competitive pressure thresholds, regulatory constraints, and potential multiples valuation premiums.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
