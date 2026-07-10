import React from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, HelpCircle } from 'lucide-react';

/**
 * Institutional Recommendation Card.
 * Renders the rating summary inside a high-contrast terminal widget.
 */
export const RecommendationCard = ({ recommendation = 'HOLD', confidence = 0.8, score = 50 }) => {
  const normalizedRec = (recommendation || 'HOLD').toUpperCase().replace(' ', '_');
  const confPct = Math.round(confidence * 100);

  // Strict flat styling parameters matching the Slate + Emerald statuses
  const badgeConfig = {
    STRONG_BUY: {
      border: 'border-[#22C55E]/40',
      text: 'text-[#22C55E]',
      bg: 'bg-[#22C55E]/5',
      icon: TrendingUp,
      desc: 'Highly favorable risk-to-reward parameters. The underlying fundamentals and market sentiment align for significant growth.'
    },
    BUY: {
      border: 'border-[#22C55E]/30',
      text: 'text-[#22C55E]',
      bg: 'bg-[#22C55E]/5',
      icon: TrendingUp,
      desc: 'Favorable operational indicators with moderate risk levels. Growth catalysts remain active and positive.'
    },
    INVEST: {
      border: 'border-[#10B981]/30',
      text: 'text-[#10B981]',
      bg: 'bg-[#10B981]/5',
      icon: TrendingUp,
      desc: 'Solid long-term investment characteristics. The company shows high financial resilience and positive sentiment.'
    },
    HOLD: {
      border: 'border-[#F59E0B]/40',
      text: 'text-[#F59E0B]',
      bg: 'bg-[#F59E0B]/5',
      icon: ShieldCheck,
      desc: 'Balanced valuation metrics. Sector headwinds or structural shifts offset balance sheet strengths. Recommend holding positions.'
    },
    UNDER_REVIEW: {
      border: 'border-blue-500/40',
      text: 'text-blue-400',
      bg: 'bg-blue-500/5',
      icon: ShieldCheck,
      desc: 'Analysis is actively undergoing re-evaluation due to recent events, major announcements, or volatile market activities.'
    },
    PASS: {
      border: 'border-[#1F2937]',
      text: 'text-[#94A3B8]',
      bg: 'bg-transparent',
      icon: ShieldCheck,
      desc: 'Model recommends passing on this asset. Better risk-reward opportunities exist elsewhere in the current environment.'
    },
    SELL: {
      border: 'border-[#EF4444]/35',
      text: 'text-[#EF4444]',
      bg: 'bg-[#EF4444]/5',
      icon: AlertTriangle,
      desc: 'Elevated leverage metrics or deteriorating sentiment indicators. Risk levels warrant reducing positions.'
    },
    STRONG_SELL: {
      border: 'border-[#EF4444]/50',
      text: 'text-[#EF4444]',
      bg: 'bg-[#EF4444]/5',
      icon: AlertTriangle,
      desc: 'Critical balance sheet vulnerabilities or highly negative media sentiment. Immediate safety issues identified.'
    }
  };

  const style = badgeConfig[normalizedRec] || badgeConfig.HOLD;
  const Icon = style.icon || HelpCircle;

  return (
    <div className="p-5 bg-[#111827] border border-[#1F2937] rounded-lg shadow-sm hover:scale-[1.01] transition-all duration-150 animate-fadeInUp">
      
      <span className="text-[10px] font-sans font-bold text-[#94A3B8] block tracking-wider uppercase">
        CONSENSUS SIGNAL
      </span>

      {/* Main Signal Display */}
      <div className="mt-4 flex items-center justify-between">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-md ${style.border} ${style.bg} ${style.text}`}>
          <Icon className="h-4 w-4 shrink-0" />
          <span className="font-mono font-bold text-xs tracking-wider uppercase">{normalizedRec.replace(/_/g, ' ')}</span>
        </div>
        <div className="text-right">
          <span className="text-xl font-mono font-bold text-[#F8FAFC] tracking-tight tabular-nums block">{score}</span>
          <span className="text-[8px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider">INDEX_RATING</span>
        </div>
      </div>

      {/* Explanation Descriptor */}
      <p className="mt-4 text-xs font-sans tracking-wide leading-relaxed text-[#94A3B8]">
        {style.desc}
      </p>

      {/* Confidence Index Gauge */}
      <div className="mt-5 pt-4 border-t border-[#1F2937]">
        <div className="flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider mb-2">
          <span className="text-[#94A3B8]">ANALYST_CONFIDENCE</span>
          <span className={`${style.text}`}>{confPct}%</span>
        </div>
        <div className="relative h-1.5 w-full bg-[#0F172A] border border-[#1F2937] rounded-md overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[#10B981] transition-all duration-700 ease-out"
            style={{ width: `${confPct}%` }}
          />
        </div>
      </div>

    </div>
  );
};

export default RecommendationCard;
