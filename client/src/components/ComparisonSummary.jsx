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
    <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md flex flex-col justify-between h-full transition-all duration-300 hover:shadow-lg">
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-amber-500 animate-pulse" />
          Executive Summary
        </h3>

        {draw ? (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 dark:bg-amber-950/20 dark:border-amber-800/80 dark:text-amber-400 font-extrabold text-sm">
              <AlertTriangle className="h-4 w-4" />
              Consensus Draw
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
              Both **{stockA.companyName} ({stockA.ticker})** and **{stockB.companyName} ({stockB.ticker})** finished with matching consensus scores of **{scoreA} / 100**. Compare their sub-scores to see which asset fits your portfolio strategy best (e.g. higher financial safety vs. stronger sentiment).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-800/80 dark:text-emerald-400 font-extrabold text-sm">
              <Award className="h-4.5 w-4.5" />
              {winner.ticker} Wins by {Math.abs(scoreA - scoreB)} Points
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
              Based on the multi-agent consensus scoring system, **{winner.companyName} ({winner.ticker})** represents the superior investment candidate compared to **{loser.companyName} ({loser.ticker})**.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 text-xs space-y-2 text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              <div className="flex justify-between">
                <span>{winner.ticker} Consensus Score:</span>
                <span className="text-emerald-500 font-extrabold">{winner.finalScore} / 100</span>
              </div>
              <div className="flex justify-between">
                <span>{loser.ticker} Consensus Score:</span>
                <span className="text-rose-500 font-extrabold">{loser.finalScore} / 100</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between">
                <span>Winning Margin:</span>
                <span className="font-extrabold">+{Math.abs(scoreA - scoreB)} points</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
          * Consensuses are computed by aggregating quantitative finance, news catalysts, and risk analysis metrics.
        </p>
      </div>
    </div>
  );
};

export default ComparisonSummary;
