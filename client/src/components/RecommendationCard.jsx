import React from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, HelpCircle } from 'lucide-react';

/**
 * Premium Recommendation Card.
 * Maps rating signals to glowing state styles and lists confidence levels.
 */
export const RecommendationCard = ({ recommendation = 'HOLD', confidence = 0.8, score = 50 }) => {
  const normalizedRec = (recommendation || 'HOLD').toUpperCase().replace(' ', '_');
  const confPct = Math.round(confidence * 100);

  // Recommendations configurations mapping
  const badgeConfig = {
    STRONG_BUY: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-250 dark:border-emerald-800/60',
      text: 'text-emerald-600 dark:text-emerald-400',
      glow: 'shadow-emerald-500/10 dark:shadow-emerald-500/5',
      icon: TrendingUp,
      desc: 'Highly favorable risk-to-reward parameters. The underlying fundamentals and market sentiment align for significant growth.'
    },
    BUY: {
      bg: 'bg-emerald-50/60 dark:bg-emerald-950/10',
      border: 'border-emerald-200 dark:border-emerald-900/40',
      text: 'text-emerald-500 dark:text-emerald-400',
      glow: 'shadow-emerald-500/5',
      icon: TrendingUp,
      desc: 'Favorable operational indicators with moderate risk levels. Growth catalysts remain active and positive.'
    },
    INVEST: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-250 dark:border-emerald-800/60',
      text: 'text-emerald-600 dark:text-emerald-400',
      glow: 'shadow-emerald-500/10 dark:shadow-emerald-500/5',
      icon: TrendingUp,
      desc: 'Solid long-term investment characteristics. The company shows high financial resilience and positive sentiment.'
    },
    HOLD: {
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-250 dark:border-amber-800/60',
      text: 'text-amber-600 dark:text-amber-400',
      glow: 'shadow-amber-500/10 dark:shadow-amber-500/5',
      icon: ShieldCheck,
      desc: 'Balanced valuation metrics. Sector headwinds or structural shifts offset balance sheet strengths. Recommend holding positions.'
    },
    UNDER_REVIEW: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-200 dark:border-blue-800/60',
      text: 'text-blue-600 dark:text-blue-400',
      glow: 'shadow-blue-500/10 dark:shadow-blue-500/5',
      icon: ShieldCheck,
      desc: 'Analysis is actively undergoing re-evaluation due to recent events, major announcements, or volatile market activities.'
    },
    PASS: {
      bg: 'bg-slate-50 dark:bg-slate-900/50',
      border: 'border-slate-300 dark:border-slate-800',
      text: 'text-slate-650 dark:text-slate-400',
      glow: 'shadow-slate-500/5',
      icon: ShieldCheck,
      desc: 'Model recommends passing on this asset. Better risk-reward opportunities exist elsewhere in the current environment.'
    },
    SELL: {
      bg: 'bg-rose-50 dark:bg-rose-950/20',
      border: 'border-rose-200 dark:border-rose-800/60',
      text: 'text-rose-600 dark:text-rose-400',
      glow: 'shadow-rose-500/10 dark:shadow-rose-500/5',
      icon: AlertTriangle,
      desc: 'Elevated leverage metrics or deteriorating sentiment indicators. Risk levels warrant reducing positions.'
    },
    STRONG_SELL: {
      bg: 'bg-rose-100/50 dark:bg-rose-950/35',
      border: 'border-rose-300 dark:border-rose-700/80',
      text: 'text-rose-700 dark:text-rose-400',
      glow: 'shadow-rose-500/20 dark:shadow-rose-500/10',
      icon: AlertTriangle,
      desc: 'Critical balance sheet vulnerabilities or highly negative media sentiment. Immediate safety issues identified.'
    }
  };

  const style = badgeConfig[normalizedRec] || badgeConfig.HOLD;
  const Icon = style.icon || HelpCircle;

  return (
    <div className={`p-6 rounded-2xl border ${style.border} bg-white dark:bg-slate-900 shadow-xl ${style.glow} transition-all duration-300`}>
      
      {/* Title */}
      <span className="text-sm font-semibold text-slate-400 block tracking-wide uppercase">
        Consensus Rating
      </span>

      {/* Main Signal Display */}
      <div className="mt-4 flex items-center justify-between">
        <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border ${style.border} ${style.bg} ${style.text}`}>
          <Icon className="h-5 w-5" />
          <span className="font-extrabold text-lg tracking-wide">{normalizedRec.replace(/_/g, ' ')}</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-slate-900 dark:text-white block">{score}</span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Rating Score</span>
        </div>
      </div>

      {/* Explanation Descriptor */}
      <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {style.desc}
      </p>

      {/* Confidence Index Gauge */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-sm font-semibold mb-2">
          <span className="text-slate-400">Analyst Confidence Index</span>
          <span className={`${style.text}`}>{confPct}%</span>
        </div>
        <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          {/* Progress bar background fill */}
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-emerald-500 to-teal-400`}
            style={{ width: `${confPct}%` }}
          />
        </div>
      </div>

    </div>
  );
};

export default RecommendationCard;
