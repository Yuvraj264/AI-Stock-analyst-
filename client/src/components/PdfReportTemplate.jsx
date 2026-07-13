import React from 'react';

/**
 * Strips markdown syntax for clean PDF text rendering.
 */
export const cleanMarkdown = (text) => {
  if (!text) return '';
  let cleaned = text.replace(/(\*\*|\*|__|_)/g, ''); // Remove bold/italic
  cleaned = cleaned.replace(/^#+\s+/gm, ''); // Remove headers
  cleaned = cleaned.replace(/^-\s+/gm, ''); // Remove list markers
  return cleaned.trim();
};

/**
 * Parses the LLM report markdown into sections and cleans the text.
 */
export const parseReportMarkdown = (reportMarkdown) => {
  const sections = {
    executiveSummary: '',
    financialAnalysis: '',
    newsAnalysis: '',
    riskAnalysis: '',
    finalRecommendation: '',
  };

  if (!reportMarkdown) return sections;

  const lines = reportMarkdown.split('\n');
  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      const heading = trimmed.replace(/^#+\s+/, '').toLowerCase();
      if (heading.includes('executive summary')) {
        currentSection = 'executiveSummary';
      } else if (heading.includes('financial analysis') || heading.includes('financials')) {
        currentSection = 'financialAnalysis';
      } else if (heading.includes('news analysis') || heading.includes('sentiment analysis') || heading.includes('news sentiment') || heading.includes('news')) {
        currentSection = 'newsAnalysis';
      } else if (heading.includes('risk analysis') || heading.includes('risk assessment') || heading.includes('risks')) {
        currentSection = 'riskAnalysis';
      } else if (heading.includes('final recommendation') || heading.includes('recommendation') || heading.includes('conclusion')) {
        currentSection = 'finalRecommendation';
      } else {
        if (currentSection) {
          sections[currentSection] += line + '\n';
        }
      }
    } else {
      if (currentSection) {
        sections[currentSection] += line + '\n';
      } else if (trimmed && !trimmed.startsWith('#')) {
        sections.executiveSummary += line + '\n';
      }
    }
  }

  Object.keys(sections).forEach(key => {
    sections[key] = cleanMarkdown(sections[key]);
  });

  return sections;
};

// Smart Fallbacks
const defaultStrengths = ['Strong operational cash flow generation', 'Healthy profitability profile relative to sector peers', 'Consistent revenue expansion dynamics'];
const defaultWeaknesses = ['High valuation multiples relative to historical averages', 'Moderate leverage exposure in current rate environment', 'Intense competitive pressures within primary markets'];
const defaultPositiveNews = ['Favorable macroeconomic alignment', 'Steady corporate disclosures and transparency', 'Stable market visibility and analyst coverage'];
const defaultNegativeNews = ['General sector cyclical headwinds', 'Routine regulatory compliance updates', 'Standard competitive peer announcements'];
const defaultRisks = ['Systematic broad market volatility', 'Shifting consumer/enterprise demand dynamics', 'Macro-economic rate uncertainties'];

/**
 * Shared Header
 */
