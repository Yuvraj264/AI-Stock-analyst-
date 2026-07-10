import React from 'react';
import { FileText } from 'lucide-react';

/**
 * ReportCard Component.
 * Custom parses and renders markdown compiled by the LLM agent network.
 * Redesigned with rounded-lg layout parameters and premium sans-serif typography.
 */
export const ReportCard = ({ report = '' }) => {
  return (
    <div className="p-5 bg-[#111827] border border-[#1F2937] rounded-lg shadow-sm hover:scale-[1.01] transition-all duration-150 animate-fadeInUp flex flex-col h-full">
      <h3 className="text-sm font-sans font-semibold text-[#F8FAFC] flex items-center gap-2 mb-4 border-b border-[#1F2937] pb-3.5 uppercase tracking-wide">
        <FileText className="h-4.5 w-4.5 text-[#10B981]" />
        SYNTHESIS REPORT PRINT
      </h3>

      <div className="flex-1 overflow-y-auto pr-1 leading-relaxed text-[#94A3B8] scrollbar-thin scrollbar-thumb-[#1F2937] max-h-[32rem]">
        <div className="max-w-none text-xs font-sans tracking-wide space-y-3">
          {report ? (
            report.split('\n').map((line, idx) => {
              if (line.startsWith('# ')) {
                return (
                  <h1 key={idx} className="text-base font-extrabold text-[#F8FAFC] mt-4 mb-2 border-b border-[#1F2937] pb-1 uppercase tracking-wider text-[#10B981]">
                    {line.replace('# ', '')}
                  </h1>
                );
              }
              if (line.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-sm font-bold text-[#F8FAFC] mt-4 mb-2 uppercase tracking-wide">
                    {line.replace('## ', '')}
                  </h2>
                );
              }
              if (line.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xs font-bold text-[#10B981] mt-3 mb-1 uppercase tracking-wide">
                    {line.replace('### ', '')}
                  </h3>
                );
              }
              if (line.startsWith('* ') || line.startsWith('- ')) {
                return (
                  <li key={idx} className="list-none flex gap-2 items-start py-0.5 text-[#94A3B8]">
                    <span className="text-[#10B981] font-bold">»</span>
                    <span>{line.substring(2)}</span>
                  </li>
                );
              }
              if (line.trim() === '---') {
                return <hr key={idx} className="border-[#1F2937] my-3.5" />;
              }
              if (line.trim() === '') {
                return <div key={idx} className="h-1.5" />;
              }
              return (
                <p key={idx} className="mb-2 text-[#94A3B8] leading-relaxed text-xs">
                  {line}
                </p>
              );
            })
          ) : (
            <p className="text-[#94A3B8]/60 italic uppercase text-[10px]">No qualitative report datastream loaded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
