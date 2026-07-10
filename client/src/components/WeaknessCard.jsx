import React from 'react';
import { ShieldAlert, TrendingDown } from 'lucide-react';

/**
 * WeaknessCard Component.
 * Styled as a qualitative headwinds tracker inside the research workspace.
 */
export const WeaknessCard = ({ weaknesses = [], negativeFactors = [], isArchive = false }) => {
  return (
    <div className="p-5 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg hover:scale-[1.01] transition-all duration-150 animate-fadeInUp">
      <h3 className="text-sm font-sans font-bold text-[#FFFFFF] flex items-center gap-2 mb-5 uppercase tracking-wide">
        <ShieldAlert className="h-4.5 w-4.5 text-[#F5F5F5]" />
        Weaknesses & Pressure
      </h3>

      <div className="space-y-5">
        {/* Core Weaknesses */}
        <div>
          <h4 className="text-[10px] font-sans font-bold text-[#F5F5F5] uppercase tracking-wider mb-2.5">
            Financial & Operational Weaknesses
          </h4>
          <ul className="space-y-2">
            {weaknesses && weaknesses.length > 0 ? (
              weaknesses.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs font-sans text-[#D1D5DB] leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F5F5F5] shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-[#D1D5DB]/60 italic list-none">
                {isArchive ? 'Archived: Detailed weaknesses list not preserved.' : 'No operational weaknesses identified.'}
              </li>
            )}
          </ul>
        </div>

        {/* Sentiment Pressures */}
        <div className="pt-4 border-t border-white/5">
          <h4 className="text-[10px] font-sans font-bold text-[#F5F5F5] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <TrendingDown className="h-3.5 w-3.5 text-[#F5F5F5]" />
            Market & Sentiment Pressures
          </h4>
          <ul className="space-y-2">
            {negativeFactors && negativeFactors.length > 0 ? (
              negativeFactors.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs font-sans text-[#D1D5DB] leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F5F5F5] shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-[#D1D5DB]/60 italic list-none">
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
