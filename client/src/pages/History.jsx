import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../hooks/useAnalysis.js';
import { ArrowLeft, RefreshCw, BarChart2, ShieldAlert, Award, FileText, ArrowUpRight, Search, Trash2 } from 'lucide-react';

/**
 * Historical logs viewer page.
 * Loads and displays past database analysis reports.
 */
export const History = () => {
  const navigate = useNavigate();
  const { history, fetchHistory, deleteAnalysisItem, loading, error } = useAnalysis();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSelectRecord = (record) => {
    // Map database model names to finalState properties required by the Dashboard
    const analysisPayload = {
      companyName: record.companyName,
      ticker: record.ticker,
      financialScore: record.financialScore,
      newsScore: record.newsScore,
      riskScore: record.riskScore,
      finalScore: record.finalScore,
      recommendation: record.recommendation,
      confidence: record.confidence,
      reasoning: record.reasoning,
      risks: record.risks || [],
      financialData: null // Set to null to indicate archived run triggers
    };
    navigate('/dashboard', { state: { analysis: analysisPayload } });
  };

  const handleDeleteRecord = async (e, id, companyName) => {
    e.stopPropagation(); // Prevent card click navigation
    if (window.confirm(`Are you sure you want to delete the research report for ${companyName}?`)) {
      try {
        await deleteAnalysisItem(id);
      } catch (err) {
        alert(err.message || 'Operational failure: Deletion aborted.');
      }
    }
  };

  const getRecommendationBadgeStyle = (rec) => {
    const r = (rec || 'HOLD').toUpperCase();
    if (r.includes('BUY') || r.includes('INVEST')) {
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    }
    if (r.includes('SELL') || r.includes('PASS')) {
      return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    }
    return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
  };

  const filteredHistory = history.filter((record) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      (record.companyName && record.companyName.toLowerCase().includes(term)) ||
      (record.ticker && record.ticker.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-12 transition-colors duration-300">
      
      {/* Header Panel */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Research History</h1>
              <p className="text-sm font-semibold text-slate-400 mt-0.5">
                Review previous stock analysis summaries stored in the database
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchHistory()}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-white transition-colors duration-200 self-start sm:self-center"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search archived research by company name or ticker..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:ring-emerald-500 shadow-sm transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Main Body */}
      <main className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        {loading && history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
            <span className="text-sm font-semibold text-slate-400">Loading historical database records...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl border border-red-200/50 bg-red-50 text-red-600 text-sm font-semibold max-w-md mx-auto text-center dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 max-w-md mx-auto shadow-md">
            <FileText className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No research logs found</h3>
            <p className="text-sm text-slate-400 text-center mt-1">
              Trigger new research profiles from the home screen to build your analysis logs database.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-md shadow-emerald-500/10 transition-colors duration-200"
            >
              Analyze a Stock
            </button>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
            <span className="text-sm font-semibold text-slate-400">No matching search results.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((record) => {
              const formattedDate = new Date(record.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={record._id}
                  onClick={() => handleSelectRecord(record)}
                  className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 hover:border-emerald-500/40 dark:border-slate-800 dark:hover:border-emerald-500/40 shadow-sm transition-all duration-305 hover:-translate-y-1 cursor-pointer hover:shadow-md"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors duration-200 truncate">
                          {record.companyName}
                        </h3>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                          Ticker: <span className="text-emerald-500 font-bold">{record.ticker}</span>
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border shrink-0 ${getRecommendationBadgeStyle(
                          record.recommendation
                        )}`}
                      >
                        {record.recommendation}
                      </span>
                    </div>

                    {/* Meta Scores Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-6">
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 text-center">
                        <Award className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                        <span className="text-[10px] font-semibold text-slate-400 uppercase block">Consensus</span>
                        <span className="text-sm font-bold block mt-0.5">{record.finalScore}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 text-center">
                        <BarChart2 className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                        <span className="text-[10px] font-semibold text-slate-400 uppercase block">Finance</span>
                        <span className="text-sm font-bold block mt-0.5">{record.financialScore}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 text-center">
                        <ShieldAlert className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                        <span className="text-[10px] font-semibold text-slate-400 uppercase block">Risk</span>
                        <span className="text-sm font-bold block mt-0.5">{record.riskScore}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer metadata */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50 dark:border-slate-805">
                    <span className="text-xs text-slate-400 font-semibold">{formattedDate}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDeleteRecord(e, record._id, record.companyName)}
                        className="p-1.5 rounded-lg border border-slate-205 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:border-slate-800 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 transition-all duration-200"
                        title="Delete Analysis"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleSelectRecord(record)}
                        className="text-xs font-semibold text-emerald-500 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/25 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors"
                      >
                        View <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
};

export default History;
