import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

/**
 * FinancialBreakdownChart Component.
 * Visualizes sub-scores (Revenue, Debt, ROE, Cash Flow, Valuation) using a Recharts Radar Chart.
 */
export const FinancialBreakdownChart = ({ score = 0, breakdown }) => {
  const finalFinancialScore = Number(score) || 0;
  const defaultSubScore = Math.round(finalFinancialScore / 5);

  const data = [
    {
      subject: 'Revenue Growth',
      value: breakdown?.revenue !== undefined ? breakdown.revenue : defaultSubScore,
      fullMark: 20
    },
    {
      subject: 'Balance Sheet Debt',
      value: breakdown?.debt !== undefined ? breakdown.debt : defaultSubScore,
      fullMark: 20
    },
    {
      subject: 'Return on Equity',
      value: breakdown?.roe !== undefined ? breakdown.roe : defaultSubScore,
      fullMark: 20
    },
    {
      subject: 'Cash Flow Health',
      value: breakdown?.cashFlow !== undefined ? breakdown.cashFlow : defaultSubScore,
      fullMark: 20
    },
    {
      subject: 'P/E Valuation',
      value: breakdown?.valuation !== undefined ? breakdown.valuation : defaultSubScore,
      fullMark: 20
    }
  ];

  return (
    <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md flex flex-col h-full transition-all duration-300 hover:shadow-lg">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">
        Financial Sub-Score Breakdown (Max 20 per metric)
      </h3>
      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 20]}
              tick={{ fill: '#64748b', fontSize: 9 }}
              axisLine={false}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.25}
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
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 text-center">
        <span className="text-xs text-slate-400 font-medium">
          Total Financial Score: <span className="text-indigo-500 font-bold">{finalFinancialScore} / 100</span>
        </span>
      </div>
    </div>
  );
};

export default FinancialBreakdownChart;