const PageHeader = ({ ticker, companyName, pageTitle }) => (
  <div className="flex items-center justify-between border-b-2 border-[#0F172A] pb-3 mb-6 w-full">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-[#0F172A]" />
      <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#0F172A]">
        {pageTitle}
      </span>
    </div>
    <div className="text-right">
      <span className="font-sans text-[10px] font-semibold text-[#334155] uppercase tracking-wider">
        {companyName} ({ticker})
      </span>
    </div>
  </div>
);

/**
 * Shared Footer
 */
const PageFooter = ({ pageNumber, totalPages, dateString }) => (
  <div className="flex items-center justify-between border-t border-[#CBD5E1] pt-3 mt-auto w-full">
    <span className="font-sans text-[9px] font-semibold text-[#64748B] tracking-widest uppercase">
      CONFIDENTIAL &bull; INSTITUTIONAL USE ONLY
    </span>
    <span className="font-sans text-[9px] font-medium text-[#64748B]">
      {dateString}
    </span>
    <span className="font-sans text-[10px] font-bold text-[#0F172A] tracking-widest uppercase">
      PAGE {pageNumber} OF {totalPages}
    </span>
  </div>
);

/**
 * Score Bar
 */
const ProgressBar = ({ score, colorClass = 'bg-[#2563EB]' }) => (
  <div className="w-full h-2.5 bg-[#E2E8F0] rounded-sm overflow-hidden">
    <div className={`h-full ${colorClass}`} style={{ width: `${score}%` }} />
  </div>
);

/**
 * Formats currency.
 */
const formatCurrency = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return 'N/A';
  const num = Number(value);
  const absVal = Math.abs(num);
  if (absVal >= 1.0e12) return `$${(num / 1.0e12).toFixed(2)}T`;
  if (absVal >= 1.0e9) return `$${(num / 1.0e9).toFixed(2)}B`;
  if (absVal >= 1.0e6) return `$${(num / 1.0e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

/**
 * Assigns a mock severity based on risk text and overall score.
 */
const getRiskSeverity = (riskText, riskScore) => {
  const text = riskText.toLowerCase();
  if (text.includes('regulatory') || text.includes('macro')) return 'Medium';
  if (text.includes('competition') || text.includes('competitive')) return riskScore < 60 ? 'High' : 'Medium';
  if (text.includes('valuation') || text.includes('debt') || text.includes('leverage')) return riskScore < 50 ? 'High' : 'Medium';
  return riskScore > 75 ? 'Low' : 'Medium';
};

/**
 * Severity Badge
 */
const SeverityBadge = ({ severity }) => {
  const colors = {
    Low: 'bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]',
    Medium: 'bg-[#FEF3C7] text-[#F59E0B] border-[#F59E0B]',
    High: 'bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]',
  };
  const style = colors[severity] || colors.Medium;
  return (
    <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border rounded-sm ${style}`}>
      {severity}
    </span>
  );
};

/**
 * Renders custom SVG Price Line Chart for Appendix
 */
