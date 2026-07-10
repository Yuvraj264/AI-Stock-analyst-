import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../hooks/useAnalysis.js';
import { ComparisonTable } from '../components/ComparisonTable.jsx';
import { ComparisonSummary } from '../components/ComparisonSummary.jsx';
import { SkeletonBase, CardSkeleton, ReportSkeleton } from '../components/Skeleton.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, RefreshCw, Layers, Sparkles } from 'lucide-react';

/**
 * Side-by-Side Stock Comparison Page.
 * Coordinates input queries, triggers parallel LangGraph workflows, and displays tables & charts.
 */
export const Compare = () => {
  const navigate = useNavigate();
  const { history, fetchHistory, analyzeStock, loading: apiLoading, error: apiError } = useAnalysis();

  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  
  const [stockA, setStockA] = useState(null);
  const [stockB, setStockB] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleQuickSelect = (record, target) => {
    if (target === 'A') {
      setStockA(record);
      setInputA(record.companyName);
    } else {
      setStockB(record);
      setInputB(record.companyName);
    }
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!inputA.trim() || !inputB.trim()) {
      setLocalError('Both Company A and Company B inputs are required.');
      return;
    }

    setLocalLoading(true);
    setLocalError(null);

    try {
      console.log(`[Compare Page] Starting comparison runs for "${inputA}" and "${inputB}"...`);
      
      const [resA, resB] = await Promise.all([
        analyzeStock(inputA),
        analyzeStock(inputB)
      ]);

      console.log(`[Compare Page] Completed parallel analysis pipelines successfully.`);
      setStockA(resA);
      setStockB(resB);
    } catch (err) {
      console.error('[Compare Page Error] Live comparison failed:', err);
      setLocalError(err.message || 'Analysis pipeline execution failed for one or both companies.');
    } finally {
      setLocalLoading(false);
    }
  };

  const getChartData = () => {
    if (!stockA || !stockB) return [];
    
    const categories = [
      { key: 'finalScore', label: 'Consensus Rating' },
      { key: 'financialScore', label: 'Financial Health' },
      { key: 'newsScore', label: 'News Sentiment' },
      { key: 'riskScore', label: 'Risk Safety' }
    ];

    return categories.map((cat) => ({
      category: cat.label,
      [stockA.ticker]: stockA[cat.key],
      [stockB.ticker]: stockB[cat.key]
    }));
  };

  const isComparisonReady = stockA && stockB;
  const isLoading = apiLoading || localLoading;
  const activeError = apiError || localError;

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#FFFFFF] pb-12 transition-colors duration-200 font-sans">
      
      {/* Header Panel */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fadeIn">
            <button
              onClick={() => navigate('/')}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-white/5 bg-[#171A21] text-[#9AA4B2] hover:text-[#FFFFFF] hover:border-[#FFFFFF]/35 transition-colors duration-150 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-xl font-sans font-bold uppercase tracking-wide tracking-[-0.01em]">Compare Workspace</h1>
              <p className="text-[10px] font-sans font-semibold text-[#9AA4B2] uppercase mt-0.5">
                Run comparative multi-agent analyses side-by-side
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        
        {/* Step 1: Input Targets */}
        <form onSubmit={handleCompare} className="p-5 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg animate-fadeInUp">
          <h3 className="text-[10px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-[#F5F5F5]" />
            [1] Enter Target Stock Companies
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input A */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider block">Company A</label>
              <input
                type="text"
                placeholder="Enter Company or Ticker (e.g. Tesla)"
                value={inputA}
                onChange={(e) => setInputA(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#171A21] text-[#FFFFFF] placeholder-[#9AA4B2]/60 focus:outline-none focus:border-[#F5F5F5]/30 text-xs font-sans font-medium uppercase tracking-wide shadow-sm"
              />
              <span className="text-[9px] font-sans font-bold text-[#9AA4B2]/60 block uppercase mt-0.5">
                {stockA ? `SELECTED: ${stockA.companyName} (${stockA.ticker})` : 'Or select from pool below.'}
              </span>
            </div>

            {/* Input B */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider block">Company B</label>
              <input
                type="text"
                placeholder="Enter Company or Ticker (e.g. Microsoft)"
                value={inputB}
                onChange={(e) => setInputB(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-white/5 bg-[#171A21] text-[#FFFFFF] placeholder-[#9AA4B2]/60 focus:outline-none focus:border-[#F5F5F5]/30 text-xs font-sans font-medium uppercase tracking-wide shadow-sm"
              />
              <span className="text-[9px] font-sans font-bold text-[#9AA4B2]/60 block uppercase mt-0.5">
                {stockB ? `SELECTED: ${stockB.companyName} (${stockB.ticker})` : 'Or select from pool below.'}
              </span>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !inputA.trim() || !inputB.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#F5F5F5] text-[#0F1115] font-sans font-bold text-[10px] uppercase tracking-wider hover:bg-[#FFFFFF] hover:scale-[1.02] active:scale-[0.98] disabled:bg-[#171A21] disabled:text-[#9AA4B2]/50 disabled:scale-100 transition-all cursor-pointer shadow-sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Running parallel nodes...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Compare Live
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Notice */}
        {activeError && (
          <div className="p-3 bg-[#1E232D] border border-[#EF4444]/30 text-[#EF4444] font-sans text-xs text-center uppercase tracking-wider rounded-md max-w-md mx-auto shadow-sm">
            Error: {activeError}
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="p-5 bg-[#1E232D] border border-white/5 rounded-lg space-y-3 shadow-sm">
                  <SkeletonBase className="h-4 w-40 mb-4 animate-pulse" />
                  <SkeletonBase className="h-8 w-full animate-pulse" />
                  <SkeletonBase className="h-8 w-full animate-pulse" />
                  <SkeletonBase className="h-8 w-full animate-pulse" />
                </div>
              </div>
              <div className="lg:col-span-1">
                <ReportSkeleton />
              </div>
            </div>
            <CardSkeleton />
          </div>
        )}

        {/* Step 2: Comparison Dashboard Output */}
        {isComparisonReady && !isLoading && (
          <div className="space-y-6">
            {/* Matrices */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ComparisonTable stockA={stockA} stockB={stockB} />
              </div>
              <div className="lg:col-span-1">
                <ComparisonSummary stockA={stockA} stockB={stockB} />
              </div>
            </div>

            {/* Recharts comparison bar chart */}
            <div className="p-5 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg animate-fadeInUp">
              <h3 className="text-[10px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-4">
                Core Metrics Summary Comp
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="category"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 9, fill: '#9AA4B2', fontFamily: 'Inter' }}
                      dy={10}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 9, fill: '#9AA4B2', fontFamily: 'Inter' }}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E232D',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        fontFamily: 'Inter',
                        fontSize: '0.75rem'
                      }}
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 10, fontFamily: 'Inter', fontWeight: 'bold' }} />
                    <Bar dataKey={stockA.ticker} fill="#F5F5F5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey={stockB.ticker} fill="#D1D5DB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Selection Pool Container */}
        <div className="animate-fadeInUp">
          <h3 className="text-[10px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-4">
            Analysis Selection Pool (Historical Runs)
          </h3>

          {history.length === 0 ? (
            <div className="p-5 bg-[#1E232D] border border-white/5 rounded-xl text-center text-[#9AA4B2] font-sans uppercase text-[10px] tracking-wide shadow-sm">
              Please analyze some companies on the Home page first to populate this quick selection pool.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.map((record) => (
                <div
                  key={record._id}
                  className="flex items-center justify-between p-3.5 bg-[#1E232D] border border-white/5 hover:border-white/10 rounded-xl font-sans text-xs shadow-lg hover:scale-[1.01] transition-all duration-150"
                >
                  <div className="min-w-0 pr-2">
                    <span className="block text-[#FFFFFF] font-bold truncate uppercase">{record.companyName}</span>
                    <span className="text-[9px] text-[#9AA4B2] mt-0.5 block uppercase">
                      Ticker: <span className="font-mono text-[#F5F5F5] font-extrabold">{record.ticker}</span>
                    </span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleQuickSelect(record, 'A')}
                      className="px-2.5 py-1 text-[9px] bg-[#171A21] border border-white/5 text-[#9AA4B2] hover:text-[#FFFFFF] hover:border-white/20 rounded-md transition-colors cursor-pointer"
                    >
                      A
                    </button>
                    <button
                      onClick={() => handleQuickSelect(record, 'B')}
                      className="px-2.5 py-1 text-[9px] bg-[#171A21] border border-white/5 text-[#9AA4B2] hover:text-[#FFFFFF] hover:border-white/20 rounded-md transition-colors cursor-pointer"
                    >
                      B
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

    </div>
  );
};

export default Compare;
