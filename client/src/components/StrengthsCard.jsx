import React from 'react';
import { ShieldCheck, TrendingUp } from 'lucide-react';

/**
 * StrengthsCard Component.
 * Styled as a qualitative workspace section inside the terminal.
 */
export const StrengthsCard = ({ strengths = [], positiveFactors = [], isArchive = false }) => {
  return (
    <div className="p-5 bg-[#111827] border border-[#1F2937] rounded-lg shadow-sm hover:scale-[1.01] transition-all duration-150 animate-fadeInUp">
      <h3 className="text-sm font-sans font-semibold text-[#F8FAFC] flex items-center gap-2 mb-5 uppercase tracking-wide">
        <ShieldCheck className="h-4.5 w-4.5 text-[#10B981]" />
        STRENGTHS & CATALYSTS
      </h3>

      <div className="space-y-5">
        {/* Core Strengths */}
        <div>
          <h4 className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-wider mb-2.5">
            // Financial & Operational Strengths
          </h4>
          <ul className="space-y-2">
            {strengths && strengths.length > 0 ? (
              strengths.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs font-sans text-[#94A3B8] leading-relaxed">
                  <span className="text-[#10B981] font-bold shrink-0 font-mono">[+]</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-[11px] font-mono text-[#64748B] italic list-none">
                {isArchive ? 'Archived: Detailed strengths list not preserved.' : 'No operational strengths identified.'}
              </li>
            )}
          </ul>
        </div>

        {/* Sentiment Drivers */}
        <div className="pt-4 border-t border-[#1F2937]">
          <h4 className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            // Market & Sentiment Drivers
          </h4>
          <ul className="space-y-2">
            {positiveFactors && positiveFactors.length > 0 ? (
              positiveFactors.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs font-sans text-[#94A3B8] leading-relaxed">
                  <span className="text-[#10B981] font-bold shrink-0 font-mono">[+]</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-[11px] font-mono text-[#64748B] italic list-none">
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
