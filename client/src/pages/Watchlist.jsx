import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../hooks/useAnalysis.js';
import { useToast } from '../components/Toast.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { 
  Plus, 
  Trash2, 
  Search, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown, 
  Bookmark, 
  Brain, 
  X
} from 'lucide-react';

const INITIAL_WATCHLIST = [
  {
    id: 'w1',
    companyName: 'NVIDIA Corporation',
    ticker: 'NVDA',
    recommendation: 'INVEST',
    consensusScore: 88,
    confidence: 0.90,
    lastUpdated: '2026-07-17T12:00:00.000Z'
  },
  {
    id: 'w2',
    companyName: 'Microsoft Corporation',
    ticker: 'MSFT',
    recommendation: 'INVEST',
    consensusScore: 82,
    confidence: 0.85,
    lastUpdated: '2026-07-16T15:30:00.000Z'
  },
  {
    id: 'w3',
    companyName: 'Tesla, Inc.',
    ticker: 'TSLA',
    recommendation: 'HOLD',
    consensusScore: 55,
    confidence: 0.70,
    lastUpdated: '2026-07-15T09:15:00.000Z'
  },
  {
    id: 'w4',
    companyName: 'Apple Inc.',
    ticker: 'AAPL',
    recommendation: 'INVEST',
    consensusScore: 80,
    confidence: 0.88,
    lastUpdated: '2026-07-17T10:45:00.000Z'
  },
  {
    id: 'w5',
    companyName: 'Intel Corporation',
    ticker: 'INTC',
    recommendation: 'PASS',
    consensusScore: 35,
    confidence: 0.75,
    lastUpdated: '2026-07-14T08:00:00.000Z'
  }
];

