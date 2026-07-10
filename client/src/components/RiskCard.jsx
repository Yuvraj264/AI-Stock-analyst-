import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

/**
 * RiskCard Component.
 * Styled as a threat and buffer review panel with rounded-xl layout parameters.
 */
export const RiskCard = ({ risks = [], mitigationFactors = [], isArchive = false }) => {
  return (
    <div className="p-5 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg hover:scale-[1.01] transition-all duration-150 animate-fadeInUp">
      <h3 className="text-sm font-sans font-bold text-[#FFFFFF] flex items-center gap-2 mb-5 uppercase tracking-wide">
        <AlertTriangle className="h-4.5 w-4.5 text-[#F5F5F5]" />
        Risks & Mitigation
      </h3>

      <div className="space-y-5">
        {/* Core Risks */}
        <div>
          <h4 className="text-[10px] font-sans font-bold text-[#F5F5F5] uppercase tracking-wider mb-2.5">
            Identified Threat & Risk Points
          </h4>
          <ul className="space-y-2">
            {risks && risks.length > 0 ? (
              risks.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs font-sans text-[#D1D5DB] leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F5F5F5] shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-[#D1D5DB]/60 italic list-none">
                No threat or risk factors identified.
              </li>
            )}
          </ul>
        </div>

        {/* Mitigation/Buffer Factors */}
        <div className="pt-4 border-t border-white/5">
          <h4 className="text-[10px] font-sans font-bold text-[#F5F5F5] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#F5F5F5]" />
            Mitigation Factors & Moats
          </h4>
          <ul className="space-y-2">
            {mitigationFactors && mitigationFactors.length > 0 ? (
              mitigationFactors.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs font-sans text-[#D1D5DB] leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F5F5F5] shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-[#D1D5DB]/60 italic list-none">
                {isArchive ? 'Archived: Mitigation metrics not preserved.' : 'No active mitigations identified.'}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RiskCard;
