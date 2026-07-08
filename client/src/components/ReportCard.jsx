import React from 'react';
import { FileText } from 'lucide-react';

/**
 * ReportCard Component.
 * Custom parses and renders markdown compiled by the LLM agent network.
 */
export const ReportCard = ({ report = '' }) => {
  return (
    <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md flex flex-col h-full transition-all duration-300 hover:shadow-lg">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-850 pb-4">
        <FileText className="h-5 w-5 text-emerald-500" />
        AI Compiled Research Report
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 text-sm leading-relaxed text-slate-600 dark:text-slate-350 font-medium space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 max-h-[32rem]">
        <div className="prose prose-slate dark:prose-invert max-w-none text-xs">
          {report ? (
            report.split('\n').map((line, idx) => {
              if (line.startsWith('# ')) {
                return (
                  <h1 key={idx} className="text-xl font-black text-slate-900 dark:text-white mt-5 mb-3 border-b border-slate-100 dark:border-slate-800 pb-1">
                    {line.replace('# ', '')}
                  </h1>
                );
              }
              if (line.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-base font-extrabold text-slate-800 dark:text-slate-200 mt-4 mb-2 uppercase tracking-wide">
                    {line.replace('## ', '')}
                  </h2>
                );
              }
              if (line.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-sm font-bold text-emerald-555 dark:text-emerald-400 mt-3 mb-1.5 uppercase tracking-wide">
                    {line.replace('### ', '')}
                  </h3>
                );
              }
              if (line.startsWith('* ') || line.startsWith('- ')) {
                return (
                  <li key={idx} className="list-disc list-inside ml-3 py-0.5 text-slate-600 dark:text-slate-400">
                    {line.substring(2)}
                  </li>
                );
              }
              if (line.trim() === '---') {
                return <hr key={idx} className="border-slate-100 dark:border-slate-800 my-4" />;
              }
              if (line.trim() === '') {
                return <div key={idx} className="h-2" />;
              }
              return (
                <p key={idx} className="mb-2 text-slate-550 dark:text-slate-400">
                  {line}
                </p>
              );
            })
          ) : (
            <p className="text-slate-400 dark:text-slate-500 italic">No qualitative summary report compiled.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
