import React from 'react';

/**
 * SkeletonBase Component.
 * Standard pulsing base shimmer block.
 */
export const SkeletonBase = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-850 rounded-xl ${className}`} />
  );
};

/**
 * ScoreCardSkeleton.
 * Mimics ScoreCard circular rings and value badges.
 */
export const ScoreCardSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
      <div className="flex gap-4 items-center">
        <SkeletonBase className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <SkeletonBase className="h-3.5 w-24" />
          <SkeletonBase className="h-6 w-10" />
        </div>
      </div>
      <SkeletonBase className="h-16 w-16 rounded-full" />
    </div>
  );
};

/**
 * CardSkeleton.
 * Mimics chart bar modules.
 */
export const CardSkeleton = () => {
  return (
    <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center mb-2">
        <SkeletonBase className="h-4 w-36" />
      </div>
      <div className="flex-1 flex items-end gap-3 h-48 justify-around pt-6">
        <SkeletonBase className="h-20 w-8 rounded-t-lg" />
        <SkeletonBase className="h-36 w-8 rounded-t-lg" />
        <SkeletonBase className="h-28 w-8 rounded-t-lg" />
        <SkeletonBase className="h-44 w-8 rounded-t-lg" />
      </div>
    </div>
  );
};

/**
 * ReportSkeleton.
 * Mimics textual paragraphs list layouts.
 */
export const ReportSkeleton = () => {
  return (
    <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4 h-full">
      <SkeletonBase className="h-5 w-48 mb-6" />
      <div className="space-y-3">
        <SkeletonBase className="h-3 w-full" />
        <SkeletonBase className="h-3 w-11/12" />
        <SkeletonBase className="h-3 w-10/12" />
        <div className="h-2" />
        <SkeletonBase className="h-3 w-full" />
        <SkeletonBase className="h-3 w-9/12" />
        <SkeletonBase className="h-3 w-11/12" />
        <SkeletonBase className="h-3 w-8/12" />
      </div>
    </div>
  );
};

export default {
  SkeletonBase,
  ScoreCardSkeleton,
  CardSkeleton,
  ReportSkeleton
};
