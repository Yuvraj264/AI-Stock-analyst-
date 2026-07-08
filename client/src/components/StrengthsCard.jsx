import React from 'react';
import { CheckCircle2, TrendingUp } from 'lucide-react';

/**
 * StrengthsCard Component.
 * Displays financial strengths and positive news sentiment drivers.
 */
export const StrengthsCard = ({ strengths = [], positiveFactors = [], isArchive = false }) => {
  return (
    <div className="p-6 rounded-2xl border border-emerald-100 dark:border-emerald-950 bg-white dark:bg-slate-900 shadow-md transition-all duration-300 hover:shadow-lg">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        Strengths & Positive Drivers
      </h3>

      <div className="space-y-6">
        {/* Core Strengths */}
        <div>
          <h4 className="text-xs font-bold text-emerald-555 dark:text-emerald-400 uppercase tracking-wider mb-3">
            Financial & Operational Strengths
          </h4>
          <ul className="space-y-3">
            {strengths && strengths.length > 0 ? (
              strengths.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-400 dark:text-slate-500 italic list-none">
                {isArchive ? 'Archived: Detailed strengths list not preserved.' : 'No operational strengths identified.'}
              </li>
            )}
          </ul>
        </div>

        {/* Sentiment Drivers */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <h4 className="text-xs font-bold text-emerald-555 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            Market & Sentiment Drivers
          </h4>
          <ul className="space-y-3">
            {positiveFactors && positiveFactors.length > 0 ? (
              positiveFactors.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                  <span className="text-emerald-500 font-extrabold text-xs mt-1">▲</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-400 dark:text-slate-500 italic list-none">
                {isArchive ? 'Archived: Positive drivers list not preserved.' : 'No positive sentiment factors identified.'}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StrengthsCard;
