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
    if (winner === 'draw') return 'text-[#D1D5DB]';
    return winner === side
      ? 'bg-white/5 text-[#FFFFFF] font-bold border-l-2 border-[#F5F5F5]'
      : 'text-[#D1D5DB]';
  };

  const winnerFinal = compareVal(stockA.finalScore, stockB.finalScore);
  const winnerFinancial = compareVal(stockA.financialScore, stockB.financialScore);
  const winnerNews = compareVal(stockA.newsScore, stockB.newsScore);
  const winnerRisk = compareVal(stockA.riskScore, stockB.riskScore);
  const winnerConfidence = compareVal(stockA.confidence, stockB.confidence);

  return (
    <div className="w-full overflow-x-auto border border-white/5 bg-[#1E232D] rounded-xl shadow-lg animate-fadeInUp">
      <table className="w-full text-left border-collapse min-w-[500px] font-sans text-xs">
        <thead>
          <tr className="border-b border-white/5 bg-[#0F1115]/40 text-[#9AA4B2] uppercase tracking-wider">
            <th className="p-4 sm:p-5 w-1/3 text-[10px] font-bold">Analysis Matrix</th>
            <th className="p-4 sm:p-5 text-center w-1/3 border-l border-white/5">
              <span className="block text-[#FFFFFF] font-bold text-sm">{stockA.ticker}</span>
              <span className="text-[9px] text-[#9AA4B2] block truncate max-w-[180px] mx-auto uppercase mt-0.5">{stockA.companyName}</span>
            </th>
            <th className="p-4 sm:p-5 text-center w-1/3 border-l border-white/5">
              <span className="block text-[#FFFFFF] font-bold text-sm">{stockB.ticker}</span>
              <span className="text-[9px] text-[#9AA4B2] block truncate max-w-[180px] mx-auto uppercase mt-0.5">{stockB.companyName}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-[#D1D5DB]">
          {/* Consensus Score Row */}
          <tr>
            <td className="p-4 sm:p-5 flex items-center gap-2 font-semibold uppercase text-[#9AA4B2] text-[10px]">
              <Award className="h-4 w-4 text-[#F5F5F5]" />
              Consensus Score
            </td>
            <td className={`p-4 sm:p-5 text-center border-l border-white/5 transition-all ${getHighlightClass('A', winnerFinal)}`}>
              {stockA.finalScore} / 100
              {winnerFinal === 'A' && <Check className="inline h-3.5 w-3.5 ml-1 text-[#F5F5F5] align-middle" />}
            </td>
            <td className={`p-4 sm:p-5 text-center border-l border-white/5 transition-all ${getHighlightClass('B', winnerFinal)}`}>
              {stockB.finalScore} / 100
              {winnerFinal === 'B' && <Check className="inline h-3.5 w-3.5 ml-1 text-[#F5F5F5] align-middle" />}
            </td>
          </tr>

          {/* Financial Score Row */}
          <tr>
            <td className="p-4 sm:p-5 flex items-center gap-2 font-semibold uppercase text-[#9AA4B2] text-[10px]">
              <DollarSign className="h-4 w-4 text-[#B5B5B5]" />
              Financial Health
            </td>
            <td className={`p-4 sm:p-5 text-center border-l border-white/5 transition-all ${getHighlightClass('A', winnerFinancial)}`}>
              {stockA.financialScore} / 100
              {winnerFinancial === 'A' && <Check className="inline h-3.5 w-3.5 ml-1 text-[#F5F5F5] align-middle" />}
            </td>
            <td className={`p-4 sm:p-5 text-center border-l border-white/5 transition-all ${getHighlightClass('B', winnerFinancial)}`}>
              {stockB.financialScore} / 100
              {winnerFinancial === 'B' && <Check className="inline h-3.5 w-3.5 ml-1 text-[#F5F5F5] align-middle" />}
            </td>
          </tr>

          {/* News Score Row */}
          <tr>
            <td className="p-4 sm:p-5 flex items-center gap-2 font-semibold uppercase text-[#9AA4B2] text-[10px]">
              <Newspaper className="h-4 w-4 text-[#F5F5F5]" />
              News Sentiment
            </td>
            <td className={`p-4 sm:p-5 text-center border-l border-white/5 transition-all ${getHighlightClass('A', winnerNews)}`}>
              {stockA.newsScore} / 100
              {winnerNews === 'A' && <Check className="inline h-3.5 w-3.5 ml-1 text-[#F5F5F5]" />}
            </td>
            <td className={`p-4 sm:p-5 text-center border-l border-white/5 transition-all ${getHighlightClass('B', winnerNews)}`}>
              {stockB.newsScore} / 100
              {winnerNews === 'B' && <Check className="inline h-3.5 w-3.5 ml-1 text-[#F5F5F5]" />}
            </td>
          </tr>

          {/* Risk Score Row */}
          <tr>
            <td className="p-4 sm:p-5 flex items-center gap-2 font-semibold uppercase text-[#9AA4B2] text-[10px]">
              <ShieldAlert className="h-4 w-4 text-[#F59E0B]" />
              Risk Safety Score
            </td>
            <td className={`p-4 sm:p-5 text-center border-l border-white/5 transition-all ${getHighlightClass('A', winnerRisk)}`}>
              {stockA.riskScore} / 100
              {winnerRisk === 'A' && <Check className="inline h-3.5 w-3.5 ml-1 text-[#F5F5F5]" />}
            </td>
            <td className={`p-4 sm:p-5 text-center border-l border-white/5 transition-all ${getHighlightClass('B', winnerRisk)}`}>
              {stockB.riskScore} / 100
              {winnerRisk === 'B' && <Check className="inline h-3.5 w-3.5 ml-1 text-[#F5F5F5]" />}
            </td>
          </tr>

          {/* Recommendation Row */}
          <tr>
            <td className="p-4 sm:p-5 flex items-center gap-2 font-semibold uppercase text-[#9AA4B2] text-[10px]">
              <Award className="h-4 w-4 text-[#F5F5F5]" />
              Recommendation
            </td>
            <td className="p-4 sm:p-5 text-center border-l border-white/5 text-[#FFFFFF] uppercase font-bold">{stockA.recommendation}</td>
            <td className="p-4 sm:p-5 text-center border-l border-white/5 text-[#FFFFFF] uppercase font-bold">{stockB.recommendation}</td>
          </tr>

          {/* Confidence Score Row */}
          <tr>
            <td className="p-4 sm:p-5 flex items-center gap-2 font-semibold uppercase text-[#9AA4B2] text-[10px]">
              <Award className="h-4 w-4 text-[#F5F5F5]" />
              Analyst Confidence
            </td>
            <td className={`p-4 sm:p-5 text-center border-l border-white/5 transition-all ${getHighlightClass('A', winnerConfidence)}`}>
              {Math.round(stockA.confidence * 100)}%
              {winnerConfidence === 'A' && <Check className="inline h-3.5 w-3.5 ml-1 text-[#F5F5F5]" />}
            </td>
            <td className={`p-4 sm:p-5 text-center border-l border-white/5 transition-all ${getHighlightClass('B', winnerConfidence)}`}>
              {Math.round(stockB.confidence * 100)}%
              {winnerConfidence === 'B' && <Check className="inline h-3.5 w-3.5 ml-1 text-[#F5F5F5]" />}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