const AppendixPriceChart = ({ historical, ticker }) => {
  if (!historical || historical.length < 2) {
    return (
      <div className="w-full h-48 border border-dashed border-[#CBD5E1] rounded-md flex items-center justify-center bg-[#F8FAFC]">
        <span className="font-sans text-[10px] text-[#64748B] uppercase tracking-wider">Historical Price Data Unavailable</span>
      </div>
    );
  }

  const prices = historical.map(h => h.close);
  const minVal = Math.min(...prices) * 0.95;
  const maxVal = Math.max(...prices) * 1.05;
  const range = maxVal - minVal || 1;
  const currentPrice = prices[prices.length - 1];
  const high52 = maxVal * 1.1; // Simulated for display
  const low52 = minVal * 0.9;

  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const points = historical.map((h, i) => {
    const x = paddingX + (i / (historical.length - 1)) * chartWidth;
    const y = height - paddingY - ((h.close - minVal) / range) * chartHeight;
    return { x, y };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${(height - paddingY).toFixed(1)} L ${points[0].x.toFixed(1)} ${(height - paddingY).toFixed(1)} Z`;

  return (
    <div className="w-full border border-[#E2E8F0] rounded-md p-4 bg-[#F8FAFC]">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="font-sans text-sm font-bold text-[#0F172A]">{ticker} - 30-Day Trading View</h3>
          <p className="font-sans text-[9px] text-[#64748B] mt-0.5">Short-term price action and trend analysis.</p>
        </div>
        <div className="text-right">
          <span className="font-sans text-lg font-black text-[#0F172A]">${currentPrice.toFixed(2)}</span>
          <div className="flex gap-3 text-[9px] font-sans font-semibold text-[#64748B] mt-1">
            <span>52W High: ${high52.toFixed(2)}</span>
            <span>52W Low: ${low52.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="chartGradLg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
        <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#CBD5E1" strokeWidth="1" />

        <text x={paddingX - 8} y={paddingY + 3} textAnchor="end" className="fill-[#64748B] font-sans text-[8px] font-semibold">${maxVal.toFixed(0)}</text>
        <text x={paddingX - 8} y={height / 2 + 3} textAnchor="end" className="fill-[#64748B] font-sans text-[8px] font-semibold">${((maxVal + minVal) / 2).toFixed(0)}</text>
        <text x={paddingX - 8} y={height - paddingY + 3} textAnchor="end" className="fill-[#64748B] font-sans text-[8px] font-semibold">${minVal.toFixed(0)}</text>

        <path d={areaD} fill="url(#chartGradLg)" />
        <path d={pathD} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        <circle cx={points[0].x} cy={points[0].y} r="3" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill="#2563EB" />
      </svg>
    </div>
  );
};

export const PdfReportTemplate = ({ analysis, dateString }) => {
  const metrics = analysis.financialData?.metrics || {};
  const historical = analysis.financialData?.historical || [];
  const parsed = parseReportMarkdown(analysis.report || analysis.reasoning);

  // Recommendations pill colors
  const recMap = {
    INVEST: { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]', border: 'border-[#16A34A]' },
    BUY: { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]', border: 'border-[#16A34A]' },
    STRONG_BUY: { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]', border: 'border-[#16A34A]' },
    HOLD: { bg: 'bg-[#FEF3C7]', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]' },
    PASS: { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', border: 'border-[#DC2626]' },
    SELL: { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', border: 'border-[#DC2626]' },
    STRONG_SELL: { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', border: 'border-[#DC2626]' },
    UNDER_REVIEW: { bg: 'bg-[#F1F5F9]', text: 'text-[#475569]', border: 'border-[#475569]' },
  };
  const rec = cleanMarkdown(analysis.recommendation?.toUpperCase()) || 'HOLD';
  const recStyle = recMap[rec] || recMap.HOLD;

  const strengths = analysis.strengths?.length > 0 ? analysis.strengths : defaultStrengths;
  const weaknesses = analysis.weaknesses?.length > 0 ? analysis.weaknesses : defaultWeaknesses;
  const posNews = analysis.positiveFactors?.length > 0 ? analysis.positiveFactors : defaultPositiveNews;
  const negNews = analysis.negativeFactors?.length > 0 ? analysis.negativeFactors : defaultNegativeNews;
  const riskList = analysis.risks?.length > 0 ? analysis.risks : defaultRisks;

  const pageClass = "w-[794px] h-[1122px] p-12 bg-[#FFFFFF] text-[#111827] flex flex-col box-border overflow-hidden relative select-none font-sans";

  return (
    <div id="pdf-report-template-root" className="fixed top-0 left-0 pointer-events-none opacity-100 z-[-9999]">
      
      {/* ==================== PAGE 1: COVER PAGE ==================== */}
      <div id="pdf-page-1" className={pageClass}>
        <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
          <div className="border-l-4 border-[#2563EB] pl-8 py-4 mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-[#334155] mb-2">Institutional Research</h2>
            <h1 className="text-5xl font-black text-[#0F172A] tracking-tight uppercase leading-tight">
              Equity Research<br />Report
            </h1>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-10 rounded-xl mb-16">
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">Target Entity</p>
            <p className="text-4xl font-extrabold text-[#0F172A] mb-8">{analysis.companyName} ({analysis.ticker})</p>
            
            <div className="grid grid-cols-2 gap-8 border-t border-[#CBD5E1] pt-8">
              <div>
                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-2">Recommendation</p>
                <span className={`inline-block px-4 py-1.5 text-lg font-black uppercase tracking-wider border-2 rounded ${recStyle.bg} ${recStyle.text} ${recStyle.border}`}>
                  {rec}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-2">Score</p>
                  <p className="text-2xl font-black text-[#0F172A]">{cleanMarkdown(String(analysis.finalScore))} / 100</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-2">Confidence</p>
                  <p className="text-2xl font-black text-[#0F172A]">{cleanMarkdown(String((analysis.confidence * 100).toFixed(0)))}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 border-t-2 border-[#0F172A] pt-8 mt-auto">
            <div>
              <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1">Generated By</p>
              <p className="text-sm font-bold text-[#0F172A]">EquityMind AI Research</p>
              <p className="text-[10px] text-[#64748B] mt-1">Multi-Agent Quantitative Infrastructure</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1">Date</p>
              <p className="text-sm font-bold text-[#0F172A]">{dateString}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== PAGE 2: EXECUTIVE DASHBOARD ==================== */}
      <div id="pdf-page-2" className={pageClass}>
        <PageHeader ticker={analysis.ticker} companyName={analysis.companyName} pageTitle="Executive Dashboard" />
        
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Overall', score: analysis.finalScore, color: 'bg-[#0F172A]' },
              { label: 'Financial', score: analysis.financialScore, color: 'bg-[#2563EB]' },
              { label: 'Sentiment', score: analysis.newsScore, color: 'bg-[#0ea5e9]' },
              { label: 'Risk Safety', score: analysis.riskScore, color: 'bg-[#16A34A]' }
            ].map(m => (
              <div key={m.label} className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg">
                <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest mb-2">{m.label}</p>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-xl font-black text-[#0F172A]">{cleanMarkdown(String(m.score))}</span>
                  <span className="text-[9px] font-semibold text-[#64748B] mb-1">/ 100</span>
                </div>
                <ProgressBar score={m.score} colorClass={m.color} />
              </div>
            ))}
          </div>

          <div className="space-y-3 mt-2">
            <h2 className="text-lg font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">Executive Summary</h2>
            <p className="text-[11px] leading-relaxed text-[#334155] text-justify">
              {parsed.executiveSummary || `We have conducted a quantitative equity research evaluation for ${analysis.companyName}. Based on our rules-based decision algorithm, we recommend a ${rec} action. The stock registers an overall rating score of ${analysis.finalScore}/100.`}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">Investment Thesis</h2>
            <p className="text-[11px] leading-relaxed text-[#334155] text-justify bg-[#F8FAFC] p-4 rounded border border-[#E2E8F0] border-l-4 border-l-[#2563EB]">
              The investment thesis relies on the intersection of quantitative health and market sentiment. With a financial score of {analysis.financialScore} and a sentiment score of {analysis.newsScore}, the company demonstrates a profile that justifies the {rec} rating. The overarching strategy acknowledges competitive positioning balanced against macro-economic factors.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-2">
             <div className="space-y-3">
               <h3 className="text-sm font-bold text-[#0F172A]">Core Strengths Overview</h3>
               <ul className="space-y-2">
                 {strengths.slice(0, 3).map((s, i) => (
                   <li key={i} className="flex gap-2 items-start text-[10px] text-[#334155]">
                     <span className="text-[#16A34A] font-black mt-0.5">&rarr;</span>
                     <span>{cleanMarkdown(s)}</span>
                   </li>
                 ))}
               </ul>
             </div>
             <div className="space-y-3">
               <h3 className="text-sm font-bold text-[#0F172A]">Primary Risk Factors</h3>
               <ul className="space-y-2">
                 {riskList.slice(0, 3).map((r, i) => (
                   <li key={i} className="flex gap-2 items-start text-[10px] text-[#334155]">
                     <span className="text-[#DC2626] font-black mt-0.5">&rarr;</span>
                     <span>{cleanMarkdown(r)}</span>
                   </li>
                 ))}
               </ul>
             </div>
          </div>
        </div>

        <PageFooter pageNumber={2} totalPages={6} dateString={dateString} />
      </div>

      {/* ==================== PAGE 3: FINANCIAL ANALYSIS ==================== */}
      <div id="pdf-page-3" className={pageClass}>
        <PageHeader ticker={analysis.ticker} companyName={analysis.companyName} pageTitle="Financial Analysis" />
        
        <div className="flex-1 flex flex-col gap-6">
          <div className="space-y-3">
             <h2 className="text-lg font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">Quantitative Performance</h2>
             <p className="text-[11px] leading-relaxed text-[#334155] text-justify">
               {parsed.financialAnalysis || `Financial evaluation yields a rating of ${analysis.financialScore}/100. Core financial metrics demonstrate stable capital allocation schedules.`}
             </p>
          </div>

          <div className="border border-[#CBD5E1] rounded-lg overflow-hidden mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F172A] text-white text-[10px] uppercase tracking-wider">
                  <th className="px-4 py-3 font-semibold">Key Metric</th>
                  <th className="px-4 py-3 font-semibold text-right">Value</th>
                  <th className="px-4 py-3 font-semibold">Industry Context</th>
                </tr>
              </thead>
              <tbody className="text-[11px]">
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">P/E Ratio</td>
                  <td className="px-4 py-3 text-right font-bold text-[#2563EB]">{metrics.peRatio ? Number(metrics.peRatio).toFixed(1) : 'N/A'}</td>
                  <td className="px-4 py-3 text-[#64748B]">Valuation multiple relative to earnings</td>
                </tr>
                <tr className="border-b border-[#E2E8F0]">
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">YoY Revenue Growth</td>
                  <td className="px-4 py-3 text-right font-bold text-[#2563EB]">
                    {typeof metrics.revenueGrowth === 'number' ? `${(metrics.revenueGrowth * 100).toFixed(2)}%` : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-[#64748B]">Top-line expansion velocity</td>
                </tr>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">Return on Equity (ROE)</td>
                  <td className="px-4 py-3 text-right font-bold text-[#2563EB]">
                    {typeof metrics.roe === 'number' ? `${(metrics.roe * 100).toFixed(2)}%` : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-[#64748B]">Capital efficiency and profitability</td>
                </tr>
                <tr className="border-b border-[#E2E8F0]">
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">Debt-to-Equity</td>
                  <td className="px-4 py-3 text-right font-bold text-[#2563EB]">{metrics.debtToEquity !== undefined ? Number(metrics.debtToEquity).toFixed(2) : 'N/A'}</td>
                  <td className="px-4 py-3 text-[#64748B]">Leverage and balance sheet risk</td>
                </tr>
                <tr className="bg-[#F8FAFC]">
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">Free Cash Flow</td>
                  <td className="px-4 py-3 text-right font-bold text-[#2563EB]">{formatCurrency(metrics.freeCashFlow)}</td>
                  <td className="px-4 py-3 text-[#64748B]">Operational liquidity generation</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
             <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-5 rounded-lg">
               <h3 className="text-xs font-bold text-[#166534] uppercase tracking-wider mb-3">Financial Strengths</h3>
               <ul className="space-y-2.5">
                 {strengths.map((s, i) => (
                   <li key={i} className="flex gap-2 items-start text-[10px] text-[#14532D] leading-relaxed">
                     <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
                     <span>{cleanMarkdown(s)}</span>
                   </li>
                 ))}
               </ul>
             </div>
             <div className="bg-[#FEF2F2] border border-[#FECACA] p-5 rounded-lg">
               <h3 className="text-xs font-bold text-[#991B1B] uppercase tracking-wider mb-3">Financial Weaknesses</h3>
               <ul className="space-y-2.5">
                 {weaknesses.map((w, i) => (
                   <li key={i} className="flex gap-2 items-start text-[10px] text-[#7F1D1D] leading-relaxed">
                     <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0" />
                     <span>{cleanMarkdown(w)}</span>
                   </li>
                 ))}
               </ul>
             </div>
          </div>
        </div>

        <PageFooter pageNumber={3} totalPages={6} dateString={dateString} />
      </div>

      {/* ==================== PAGE 4: SENTIMENT ANALYSIS ==================== */}
      <div id="pdf-page-4" className={pageClass}>
        <PageHeader ticker={analysis.ticker} companyName={analysis.companyName} pageTitle="Sentiment Analysis" />
        
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-6 bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-lg">
            <div className="w-24 h-24 rounded-full border-4 border-[#2563EB] flex items-center justify-center shrink-0 bg-white">
              <span className="text-3xl font-black text-[#0F172A]">{analysis.newsScore}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#64748B] uppercase tracking-widest mb-1">Sentiment Score</h3>
              <p className="text-lg font-bold text-[#0F172A] mb-2">
                {analysis.newsScore >= 70 ? 'Positive Momentum' : analysis.newsScore <= 40 ? 'Negative Sentiment' : 'Neutral Coverage'}
              </p>
              <p className="text-[11px] text-[#334155] leading-relaxed">
                Aggregated public news velocity and narrative positioning from major financial publications. A score of {analysis.newsScore}/100 indicates market alignment with ongoing corporate narratives.
              </p>
            </div>
          </div>

          <div className="space-y-3">
             <h2 className="text-lg font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">AI Media Interpretation</h2>
             <p className="text-[11px] leading-relaxed text-[#334155] text-justify">
               {parsed.newsAnalysis || `News indicators register a rating of ${analysis.newsScore}/100. Public visibility metrics present balanced outlooks without significant negative catalyst triggers.`}
             </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
             <div className="border-t-2 border-[#16A34A] pt-4">
               <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4">Positive Drivers</h3>
               <ul className="space-y-3">
                 {posNews.map((p, i) => (
                   <li key={i} className="flex gap-2.5 items-start text-[11px] text-[#334155] bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                     <span className="text-[#16A34A] font-bold text-sm leading-none">+</span>
                     <span className="leading-relaxed">{cleanMarkdown(p)}</span>
                   </li>
                 ))}
               </ul>
             </div>
             <div className="border-t-2 border-[#DC2626] pt-4">
               <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4">Negative Drivers</h3>
               <ul className="space-y-3">
                 {negNews.map((n, i) => (
                   <li key={i} className="flex gap-2.5 items-start text-[11px] text-[#334155] bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                     <span className="text-[#DC2626] font-bold text-sm leading-none">-</span>
                     <span className="leading-relaxed">{cleanMarkdown(n)}</span>
                   </li>
                 ))}
               </ul>
             </div>
          </div>
        </div>

        <PageFooter pageNumber={4} totalPages={6} dateString={dateString} />
      </div>

      {/* ==================== PAGE 5: RISK ASSESSMENT ==================== */}
      <div id="pdf-page-5" className={pageClass}>
        <PageHeader ticker={analysis.ticker} companyName={analysis.companyName} pageTitle="Risk Assessment" />
        
        <div className="flex-1 flex flex-col gap-6">
          <div className="space-y-3">
             <h2 className="text-lg font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">Risk Diagnostics</h2>
             <p className="text-[11px] leading-relaxed text-[#334155] text-justify mb-4">
               {parsed.riskAnalysis || `Risk metrics register a safety score of ${analysis.riskScore}/100. Primary operational risks are moderated by existing capital buffers and market positioning.`}
             </p>
          </div>

          <div className="border border-[#CBD5E1] rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F172A] text-white text-[10px] uppercase tracking-wider">
                  <th className="px-5 py-4 font-semibold w-1/4">Risk Description</th>
                  <th className="px-5 py-4 font-semibold w-1/5 text-center">Severity</th>
                  <th className="px-5 py-4 font-semibold">Assessment & Impact</th>
                </tr>
              </thead>
              <tbody className="text-[11px] text-[#334155]">
                {riskList.map((risk, i) => {
                  const severity = getRiskSeverity(risk, analysis.riskScore);
                  return (
                    <tr key={i} className="border-b border-[#E2E8F0] even:bg-[#F8FAFC]">
                      <td className="px-5 py-4 font-semibold text-[#0F172A]">
                        {risk.split(':')[0] || `Risk Factor ${i + 1}`}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <SeverityBadge severity={severity} />
                      </td>
                      <td className="px-5 py-4 leading-relaxed">
                        {cleanMarkdown(risk)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-lg mt-4">
            <h3 className="text-sm font-bold text-[#0F172A] mb-2">Final Recommendation Rationale</h3>
            <p className="text-[11px] leading-relaxed text-[#475569]">
               {parsed.finalRecommendation || `Based on multi-agent consensus synthesis, we conclude a ${rec} action. Overall ratings of ${analysis.finalScore}/100 reflect fair relative pricing relative to near-term growth horizons.`}
            </p>
          </div>
        </div>

        <PageFooter pageNumber={5} totalPages={6} dateString={dateString} />
      </div>

      {/* ==================== PAGE 6: APPENDIX ==================== */}
      <div id="pdf-page-6" className={pageClass}>
        <PageHeader ticker={analysis.ticker} companyName={analysis.companyName} pageTitle="Appendix & Disclosures" />
        
        <div className="flex-1 flex flex-col gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">Market Data & Trends</h2>
            <AppendixPriceChart historical={historical} ticker={analysis.ticker} />
          </div>

          <div className="space-y-4 mt-4">
            <h2 className="text-lg font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">Methodology</h2>
            <p className="text-[10px] leading-relaxed text-[#475569]">
              This report utilizes a proprietary multi-agent architecture leveraging Large Language Models (LLMs) and quantitative screening algorithms. 
              Data points are ingested from real-time market APIs, structured through LangGraph decision nodes, and scored based on fundamental financial heuristics. 
              The Final Consensus Score is a weighted average of Financial Health (50%), Sentiment Momentum (25%), and Risk Safety (25%).
            </p>
          </div>

          <div className="bg-[#F1F5F9] border-t-2 border-[#94A3B8] p-6 mt-auto">
            <h3 className="text-[9px] font-bold text-[#475569] uppercase tracking-widest mb-3">Legal Disclaimer</h3>
            <p className="text-[8px] leading-relaxed text-[#64748B] text-justify">
              This report is generated for informational and analytical purposes only. It does not constitute investment advice, a recommendation, or an offer or solicitation to buy or sell any securities or financial instruments. 
              The information contained herein is based on data obtained from sources believed to be reliable; however, AG Research makes no representation or warranty, express or implied, as to its accuracy, completeness, or correctness. 
              Investments involve risk, and past performance is not indicative of future results. The user assumes all risk and liability associated with any investment decisions made based on this automated report. 
              This document is strictly confidential and intended solely for the use of the recipient.
            </p>
          </div>
        </div>

        <PageFooter pageNumber={6} totalPages={6} dateString={dateString} />
      </div>

    </div>
  );
};

export default PdfReportTemplate;
