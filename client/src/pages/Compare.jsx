import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../hooks/useAnalysis.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, RefreshCw, Layers, Plus, X, Award, ShieldAlert, Newspaper, DollarSign } from 'lucide-react';

/**
 * Side-by-Side Stock Comparison Page.
 * Allows comparing scores and quantitative metrics from history logs.
 */
export const Compare = () => {
  const navigate = useNavigate();
  const { history, fetchHistory, loading, error } = useAnalysis();
  const [selectedStocks, setSelectedStocks] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleAddStock = (stock) => {
    if (selectedStocks.some((s) => s._id === stock._id)) return;
    if (selectedStocks.length >= 3) {
      alert('You can compare a maximum of 3 stocks simultaneously.');
      return;
    }
    setSelectedStocks((prev) => [...prev, stock]);
  };

  const handleRemoveStock = (id) => {
    setSelectedStocks((prev) => prev.filter((s) => s._id !== id));
  };

  // Reformat selected stocks data for Recharts BarChart comparison
  // Chart structure: [{ category: 'Final', StockA: 85, StockB: 60, ... }]
  const getChartData = () => {
    const categories = [
      { key: 'finalScore', label: 'Consensus Rating' },
      { key: 'financialScore', label: 'Financial Health' },
      { key: 'newsScore', label: 'News Sentiment' },
      { key: 'riskScore', label: 'Risk Safety' }
    ];

    return categories.map((cat) => {
      const dataPoint = { category: cat.label };
      selectedStocks.forEach((stock) => {
        dataPoint[stock.ticker] = stock[cat.key];
      });
      return dataPoint;
    });
  };

  const colors = ['#10b981', '#3b82f6', '#f59e0b'];

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
                Select and compare up to 3 stocks from analysis history
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Step 1: Active comparison selection top bar */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-emerald-500" />
            Selected Stocks ({selectedStocks.length}/3)
          </h3>
          
          <div className="flex flex-wrap gap-4 items-center min-h-[4.5rem] p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm">
            {selectedStocks.length === 0 ? (
              <span className="text-sm text-slate-400 font-semibold px-2">
                Click stocks in the selection pool below to start comparing
              </span>
            ) : (
              selectedStocks.map((stock, idx) => (
                <div
                  key={stock._id}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-sm shadow-sm"
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[idx] }}></span>
                  <span className="text-slate-850 dark:text-slate-200">{stock.ticker}</span>
                  <button
                    onClick={() => handleRemoveStock(stock._id)}
                    className="text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors duration-200 ml-1.5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic score compare graphs */}
        {selectedStocks.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Chart */}
            <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
              <h3 className="text-base font-bold text-slate-400 uppercase tracking-wide mb-4">
                Score Comparison
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
                    {selectedStocks.map((stock, idx) => (
                      <Bar
                        key={stock._id}
                        dataKey={stock.ticker}
                        fill={colors[idx]}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Side-by-Side metrics table panel */}
            <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-400 uppercase tracking-wide mb-4">
                  Comparison Matrix
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
                  
                  {/* Rating row */}
                  <div className="pt-2">
                    <span className="text-xs font-semibold text-slate-400 block tracking-wide uppercase">Consensus Rating</span>
                    <div className="flex gap-4 mt-2 font-bold text-sm">
                      {selectedStocks.map((stock, idx) => (
                        <div key={stock._id} className="flex-1">
                          <span style={{ color: colors[idx] }}>{stock.ticker}:</span>{' '}
                          <span className="block mt-0.5 text-slate-800 dark:text-slate-200">
                            {stock.recommendation}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risks row */}
                  <div className="pt-4">
                    <span className="text-xs font-semibold text-slate-400 block tracking-wide uppercase">Key Risks Count</span>
                    <div className="flex gap-4 mt-2 font-bold text-sm">
                      {selectedStocks.map((stock, idx) => (
                        <div key={stock._id} className="flex-1">
                          <span style={{ color: colors[idx] }}>{stock.ticker}:</span>{' '}
                          <span className="block mt-0.5 text-slate-800 dark:text-slate-200">
                            {stock.risks?.length || 0} Risk Factors
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}

        {/* Selection Pool Container */}
        <div>
          <h3 className="text-base font-bold text-slate-400 uppercase tracking-wide mb-4">
            Analysis Selection Pool
          </h3>

          {loading && history.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <RefreshCw className="h-6 w-6 text-emerald-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl border border-red-200/50 bg-red-50 text-red-600 text-sm font-semibold max-w-md mx-auto text-center dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
              {error}
            </div>
          ) : history.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 text-center text-slate-400 font-semibold text-sm">
              Please analyze some companies on the Home page first to add them to the pool.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.map((record) => {
                const isSelected = selectedStocks.some((s) => s._id === record._id);
                return (
                  <button
                    key={record._id}
                    onClick={() => handleAddStock(record)}
                    disabled={isSelected}
                    className={`flex items-center justify-between p-4 rounded-xl border text-left font-bold text-sm shadow-sm transition-all duration-200 select-none ${
                      isSelected
                        ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 dark:bg-slate-950 dark:border-slate-850'
                        : 'bg-white border-slate-150 text-slate-700 hover:border-emerald-500/40 hover:-translate-y-0.5 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-emerald-500/40'
                    }`}
                  >
                    <div>
                      <span className="block text-slate-800 dark:text-white font-bold">{record.ticker}</span>
                      <span className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5 block truncate max-w-[130px]">
                        {record.companyName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-extrabold text-slate-600 dark:text-slate-400">
                        {record.finalScore}
                      </span>
                      {!isSelected && <Plus className="h-4 w-4 text-emerald-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </main>

    </div>
  );
};

export default Compare;
