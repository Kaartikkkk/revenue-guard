'use client';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusMap: Record<string, { label: string; dotColor: string; textColor: string; border: string }> = {
  failed: { label: 'Failed', dotColor: 'bg-rose-500', textColor: 'text-rose-400', border: 'border-rose-500/30 bg-rose-500/10' },
  recovering: { label: 'Recovering', dotColor: 'bg-blue-400', textColor: 'text-blue-400', border: 'border-blue-500/30 bg-blue-500/10' },
  recovered: { label: 'Recovered', dotColor: 'bg-emerald-400', textColor: 'text-emerald-400', border: 'border-emerald-500/30 bg-emerald-500/10' },
  pending_approval: { label: 'Pending Approval', dotColor: 'bg-amber-400', textColor: 'text-amber-400', border: 'border-amber-500/30 bg-amber-500/10' },
  abandoned: { label: 'Abandoned', dotColor: 'bg-zinc-500', textColor: 'text-zinc-400', border: 'border-zinc-700 bg-zinc-800/40' },
  pending: { label: 'Pending', dotColor: 'bg-amber-400', textColor: 'text-amber-400', border: 'border-amber-500/30 bg-amber-500/10' },
  in_progress: { label: 'In Progress', dotColor: 'bg-blue-400', textColor: 'text-blue-400', border: 'border-blue-500/30 bg-blue-500/10' },
  success: { label: 'Success', dotColor: 'bg-emerald-400', textColor: 'text-emerald-400', border: 'border-emerald-500/30 bg-emerald-500/10' },
  approved: { label: 'Approved', dotColor: 'bg-emerald-400', textColor: 'text-emerald-400', border: 'border-emerald-500/30 bg-emerald-500/10' },
  rejected: { label: 'Rejected', dotColor: 'bg-rose-500', textColor: 'text-rose-400', border: 'border-rose-500/30 bg-rose-500/10' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusMap[status] || {
    label: status,
    dotColor: 'bg-zinc-500',
    textColor: 'text-zinc-400',
    border: 'border-zinc-700 bg-zinc-800/40',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded border font-mono font-medium tracking-tight
        ${config.border} ${config.textColor}
        ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
}
