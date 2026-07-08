import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ScoreCard } from '../components/ScoreCard.jsx';
import { RecommendationCard } from '../components/RecommendationCard.jsx';
import { StrengthsCard } from '../components/StrengthsCard.jsx';
import { WeaknessCard } from '../components/WeaknessCard.jsx';
import { RiskCard } from '../components/RiskCard.jsx';
import { ReportCard } from '../components/ReportCard.jsx';
import { FinancialBreakdownChart } from '../components/FinancialBreakdownChart.jsx';
import { ScoreComparisonChart } from '../components/ScoreComparisonChart.jsx';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, ArrowLeft, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2, Shield, Eye, Info } from 'lucide-react';

/**
 * Interactive Analytical Dashboard.
 * Integrates charting widgets, list panels, and markdown investment reports.
 */
export const Dashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('financial');

  // Fallback structure in case dashboard loaded directly without search parameters
  const sampleData = {
    companyName: 'Example Inc.',
    ticker: 'EXMPL',
    financialScore: 70,
    newsScore: 60,
    riskScore: 65,
    finalScore: 66,
    recommendation: 'HOLD',
    confidence: 0.8,
    strengths: ['Stable cash reserve metrics', 'Low capital leverage ratios'],
    weaknesses: ['Negative growth ratios', 'High multiple premiums'],
    positiveFactors: ['New tech initiatives announced'],
    negativeFactors: ['Supply chain saturation warnings'],
    risks: ['Pricing pressures from competitors'],
    mitigationFactors: ['Low debt-to-equity cushions'],
    report: '# Example Research Report\nUse the search bar on the home screen to fetch real-time reports.',
    financialData: {
      metrics: {
        currentPrice: 150.0,
        marketCap: 450000000,
        peRatio: 22.5,
        revenueGrowth: -0.05,
        roe: 0.12,
        debtToEquity: 0.35
      },
      historical: [
        { date: '2026-06-01', close: 140 },
        { date: '2026-06-15', close: 145 },
        { date: '2026-07-01', close: 150 }
      ]
    }
  };

  // Extract from react-router navigation location state
  const stateData = location.state?.analysis;
  const analysis = stateData || sampleData;

  const metrics = analysis.financialData?.metrics || {};
  const historicalData = analysis.financialData?.historical || [];
  const reportText = analysis.report || analysis.reasoning || '';
  const isHistoryRecord = !analysis.financialData;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-12 transition-colors duration-300">
      
      {/* Header Panel */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight">{analysis.companyName}</h1>
                {isHistoryRecord && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-900 text-slate-500 border border-slate-250 dark:border-slate-800">
                    <Info className="h-3.5 w-3.5 text-blue-500" />
                    Archived Report
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-400 mt-0.5">
                Ticker Resolved: <span className="text-emerald-500 font-bold">{analysis.ticker}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/10 transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              New Analysis
            </Link>
          </div>
        </div>
      </div>

      {/* Main Layout Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Row 1: Sub-Score Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScoreCard title="Consensus Score" score={analysis.finalScore} type="final" />
          <ScoreCard title="Financial Score" score={analysis.financialScore} type="financial" />
          <ScoreCard title="Sentiment Score" score={analysis.newsScore} type="news" />
          <ScoreCard title="Risk Safety Score" score={analysis.riskScore} type="risk" />
        </div>

        {/* Row 2: Chart & Recommendation Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Recharts Price Trend AreaChart */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-400 uppercase tracking-wide mb-4">
                30-Day Historical Close Price ($)
              </h3>
            </div>
            <div className="h-80 w-full flex items-center justify-center">
              {historicalData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      dy={10}
                    />
                    <YAxis
                      domain={['auto', 'auto']}
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
                      labelClassName="font-semibold text-slate-400"
                    />
                    <Area
                      type="monotone"
                      dataKey="close"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorClose)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center p-6 space-y-2">
                  <BarChart2 className="h-10 w-10 text-slate-350 dark:text-slate-700 mx-auto" />
                  <p className="text-sm text-slate-400 font-semibold">
                    Historical metrics unavailable
                  </p>
                  <p className="text-xs text-slate-400/80 max-w-md">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns: Qualitative Detail Lists */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Core Ratios Quick Bar */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
              <div className="text-center">
                <span className="text-xs font-semibold text-slate-400 block tracking-wide uppercase">PE Ratio</span>
                <span className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">
                  {metrics.peRatio || 'N/A'}
                </span>
              </div>
              <div className="text-center border-x border-slate-100 dark:border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400 block tracking-wide uppercase">YoY Growth</span>
                <span className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">
                  {typeof metrics.revenueGrowth === 'number'
                    ? `${(metrics.revenueGrowth * 100).toFixed(2)}%`
                    : 'N/A'}
                </span>
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold text-slate-400 block tracking-wide uppercase">ROE</span>
                <span className="text-sm sm:text-base font-extrabold text-slate-850 dark:text-slate-200 mt-1 block">
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

            {/* Threat & Risk Card */}
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
  );
};

export default Dashboard;
