import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ScoreCard } from '../components/ScoreCard.jsx';
import { RecommendationCard } from '../components/RecommendationCard.jsx';
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

        {/* Row 3: Metrics summary & Qualitative Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns: Qualitative Lists */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden">
            
            {/* Tabs Controller */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <button
                onClick={() => setActiveTab('financial')}
                className={`flex items-center gap-1.5 px-6 py-4 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === 'financial'
                    ? 'border-emerald-500 text-emerald-500 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <BarChart2 className="h-4 w-4" />
                Financial Ratios
              </button>
              <button
                onClick={() => setActiveTab('sentiment')}
                className={`flex items-center gap-1.5 px-6 py-4 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === 'sentiment'
                    ? 'border-emerald-500 text-emerald-500 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Eye className="h-4 w-4" />
                Market Sentiment
              </button>
              <button
                onClick={() => setActiveTab('risks')}
                className={`flex items-center gap-1.5 px-6 py-4 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === 'risks'
                    ? 'border-emerald-500 text-emerald-500 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Shield className="h-4 w-4" />
                Moat & Risks
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6">
              {activeTab === 'financial' && (
                <div className="space-y-6">
                  {/* Financial Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
                      <span className="text-xs font-semibold text-slate-400 block tracking-wide uppercase">PE Ratio</span>
                      <span className="text-lg font-bold text-slate-850 dark:text-slate-200 mt-1 block">
                        {metrics.peRatio || 'N/A'}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
                      <span className="text-xs font-semibold text-slate-400 block tracking-wide uppercase">YoY Growth</span>
                      <span className="text-lg font-bold text-slate-850 dark:text-slate-200 mt-1 block">
                        {typeof metrics.revenueGrowth === 'number'
                          ? `${(metrics.revenueGrowth * 100).toFixed(2)}%`
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
                      <span className="text-xs font-semibold text-slate-400 block tracking-wide uppercase">Return on Equity</span>
                      <span className="text-lg font-bold text-slate-850 dark:text-slate-200 mt-1 block">
                        {typeof metrics.roe === 'number' ? `${(metrics.roe * 100).toFixed(2)}%` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-sm text-emerald-500 uppercase tracking-wider mb-2">Strengths</h4>
                      <ul className="space-y-2">
                        {analysis.strengths && analysis.strengths.length > 0 ? (
                          analysis.strengths.map((s, idx) => (
                            <li key={idx} className="flex gap-2 items-start text-sm text-slate-600 dark:text-slate-400 font-medium">
                              <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                              {s}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-slate-400/85">
                            {isHistoryRecord ? 'Detailed strengths archived.' : 'None identified.'}
                          </li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-rose-500 uppercase tracking-wider mb-2">Weaknesses</h4>
                      <ul className="space-y-2">
                        {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
                          analysis.weaknesses.map((w, idx) => (
                            <li key={idx} className="flex gap-2 items-start text-sm text-slate-600 dark:text-slate-400 font-medium">
                              <span className="text-rose-500 font-bold mt-0.5">✗</span>
                              {w}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-slate-400/85">
                            {isHistoryRecord ? 'Detailed weaknesses archived.' : 'None identified.'}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sentiment' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4">News Catalysts</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-xs font-bold text-emerald-500 uppercase tracking-wide mb-2">Positive Drivers</h5>
                        <ul className="space-y-2">
                          {analysis.positiveFactors && analysis.positiveFactors.length > 0 ? (
                            analysis.positiveFactors.map((f, idx) => (
                              <li key={idx} className="flex gap-2 items-start text-sm text-slate-600 dark:text-slate-400 font-medium">
                                <span className="text-emerald-500 font-bold mt-0.5">▲</span>
                                {f}
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-slate-400/85">
                              {isHistoryRecord ? 'Detailed catalysts archived.' : 'None identified.'}
                            </li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-rose-500 uppercase tracking-wide mb-2">Negative Pressures</h5>
                        <ul className="space-y-2">
                          {analysis.negativeFactors && analysis.negativeFactors.length > 0 ? (
                            analysis.negativeFactors.map((f, idx) => (
                              <li key={idx} className="flex gap-2 items-start text-sm text-slate-600 dark:text-slate-400 font-medium">
                                <span className="text-rose-500 font-bold mt-0.5">▼</span>
                                {f}
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-slate-400/85">
                              {isHistoryRecord ? 'Detailed negative factors archived.' : 'None identified.'}
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'risks' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-sm text-amber-500 uppercase tracking-wider mb-2">Identified Vulnerability Points</h4>
                    <ul className="space-y-2">
                      {analysis.risks && analysis.risks.length > 0 ? (
                        analysis.risks.map((r, idx) => (
                          <li key={idx} className="flex gap-2 items-start text-sm text-slate-600 dark:text-slate-400 font-medium">
                            <span className="text-amber-500 font-bold mt-0.5">⚠</span>
                            {r}
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-slate-400">None identified.</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Markdown executive report viewer */}
          <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md flex flex-col">
            <h3 className="text-base font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-emerald-500" />
              AI Compiled Report
            </h3>
            
            {/* Scrollable Report Content block */}
            <div className="h-[28rem] overflow-y-auto pr-2 text-sm leading-relaxed text-slate-600 dark:text-slate-350 font-medium space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              <div className="prose prose-slate dark:prose-invert max-w-none text-xs">
                {reportText ? (
                  reportText.split('\n').map((line, idx) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={idx} className="text-lg font-black text-slate-900 dark:text-white mt-4 mb-2">{line.replace('# ', '')}</h1>;
                    }
                    if (line.startsWith('## ')) {
                      return <h2 key={idx} className="text-sm font-bold text-slate-855 dark:text-slate-150 mt-4 mb-1.5 uppercase tracking-wide">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('### ')) {
                      return <h3 key={idx} className="text-xs font-bold text-emerald-500 dark:text-emerald-450 mt-3 mb-1 uppercase tracking-wide">{line.replace('### ', '')}</h3>;
                    }
                    if (line.startsWith('* ') || line.startsWith('- ')) {
                      return <li key={idx} className="list-disc list-inside ml-2 py-0.5 text-slate-500 dark:text-slate-400">{line.substring(2)}</li>;
                    }
                    if (line.trim() === '---') {
                      return <hr key={idx} className="border-slate-100 dark:border-slate-800 my-4" />;
                    }
                    return <p key={idx} className="mb-2 text-slate-550 dark:text-slate-400">{line}</p>;
                  })
                ) : (
                  <p className="text-slate-400">No qualitative summary compiled.</p>
                )}
              </div>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
};

export default Dashboard;
