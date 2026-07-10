import React from 'react';
import { ShieldAlert, TrendingDown } from 'lucide-react';

/**
 * WeaknessCard Component.
 * Styled as a qualitative headwinds tracker inside the research workspace.
 */
export const WeaknessCard = ({ weaknesses = [], negativeFactors = [], isArchive = false }) => {
  return (
    <div className="p-5 bg-[#111827] border border-[#1F2937] rounded-lg shadow-sm hover:scale-[1.01] transition-all duration-150 animate-fadeInUp">
      <h3 className="text-sm font-sans font-semibold text-[#F8FAFC] flex items-center gap-2 mb-5 uppercase tracking-wide">
        <ShieldAlert className="h-4.5 w-4.5 text-[#EF4444]" />
        WEAKNESSES & PRESSURE
      </h3>

      <div className="space-y-5">
        {/* Core Weaknesses */}
        <div>
          <h4 className="text-[10px] font-mono font-bold text-[#EF4444] uppercase tracking-wider mb-2.5">
            // Financial & Operational Weaknesses
          </h4>
          <ul className="space-y-2">
            {weaknesses && weaknesses.length > 0 ? (
              weaknesses.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs font-sans text-[#94A3B8] leading-relaxed">
                  <span className="text-[#EF4444] font-bold shrink-0 font-mono">[-]</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-[11px] font-mono text-[#64748B] italic list-none">
                {isArchive ? 'Archived: Detailed weaknesses list not preserved.' : 'No operational weaknesses identified.'}
              </li>
            )}
          </ul>
        </div>

        {/* Sentiment Pressures */}
        <div className="pt-4 border-t border-[#1F2937]">
          <h4 className="text-[10px] font-mono font-bold text-[#EF4444] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <TrendingDown className="h-3.5 w-3.5" />
            // Market & Sentiment Pressures
          </h4>
          <ul className="space-y-2">
            {negativeFactors && negativeFactors.length > 0 ? (
              negativeFactors.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs font-sans text-[#94A3B8] leading-relaxed">
                  <span className="text-[#EF4444] font-bold shrink-0 font-mono">[-]</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-[11px] font-mono text-[#64748B] italic list-none">
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
