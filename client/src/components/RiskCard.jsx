import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

/**
 * RiskCard Component.
 * Displays structural threat/risk points and protective buffer/mitigation factors.
 */
export const RiskCard = ({ risks = [], mitigationFactors = [], isArchive = false }) => {
  return (
    <div className="p-6 rounded-2xl border border-amber-100 dark:border-amber-955 bg-white dark:bg-slate-900 shadow-md transition-all duration-300 hover:shadow-lg">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        Risks & Mitigations
      </h3>

      <div className="space-y-6">
        {/* Core Risks */}
        <div>
          <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3">
            Identified Threat & Risk Points
          </h4>
          <ul className="space-y-3">
            {risks && risks.length > 0 ? (
              risks.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-650 dark:text-slate-355 leading-relaxed font-medium">
                  <span className="text-amber-500 font-bold mt-0.5">⚠</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-400 dark:text-slate-500 italic list-none">
                No threat or risk factors identified.
              </li>
            )}
          </ul>
        </div>

        {/* Mitigation/Buffer Factors */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <h4 className="text-xs font-bold text-emerald-555 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Mitigation Factors & Moats
          </h4>
          <ul className="space-y-3">
            {mitigationFactors && mitigationFactors.length > 0 ? (
              mitigationFactors.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-650 dark:text-slate-355 leading-relaxed font-medium">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-400 dark:text-slate-500 italic list-none">
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