export const Watchlist = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { history, fetchHistory, performAnalysis } = useAnalysis();

  // Watchlist Items State (Persisted in localStorage)
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse watchlist items from localStorage', e);
      }
    }
    return INITIAL_WATCHLIST;
  });

  // Save watchlist items on state change
  useEffect(() => {
    localStorage.setItem('watchlist_items', JSON.stringify(watchlist));
  }, [watchlist]);

  // Load history logs on mount to enable autocomplete / filling from history
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // UI Interactive States
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'ticker', direction: 'asc' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Real-time analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingCompany, setAnalyzingCompany] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  // Add stock form states
  const [formTicker, setFormTicker] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formRecommendation, setFormRecommendation] = useState('INVEST');
  const [formScore, setFormScore] = useState(80);
  const [formConfidence, setFormConfidence] = useState(85);

  // Handle Quick Analyze
  const handleQuickAnalyze = async (companyName) => {
    setAnalyzingCompany(companyName);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    addToast(`Initializing multi-agent graph node workflow for "${companyName}"...`, 'info');
    
    try {
      const response = await performAnalysis(companyName);
      if (response && response.success) {
        setAnalysisResult(response.data);
      } else {
        throw new Error(response.message || 'Workflow execution rejected by host.');
      }
    } catch (err) {
      console.error('Watchlist quick research failed:', err);
      const errMsg = err.response?.data?.message || err.message || 'Operational execution failed.';
      setIsAnalyzing(false);
      addToast(errMsg, 'error');
    }
  };

  const handleLoaderFinished = () => {
    if (analysisResult) {
      addToast(`Analysis compiled for ${analysisResult.companyName}!`, 'success');
      setIsAnalyzing(false);
      navigate('/dashboard', { state: { analysis: analysisResult } });
    }
  };

  // Add Item to Watchlist
  const handleAddStock = (e) => {
    e.preventDefault();
    if (!formTicker || !formCompany) {
      addToast('Please provide both a ticker symbol and company name.', 'error');
      return;
    }

    const tickerUpper = formTicker.trim().toUpperCase();
    const companyTrimmed = formCompany.trim();

    // Check if already in watchlist
    if (watchlist.some(item => item.ticker === tickerUpper)) {
      addToast(`${tickerUpper} is already in your watchlist.`, 'warning');
      return;
    }

    const newItem = {
      id: `w-${Date.now()}`,
      companyName: companyTrimmed,
      ticker: tickerUpper,
      recommendation: formRecommendation,
      consensusScore: Number(formScore),
      confidence: Number(formConfidence) / 100,
      lastUpdated: new Date().toISOString()
    };

    setWatchlist([newItem, ...watchlist]);
    addToast(`Successfully added ${tickerUpper} to watchlist.`, 'success');
    
    // Reset Form & Close Modal
    setFormTicker('');
    setFormCompany('');
    setFormRecommendation('INVEST');
    setFormScore(80);
    setFormConfidence(85);
    setIsAddModalOpen(false);
  };

  // Auto-fill form from selected History report
  const handleHistorySelection = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const record = history.find(item => item._id === selectedId);
    if (record) {
      setFormTicker(record.ticker || '');
      setFormCompany(record.companyName || '');
      setFormRecommendation(record.recommendation || 'INVEST');
      setFormScore(record.finalScore || 80);
      setFormConfidence(Math.round((record.confidence || 0.8) * 100));
      addToast(`Autofilled data for ${record.ticker}.`, 'info');
    }
  };

  // Remove Item from Watchlist
  const handleRemoveStock = (id, ticker) => {
    if (window.confirm(`Are you sure you want to remove ${ticker} from your watchlist?`)) {
      setWatchlist(watchlist.filter(item => item.id !== id));
      addToast(`${ticker} removed from watchlist.`, 'success');
    }
  };

  // Color Styles Helper
  const getRecStyle = (rec) => {
    const r = (rec || 'HOLD').toUpperCase();
    if (r.includes('BUY') || r.includes('INVEST')) {
      return 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20';
    }
    if (r.includes('SELL') || r.includes('PASS')) {
      return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20';
    }
    return 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20';
  };

  // Sorting Handler
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Compute stats for KPI cards
  const stats = useMemo(() => {
    const total = watchlist.length;
    let invest = 0;
    let hold = 0;
    let pass = 0;

    watchlist.forEach(item => {
      const r = item.recommendation.toUpperCase();
      if (r.includes('BUY') || r.includes('INVEST')) {
        invest++;
      } else if (r.includes('SELL') || r.includes('PASS')) {
        pass++;
      } else {
        hold++;
      }
    });

    return { total, invest, hold, pass };
  }, [watchlist]);

  // Filter & Sort Watchlist Data
  const filteredSortedWatchlist = useMemo(() => {
    // 1. Filter
    const filtered = watchlist.filter(item => {
      const query = searchTerm.toLowerCase().trim();
      if (!query) return true;
      return (
        item.ticker.toLowerCase().includes(query) ||
        item.companyName.toLowerCase().includes(query)
      );
    });

    // 2. Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Format strings for case-insensitive sort
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [watchlist, searchTerm, sortConfig]);

  // Render sorting arrow helpers
  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-3 w-3 text-[#9AA4B2]/40 group-hover:text-[#FFFFFF]/60 transition-colors ml-1 inline" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-3 w-3 text-[#FFFFFF] ml-1 inline" /> 
      : <ChevronDown className="h-3 w-3 text-[#FFFFFF] ml-1 inline" />;
  };

  if (isAnalyzing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F1115] px-4 transition-colors duration-200 font-sans">
        <LoadingSpinner 
          companyName={analyzingCompany} 
          isApiFinished={!!analysisResult}
          onFinished={handleLoaderFinished}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#FFFFFF] pb-12 transition-colors duration-200 font-sans">
      
      {/* Header Panel */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 animate-fadeIn">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/5 bg-[#171A21] text-[#9AA4B2]">
              <Bookmark className="h-4 w-4 text-[#F5F5F5]" />
            </div>
            <div>
              <h1 className="text-xl font-sans font-bold uppercase tracking-wide tracking-[-0.01em]">Watchlist Workspace</h1>
              <p className="text-[10px] font-sans font-semibold text-[#9AA4B2] uppercase mt-0.5">
                Monitor and manage curated companies under observation
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#F5F5F5] hover:bg-[#FFFFFF] text-[#0F1115] font-sans font-bold text-[10px] uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3px]" />
            Add Company
          </button>
        </div>
      </div>

      {/* KPI Cards section */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2 animate-fadeInUp">
          {/* Card 1 */}
          <div className="p-4 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg flex flex-col justify-between">
            <span className="text-[10px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider">Total Companies</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-bold tracking-tight text-[#FFFFFF]">{stats.total}</span>
              <span className="text-[9px] text-[#9AA4B2] font-semibold">Active Watch</span>
            </div>
          </div>
          {/* Card 2 */}
          <div className="p-4 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg flex flex-col justify-between">
            <span className="text-[10px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider">Invest Signals</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-bold tracking-tight text-[#22C55E]">{stats.invest}</span>
              <span className="text-[9px] text-[#22C55E] font-semibold">Buy Ready</span>
            </div>
          </div>
          {/* Card 3 */}
          <div className="p-4 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg flex flex-col justify-between">
            <span className="text-[10px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider">Hold Signals</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-bold tracking-tight text-[#F59E0B]">{stats.hold}</span>
              <span className="text-[9px] text-[#F59E0B] font-semibold">Consolidated</span>
            </div>
          </div>
          {/* Card 4 */}
          <div className="p-4 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg flex flex-col justify-between">
            <span className="text-[10px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider">Pass Signals</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-bold tracking-tight text-[#EF4444]">{stats.pass}</span>
              <span className="text-[9px] text-[#EF4444] font-semibold">Avoid/Wait</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filter Controls */}
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <div className="relative animate-fadeIn">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="h-4 w-4 text-[#9AA4B2]/60" />
          </span>
          <input
            type="text"
            placeholder="Search watchlist by ticker symbol or company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-white/5 bg-[#171A21] focus:outline-none focus:border-[#F5F5F5]/30 text-[#FFFFFF] text-xs font-sans tracking-wide uppercase shadow-sm placeholder:text-[#9AA4B2]/40"
          />
        </div>
      </div>

      {/* Main Table Body */}
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#171A21] border border-white/5 p-8 max-w-md mx-auto rounded-xl text-center shadow-sm animate-fadeInUp">
            <Bookmark className="h-10 w-10 text-[#9AA4B2]/40 mb-4" />
            <h3 className="text-xs font-sans font-bold text-[#FFFFFF] uppercase tracking-wider">Watchlist is Empty</h3>
            <p className="text-[10px] text-[#9AA4B2] font-sans tracking-wide leading-relaxed mt-2">
              Add companies that you are monitoring to keep track of their scores and signals.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-6 px-4 py-2 rounded-md bg-[#F5F5F5] text-[#0F1115] font-sans font-bold text-[10px] uppercase tracking-wider hover:bg-[#FFFFFF] transition-colors cursor-pointer shadow-sm"
            >
              Add First Stock
            </button>
          </div>
        ) : filteredSortedWatchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-xs font-sans text-[#9AA4B2]/60 uppercase tracking-widest">No matching watchlist records.</span>
          </div>
        ) : (
          /* Spreadsheet Table Grid Layout */
          <div className="w-full overflow-hidden border border-white/5 bg-[#171A21] rounded-xl shadow-sm animate-fadeInUp">
            <table className="w-full border-collapse text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/5 bg-[#0F1115]/40 text-[#9AA4B2] font-bold uppercase tracking-wider select-none">
                  <th 
                    className="p-4 text-[10px] cursor-pointer hover:text-[#FFFFFF] transition-colors group"
                    onClick={() => requestSort('ticker')}
                  >
                    Ticker {renderSortIndicator('ticker')}
                  </th>
                  <th 
                    className="p-4 text-[10px] cursor-pointer hover:text-[#FFFFFF] transition-colors group"
                    onClick={() => requestSort('companyName')}
                  >
                    Company {renderSortIndicator('companyName')}
                  </th>
                  <th 
                    className="p-4 text-[10px] cursor-pointer hover:text-[#FFFFFF] transition-colors group"
                    onClick={() => requestSort('recommendation')}
                  >
                    Recommendation {renderSortIndicator('recommendation')}
                  </th>
                  <th 
                    className="p-4 text-[10px] text-center cursor-pointer hover:text-[#FFFFFF] transition-colors group"
                    onClick={() => requestSort('consensusScore')}
                  >
                    Consensus Score {renderSortIndicator('consensusScore')}
                  </th>
                  <th 
                    className="p-4 text-center text-[10px] cursor-pointer hover:text-[#FFFFFF] transition-colors group"
                    onClick={() => requestSort('confidence')}
                  >
                    Confidence {renderSortIndicator('confidence')}
                  </th>
                  <th 
                    className="p-4 text-[10px] cursor-pointer hover:text-[#FFFFFF] transition-colors group"
                    onClick={() => requestSort('lastUpdated')}
                  >
                    Last Updated {renderSortIndicator('lastUpdated')}
                  </th>
                  <th className="p-4 text-[10px] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#9AA4B2] font-medium">
                {filteredSortedWatchlist.map((item) => {
                  const formattedDate = new Date(item.lastUpdated).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#0F1115]/30 transition-colors duration-100"
                    >
                      <td className="p-4 font-mono font-bold text-[#F5F5F5]">{item.ticker}</td>
                      <td className="p-4 font-semibold text-[#FFFFFF] truncate max-w-[200px]">
                        {item.companyName}
                      </td>
                      <td className="p-4 font-bold text-[10px]">
                        <span className={`inline-flex px-2 py-0.5 rounded border ${getRecStyle(item.recommendation)}`}>
                          {item.recommendation}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-[#FFFFFF]">
                        <div className="inline-flex items-center justify-center h-7 w-7 rounded bg-[#1E232D] border border-white/5 font-mono">
                          {item.consensusScore}
                        </div>
                      </td>
                      <td className="p-4 text-center font-semibold text-[#D1D5DB]">
                        {Math.round(item.confidence * 100)}%
                      </td>
                      <td className="p-4 text-[#D1D5DB]/85">{formattedDate}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-1.5 text-[9px] font-sans font-bold uppercase">
                          <button
                            onClick={() => handleQuickAnalyze(item.companyName)}
                            className="flex items-center gap-1 px-2.5 py-1.5 border border-white/5 bg-[#0F1115] hover:bg-[#1E232D] text-[#D1D5DB] hover:text-[#FFFFFF] hover:border-[#FFFFFF]/45 rounded-md transition-all cursor-pointer"
                            title="Trigger AI Consensus Analysis"
                          >
                            <Brain className="h-3 w-3" />
                            Analyze
                          </button>
                          <button
                            onClick={() => handleRemoveStock(item.id, item.ticker)}
                            className="p-1.5 border border-white/5 bg-[#0F1115] hover:bg-[#EF4444]/10 text-[#EF4444] hover:border-[#EF4444]/30 rounded-md transition-all cursor-pointer"
                            title="Remove from Watchlist"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Add Company Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className="w-full max-w-md bg-[#171A21] border border-white/5 rounded-xl shadow-2xl p-6 relative animate-fadeInUp flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4.5 w-4.5 text-[#F5F5F5]" />
                <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-[#FFFFFF]">Add to Watchlist</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[#9AA4B2] hover:text-[#FFFFFF] rounded-md transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Autofill option from database research history */}
            {history && history.length > 0 && (
              <div className="mt-4 pb-4 border-b border-white/5">
                <label className="block text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-1.5">
                  Autofill from Research History
                </label>
                <select
                  onChange={handleHistorySelection}
                  defaultValue=""
                  className="w-full px-3 py-2 rounded-md border border-white/5 bg-[#1E232D] text-[#D1D5DB] text-xs font-sans tracking-wide uppercase focus:outline-none focus:border-[#F5F5F5]/30 cursor-pointer"
                >
                  <option value="">-- Choose Researched Company --</option>
                  {history.map(record => (
                    <option key={record._id} value={record._id}>
                      {record.ticker} - {record.companyName} ({record.recommendation})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleAddStock} className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-1">
                    Ticker
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AAPL"
                    value={formTicker}
                    onChange={(e) => setFormTicker(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-white/5 bg-[#1E232D] text-[#FFFFFF] text-xs font-sans tracking-wide uppercase focus:outline-none focus:border-[#F5F5F5]/30 placeholder:text-[#9AA4B2]/30"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apple Inc."
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-white/5 bg-[#1E232D] text-[#FFFFFF] text-xs font-sans tracking-wide focus:outline-none focus:border-[#F5F5F5]/30 placeholder:text-[#9AA4B2]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-1">
                  Recommendation Signal
                </label>
                <select
                  value={formRecommendation}
                  onChange={(e) => setFormRecommendation(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-white/5 bg-[#1E232D] text-[#FFFFFF] text-xs font-sans tracking-wide uppercase focus:outline-none focus:border-[#F5F5F5]/30 cursor-pointer"
                >
                  <option value="INVEST">INVEST</option>
                  <option value="HOLD">HOLD</option>
                  <option value="PASS">PASS</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider">
                      Consensus Score
                    </label>
                    <span className="text-[10px] font-bold text-[#FFFFFF] font-mono">{formScore}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formScore}
                    onChange={(e) => setFormScore(Number(e.target.value))}
                    className="w-full accent-[#FFFFFF] cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider">
                      Confidence
                    </label>
                    <span className="text-[10px] font-bold text-[#FFFFFF] font-mono">{formConfidence}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formConfidence}
                    onChange={(e) => setFormConfidence(Number(e.target.value))}
                    className="w-full accent-[#FFFFFF] cursor-pointer"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 rounded-md border border-white/5 bg-[#1E232D] text-[#D1D5DB] hover:text-[#FFFFFF] text-[10px] font-sans font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-md bg-[#F5F5F5] hover:bg-[#FFFFFF] text-[#0F1115] text-[10px] font-sans font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Watchlist;
