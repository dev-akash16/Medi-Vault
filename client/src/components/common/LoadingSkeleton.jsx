import React from 'react';

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  if (type === 'table') {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-100 p-4 space-y-3 animate-pulse">
        <div className="h-8 bg-slate-100 rounded-lg w-full mb-4"></div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-6 bg-slate-100 rounded w-1/4"></div>
            <div className="h-6 bg-slate-100 rounded w-1/4"></div>
            <div className="h-6 bg-slate-100 rounded w-1/4"></div>
            <div className="h-6 bg-slate-100 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
          </div>
          <div className="h-8 bg-slate-200 rounded w-1/2"></div>
          <div className="h-3 bg-slate-100 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
