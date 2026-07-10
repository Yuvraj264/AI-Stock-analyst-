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
    <div className="p-5 bg-[#111827] border border-[#1F2937] rounded-lg shadow-sm hover:scale-[1.01] transition-all duration-150 flex flex-col justify-between h-full font-sans text-xs animate-fadeInUp">
      <div>
        <h3 className="text-[10px] font-sans font-bold text-[#94A3B8] uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-[#10B981] animate-pulse" />
          EXECUTIVE SUMMARY
        </h3>

        {draw ? (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0F172A] border border-[#F59E0B]/30 text-[#F59E0B] font-bold text-[10px] uppercase shadow-sm">
              <AlertTriangle className="h-3.5 w-3.5" />
              CONSENSUS DRAW
            </div>
            <p className="text-[11px] leading-relaxed text-[#94A3B8] font-medium">
              Both **{stockA.companyName} ({stockA.ticker})** and **{stockB.companyName} ({stockB.ticker})** finished with matching consensus scores of **{scoreA} / 100**. Compare their sub-scores to see which asset fits your portfolio strategy best (e.g. higher financial safety vs. stronger sentiment).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0F172A] border border-[#10B981]/30 text-[#10B981] font-bold text-[10px] uppercase shadow-sm">
              <Award className="h-3.5 w-3.5" />
              {winner.ticker} OUTPERFORMS BY {Math.abs(scoreA - scoreB)} PTS
            </div>
            <p className="text-[11px] leading-relaxed text-[#94A3B8]">
              Based on the multi-agent consensus scoring system, **{winner.companyName} ({winner.ticker})** represents the superior investment candidate compared to **{loser.companyName} ({loser.ticker})**.
            </p>
            <div className="p-3.5 bg-[#0F172A] border border-[#1F2937] rounded-md space-y-2 text-[10px] text-[#94A3B8] font-mono">
              <div className="flex justify-between">
                <span>{winner.ticker} Consensus:</span>
                <span className="text-[#10B981] font-bold">{winner.finalScore} / 100</span>
              </div>
              <div className="flex justify-between">
                <span>{loser.ticker} Consensus:</span>
                <span className="text-[#EF4444] font-bold">{loser.finalScore} / 100</span>
              </div>
              <div className="border-t border-[#1F2937] pt-2 flex justify-between">
                <span>Winning Margin:</span>
                <span className="font-bold text-[#F8FAFC]">+{Math.abs(scoreA - scoreB)} points</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-[#1F2937] text-[8px] text-[#64748B] leading-relaxed uppercase">
        * Consensuses are computed by aggregating quantitative finance, news catalysts, and risk analysis metrics.
      </div>
    </div>
  );
};

export default ComparisonSummary;
