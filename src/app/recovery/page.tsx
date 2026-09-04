'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Brain,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Lock,
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

export default function RecoveryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
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

  const filters = [
    { value: '', label: 'All Payments' },
    { value: 'pending_approval', label: 'Pending Approval', count: payments.filter(p => p.status === 'pending_approval').length },
    { value: 'recovering', label: 'Active Recoveries' },
    { value: 'recovered', label: 'Recovered' },
    { value: 'failed', label: 'Failed' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              Live Recovery Hub
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Payment Recovery <span className="gradient-text-blue">Workflows</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage autonomous agent recovery steps and review human-in-the-loop approvals.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-all shadow-md"
        >
          <RefreshCw className="w-4 h-4 text-indigo-400" />
          Refresh List
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`
              px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap
              ${filter === f.value
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-inner'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/60'
              }
            `}
          >
            {f.label}
            {f.count !== undefined && f.count > 0 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Payments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-900/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="glass-card rounded-3xl border border-slate-800/80 p-16 text-center">
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-60" />
          <p className="text-base font-bold text-slate-300">No payment records found</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {filter ? 'Try selecting a different filter tab.' : 'Run a scenario from the Simulation Lab to generate test failures.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {payments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`
                  glass-card rounded-2xl border transition-all duration-200 overflow-hidden
                  ${payment.status === 'pending_approval' 
                    ? 'border-amber-500/40 shadow-amber-500/10' 
                    : 'border-slate-800/80'
                  }
                `}
              >
                {/* Card Summary Header */}
                <div
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-900/40 transition-colors"
                  onClick={() => setExpandedId(expandedId === payment.id ? null : payment.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`
                      w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm border shadow-inner shrink-0
                      ${payment.status === 'pending_approval' 
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
                        : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                      }
                    `}>
                      {(payment.customer_name || 'U').charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="text-sm font-extrabold text-white truncate">
                          {payment.customer_name || payment.customer_email || 'Unknown Customer'}
                        </span>
                        <StatusBadge status={payment.status} />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="text-slate-300 font-semibold">{payment.razorpay_payment_id}</span>
                        <span>•</span>
                        <span className="capitalize">{payment.method || 'card'}</span>
                        <span>•</span>
                        <span className="text-indigo-300 font-sans font-semibold">{payment.failure_category.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-white">
                        {payment.amountFormatted}
                      </p>
                      <p className="text-[11px] font-mono text-slate-500">
                        {new Date(payment.created_at).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-800/60 text-slate-400">
                      {expandedId === payment.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {expandedId === payment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-slate-800/80 p-6 bg-slate-950/60 space-y-5"
                  >
                    {/* Bounded Approval Banner */}
                    {payment.status === 'pending_approval' && (
                      <div className="p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent space-y-3">
                        <div className="flex items-center gap-2.5">
                          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                          <div>
                            <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wide">
                              Human Approval Required (Bounded Control)
                            </h4>
                            <p className="text-xs text-amber-200/80 mt-0.5">
                              Transaction amount ({payment.amountFormatted}) exceeds the ₹5,000 auto-recovery safety threshold.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleApproval(payment.id, 'approve'); }}
                            disabled={approving === payment.id}
                            className="flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {approving === payment.id ? 'Executing Agent Strategy...' : 'Approve Recovery Action'}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleApproval(payment.id, 'reject'); }}
                            disabled={approving === payment.id}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4 text-rose-400" />
                            Reject
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Technical Failure Details */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        Razorpay Webhook Diagnostic Data
                      </h4>
                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs space-y-1">
                        <p className="text-rose-400 font-bold">{payment.error_code || 'PAYMENT_ERROR'}</p>
                        <p className="text-slate-300">{payment.error_description || 'No detailed error message provided.'}</p>
                      </div>
                    </div>

                    {/* Agent Strategy & Recovery Attempts */}
                    {payment.recoveryAttempts.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                          <Brain className="w-3.5 h-3.5 text-indigo-400" />
                          AI Agent Execution Timeline
                        </h4>
                        <div className="space-y-3">
                          {payment.recoveryAttempts.map((attempt) => (
                            <div key={attempt.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-xs font-extrabold text-white capitalize bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                                    Attempt #{attempt.attempt_number} • {attempt.strategy.replace(/_/g, ' ')}
                                  </span>
                                  <StatusBadge status={attempt.status} />
                                </div>
                                <span className="text-[11px] font-mono text-slate-500">
                                  {new Date(attempt.created_at).toLocaleTimeString()}
                                </span>
                              </div>

                              {attempt.diagnosis && (
                                <p className="text-xs text-slate-300 font-medium pt-1">
                                  🧠 <span className="font-semibold text-indigo-300">Diagnosis:</span> {attempt.diagnosis}
                                </p>
                              )}

                              {attempt.reasoning && (
                                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/60 text-xs text-slate-400 italic">
                                  &quot;{attempt.reasoning}&quot;
                                </div>
                              )}

                              {attempt.payment_link_url && (
                                <div className="pt-1">
                                  <a
                                    href={attempt.payment_link_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 transition-all shadow-md"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Open Live Razorpay Payment Link ({attempt.payment_link_url})
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
