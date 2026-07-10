import React from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, HelpCircle } from 'lucide-react';

/**
 * Institutional Recommendation Card.
 * Renders the rating summary inside a platinum-accented widget.
 */
export const RecommendationCard = ({ recommendation = 'HOLD', confidence = 0.8, score = 50 }) => {
  const normalizedRec = (recommendation || 'HOLD').toUpperCase().replace(' ', '_');
  const confPct = Math.round(confidence * 100);

  // Flat styling parameters matching Slate + Platinum statuses
  const badgeConfig = {
    STRONG_BUY: {
      border: 'border-[#22C55E]/30',
      text: 'text-[#22C55E]',
      bg: 'bg-[#22C55E]/5',
      icon: TrendingUp,
      desc: 'Highly favorable risk-to-reward parameters. The underlying fundamentals and market sentiment align for significant growth.'
    },
    BUY: {
      border: 'border-[#22C55E]/20',
      text: 'text-[#22C55E]',
      bg: 'bg-[#22C55E]/5',
      icon: TrendingUp,
      desc: 'Favorable operational indicators with moderate risk levels. Growth catalysts remain active and positive.'
    },
    INVEST: {
      border: 'border-[#F5F5F5]/30',
      text: 'text-[#FFFFFF]',
      bg: 'bg-white/5',
      icon: TrendingUp,
      desc: 'Solid long-term investment characteristics. The company shows high financial resilience and positive sentiment.'
    },
    HOLD: {
      border: 'border-[#F59E0B]/30',
      text: 'text-[#F59E0B]',
      bg: 'bg-[#F59E0B]/5',
      icon: ShieldCheck,
      desc: 'Balanced valuation metrics. Sector headwinds or structural shifts offset balance sheet strengths. Recommend holding positions.'
    },
    UNDER_REVIEW: {
      border: 'border-[#F5F5F5]/20',
      text: 'text-[#FFFFFF]',
      bg: 'bg-white/5',
      icon: ShieldCheck,
      desc: 'Analysis is actively undergoing re-evaluation due to recent events, major announcements, or volatile market activities.'
    },
    PASS: {
      border: 'border-white/5',
      text: 'text-[#9AA4B2]',
      bg: 'bg-transparent',
      icon: ShieldCheck,
      desc: 'Model recommends passing on this asset. Better risk-reward opportunities exist elsewhere in the current environment.'
    },
    SELL: {
      border: 'border-[#EF4444]/30',
      text: 'text-[#EF4444]',
      bg: 'bg-[#EF4444]/5',
      icon: AlertTriangle,
      desc: 'Elevated leverage metrics or deteriorating sentiment indicators. Risk levels warrant reducing positions.'
    },
    STRONG_SELL: {
      border: 'border-[#EF4444]/40',
      text: 'text-[#EF4444]',
      bg: 'bg-[#EF4444]/5',
      icon: AlertTriangle,
      desc: 'Critical balance sheet vulnerabilities or highly negative media sentiment. Immediate safety issues identified.'
    }
  };

  const style = badgeConfig[normalizedRec] || badgeConfig.HOLD;
  const Icon = style.icon || HelpCircle;

  return (
    <div className="p-5 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg hover:scale-[1.01] transition-all duration-150 animate-fadeInUp">
      
      <span className="text-[10px] font-sans font-bold text-[#9AA4B2] block tracking-wider uppercase">
        CONSENSUS SIGNAL
      </span>

      {/* Main Signal Display */}
      <div className="mt-4 flex items-center justify-between">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-md ${style.border} ${style.bg} ${style.text}`}>
          <Icon className="h-4 w-4 shrink-0" />
          <span className="font-sans font-bold text-xs tracking-wider uppercase">{normalizedRec.replace(/_/g, ' ')}</span>
        </div>
        <div className="text-right">
          <span className="text-xl font-sans font-bold text-[#FFFFFF] tracking-tight block">{score}</span>
          <span className="text-[8px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider">INDEX_RATING</span>
        </div>
      </div>

      {/* Explanation Descriptor */}
      <p className="mt-4 text-xs font-sans tracking-wide leading-relaxed text-[#D1D5DB]">
        {style.desc}
      </p>

      {/* Confidence Index Gauge */}
      <div className="mt-5 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider mb-2">
          <span className="text-[#9AA4B2]">ANALYST_CONFIDENCE</span>
          <span className={`${style.text}`}>{confPct}%</span>
        </div>
        <div className="relative h-1.5 w-full bg-[#171A21] border border-white/5 rounded-md overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[#F5F5F5] transition-all duration-700 ease-out"
            style={{ width: `${confPct}%` }}
          />
        </div>
      </div>

    </div>
  );
};

export default RecommendationCard;
