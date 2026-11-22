import React from 'react';

const variantClasses = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  verified: 'bg-teal-50 text-teal-700 border-teal-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  requested: 'bg-amber-50 text-amber-700 border-amber-200',
  under_treatment: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  chronic: 'bg-purple-50 text-purple-700 border-purple-200',
  mild: 'bg-sky-50 text-sky-700 border-sky-200',
  moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  severe: 'bg-rose-50 text-rose-700 border-rose-200',
  life_threatening: 'bg-red-100 text-red-800 border-red-300 font-bold animate-pulse',
  critical: 'bg-red-50 text-red-700 border-red-200',
  discontinued: 'bg-slate-100 text-slate-600 border-slate-200',
  suspended: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
  revoked: 'bg-rose-50 text-rose-700 border-rose-200',
  default: 'bg-slate-50 text-slate-700 border-slate-200',
};

export const Badge = ({ children, variant = 'default', className = '', size = 'md' }) => {
  const normVariant = variant.toLowerCase().replace(/\s+/g, '_');
  const colorClass = variantClasses[normVariant] || variantClasses.default;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${colorClass} ${sizeClass} tracking-wide ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {children}
    </span>
  );
};

export default Badge;
