'use client';

import { CheckCircle2, Clock, AlertTriangle, XCircle, RefreshCw, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string; glow: string; icon: any }> = {
  failed: { 
    label: 'Failed', 
    bg: 'bg-rose-500/10', 
    text: 'text-rose-400', 
    border: 'border-rose-500/25', 
    glow: 'shadow-rose-500/20',
    icon: XCircle
  },
  recovering: { 
    label: 'Recovering', 
    bg: 'bg-indigo-500/15', 
    text: 'text-indigo-300', 
    border: 'border-indigo-500/30', 
    glow: 'shadow-indigo-500/20',
    icon: RefreshCw
  },
  recovered: { 
    label: 'Recovered', 
    bg: 'bg-emerald-500/15', 
    text: 'text-emerald-300', 
    border: 'border-emerald-500/30', 
    glow: 'shadow-emerald-500/20',
    icon: CheckCircle2
  },
  pending_approval: { 
    label: 'Human Approval Required', 
    bg: 'bg-amber-500/15', 
    text: 'text-amber-300', 
    border: 'border-amber-500/35', 
    glow: 'shadow-amber-500/20',
    icon: ShieldAlert
  },
  abandoned: { 
    label: 'Abandoned', 
    bg: 'bg-slate-800/60', 
    text: 'text-slate-400', 
    border: 'border-slate-700/50', 
    glow: 'shadow-none',
    icon: AlertTriangle
  },
  pending: { 
    label: 'Pending', 
    bg: 'bg-amber-500/15', 
    text: 'text-amber-300', 
    border: 'border-amber-500/30', 
    glow: 'shadow-amber-500/20',
    icon: Clock
  },
  in_progress: { 
    label: 'In Progress', 
    bg: 'bg-blue-500/15', 
    text: 'text-blue-300', 
    border: 'border-blue-500/30', 
    glow: 'shadow-blue-500/20',
    icon: RefreshCw
  },
  success: { 
    label: 'Success', 
    bg: 'bg-emerald-500/15', 
    text: 'text-emerald-300', 
    border: 'border-emerald-500/30', 
    glow: 'shadow-emerald-500/20',
    icon: CheckCircle2
  },
  skipped: { 
    label: 'Skipped', 
    bg: 'bg-slate-800/60', 
    text: 'text-slate-400', 
    border: 'border-slate-700/50', 
    glow: 'shadow-none',
    icon: AlertTriangle
  },
  approved: { 
    label: 'Approved', 
    bg: 'bg-emerald-500/15', 
    text: 'text-emerald-300', 
    border: 'border-emerald-500/30', 
    glow: 'shadow-emerald-500/20',
    icon: CheckCircle2
  },
  rejected: { 
    label: 'Rejected', 
    bg: 'bg-rose-500/10', 
    text: 'text-rose-400', 
    border: 'border-rose-500/25', 
    glow: 'shadow-rose-500/20',
    icon: XCircle
  },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    bg: 'bg-slate-800/60',
    text: 'text-slate-400',
    border: 'border-slate-700/50',
    glow: 'shadow-none',
    icon: Clock,
  };

  const Icon = config.icon;
  const isSpinner = status === 'recovering' || status === 'in_progress';

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-[11px]',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-3.5 py-2 text-sm font-semibold',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md font-semibold tracking-wide shadow-sm
        transition-all duration-200 ${config.bg} ${config.text} ${config.border} ${config.glow} ${sizeClasses[size]}
      `}
    >
      <Icon className={`w-3.5 h-3.5 ${isSpinner ? 'animate-spin text-indigo-400' : ''}`} />
      <span>{config.label}</span>
    </span>
  );
}
