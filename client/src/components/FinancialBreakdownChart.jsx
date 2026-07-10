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
    <div className="p-5 bg-[#111827] border border-[#1F2937] rounded-lg shadow-sm hover:scale-[1.01] transition-all duration-150 flex flex-col h-full animate-fadeInUp">
      <h3 className="text-[10px] font-sans font-bold text-[#94A3B8] uppercase tracking-wider mb-4">
        FINANCIAL BREAKDOWN GRID (MAX 20 / METRIC)
      </h3>
      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#1F2937" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#94A3B8', fontSize: 9, fontFamily: 'Plus Jakarta Sans' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 20]}
              tick={{ fill: '#94A3B8', fontSize: 8, fontFamily: 'Plus Jakarta Sans' }}
              axisLine={false}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.15}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #1F2937',
                borderRadius: '6px',
                color: '#F8FAFC',
                fontFamily: 'Plus Jakarta Sans',
                fontSize: '0.75rem'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-4 border-t border-[#1F2937] text-center">
        <span className="text-[10px] font-sans text-[#94A3B8]">
          AGGREGATED FINANCE SCORE: <span className="text-[#10B981] font-bold">{finalFinancialScore} / 100</span>
        </span>
      </div>
    </div>
  );
};

export default FinancialBreakdownChart;
