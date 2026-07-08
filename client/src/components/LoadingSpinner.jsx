import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

/**
 * Premium step-by-step loading screen.
 * Simulates active research agent states to keep the UI engaging.
 */
export const LoadingSpinner = ({ companyName = 'Stock' }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    `Connecting to Yahoo Finance API and resolving ticker...`,
    `Fetching annual balance sheets and quarterly cash flows...`,
    `Scraping recent media headlines and article databases...`,
    `Invoking Gemini API to parse and score market sentiment...`,
    `Running quantitative models to score financial health...`,
    `Evaluating competitive, regulatory, and valuation risks...`,
    `Assembling multi-agent analysis state and compiling report...`
  ];

  useEffect(() => {
    // Increment the simulated loading step indicator periodically
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center p-12 max-w-lg mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl transition-all duration-300">
      
      {/* Spinning Ring */}
      <div className="relative flex items-center justify-center h-20 w-20">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10 dark:border-emerald-500/5"></div>
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-800 dark:text-white text-center">
        Analyzing {companyName}
      </h3>
      <p className="mt-1 text-sm text-slate-400 text-center">
        Our multi-agent consensus graph is compiling metrics...
      </p>

      {/* Steps List */}
      <div className="w-full mt-8 space-y-4">
        {steps.map((text, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 transition-opacity duration-300 ${
                isCompleted || isActive ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              ) : isActive ? (
                <Loader2 className="h-5 w-5 text-emerald-500 shrink-0 animate-spin mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-slate-300 dark:text-slate-700 shrink-0 mt-0.5" />
              )}
              <span
                className={`text-xs font-semibold leading-relaxed ${
                  isActive
                    ? 'text-slate-800 dark:text-white font-bold'
                    : isCompleted
                    ? 'text-slate-500 dark:text-slate-400'
                    : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {text}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default LoadingSpinner;
