import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

/**
 * ScoreComparisonChart Component.
 * Visualizes core scores comparison inside a clean, high-contrast terminal pane.
 */
export const ScoreComparisonChart = ({ finalScore = 0, financialScore = 0, newsScore = 0, riskScore = 0 }) => {
  const data = [
    { name: 'Consensus', score: Number(finalScore) || 0, color: '#10B981' }, // Emerald
    { name: 'Financial', score: Number(financialScore) || 0, color: '#3b82f6' }, // Blue
    { name: 'Sentiment', score: Number(newsScore) || 0, color: '#6366f1' }, // Indigo
    { name: 'Risk Safety', score: Number(riskScore) || 0, color: '#F59E0B' } // Amber
  ];

  return (
    <div className="p-5 bg-[#111827] border border-[#1F2937] rounded-lg shadow-sm hover:scale-[1.01] transition-all duration-150 flex flex-col h-full animate-fadeInUp">
      <h3 className="text-[10px] font-sans font-bold text-[#94A3B8] uppercase tracking-wider mb-4">
        CORE METRICS AGGREGATE COMPARISON
      </h3>
      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'Plus Jakarta Sans' }}
              dy={10}
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94A3B8', fontSize: 9, fontFamily: 'Plus Jakarta Sans' }}
              dx={-10}
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
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={45}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend Block */}
      <div className="mt-4 pt-4 border-t border-[#1F2937] flex flex-wrap justify-around gap-2 text-[9px] font-mono text-[#94A3B8] uppercase">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-sm bg-[#10B981]" />
          Consensus
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-sm bg-blue-500" />
          Financial
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-sm bg-indigo-500" />
          Sentiment
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-sm bg-[#F59E0B]" />
          Risk Safety
        </div>
      </div>
    </div>
  );
};

export default ScoreComparisonChart;
