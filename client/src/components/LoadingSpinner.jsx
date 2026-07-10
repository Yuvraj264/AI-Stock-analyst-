import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

/**
 * Premium step-by-step loading screen.
 * Configured with Slate + Emerald style presets: rounded-lg card, emerald active spinner.
 */
export const LoadingSpinner = ({ companyName = 'Stock', isApiFinished = false, onFinished }) => {
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
    // If API finishes, we run remaining steps rapidly (every 200ms) for high-performance terminal feel.
    const intervalDuration = isApiFinished ? 200 : 2000;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [isApiFinished, steps.length]);

  useEffect(() => {
    if (activeStep === steps.length - 1 && isApiFinished && onFinished) {
      const delay = setTimeout(() => {
        onFinished();
      }, 400);
      return () => clearTimeout(delay);
    }
  }, [activeStep, isApiFinished, onFinished, steps.length]);

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-lg mx-auto bg-[#111827] border border-[#1F2937] rounded-lg shadow-md animate-fadeInUp">
      
      {/* Pulse status indicator */}
      <div className="relative flex items-center justify-center h-14 w-14 mb-4">
        <Loader2 className="h-8 w-8 text-[#10B981] animate-spin" />
      </div>

      <h3 className="text-sm font-sans font-bold text-[#F8FAFC] uppercase tracking-wider text-center">
        Analyzing {companyName}
      </h3>
      <p className="mt-1 text-[10px] font-mono text-[#94A3B8] uppercase tracking-wide text-center">
        EXEC_GRAPH_CONSENSUS: PROCESSING DATASTREAM
      </p>

      {/* Ticking checks */}
      <div className="w-full mt-6 space-y-3 pt-4 border-t border-[#1F2937]">
        {steps.map((text, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-start gap-2.5 transition-opacity duration-150 ${
                isCompleted || isActive ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 text-[#10B981] shrink-0 animate-spin mt-0.5" />
              ) : (
                <Circle className="h-4 w-4 text-[#1F2937] shrink-0 mt-0.5" />
              )}
              <span
                className={`text-[10px] font-mono tracking-wide leading-relaxed uppercase ${
                  isActive
                    ? 'text-[#10B981] font-bold'
                    : isCompleted
                    ? 'text-[#94A3B8]'
                    : 'text-[#64748B]'
                }`}
              >
                [{idx + 1}] {text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Terminal Footer Info */}
      <div className="w-full mt-6 pt-3 border-t border-[#1F2937] flex items-center justify-between text-[8px] font-mono text-[#64748B] tracking-wider uppercase">
        <span>STATUS: WORKING</span>
        <span>SYS_LOG: OK</span>
      </div>

    </div>
  );
};

export default LoadingSpinner;
