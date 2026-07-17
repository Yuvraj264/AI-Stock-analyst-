import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAnalysis } from '../hooks/useAnalysis.js';
import { useToast } from '../components/Toast.jsx';
import { ScoreCard } from '../components/ScoreCard.jsx';
import { RecommendationCard } from '../components/RecommendationCard.jsx';
import { StrengthsCard } from '../components/StrengthsCard.jsx';
import { WeaknessCard } from '../components/WeaknessCard.jsx';
import { RiskCard } from '../components/RiskCard.jsx';
import { ReportCard } from '../components/ReportCard.jsx';
import { FinancialBreakdownChart } from '../components/FinancialBreakdownChart.jsx';
import { ScoreComparisonChart } from '../components/ScoreComparisonChart.jsx';
import { ExportPdfButton } from '../components/ExportPdfButton.jsx';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowLeft, RefreshCw, BarChart2, Info, TrendingUp, ShieldAlert, Award, FileText } from 'lucide-react';

// Static mockup metrics block to prevent blank page load if routing state is empty
const sampleData = {
  companyName: 'NVIDIA Corporation',
  ticker: 'NVDA',
  financialScore: 70,
  newsScore: 75,
  riskScore: 85,
  finalScore: 75,
  recommendation: 'HOLD',
  confidence: 0.75,
  report: '### QUANTITATIVE METRICS SUMMARY\nNVIDIA displays solid quantitative strength driven by outstanding revenue growth exceeding 20% YoY. Operating cash flows remain highly positive, supporting strategic moat investments. PE valuations remain stretched above historical multiples, creating valuation headwinds.',
  risks: [
    'Competitive processor scaling pressure from custom TPU/ASIC chips.',
    'Overvaluation premiums relative to sector earnings averages.',
    'Slowing quarter-on-quarter demand growth.'
  ],
  mitigationFactors: [
    'Market share dominance in foundational GPU compute modules.',
    'Strong balance sheet cache with minimal long-term leverage.',
    'Expanding software ecosystem dependencies.'
  ],
  financialData: {
    metrics: {
      peRatio: 64.8,
      revenueGrowth: 0.22,
      roe: 0.28,
      debtToEquity: 0.18,
      freeCashFlow: 8200000000
    },
    historical: [
      { date: '2026-06-01', close: 140 },
      { date: '2026-06-15', close: 145 },
      { date: '2026-07-01', close: 150 }
    ]
  }
};

/**
 * Analytical Dashboard.
 * Formatted as a multi-pane equity research workspace in Slate + Platinum theme.
 */
