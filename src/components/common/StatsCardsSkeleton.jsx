/**
 * @file src/components/common/StatsCardsSkeleton.jsx
 * @description Standardized skeleton loader for metric / KPI cards
 */
import React from 'react';

export const StatsCardsSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-paper2 border border-rule rounded-card p-5 animate-pulse space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 bg-paper3 rounded" />
            <div className="h-6 w-6 bg-paper3 rounded-full" />
          </div>
          <div className="h-7 w-28 bg-paper3 rounded" />
          <div className="h-2.5 w-36 bg-paper3 rounded" />
        </div>
      ))}
    </div>
  );
};

