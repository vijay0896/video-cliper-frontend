/**
 * @file src/components/common/TableSkeleton.jsx
 * @description Standardized skeleton loader for lists and data tables
 */
import React from 'react';

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-paper2 border border-rule rounded-card overflow-hidden">
      <div className="h-10 border-b border-rule bg-paper3/40 flex items-center px-4 gap-4">
        <div className="h-3 w-32 bg-paper3 rounded animate-pulse" />
        <div className="h-3 w-24 bg-paper3 rounded animate-pulse" />
        <div className="h-3 w-20 bg-paper3 rounded animate-pulse ml-auto" />
      </div>
      <div className="divide-y divide-rule">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
            <div className="h-10 w-16 bg-paper3 rounded shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 w-1/3 bg-paper3 rounded" />
              <div className="h-2.5 w-1/4 bg-paper3 rounded" />
            </div>
            <div className="h-8 w-20 bg-paper3 rounded shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

