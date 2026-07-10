import React from 'react';
import { DollarSign, Newspaper, ShieldAlert, Award, HelpCircle } from 'lucide-react';

/**
 * Score Card Component.
 * Styled as a modular rounded-lg panel inside the Slate + Emerald design theme.
 */
export const ScoreCard = ({ title, score, maxScore = 100, type = 'financial' }) => {
  const parsedScore = Number(score);
  const normalizedScore = isNaN(parsedScore) ? 0 : parsedScore;
  
  // Terminal mapping for subscores
  const themeMap = {
    financial: {
      icon: DollarSign,
      ringColor: 'stroke-blue-500',
      trackColor: 'stroke-[#1F2937]',
      textColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    news: {
      icon: Newspaper,
      ringColor: 'stroke-indigo-500',
      trackColor: 'stroke-[#1F2937]',
      textColor: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10'
    },
    risk: {
      icon: ShieldAlert,
      ringColor: 'stroke-[#F59E0B]',
      trackColor: 'stroke-[#1F2937]',
      textColor: 'text-[#F59E0B]',
      bgColor: 'bg-[#F59E0B]/10'
    },
    final: {
      icon: Award,
      ringColor: 'stroke-[#10B981]',
      trackColor: 'stroke-[#1F2937]',
      textColor: 'text-[#10B981]',
      bgColor: 'bg-[#10B981]/10'
    }
  };

  const currentTheme = themeMap[type] || themeMap.financial;
  const IconComponent = currentTheme.icon || HelpCircle;

  // SVG circular path metrics (no rounded lines)
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((normalizedScore / maxScore) * 100, 0), 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-between p-5 bg-[#111827] border border-[#1F2937] rounded-lg shadow-sm hover:scale-[1.01] hover:border-[#1F2937]/80 transition-all duration-150 animate-fadeInUp">
      
      {/* High-Contrast Info Column */}
      <div className="flex gap-4 items-center">
        <div className={`flex h-10 w-10 items-center justify-center rounded-md border border-[#1F2937] ${currentTheme.bgColor} ${currentTheme.textColor}`}>
          <IconComponent className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-sans font-bold text-[#94A3B8] block tracking-wider uppercase">
            {title}
          </span>
          <span className="text-2xl font-mono font-bold text-[#F8FAFC] tracking-tight tabular-nums mt-0.5 block">
            {normalizedScore}
            <span className="text-[#64748B] text-xs font-normal ml-0.5 font-sans">
              /{maxScore}
            </span>
          </span>
        </div>
      </div>

      {/* Strict Circular Dial */}
      <div className="relative h-16 w-16 flex items-center justify-center shrink-0">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={`fill-none ${currentTheme.trackColor}`}
            strokeWidth="5"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={`fill-none transition-all duration-700 ease-out ${currentTheme.ringColor}`}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <span className="absolute text-[10px] font-mono font-bold text-[#F8FAFC] tabular-nums">
          {Math.round(percentage)}%
        </span>
      </div>

    </div>
  );
};

export default ScoreCard;
