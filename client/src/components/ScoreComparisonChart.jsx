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
    { name: 'Consensus', score: Number(finalScore) || 0, color: '#F5F5F5' }, // Platinum
    { name: 'Financial', score: Number(financialScore) || 0, color: '#B5B5B5' }, // Soft grey
    { name: 'Sentiment', score: Number(newsScore) || 0, color: '#F5F5F5' }, // Platinum
    { name: 'Risk Safety', score: Number(riskScore) || 0, color: '#F59E0B' } // Amber
  ];

  return (
    <div className="p-5 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg hover:scale-[1.01] transition-all duration-150 flex flex-col h-full animate-fadeInUp">
      <h3 className="text-[10px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-4">
        Core Metrics Aggregate Comparison
      </h3>
      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#9AA4B2', fontSize: 10, fontFamily: 'Inter' }}
              dy={10}
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#9AA4B2', fontSize: 9, fontFamily: 'Inter' }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E232D',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontFamily: 'Inter',
                fontSize: '0.75rem'
              }}
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
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
      <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap justify-around gap-2 text-[9px] font-sans font-bold text-[#9AA4B2] uppercase">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-[#F5F5F5]" />
          Consensus
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-[#B5B5B5]" />
          Financial
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-[#F5F5F5]" />
          Sentiment
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-[#F59E0B]" />
          Risk Safety
        </div>
      </div>
    </div>
  );
};

export default ScoreComparisonChart;
