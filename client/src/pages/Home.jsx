import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { performAnalysis } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import { Shield, Cpu, BarChart3, Terminal } from 'lucide-react';

/**
 * Premium Home Console.
 * Redesigned with the Slate + Emerald design tokens, 8px cards, and typography scales.
 */
export const Home = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [searchedName, setSearchedName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const handleSearchSubmit = async (companyName) => {
    setSearchedName(companyName);
    setIsSearching(true);
    setSearchResult(null);
    setSearchError(null);
    
    addToast(`Initializing multi-agent graph node workflow for "${companyName}"...`, 'info');
    
    try {
      const response = await performAnalysis(companyName);
      if (response && response.success) {
        setSearchResult(response.data);
      } else {
        throw new Error(response.message || 'Workflow execution rejected by host.');
      }
    } catch (err) {
      console.error('Research node failed:', err);
      const errMsg = err.response?.data?.message || err.message || 'Operational execution failed.';
      setSearchError(errMsg);
      setIsSearching(false);
      addToast(errMsg, 'error');
    }
  };

  const handleLoaderFinished = () => {
    if (searchResult) {
      addToast(`Telemetry analysis compiled for ${searchResult.companyName}!`, 'success');
      setIsSearching(false);
      navigate('/dashboard', { state: { analysis: searchResult } });
    }
  };

  if (isSearching) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-[#0F172A] px-4 transition-colors duration-200">
        <LoadingSpinner 
          companyName={searchedName} 
          isApiFinished={!!searchResult}
          onFinished={handleLoaderFinished}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#0F172A] text-[#F8FAFC] pb-16 transition-colors duration-200 font-sans">
      
      {/* Ticker tape telemetry feed */}
      <div className="w-full bg-[#111827] border-b border-[#1F2937] py-2.5 px-4 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between text-[10px] font-mono tracking-wider text-[#94A3B8]">
          <div className="flex gap-4 overflow-x-auto whitespace-nowrap scrollbar-none">
            <span className="text-[#10B981] font-bold">SYSTEM_ONLINE</span>
            <span>SEC FILINGS: RESPONDING</span>
            <span>LLM NODES: READY</span>
            <span>DATABASES: ACTIVE</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[#10B981]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            LIVE CONNECT
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center animate-fadeInUp">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111827] border border-[#1F2937] font-mono text-[10px] tracking-wider text-[#10B981] uppercase mb-8 rounded-md shadow-sm">
          <Terminal className="h-3.5 w-3.5" />
          Multi-Agent Consensus Platform
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight uppercase max-w-4xl mx-auto tracking-[-0.02em]">
          AI-Powered{' '}
          <span className="text-[#10B981]">
            Investment Research
          </span>{' '}
          Terminal
        </h1>

        <p className="mt-4 text-xs sm:text-sm text-[#94A3B8] max-w-2xl mx-auto font-sans leading-relaxed tracking-wide">
          Instantly run structured quantitative screenings, scan public sentiment drivers, and map operational risk indices inside a stateful graph orchestration.
        </p>

        {/* Central Search bar block */}
        <div className="mt-12">
          <SearchBar onSearch={handleSearchSubmit} loading={isSearching} />
        </div>

        {searchError && (
          <div className="mt-8 max-w-md mx-auto p-3.5 bg-[#111827] border border-[#EF4444]/30 text-[#EF4444] font-mono text-xs rounded-md text-center uppercase tracking-wide shadow-sm">
            ERROR // {searchError}
          </div>
        )}
      </section>

      {/* Reusable Modules Grid (Slate + Emerald cards: rounded-lg) */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-[#1F2937] animate-fadeInUp">
        <h4 className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase mb-6">
          System Module Interfaces
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-5 bg-[#111827] border border-[#1F2937] rounded-lg shadow-sm hover:scale-[1.01] transition-transform duration-150 flex flex-col justify-between h-44">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#10B981] uppercase mb-3">
                <div className="p-1 rounded-md bg-[#10B981]/10">
                  <BarChart3 className="h-4 w-4 text-[#10B981]" />
                </div>
                Quantitative
              </div>
              <p className="text-xs leading-relaxed text-[#94A3B8]">
                Audit revenue margins, ROE coefficients, liquidity multipliers, and PE valuations to score overall balance sheet safety.
              </p>
            </div>
            <span className="text-[9px] font-mono text-[#64748B]">CORE_FINANCIAL_NODE</span>
          </div>

          {/* Card 2 */}
          <div className="p-5 bg-[#111827] border border-[#1F2937] rounded-lg shadow-sm hover:scale-[1.01] transition-transform duration-150 flex flex-col justify-between h-44">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#10B981] uppercase mb-3">
                <div className="p-1 rounded-md bg-[#10B981]/10">
                  <Cpu className="h-4 w-4 text-[#10B981]" />
                </div>
                Sentiment
              </div>
              <p className="text-xs leading-relaxed text-[#94A3B8]">
                Scan corporate press headlines, index sentiment vectors, and identify near-term catalyst risks using LLM summarizers.
              </p>
            </div>
            <span className="text-[9px] font-mono text-[#64748B]">MEDIA_SENTIMENT_NODE</span>
          </div>

          {/* Card 3 */}
          <div className="p-5 bg-[#111827] border border-[#1F2937] rounded-lg shadow-sm hover:scale-[1.01] transition-transform duration-150 flex flex-col justify-between h-44">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#10B981] uppercase mb-3">
                <div className="p-1 rounded-md bg-[#10B981]/10">
                  <Shield className="h-4 w-4 text-[#10B981]" />
                </div>
                Risk Audit
              </div>
              <p className="text-xs leading-relaxed text-[#94A3B8]">
                Map sector regulatory bottlenecks, competitive moats, supply-line exposures, and multiples premiums.
              </p>
            </div>
            <span className="text-[9px] font-mono text-[#64748B]">RISK_SAFETY_NODE</span>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
