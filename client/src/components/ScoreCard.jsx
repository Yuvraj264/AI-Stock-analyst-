import React from 'react';
import { DollarSign, Newspaper, ShieldAlert, Award } from 'lucide-react';

/**
 * Score visualization card with radial/circular gauge ring.
 * Maps score thresholds to customized HSL color-coded states.
 */
export const ScoreCard = ({ title, score, maxScore = 100, type = 'financial' }) => {
  const normalizedScore = typeof score === 'number' ? score : 0;
  
  // Custom theme mapping based on agent type
  const themeMap = {
    financial: {
      icon: DollarSign,
      glow: 'shadow-blue-500/10 dark:shadow-blue-500/5',
      ringColor: 'stroke-blue-500',
      trackColor: 'stroke-blue-100 dark:stroke-blue-950/40',
      bgGrad: 'from-blue-50/50 to-white dark:from-blue-950/10 dark:to-slate-900',
      labelColor: 'text-blue-500'
    },
    news: {
      icon: Newspaper,
      glow: 'shadow-indigo-500/10 dark:shadow-indigo-500/5',
      ringColor: 'stroke-indigo-500',
      trackColor: 'stroke-indigo-100 dark:stroke-indigo-950/40',
      bgGrad: 'from-indigo-50/50 to-white dark:from-indigo-950/10 dark:to-slate-900',
      labelColor: 'text-indigo-500'
    },
    risk: {
      icon: ShieldAlert,
      glow: 'shadow-amber-500/10 dark:shadow-amber-500/5',
      ringColor: 'stroke-amber-500',
      trackColor: 'stroke-amber-100 dark:stroke-amber-950/40',
      bgGrad: 'from-amber-50/50 to-white dark:from-amber-950/10 dark:to-slate-900',
      labelColor: 'text-amber-500'
    },
    final: {
      icon: Award,
      glow: 'shadow-emerald-500/10 dark:shadow-emerald-500/5',
      ringColor: 'stroke-emerald-500',
      trackColor: 'stroke-emerald-100 dark:stroke-emerald-950/40',
      bgGrad: 'from-emerald-50/50 to-white dark:from-emerald-950/10 dark:to-slate-900',
      labelColor: 'text-emerald-500'
    }
  };

  const currentTheme = themeMap[type] || themeMap.financial;
  const IconComponent = currentTheme.icon;

  // SVG Gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const percentage = (normalizedScore / maxScore) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-between p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-gradient-to-br ${currentTheme.bgGrad} shadow-lg ${currentTheme.glow} transition-all duration-300 hover:-translate-y-1`}>
      
      {/* Visual Meta Data */}
      <div className="flex gap-4 items-center">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 shadow-sm ${currentTheme.labelColor}`}>
          <IconComponent className="h-6 w-6" />
        </div>
        <div>
          <span className="text-sm font-semibold text-slate-400 block tracking-wide uppercase">
            {title}
          </span>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 block">
            {normalizedScore}
            <span className="text-slate-400 dark:text-slate-600 text-sm font-semibold">
              /{maxScore}
            </span>
          </span>
        </div>
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative h-20 w-20 flex items-center justify-center">
        <svg className="h-full w-full -rotate-90">
          {/* Base Track */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={`fill-none ${currentTheme.trackColor}`}
            strokeWidth="6"
          />
          {/* Active Ring */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={`fill-none transition-all duration-1000 ease-out ${currentTheme.ringColor}`}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-sm font-extrabold text-slate-700 dark:text-slate-300">
          {Math.round(percentage)}%
        </span>
      </div>

    </div>
  );
};

export default ScoreCard;
