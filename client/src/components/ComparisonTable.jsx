import React from 'react';
import { Award, DollarSign, Newspaper, ShieldAlert, Check } from 'lucide-react';

/**
 * ComparisonTable Component.
 * Displays side-by-side comparative rows of scores and recommendations.
 */
export const ComparisonTable = ({ stockA, stockB }) => {
  if (!stockA || !stockB) return null;

  const compareVal = (valA, valB, isLowerBetter = false) => {
    const numA = Number(valA) || 0;
    const numB = Number(valB) || 0;
    if (numA === numB) return 'draw';
    if (isLowerBetter) {
      return numA < numB ? 'A' : 'B';
    }
    return numA > numB ? 'A' : 'B';
  };

  const getHighlightClass = (side, winner) => {
    if (winner === 'draw') return 'bg-slate-50/30 dark:bg-slate-900/10';
    return winner === side
      ? 'bg-emerald-50/50 dark:bg-emerald-950/15 border-l-4 border-emerald-500 font-extrabold text-emerald-600 dark:text-emerald-400'
      : '';
  };

  const winnerFinal = compareVal(stockA.finalScore, stockB.finalScore);
  const winnerFinancial = compareVal(stockA.financialScore, stockB.financialScore);
  const winnerNews = compareVal(stockA.newsScore, stockB.newsScore);
  const winnerRisk = compareVal(stockA.riskScore, stockB.riskScore);
  const winnerConfidence = compareVal(stockA.confidence, stockB.confidence);

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
      <table className="w-full text-left border-collapse min-w-[500px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <th className="p-4 sm:p-5 w-1/3">Analysis Matrix</th>
            <th className="p-4 sm:p-5 text-center w-1/3">
              <span className="block text-slate-800 dark:text-white font-extrabold text-base">{stockA.ticker}</span>
              <span className="text-[10px] text-slate-400 block truncate max-w-[180px] mx-auto">{stockA.companyName}</span>
            </th>
            <th className="p-4 sm:p-5 text-center w-1/3">
              <span className="block text-slate-800 dark:text-white font-extrabold text-base">{stockB.ticker}</span>
              <span className="text-[10px] text-slate-400 block truncate max-w-[180px] mx-auto">{stockB.companyName}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-semibold">
          {/* Consensus Score Row */}
          <tr>
            <td className="p-4 sm:p-5 flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Award className="h-4 w-4 text-emerald-500" />
              Consensus Score
            </td>
            <td className={`p-4 sm:p-5 text-center transition-all ${getHighlightClass('A', winnerFinal)}`}>
              {stockA.finalScore} / 100
              {winnerFinal === 'A' && <Check className="inline h-4 w-4 ml-1.5 text-emerald-500 align-middle" />}
            </td>
            <td className={`p-4 sm:p-5 text-center transition-all ${getHighlightClass('B', winnerFinal)}`}>
              {stockB.finalScore} / 100
              {winnerFinal === 'B' && <Check className="inline h-4 w-4 ml-1.5 text-emerald-500 align-middle" />}
            </td>
          </tr>

          {/* Financial Score Row */}
          <tr>
            <td className="p-4 sm:p-5 flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <DollarSign className="h-4 w-4 text-blue-500" />
              Financial Health
            </td>
            <td className={`p-4 sm:p-5 text-center transition-all ${getHighlightClass('A', winnerFinancial)}`}>
              {stockA.financialScore} / 100
              {winnerFinancial === 'A' && <Check className="inline h-4 w-4 ml-1.5 text-emerald-500 align-middle" />}
            </td>
            <td className={`p-4 sm:p-5 text-center transition-all ${getHighlightClass('B', winnerFinancial)}`}>
              {stockB.financialScore} / 100
              {winnerFinancial === 'B' && <Check className="inline h-4 w-4 ml-1.5 text-emerald-500 align-middle" />}
            </td>
          </tr>

          {/* News Score Row */}
          <tr>
            <td className="p-4 sm:p-5 flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Newspaper className="h-4 w-4 text-indigo-500" />
              News Sentiment
            </td>
            <td className={`p-4 sm:p-5 text-center transition-all ${getHighlightClass('A', winnerNews)}`}>
              {stockA.newsScore} / 100
              {winnerNews === 'A' && <Check className="inline h-4 w-4 ml-1.5 text-emerald-500" />}
            </td>
            <td className={`p-4 sm:p-5 text-center transition-all ${getHighlightClass('B', winnerNews)}`}>
              {stockB.newsScore} / 100
              {winnerNews === 'B' && <Check className="inline h-4 w-4 ml-1.5 text-emerald-500" />}
            </td>
          </tr>

          {/* Risk Score Row */}
          <tr>
            <td className="p-4 sm:p-5 flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              Risk Safety Score
            </td>
            <td className={`p-4 sm:p-5 text-center transition-all ${getHighlightClass('A', winnerRisk)}`}>
              {stockA.riskScore} / 100
              {winnerRisk === 'A' && <Check className="inline h-4 w-4 ml-1.5 text-emerald-500" />}
            </td>
            <td className={`p-4 sm:p-5 text-center transition-all ${getHighlightClass('B', winnerRisk)}`}>
              {stockB.riskScore} / 100
              {winnerRisk === 'B' && <Check className="inline h-4 w-4 ml-1.5 text-emerald-500" />}
            </td>
          </tr>

          {/* Recommendation Row */}
          <tr>
            <td className="p-4 sm:p-5 flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Award className="h-4 w-4 text-indigo-500" />
              Recommendation
            </td>
            <td className="p-4 sm:p-5 text-center text-slate-800 dark:text-slate-200">{stockA.recommendation}</td>
            <td className="p-4 sm:p-5 text-center text-slate-800 dark:text-slate-200">{stockB.recommendation}</td>
          </tr>

          {/* Confidence Score Row */}
          <tr>
            <td className="p-4 sm:p-5 flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Award className="h-4 w-4 text-emerald-500" />
              Analyst Confidence
            </td>
            <td className={`p-4 sm:p-5 text-center transition-all ${getHighlightClass('A', winnerConfidence)}`}>
              {Math.round(stockA.confidence * 100)}%
              {winnerConfidence === 'A' && <Check className="inline h-4 w-4 ml-1.5 text-emerald-500" />}
            </td>
            <td className={`p-4 sm:p-5 text-center transition-all ${getHighlightClass('B', winnerConfidence)}`}>
              {Math.round(stockB.confidence * 100)}%
              {winnerConfidence === 'B' && <Check className="inline h-4 w-4 ml-1.5 text-emerald-500" />}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
