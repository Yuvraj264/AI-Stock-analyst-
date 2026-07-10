import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

/**
 * Premium step-by-step loading screen.
 * Configured with Slate + Platinum style presets: rounded-xl card, platinum active spinner.
 */
export const LoadingSpinner = ({ companyName = 'Stock', isApiFinished = false, onFinished }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    `Connecting to financial indexes and resolving ticker...`,
    `Fetching annual balance sheets and quarterly cash flows...`,
    `Scraping recent press releases and news databases...`,
    `Invoking research model nodes to score market sentiment...`,
    `Running quantitative models to score financial health...`,
    `Evaluating competitive, regulatory, and valuation risks...`,
    `Assembling consensus state and compiling final report...`
  ];

  useEffect(() => {
    // If API finishes, run remaining steps rapidly (every 200ms) for high-performance feel.
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
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-lg mx-auto bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl shadow-lg animate-fadeInUp">
      
      {/* status indicator */}
      <div className="relative flex items-center justify-center h-14 w-14 mb-4">
        <Loader2 className="h-8 w-8 text-[#C0C0C0] animate-spin" />
      </div>

      <h3 className="text-sm font-sans font-bold text-[#FFFFFF] tracking-tight uppercase text-center">
        Analyzing {companyName}
      </h3>
      <p className="mt-1 text-[10px] text-[#B5B5B5] font-semibold uppercase tracking-wide text-center">
        Compiling multi-agent research consensus...
      </p>

      {/* Ticking checks */}
      <div className="w-full mt-6 space-y-3 pt-4 border-t border-[#2D2D2D]">
        {steps.map((text, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-start gap-2.5 transition-opacity duration-150 ${
                isCompleted || isActive ? 'opacity-100' : 'opacity-35'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-[#2ECC71] shrink-0 mt-0.5" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 text-[#C0C0C0] shrink-0 animate-spin mt-0.5" />
              ) : (
                <Circle className="h-4 w-4 text-[#FFFFFF]/10 shrink-0 mt-0.5" />
              )}
              <span
                className={`text-[10px] font-sans font-semibold tracking-wide leading-relaxed uppercase ${
                  isActive
                    ? 'text-[#C0C0C0] font-bold'
                    : isCompleted
                    ? 'text-[#B5B5B5]'
                    : 'text-[#B5B5B5]/60'
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
