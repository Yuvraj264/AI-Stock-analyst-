import React from 'react';
import { DollarSign, Newspaper, ShieldAlert, Award, HelpCircle } from 'lucide-react';

/**
 * Score Card Component.
 * Styled as a modular rounded-xl panel inside the Slate + Platinum design theme.
 */
export const ScoreCard = ({ title, score, maxScore = 100, type = 'financial' }) => {
  const parsedScore = Number(score);
  const normalizedScore = isNaN(parsedScore) ? 0 : parsedScore;
  
  // Luxury platinum style mappings
  const themeMap = {
    financial: {
      icon: DollarSign,
      ringColor: 'stroke-[#F5F5F5]',
      trackColor: 'stroke-white/5',
      textColor: 'text-[#FFFFFF]',
      bgColor: 'bg-white/5'
    },
    news: {
      icon: Newspaper,
      ringColor: 'stroke-[#B5B5B5]',
      trackColor: 'stroke-white/5',
      textColor: 'text-[#FFFFFF]',
      bgColor: 'bg-white/5'
    },
    risk: {
      icon: ShieldAlert,
      ringColor: 'stroke-[#F39C12]',
      trackColor: 'stroke-white/5',
      textColor: 'text-[#F39C12]',
      bgColor: 'bg-[#F39C12]/5'
    },
    final: {
      icon: Award,
      ringColor: 'stroke-[#F5F5F5]',
      trackColor: 'stroke-white/5',
      textColor: 'text-[#FFFFFF]',
      bgColor: 'bg-white/5'
    }
  };

  const currentTheme = themeMap[type] || themeMap.financial;
  const IconComponent = currentTheme.icon || HelpCircle;

  // SVG circular path metrics
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((normalizedScore / maxScore) * 100, 0), 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-between p-5 bg-[#1E232D] border border-white/5 rounded-xl shadow-lg hover:scale-[1.01] transition-all duration-150 animate-fadeInUp">
      
      {/* Detail Column */}
      <div className="flex gap-4 items-center">
        <div className={`flex h-10 w-10 items-center justify-center rounded-md border border-white/5 ${currentTheme.bgColor} ${currentTheme.textColor}`}>
          <IconComponent className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-sans font-bold text-[#9AA4B2] block tracking-wider uppercase">
            {title}
          </span>
          <span className="text-2xl font-bold text-[#FFFFFF] tracking-tight mt-0.5 block">
            {normalizedScore}
            <span className="text-[#9AA4B2] text-xs font-normal ml-0.5">
              /{maxScore}
            </span>
          </span>
        </div>
      </div>

      {/* Circular Dial */}
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
        <span className="absolute text-[10px] font-bold text-[#FFFFFF]">
          {Math.round(percentage)}%
        </span>
      </div>

    </div>
  );
};

export default ScoreCard;
