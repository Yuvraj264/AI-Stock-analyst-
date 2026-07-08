import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../hooks/useAnalysis.js';
import { ComparisonTable } from '../components/ComparisonTable.jsx';
import { ComparisonSummary } from '../components/ComparisonSummary.jsx';
import { SkeletonBase, CardSkeleton, ReportSkeleton } from '../components/Skeleton.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, RefreshCw, Layers, Sparkles, HelpCircle } from 'lucide-react';

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
      
      // Execute LangGraph pipelines concurrently for both inputs in parallel
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

  // Format compared stock data for Recharts BarChart rendering
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-12 transition-colors duration-300">
      
      {/* Header Panel */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Compare Stocks</h1>
              <p className="text-sm font-semibold text-slate-400 mt-0.5">
                Run comparative multi-agent analyses side-by-side
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Step 1: Input Targets */}
        <form onSubmit={handleCompare} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md">
          <h3 className="text-base font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-emerald-500" />
            1. Select or Enter Target Stocks
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input A */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Company A</label>
              <input
                type="text"
                placeholder="Enter Company Name or Ticker (e.g. Tesla)"
                value={inputA}
                onChange={(e) => setInputA(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
              />
              <span className="text-[10px] text-slate-400 font-medium block">
                {stockA ? `Selected: ${stockA.companyName} (${stockA.ticker})` : 'Or select from selection pool below.'}
              </span>
            </div>

            {/* Input B */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Company B</label>
              <input
                type="text"
                placeholder="Enter Company Name or Ticker (e.g. Microsoft)"
                value={inputB}
                onChange={(e) => setInputB(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
              />
              <span className="text-[10px] text-slate-400 font-medium block">
                {stockB ? `Selected: ${stockB.companyName} (${stockB.ticker})` : 'Or select from selection pool below.'}
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !inputA.trim() || !inputB.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-850 dark:disabled:text-slate-600 shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Running Parallel Analyses...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Compare Live
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Notice */}
        {activeError && (
          <div className="p-4 rounded-xl border border-rose-200/50 bg-rose-50 text-rose-600 text-sm font-semibold max-w-md mx-auto text-center dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400">
            {activeError}
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4">
                  <SkeletonBase className="h-6 w-48 mb-6" />
                  <div className="space-y-3">
                    <SkeletonBase className="h-8 w-full" />
                    <SkeletonBase className="h-8 w-full" />
                    <SkeletonBase className="h-8 w-full" />
                    <SkeletonBase className="h-8 w-full" />
                    <SkeletonBase className="h-8 w-full" />
                  </div>
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
          <div className="space-y-8 animate-fadeIn">
            {/* Matrices */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ComparisonTable stockA={stockA} stockB={stockB} />
              </div>
              <div className="lg:col-span-1">
                <ComparisonSummary stockA={stockA} stockB={stockB} />
              </div>
            </div>

            {/* Recharts comparison bar chart */}
            <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
              <h3 className="text-base font-bold text-slate-400 uppercase tracking-wide mb-4">
                Core Metrics Score Bar-Chart Comparison
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="category"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      dy={10}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
                    <Bar dataKey={stockA.ticker} fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey={stockB.ticker} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Selection Pool Container */}
        <div>
          <h3 className="text-base font-bold text-slate-400 uppercase tracking-wide mb-4">
            Analysis Selection Pool (Historical Runs)
          </h3>

          {history.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-105 dark:border-slate-800/80 text-center text-slate-400 font-semibold text-sm">
              Please analyze some companies on the Home page first to populate this quick selection pool.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.map((record) => (
                <div
                  key={record._id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm font-bold text-sm"
                >
                  <div className="min-w-0 pr-2">
                    <span className="block text-slate-800 dark:text-white font-bold truncate">{record.companyName}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Ticker: <span className="text-emerald-500 font-extrabold">{record.ticker}</span>
                    </span>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => handleQuickSelect(record, 'A')}
                      className="px-2 py-1 text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 rounded dark:bg-emerald-950/25 dark:text-emerald-450 dark:border-emerald-900 transition-colors cursor-pointer"
                    >
                      A
                    </button>
                    <button
                      onClick={() => handleQuickSelect(record, 'B')}
                      className="px-2 py-1 text-[10px] bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded dark:bg-blue-950/25 dark:text-blue-450 dark:border-blue-900 transition-colors cursor-pointer"
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
