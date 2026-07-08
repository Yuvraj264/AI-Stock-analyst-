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
 * Visualizes the comparison of core scores (Consensus, Financial, Sentiment, Risk Safety) using a Recharts Bar Chart.
 */
export const ScoreComparisonChart = ({ finalScore = 0, financialScore = 0, newsScore = 0, riskScore = 0 }) => {
  const data = [
    { name: 'Consensus', score: Number(finalScore) || 0, color: '#10b981' }, // Emerald
    { name: 'Financial', score: Number(financialScore) || 0, color: '#3b82f6' }, // Blue
    { name: 'Sentiment', score: Number(newsScore) || 0, color: '#6366f1' }, // Indigo
    { name: 'Risk Safety', score: Number(riskScore) || 0, color: '#f59e0b' } // Amber
  ];

  return (
    <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md flex flex-col h-full transition-all duration-300 hover:shadow-lg">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">
        Core Metric Scores Comparison
      </h3>
      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 10 }}
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
              cursor={{ fill: 'rgba(241, 245, 249, 0.15)' }}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={45}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-around text-[10px] sm:text-xs font-semibold text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Consensus
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          Financial
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
          Sentiment
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          Risk Safety
        </div>
      </div>
    </div>
  );
};

export default ScoreComparisonChart;
