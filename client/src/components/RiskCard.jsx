import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

/**
 * RiskCard Component.
 * Styled as a threat and buffer review panel with rounded-lg layout parameters.
 */
export const RiskCard = ({ risks = [], mitigationFactors = [], isArchive = false }) => {
  return (
    <div className="p-5 bg-[#111827] border border-[#1F2937] rounded-lg shadow-sm hover:scale-[1.01] transition-all duration-150 animate-fadeInUp">
      <h3 className="text-sm font-sans font-semibold text-[#F8FAFC] flex items-center gap-2 mb-5 uppercase tracking-wide">
        <AlertTriangle className="h-4.5 w-4.5 text-[#F59E0B]" />
        RISKS & MITIGATION
      </h3>

      <div className="space-y-5">
        {/* Core Risks */}
        <div>
          <h4 className="text-[10px] font-mono font-bold text-[#F59E0B] uppercase tracking-wider mb-2.5">
            // Identified Threat & Risk Points
          </h4>
          <ul className="space-y-2">
            {risks && risks.length > 0 ? (
              risks.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs font-sans text-[#94A3B8] leading-relaxed">
                  <span className="text-[#F59E0B] font-bold shrink-0 font-mono">[!]</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-[11px] font-mono text-[#64748B] italic list-none">
                No threat or risk factors identified.
              </li>
            )}
          </ul>
        </div>

        {/* Mitigation/Buffer Factors */}
        <div className="pt-4 border-t border-[#1F2937]">
          <h4 className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
            // Mitigation Factors & Moats
          </h4>
          <ul className="space-y-2">
            {mitigationFactors && mitigationFactors.length > 0 ? (
              mitigationFactors.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs font-sans text-[#94A3B8] leading-relaxed">
                  <span className="text-[#10B981] font-bold shrink-0 font-mono">[+]</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-[11px] font-mono text-[#64748B] italic list-none">
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
