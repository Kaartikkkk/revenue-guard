'use client';

import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import {
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Sparkles,
  CreditCard,
  AlertCircle,
  Clock,
  Zap,
  ArrowUpRight,
  User,
  Activity,
} from 'lucide-react';

interface Payment {
  id: string;
  razorpay_payment_id: string;
  amount: number;
  currency: string;
  customer_email: string | null;
  customer_name: string | null;
  error_code: string | null;
  error_description: string | null;
  failure_category: string;
  status: string;
  method: string | null;
  retry_count: number;
  max_retries: number;
  created_at: string;
  amountFormatted: string;
  recoveryAttempts: Array<{
    id: string;
    strategy: string;
    status: string;
    attempt_number: number;
    diagnosis: string | null;
    reasoning: string | null;
    result: string | null;
    payment_link_url: string | null;
    created_at: string;
  }>;
}

const categoryLabels: Record<string, string> = {
  network_error: 'Network Timeout',
  insufficient_funds: 'Insufficient Balance',
  card_declined: 'Card Declined',
  expired_card: 'Expired Card',
  authentication_failed: 'Authentication Failed',
  bank_error: 'Bank Outage',
  invalid_details: 'Invalid Payment Details',
  unknown: 'Unspecified Error',
};

// Clean reasoning formatter to remove ugly debug tags
function cleanReasoningText(text: string | null): string {
  if (!text) return 'Recommended automated recovery strategy based on error analysis.';
  return text
    .replace(/^\[.*?\]\s*/g, '')
    .replace(/^\[.*?\]\s*/g, '')
    .trim();
}

export default function RecoveryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      const url = filter ? `/api/recovery?status=${filter}` : '/api/recovery';
      const res = await fetch(url);
      const json = await res.json();
      setPayments(json.payments || []);
    } catch (error) {
      console.error('Failed to fetch recovery data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 4000);
    return () => clearInterval(interval);
  }, [filter]);

  const handleApproval = async (paymentId: string, action: 'approve' | 'reject') => {
    setApproving(paymentId);
    try {
      await fetch(`/api/recovery/${paymentId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      await fetchPayments();
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setApproving(null);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.razorpay_payment_id.toLowerCase().includes(term) ||
      (p.customer_name && p.customer_name.toLowerCase().includes(term)) ||
      (p.customer_email && p.customer_email.toLowerCase().includes(term))
    );
  });

  const filters = [
    { label: 'All Recoveries', value: '', count: payments.length },
    { label: 'Pending Approval', value: 'pending_approval', count: payments.filter(p => p.status === 'pending_approval').length },
    { label: 'Active Recoveries', value: 'recovering', count: payments.filter(p => p.status === 'recovering').length },
    { label: 'Recovered', value: 'recovered', count: payments.filter(p => p.status === 'recovered').length },
    { label: 'Failed / Abandoned', value: 'failed', count: payments.filter(p => p.status === 'failed' || p.status === 'abandoned').length },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-20 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Recovery Hub</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
              Live Workflows
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Monitor, approve, and track autonomous payment recovery pipelines.
          </p>
        </div>

        {/* Top Quick Stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <Clock className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase">Approval Queue</p>
              <p className="font-extrabold text-white font-mono">
                {payments.filter(p => p.status === 'pending_approval').length} pending
              </p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase">Recovered</p>
              <p className="font-extrabold text-white font-mono">
                {payments.filter(p => p.status === 'recovered').length} payments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`
                px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap
                ${filter === f.value
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/80 border border-slate-800/80'
                }
              `}
            >
              {f.label}
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                filter === f.value ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search payment ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 text-xs text-slate-200 rounded-xl pl-10 pr-4 py-2 border border-slate-800 focus:border-blue-500 focus:outline-none placeholder:text-slate-500 font-medium"
          />
        </div>
      </div>

      {/* Payment Cards List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-900/80 rounded-2xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="mockup-card p-12 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto opacity-50" />
          <p className="text-sm font-bold text-slate-300">No payment recovery workflows found</p>
          <p className="text-xs text-slate-500">
            {filter || searchTerm ? 'Try adjusting your search or status filter.' : 'Run simulations in the Simulation Lab to inspect live recoveries.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className={`
                mockup-card transition-all duration-200 overflow-hidden rounded-2xl border
                ${payment.status === 'pending_approval'
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : 'border-slate-800 bg-slate-900/60'
                }
              `}
            >
              {/* Payment Card Header */}
              <div
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                onClick={() => setExpandedId(expandedId === payment.id ? null : payment.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm
                    ${payment.status === 'pending_approval'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    }
                  `}>
                    {(payment.customer_name || 'C').charAt(0)}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white truncate">
                        {payment.customer_name || payment.customer_email || 'Customer'}
                      </span>
                      <StatusBadge status={payment.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="font-mono text-slate-300 font-semibold">{payment.razorpay_payment_id}</span>
                      <span>•</span>
                      <span className="capitalize">{payment.method || 'Card'}</span>
                      <span>•</span>
                      <span className="text-purple-300 font-medium">
                        {categoryLabels[payment.failure_category] || payment.failure_category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 shrink-0">
                  <div className="text-right">
                    <p className="text-base font-extrabold text-white font-mono">{payment.amountFormatted}</p>
                    <p className="text-[11px] text-slate-500">
                      {new Date(payment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400">
                    {expandedId === payment.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Clean Expanded Detail Drawer */}
              {expandedId === payment.id && (
                <div className="border-t border-slate-800/80 p-5 bg-[#080d19] space-y-4 text-xs">
                  {/* Approval Gate Alert */}
                  {payment.status === 'pending_approval' && (
                    <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-amber-300">
                            High-Value Safety Gate Triggered
                          </h4>
                          <p className="text-[11px] text-amber-200/80 mt-0.5">
                            This transaction of {payment.amountFormatted} exceeds your safety limit (₹5,000). Operator approval is required to process recovery.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleApproval(payment.id, 'approve'); }}
                          disabled={approving === payment.id}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {approving === payment.id ? 'Approving...' : 'Approve Recovery Action'}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleApproval(payment.id, 'reject'); }}
                          disabled={approving === payment.id}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4 text-rose-400" />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Failure Cause & Diagnosis Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Failure Cause</p>
                      <p className="text-xs font-semibold text-slate-200">
                        {payment.error_description || 'Payment was interrupted or declined.'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recovery Strategy</p>
                      <p className="text-xs font-semibold text-purple-300">
                        {categoryLabels[payment.failure_category] || payment.failure_category} • {payment.retry_count}/{payment.max_retries} Retries Used
                      </p>
                    </div>
                  </div>

                  {/* Agent Execution Steps */}
                  {payment.recoveryAttempts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Execution History</p>
                      {payment.recoveryAttempts.map((attempt) => (
                        <div key={attempt.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white capitalize">
                              Attempt #{attempt.attempt_number} — {attempt.strategy.replace(/_/g, ' ')}
                            </span>
                            <StatusBadge status={attempt.status} />
                          </div>

                          <p className="text-slate-300 font-medium leading-relaxed text-[11px]">
                            {cleanReasoningText(attempt.reasoning)}
                          </p>

                          {attempt.payment_link_url && (
                            <div className="pt-1">
                              <a
                                href={attempt.payment_link_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 transition-all"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Open Razorpay Payment Link</span>
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
