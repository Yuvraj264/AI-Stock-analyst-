import React from 'react';
import { FileText } from 'lucide-react';

/**
 * ReportCard Component.
 * Custom parses and renders markdown compiled by the LLM agent network.
 * Redesigned with rounded-xl layout parameters and premium Inter typography.
 */
export const ReportCard = ({ report = '' }) => {
  return (
    <div className="p-5 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg hover:scale-[1.01] transition-all duration-150 animate-fadeInUp flex flex-col h-full">
      <h3 className="text-sm font-sans font-bold text-[#FFFFFF] flex items-center gap-2 mb-4 border-b border-white/5 pb-3.5 uppercase tracking-wide">
        <FileText className="h-4.5 w-4.5 text-[#F5F5F5]" />
        Executive Summary Report
      </h3>

      <div className="flex-1 overflow-y-auto pr-1 leading-relaxed text-[#D1D5DB] scrollbar-thin scrollbar-thumb-white/5 max-h-[32rem]">
        <div className="max-w-none text-xs font-sans tracking-wide space-y-3">
          {report ? (
            report.split('\n').map((line, idx) => {
              if (line.startsWith('# ')) {
                return (
                  <h1 key={idx} className="text-base font-extrabold text-[#FFFFFF] mt-4 mb-2 border-b border-white/5 pb-1 uppercase tracking-wider text-[#F5F5F5]">
                    {line.replace('# ', '')}
                  </h1>
                );
              }
              if (line.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-sm font-bold text-[#FFFFFF] mt-4 mb-2 uppercase tracking-wide">
                    {line.replace('## ', '')}
                  </h2>
                );
              }
              if (line.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xs font-bold text-[#F5F5F5] mt-3 mb-1 uppercase tracking-wide">
                    {line.replace('### ', '')}
                  </h3>
                );
              }
              if (line.startsWith('* ') || line.startsWith('- ')) {
                return (
                  <li key={idx} className="list-none flex gap-2 items-start py-0.5 text-[#D1D5DB]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F5F5F5] shrink-0 mt-1.5" />
                    <span>{line.substring(2)}</span>
                  </li>
                );
              }
              if (line.trim() === '---') {
                return <hr key={idx} className="border-white/5 my-3.5" />;
              }
              if (line.trim() === '') {
                return <div key={idx} className="h-1.5" />;
              }
              return (
                <p key={idx} className="mb-2 text-[#D1D5DB] leading-relaxed text-xs">
                  {line}
                </p>
              );
            })
          ) : (
            <p className="text-[#D1D5DB]/60 italic uppercase text-[10px]">No qualitative report datastream loaded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