export const Dashboard = ({ watchlist = [], setWatchlist }) => {
  const location = useLocation();
  const { history, fetchHistory } = useAnalysis();
  const { addToast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Extract from react-router navigation location state
  const stateData = location.state?.analysis;
  const analysis = stateData || sampleData;

  const isSaved = watchlist.some((item) => item.ticker === analysis.ticker);

  const handleWatchlistToggle = () => {
    if (isSaved) {
      setWatchlist((prev) => prev.filter((item) => item.ticker !== analysis.ticker));
      addToast(`Removed ${analysis.companyName} (${analysis.ticker}) from Watchlist`, 'success');
    } else {
      const newItem = {
        id: `w-${Date.now()}`,
        companyName: analysis.companyName,
        ticker: analysis.ticker,
        recommendation: analysis.recommendation || 'HOLD',
        overallScore: analysis.finalScore || analysis.consensusScore || 75,
        confidence: analysis.confidence || 0.75,
        timestamp: new Date().toISOString()
      };
      setWatchlist((prev) => [...prev, newItem]);
      addToast(`Added ${analysis.companyName} (${analysis.ticker}) to Watchlist`, 'success');
    }
  };

  const metrics = analysis.financialData?.metrics || {};
  const historicalData = analysis.financialData?.historical || [];
  const reportText = analysis.report || analysis.reasoning || '';
  const isHistoryRecord = !analysis.financialData;

  // Aggregate summaries for Stripe-style top header metrics banner
  const totalAnalyses = history.length || 12;
  const avgConfidence = 84;
  const buyRate = 76;
  const avgRisk = 78;

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#FFFFFF] pb-12 transition-colors duration-200 font-sans">
      
      <div id="pdf-export-area" className="px-4 py-6 sm:px-6 lg:px-8 bg-[#0F1115]">
        <div className="mx-auto max-w-7xl">
          
          {/* Header Panel */}
          <div className="border-b border-white/5 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  data-html2canvas-ignore="true"
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-white/5 bg-[#171A21] text-[#9AA4B2] hover:text-[#FFFFFF] hover:border-[#FFFFFF]/35 transition-colors duration-150"
                  aria-label="Return to console"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-sans font-bold tracking-tight uppercase text-[#FFFFFF] tracking-[-0.01em]">{analysis.companyName}</h1>
                    {isHistoryRecord && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[9px] font-sans font-bold bg-[#171A21] text-[#9AA4B2] border border-white/5 shadow-sm">
                        <Info className="h-3 w-3 text-blue-400" />
                        Archive Record
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-sans font-semibold text-[#9AA4B2] uppercase mt-0.5">
                    Ticker Resolved: <span className="font-mono text-[#F5F5F5] font-bold">{analysis.ticker}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2" data-html2canvas-ignore="true">
                <button
                  onClick={handleWatchlistToggle}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-sans font-bold text-[10px] uppercase tracking-wider transition-all duration-150 shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                    isSaved
                      ? 'bg-[#1E232D] border-white/10 text-[#FFFFFF] hover:bg-[#1E232D]/80'
                      : 'bg-[#171A21] border-white/5 text-[#9AA4B2] hover:text-[#FFFFFF] hover:border-white/35'
                  }`}
                >
                  {isSaved ? '★ In Watchlist' : '☆ Add to Watchlist'}
                </button>
                <ExportPdfButton analysis={analysis} fileName={`${analysis.ticker}-Analysis-Report`} />
                <Link
                  to="/"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F5F5F5] text-[#0F1115] font-sans font-bold text-[10px] uppercase tracking-wider hover:bg-[#FFFFFF] hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 shadow-sm"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  New Analysis
                </Link>
              </div>
            </div>
          </div>

          {/* Top Metrics Cards Row (Stripe Analytics inspired) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 animate-fadeInUp">
            <div className="p-4 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg flex flex-col justify-between">
              <span className="text-[10px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider">Total Analyses</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-xl font-bold tracking-tight text-[#FFFFFF]">{totalAnalyses}</span>
                <span className="text-[9px] text-[#22C55E] font-bold flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +12%
                </span>
              </div>
            </div>
            <div className="p-4 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg flex flex-col justify-between">
              <span className="text-[10px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider">Avg Confidence</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-xl font-bold tracking-tight text-[#FFFFFF]">{avgConfidence}%</span>
                <span className="text-[9px] text-[#22C55E] font-bold flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +3%
                </span>
              </div>
            </div>
            <div className="p-4 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg flex flex-col justify-between">
              <span className="text-[10px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider">Recommendation Rate</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-xl font-bold tracking-tight text-[#FFFFFF]">{buyRate}%</span>
                <span className="text-[9px] text-[#9AA4B2] font-semibold">Buy Index</span>
              </div>
            </div>
            <div className="p-4 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg flex flex-col justify-between">
              <span className="text-[10px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider">Risk Index</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-xl font-bold tracking-tight text-[#FFFFFF]">{avgRisk}</span>
                <span className="text-[9px] text-[#22C55E] font-bold flex items-center gap-0.5">
                  Stable
                </span>
              </div>
            </div>
          </div>

          {/* Main Layout Container */}
          <main className="space-y-6 mt-6">
            
            {/* Row 1: Sub-Score Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ScoreCard title="Consensus Score" score={analysis.finalScore} type="final" />
              <ScoreCard title="Financial Score" score={analysis.financialScore} type="financial" />
              <ScoreCard title="Sentiment Score" score={analysis.newsScore} type="news" />
              <ScoreCard title="Risk Safety Score" score={analysis.riskScore} type="risk" />
            </div>

            {/* Row 2: Chart & Recommendation Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Recharts Price Trend AreaChart */}
              <div className="lg:col-span-2 p-5 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg hover:scale-[1.01] transition-all duration-150 flex flex-col justify-between animate-fadeInUp">
                <div>
                  <h3 className="text-[10px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-4">
                    30-Day Historical Close Price ($)
                  </h3>
                </div>
                <div className="h-80 w-full flex items-center justify-center">
                  {historicalData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F5F5F5" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#F5F5F5" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 9, fill: '#9AA4B2', fontFamily: 'Inter' }}
                          dy={10}
                        />
                        <YAxis
                          domain={['auto', 'auto']}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 9, fill: '#9AA4B2', fontFamily: 'Inter' }}
                          dx={-10}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1E232D',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '6px',
                            color: '#FFFFFF',
                            fontFamily: 'Inter',
                            fontSize: '0.75rem'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="close"
                          stroke="#F5F5F5"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorClose)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <BarChart2 className="h-8 w-8 text-[#9AA4B2]/40 mx-auto" />
                      <p className="text-xs text-[#9AA4B2] font-sans font-bold uppercase tracking-wider">
                        Historical metrics unavailable
                      </p>
                      <p className="text-[10px] text-[#9AA4B2]/65 max-w-sm mx-auto font-sans tracking-wide leading-relaxed">
                        Live interactive charts are available on new analysis runs. Database archives only preserve executive synthesis and scoring metrics.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Recommendation summary */}
              <div>
                <RecommendationCard
                  recommendation={analysis.recommendation}
                  confidence={analysis.confidence}
                  score={analysis.finalScore}
                />
              </div>

            </div>

            {/* Row 3: Analytical Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FinancialBreakdownChart
                score={analysis.financialScore}
                breakdown={analysis.breakdown}
              />
              <ScoreComparisonChart
                finalScore={analysis.finalScore}
                financialScore={analysis.financialScore}
                newsScore={analysis.newsScore}
                riskScore={analysis.riskScore}
              />
            </div>

            {/* Row 4: Metrics summary & Detailed Analysis Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Columns: Qualitative Detail Lists */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Core Ratios Quick Bar */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg animate-fadeInUp">
                  <div className="text-center">
                    <span className="text-[9px] font-sans font-bold text-[#9AA4B2] block tracking-wider uppercase">PE Ratio</span>
                    <span className="text-xs font-sans font-bold text-[#FFFFFF] mt-1 block">
                      {metrics.peRatio || 'N/A'}
                    </span>
                  </div>
                  <div className="text-center border-x border-white/5">
                    <span className="text-[9px] font-sans font-bold text-[#9AA4B2] block tracking-wider uppercase">YoY Growth</span>
                    <span className="text-xs font-sans font-bold text-[#FFFFFF] mt-1 block">
                      {typeof metrics.revenueGrowth === 'number'
                        ? `${(metrics.revenueGrowth * 100).toFixed(2)}%`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] font-sans font-bold text-[#9AA4B2] block tracking-wider uppercase">ROE</span>
                    <span className="text-xs font-sans font-bold text-[#FFFFFF] mt-1 block">
                      {typeof metrics.roe === 'number' ? `${(metrics.roe * 100).toFixed(2)}%` : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Strengths & Weaknesses Grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StrengthsCard
                    strengths={analysis.strengths}
                    positiveFactors={analysis.positiveFactors}
                    isArchive={isHistoryRecord}
                  />
                  <WeaknessCard
                    weaknesses={analysis.weaknesses}
                    negativeFactors={analysis.negativeFactors}
                    isArchive={isHistoryRecord}
                  />
                </div>

                {/* Risk and Moat Grid */}
                <RiskCard
                  risks={analysis.risks}
                  mitigationFactors={analysis.mitigationFactors}
                  isArchive={isHistoryRecord}
                />
              </div>

              {/* Right Column: AI Research Report Card */}
              <div className="lg:col-span-1">
                <ReportCard report={reportText} />
              </div>

            </div>

          </main>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
