import React from 'react';
import { Award, Zap, AlertTriangle } from 'lucide-react';

/**
 * ComparisonSummary Component.
 * Formulates the winning logic based on Consensus Score, highlighting margin values.
 */
export const ComparisonSummary = ({ stockA, stockB }) => {
  if (!stockA || !stockB) return null;

  const scoreA = Number(stockA.finalScore) || 0;
  const scoreB = Number(stockB.finalScore) || 0;

  let winner = null;
  let loser = null;
  let draw = false;

  if (scoreA > scoreB) {
    winner = stockA;
    loser = stockB;
  } else if (scoreB > scoreA) {
    winner = stockB;
    loser = stockA;
  } else {
    draw = true;
  }

  return (
    <div className="p-5 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg hover:scale-[1.01] transition-all duration-150 flex flex-col justify-between h-full font-sans text-xs animate-fadeInUp">
      <div>
        <h3 className="text-[10px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-[#F5F5F5] animate-pulse" />
          Executive Summary
        </h3>

        {draw ? (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0F1115] border border-[#F59E0B]/30 text-[#F59E0B] font-bold text-[10px] uppercase shadow-sm">
              <AlertTriangle className="h-3.5 w-3.5" />
              Consensus Draw
            </div>
            <p className="text-[11px] leading-relaxed text-[#D1D5DB] font-medium">
              Both **{stockA.companyName} ({stockA.ticker})** and **{stockB.companyName} ({stockB.ticker})** finished with matching consensus scores of **{scoreA} / 100**. Compare their sub-scores to see which asset fits your portfolio strategy best (e.g. higher financial safety vs. stronger sentiment).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0F1115] border border-[#F5F5F5]/30 text-[#FFFFFF] font-bold text-[10px] uppercase shadow-sm">
              <Award className="h-3.5 w-3.5" />
              {winner.ticker} Outperforms by {Math.abs(scoreA - scoreB)} Pts
            </div>
            <p className="text-[11px] leading-relaxed text-[#D1D5DB]">
              Based on the multi-agent consensus scoring system, **{winner.companyName} ({winner.ticker})** represents the superior investment candidate compared to **{loser.companyName} ({loser.ticker})**.
            </p>
            <div className="p-3.5 bg-[#0F1115] border border-white/5 rounded-md space-y-2 text-[10px] text-[#D1D5DB]">
              <div className="flex justify-between">
                <span>{winner.ticker} Consensus:</span>
                <span className="text-[#F5F5F5] font-bold">{winner.finalScore} / 100</span>
              </div>
              <div className="flex justify-between">
                <span>{loser.ticker} Consensus:</span>
                <span className="text-[#EF4444] font-bold">{loser.finalScore} / 100</span>
              </div>
              <div className="border-t border-white/5 pt-2 flex justify-between">
                <span>Winning Margin:</span>
                <span className="font-bold text-[#FFFFFF]">+{Math.abs(scoreA - scoreB)} points</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 text-[8px] text-[#9AA4B2] leading-relaxed uppercase">
        * Consensuses are computed by aggregating quantitative finance, news catalysts, and risk analysis metrics.
      </div>
    </div>
  );
};

export default ComparisonSummary;
