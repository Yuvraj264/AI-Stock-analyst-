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
    <div className="p-5 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg hover:scale-[1.01] transition-all duration-150 flex flex-col h-full animate-fadeInUp">
      <h3 className="text-[10px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-4">
        Financial Breakdown (Max 20 / Metric)
      </h3>
      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.05)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#9AA4B2', fontSize: 9, fontFamily: 'Inter' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 20]}
              tick={{ fill: '#9AA4B2', fontSize: 8, fontFamily: 'Inter' }}
              axisLine={false}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#F5F5F5"
              fill="#F5F5F5"
              fillOpacity={0.15}
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
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-4 border-t border-white/5 text-center">
        <span className="text-[10px] font-sans text-[#9AA4B2]">
          Aggregated Finance Score: <span className="text-[#F5F5F5] font-bold">{finalFinancialScore} / 100</span>
        </span>
      </div>
    </div>
  );
};

export default FinancialBreakdownChart;
