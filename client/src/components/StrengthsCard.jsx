import React from 'react';
import { ShieldCheck, TrendingUp } from 'lucide-react';

/**
 * StrengthsCard Component.
 * Styled as a qualitative workspace section inside the Slate + Platinum layout.
 */
export const StrengthsCard = ({ strengths = [], positiveFactors = [], isArchive = false }) => {
  return (
    <div className="p-5 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg hover:scale-[1.01] transition-all duration-150 animate-fadeInUp">
      <h3 className="text-sm font-sans font-bold text-[#FFFFFF] flex items-center gap-2 mb-5 uppercase tracking-wide">
        <ShieldCheck className="h-4.5 w-4.5 text-[#F5F5F5]" />
        Strengths & Catalysts
      </h3>

      <div className="space-y-5">
        {/* Core Strengths */}
        <div>
          <h4 className="text-[10px] font-sans font-bold text-[#F5F5F5] uppercase tracking-wider mb-2.5">
            Financial & Operational Strengths
          </h4>
          <ul className="space-y-2">
            {strengths && strengths.length > 0 ? (
              strengths.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs font-sans text-[#D1D5DB] leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F5F5F5] shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-[#D1D5DB]/60 italic list-none">
                {isArchive ? 'Archived: Detailed strengths list not preserved.' : 'No operational strengths identified.'}
              </li>
            )}
          </ul>
        </div>

        {/* Sentiment Drivers */}
        <div className="pt-4 border-t border-white/5">
          <h4 className="text-[10px] font-sans font-bold text-[#F5F5F5] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-[#F5F5F5]" />
            Market & Sentiment Drivers
          </h4>
          <ul className="space-y-2">
            {positiveFactors && positiveFactors.length > 0 ? (
              positiveFactors.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs font-sans text-[#D1D5DB] leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F5F5F5] shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-[#D1D5DB]/60 italic list-none">
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
