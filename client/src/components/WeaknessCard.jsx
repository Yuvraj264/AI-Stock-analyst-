import React from 'react';
import { XCircle, TrendingDown } from 'lucide-react';

/**
 * WeaknessCard Component.
 * Displays financial weaknesses and negative news sentiment pressures.
 */
export const WeaknessCard = ({ weaknesses = [], negativeFactors = [], isArchive = false }) => {
  return (
    <div className="p-6 rounded-2xl border border-rose-100 dark:border-rose-955 bg-white dark:bg-slate-900 shadow-md transition-all duration-300 hover:shadow-lg">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
        <XCircle className="h-5 w-5 text-rose-500" />
        Weaknesses & Negative Drivers
      </h3>

      <div className="space-y-6">
        {/* Core Weaknesses */}
        <div>
          <h4 className="text-xs font-bold text-rose-555 dark:text-rose-400 uppercase tracking-wider mb-3">
            Financial & Operational Weaknesses
          </h4>
          <ul className="space-y-3">
            {weaknesses && weaknesses.length > 0 ? (
              weaknesses.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                  <span className="text-rose-500 font-bold mt-0.5">✗</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-400 dark:text-slate-500 italic list-none">
                {isArchive ? 'Archived: Detailed weaknesses list not preserved.' : 'No operational weaknesses identified.'}
              </li>
            )}
          </ul>
        </div>

        {/* Sentiment Pressures */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <h4 className="text-xs font-bold text-rose-555 dark:text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingDown className="h-3.5 w-3.5" />
            Market & Sentiment Pressures
          </h4>
          <ul className="space-y-3">
            {negativeFactors && negativeFactors.length > 0 ? (
              negativeFactors.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                  <span className="text-rose-500 font-extrabold text-xs mt-1">▼</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-400 dark:text-slate-500 italic list-none">
                {isArchive ? 'Archived: Negative factors list not preserved.' : 'No negative sentiment pressures identified.'}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WeaknessCard;
