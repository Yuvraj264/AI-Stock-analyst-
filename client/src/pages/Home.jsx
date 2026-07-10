import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { performAnalysis } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import { 
  Shield, 
  Cpu, 
  BarChart3, 
  Database, 
  Cpu as Brain, 
  FileCheck, 
  ArrowRight 
} from 'lucide-react';

/**
 * Premium Home Console.
 * Redesigned with a dual-column hero layout, workflow illustrations, and pipeline visuals.
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
      addToast(`Analysis compiled for ${searchResult.companyName}!`, 'success');
      setIsSearching(false);
      navigate('/dashboard', { state: { analysis: searchResult } });
    }
  };

  if (isSearching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F1115] px-4 transition-colors duration-200 font-sans">
        <LoadingSpinner 
          companyName={searchedName} 
          isApiFinished={!!searchResult}
          onFinished={handleLoaderFinished}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#FFFFFF] pb-24 transition-colors duration-200 font-sans antialiased">
      
      {/* Hero Header Section */}
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Search & Text */}
          <div className="lg:col-span-7 text-left space-y-6 animate-fadeInUp">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#171A21] border border-white/5 font-sans text-[10px] tracking-wider text-[#F5F5F5] uppercase rounded-md shadow-sm">
              <Brain className="h-3.5 w-3.5" />
              Institutional Multi-Agent Consensus
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight tracking-[-0.02em] text-[#FFFFFF]">
              AI Investment{' '}
              <span className="text-[#B5B5B5] block sm:inline">
                Research Platform
              </span>
            </h1>

            <p className="text-sm text-[#9AA4B2] font-sans leading-relaxed tracking-wide max-w-xl">
              Institutional-grade research powered by AI agents, financial analysis, sentiment intelligence, and risk assessment.
            </p>

            <div className="pt-4">
              <SearchBar onSearch={handleSearchSubmit} loading={isSearching} />
            </div>

            {searchError && (
              <div className="max-w-md p-3.5 bg-[#171A21] border border-[#EF4444]/30 text-[#EF4444] font-sans text-xs rounded-lg uppercase tracking-wide shadow-sm">
                Error: {searchError}
              </div>
            )}
          </div>

          {/* Right Column: Subtle Graph/Platform Illustration */}
          <div className="hidden lg:col-span-5 lg:flex justify-center items-center animate-fadeIn">
            <div className="relative w-80 h-80 rounded-full border border-white/5 flex items-center justify-center bg-[#171A21]/30">
              {/* Outer Ring */}
              <div className="absolute inset-4 rounded-full border border-white/5 border-dashed" />
              {/* Inner Node */}
              <div className="absolute h-20 w-20 rounded-full bg-[#1E232D] border border-white/10 shadow-2xl flex items-center justify-center">
                <Brain className="h-8 w-8 text-[#F5F5F5]" />
              </div>
              {/* Satellite Node 1 */}
              <div className="absolute top-10 left-10 h-10 w-10 rounded-lg bg-[#1E232D] border border-white/5 flex items-center justify-center shadow-lg">
                <BarChart3 className="h-5 w-5 text-[#22C55E]" />
              </div>
              {/* Satellite Node 2 */}
              <div className="absolute bottom-10 right-10 h-10 w-10 rounded-lg bg-[#1E232D] border border-white/5 flex items-center justify-center shadow-lg">
                <Cpu className="h-5 w-5 text-[#60A5FA]" />
              </div>
              {/* Satellite Node 3 */}
              <div className="absolute top-28 right-6 h-10 w-10 rounded-lg bg-[#1E232D] border border-white/5 flex items-center justify-center shadow-lg">
                <Shield className="h-5 w-5 text-[#F59E0B]" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* AI Agent Modules Cards Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-white/5 animate-fadeInUp">
        <h4 className="text-[10px] font-sans font-bold tracking-widest text-[#9AA4B2] uppercase mb-8">
          Analytical Sub-Agent Modules
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-5 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg hover:scale-[1.01] transition-transform duration-150 flex flex-col justify-between h-44">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#FFFFFF] uppercase mb-3">
                <div className="p-1 rounded-md bg-white/5">
                  <BarChart3 className="h-4 w-4 text-[#F5F5F5]" />
                </div>
                Quantitative
              </div>
              <p className="text-xs leading-relaxed text-[#D1D5DB]">
                Audit revenue growth, debt leverage, ROE coefficients, and free cash flows to score total financial safety.
              </p>
            </div>
            <span className="text-[9px] font-sans font-bold text-[#9AA4B2] uppercase">Financial Agent</span>
          </div>

          {/* Card 2 */}
          <div className="p-5 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg hover:scale-[1.01] transition-transform duration-150 flex flex-col justify-between h-44">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#FFFFFF] uppercase mb-3">
                <div className="p-1 rounded-md bg-white/5">
                  <Cpu className="h-4 w-4 text-[#F5F5F5]" />
                </div>
                Sentiment
              </div>
              <p className="text-xs leading-relaxed text-[#D1D5DB]">
                Index corporate media databases and parse news articles to map near-term momentum sentiment.
              </p>
            </div>
            <span className="text-[9px] font-sans font-bold text-[#9AA4B2] uppercase">Sentiment Agent</span>
          </div>

          {/* Card 3 */}
          <div className="p-5 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg hover:scale-[1.01] transition-transform duration-150 flex flex-col justify-between h-44">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#FFFFFF] uppercase mb-3">
                <div className="p-1 rounded-md bg-white/5">
                  <Shield className="h-4 w-4 text-[#F5F5F5]" />
                </div>
                Risk Audit
              </div>
              <p className="text-xs leading-relaxed text-[#D1D5DB]">
                Map regulatory bottlenecks, brand vulnerabilities, and valuation multiple premiums.
              </p>
            </div>
            <span className="text-[9px] font-sans font-bold text-[#9AA4B2] uppercase">Risk Agent</span>
          </div>

        </div>
      </section>

      {/* AI Pipeline Workflow Visualization (Horizontal flow) */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-white/5 animate-fadeInUp">
        <h4 className="text-[10px] font-sans font-bold tracking-widest text-[#9AA4B2] uppercase mb-8">
          AI Workflow Pipeline
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
          
          <div className="flex flex-col items-center p-4 bg-[#171A21] border border-white/5 rounded-lg text-center shadow-sm">
            <Database className="h-6 w-6 text-[#9AA4B2] mb-2" />
            <span className="text-[9px] font-sans font-bold uppercase text-[#FFFFFF]">Data Collection</span>
          </div>

          <div className="hidden md:flex justify-center text-[#9AA4B2]">
            <ArrowRight className="h-4 w-4" />
          </div>

          <div className="flex flex-col items-center p-4 bg-[#171A21] border border-white/5 rounded-lg text-center shadow-sm">
            <BarChart3 className="h-6 w-6 text-[#22C55E] mb-2" />
            <span className="text-[9px] font-sans font-bold uppercase text-[#FFFFFF]">Financial Analysis</span>
          </div>

          <div className="hidden md:flex justify-center text-[#9AA4B2]">
            <ArrowRight className="h-4 w-4" />
          </div>

          <div className="flex flex-col items-center p-4 bg-[#171A21] border border-white/5 rounded-lg text-center shadow-sm">
            <Cpu className="h-6 w-6 text-[#60A5FA] mb-2" />
            <span className="text-[9px] font-sans font-bold uppercase text-[#FFFFFF]">News Sentiment</span>
          </div>

          <div className="hidden md:flex justify-center text-[#9AA4B2]">
            <ArrowRight className="h-4 w-4" />
          </div>

          <div className="flex flex-col items-center p-4 bg-[#171A21] border border-white/5 rounded-lg text-center shadow-sm">
            <Shield className="h-6 w-6 text-[#F59E0B] mb-2" />
            <span className="text-[9px] font-sans font-bold uppercase text-[#FFFFFF]">Risk Assessment</span>
          </div>

          <div className="hidden md:flex justify-center text-[#9AA4B2]">
            <ArrowRight className="h-4 w-4" />
          </div>

          <div className="flex flex-col items-center p-4 bg-[#171A21] border border-white/5 rounded-lg text-center shadow-sm">
            <Brain className="h-6 w-6 text-[#F5F5F5] mb-2" />
            <span className="text-[9px] font-sans font-bold uppercase text-[#FFFFFF]">Decision Engine</span>
          </div>

          <div className="hidden md:flex justify-center text-[#9AA4B2]">
            <ArrowRight className="h-4 w-4" />
          </div>

          <div className="flex flex-col items-center p-4 bg-[#171A21] border border-white/5 rounded-lg text-center shadow-sm">
            <FileCheck className="h-6 w-6 text-[#FFFFFF] mb-2" />
            <span className="text-[9px] font-sans font-bold uppercase text-[#FFFFFF]">Report Generation</span>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
