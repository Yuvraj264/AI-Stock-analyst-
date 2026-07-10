import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../hooks/useAnalysis.js';
import { useToast } from '../components/Toast.jsx';
import { ScoreCardSkeleton } from '../components/Skeleton.jsx';
import { ArrowLeft, RefreshCw, FileText, Search, Trash2 } from 'lucide-react';

/**
 * Historical logs viewer page.
 * Formatted as a spreadsheet-like grid with pagination.
 */
export const History = () => {
  const navigate = useNavigate();
  const { history, fetchHistory, deleteAnalysisItem, loading, error } = useAnalysis();
  const { addToast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSelectRecord = (record) => {
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
      financialData: null
    };
    navigate('/dashboard', { state: { analysis: analysisPayload } });
  };

  const handleDeleteRecord = async (e, id, companyName) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the research report for ${companyName}?`)) {
      try {
        await deleteAnalysisItem(id);
        addToast(`Successfully deleted analysis record for ${companyName}.`, 'success');
      } catch (err) {
        addToast(err.message || 'Operational failure: Deletion aborted.', 'error');
      }
    }
  };

  const getRecommendationStyle = (rec) => {
    const r = (rec || 'HOLD').toUpperCase();
    if (r.includes('BUY') || r.includes('INVEST')) {
      return 'text-[#22C55E]';
    }
    if (r.includes('SELL') || r.includes('PASS')) {
      return 'text-[#EF4444]';
    }
    return 'text-[#F59E0B]';
  };

  const filteredHistory = history.filter((record) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      (record.companyName && record.companyName.toLowerCase().includes(term)) ||
      (record.ticker && record.ticker.toLowerCase().includes(term))
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredHistory.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRecords = filteredHistory.slice(startIndex, startIndex + recordsPerPage);

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#FFFFFF] pb-12 transition-colors duration-200 font-sans">
      
      {/* Header Panel */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 animate-fadeIn">
            <button
              onClick={() => navigate('/')}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-white/5 bg-[#171A21] text-[#9AA4B2] hover:text-[#FFFFFF] hover:border-[#FFFFFF]/45 transition-colors duration-150"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-xl font-sans font-bold uppercase tracking-wide tracking-[-0.01em]">Research History Log</h1>
              <p className="text-[10px] font-sans font-semibold text-[#9AA4B2] uppercase mt-0.5">
                Audit data-archives of previously executed stock research reports
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchHistory()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171A21] border border-white/5 text-[10px] font-sans font-bold uppercase tracking-wider text-[#D1D5DB] hover:text-[#FFFFFF] hover:border-[#FFFFFF]/45 transition-all duration-150 cursor-pointer shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative animate-fadeIn">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="h-4 w-4 text-[#9AA4B2]/60" />
          </span>
          <input
            type="text"
            placeholder="Filter records by ticker symbol or company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-white/5 bg-[#171A21] focus:outline-none focus:border-[#F5F5F5]/30 text-[#FFFFFF] text-xs font-sans tracking-wide uppercase shadow-sm"
          />
        </div>
      </div>

      {/* Main Table Body */}
      <main className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        {loading && history.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScoreCardSkeleton />
            <ScoreCardSkeleton />
            <ScoreCardSkeleton />
          </div>
        ) : error ? (
          <div className="p-3 bg-[#171A21] border border-[#EF4444]/30 text-[#EF4444] font-mono text-xs text-center uppercase tracking-wider rounded-md">
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#171A21] border border-white/5 p-8 max-w-md mx-auto rounded-xl text-center shadow-sm animate-fadeInUp">
            <FileText className="h-10 w-10 text-[#9AA4B2]/40 mb-4" />
            <h3 className="text-xs font-sans font-bold text-[#FFFFFF] uppercase tracking-wider">No research logs compiled</h3>
            <p className="text-[10px] text-[#9AA4B2] font-sans tracking-wide leading-relaxed mt-2">
              Execute analytical runs from the terminal command line to save reports.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-4 py-2 rounded-md bg-[#F5F5F5] text-[#0F1115] font-sans font-bold text-[10px] uppercase tracking-wider hover:bg-[#FFFFFF] transition-colors cursor-pointer shadow-sm"
            >
              Analyze Stock
            </button>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-xs font-sans text-[#9AA4B2]/60 uppercase tracking-widest">No matching record resolved.</span>
          </div>
        ) : (
          /* Spreadsheet Table Grid Layout */
          <div className="w-full overflow-hidden border border-white/5 bg-[#171A21] rounded-xl shadow-sm animate-fadeInUp">
            <table className="w-full border-collapse text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/5 bg-[#0F1115]/40 text-[#9AA4B2] font-bold uppercase tracking-wider">
                  <th className="p-4 text-[10px]">Ticker</th>
                  <th className="p-4 text-[10px]">Company Name</th>
                  <th className="p-4 text-[10px]">Signal</th>
                  <th className="p-4 text-[10px] text-center">Consensus</th>
                  <th className="p-4 text-[10px] text-center">Finance</th>
                  <th className="p-4 text-[10px] text-center">Risk Safety</th>
                  <th className="p-4 text-[10px]">Date Resolved</th>
                  <th className="p-4 text-[10px] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#9AA4B2] font-medium">
                {paginatedRecords.map((record) => {
                  const formattedDate = new Date(record.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <tr
                      key={record._id}
                      onClick={() => handleSelectRecord(record)}
                      className="hover:bg-[#0F1115]/30 cursor-pointer transition-colors duration-100"
                    >
                      <td className="p-4 font-mono font-bold text-[#F5F5F5]">{record.ticker}</td>
                      <td className="p-4 font-semibold text-[#FFFFFF] truncate max-w-[200px]">
                        {record.companyName}
                      </td>
                      <td className={`p-4 font-bold ${getRecommendationStyle(record.recommendation)}`}>
                        {record.recommendation}
                      </td>
                      <td className="p-4 text-center font-semibold text-[#FFFFFF]">{record.finalScore}</td>
                      <td className="p-4 text-center text-[#D1D5DB]">{record.financialScore}</td>
                      <td className="p-4 text-center text-[#D1D5DB]">{record.riskScore}</td>
                      <td className="p-4 text-[#D1D5DB]/85">{formattedDate}</td>
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => handleSelectRecord(record)}
                            className="px-2.5 py-1.5 border border-white/5 bg-[#0F1115] text-[#D1D5DB] hover:text-[#FFFFFF] hover:border-[#FFFFFF]/45 rounded-md transition-all text-[9px] font-sans uppercase font-bold cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            onClick={(e) => handleDeleteRecord(e, record._id, record.companyName)}
                            className="p-1.5 border border-white/5 bg-[#0F1115] text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-md transition-all text-[9px] cursor-pointer"
                            title="Delete Report"
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-white/5 bg-[#171A21]">
                <span className="text-[10px] font-sans font-semibold text-[#9AA4B2] uppercase">
                  Page {currentPage} of {totalPages} ({filteredHistory.length} entries)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-3 py-1 rounded-md text-[10px] font-sans font-bold uppercase tracking-wider bg-[#0F1115] border border-white/5 text-[#D1D5DB] hover:text-[#FFFFFF] hover:border-white/35 disabled:opacity-50 disabled:hover:text-[#9AA4B2] disabled:hover:border-white/5 transition-all duration-150 cursor-pointer"
                  >
                    Prev
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1 rounded-md text-[10px] font-sans font-bold uppercase tracking-wider bg-[#0F1115] border border-white/5 text-[#D1D5DB] hover:text-[#FFFFFF] hover:border-white/35 disabled:opacity-50 disabled:hover:text-[#9AA4B2] disabled:hover:border-white/5 transition-all duration-150 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

    </div>
  );
};

export default History;
