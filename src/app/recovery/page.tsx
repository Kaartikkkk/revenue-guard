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
  Brain,
  CreditCard,
  AlertCircle,
  Clock,
  Zap,
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
    { value: '', label: 'All Payments', count: payments.length },
    { value: 'pending_approval', label: 'Pending Approval', count: payments.filter(p => p.status === 'pending_approval').length },
    { value: 'recovering', label: 'Active Recoveries', count: payments.filter(p => p.status === 'recovering').length },
    { value: 'recovered', label: 'Recovered', count: payments.filter(p => p.status === 'recovered').length },
    { value: 'failed', label: 'Failed', count: payments.filter(p => p.status === 'failed').length },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-16 font-sans select-none">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Live Operations Hub
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Payment Recovery <span className="text-blue-400">Workflows</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Orchestrate autonomous agent retries and review human-gated approval requests.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-300 bg-[#0e1526] hover:bg-[#131c33] rounded-xl border border-slate-800 transition-all shadow-md shrink-0"
        >
          <RefreshCw className="w-4 h-4 text-blue-400" />
          Refresh List
        </button>
      </div>

      {/* Top 4 Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="mockup-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400">Total Workflows</p>
            <p className="text-2xl font-extrabold text-white font-mono">{payments.length}</p>
          </div>
        </div>

        <div className="mockup-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400">Pending Approval</p>
            <p className="text-2xl font-extrabold text-amber-400 font-mono">
              {payments.filter(p => p.status === 'pending_approval').length}
            </p>
          </div>
        </div>

        <div className="mockup-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400">Active Recoveries</p>
            <p className="text-2xl font-extrabold text-white font-mono">
              {payments.filter(p => p.status === 'recovering').length}
            </p>
          </div>
        </div>

        <div className="mockup-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400">Successfully Recovered</p>
            <p className="text-2xl font-extrabold text-emerald-400 font-mono">
              {payments.filter(p => p.status === 'recovered').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`
                px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap
                ${filter === f.value
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 bg-[#0e1526] border border-slate-800'
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
            placeholder="Search Payment ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0e1526] text-xs text-slate-200 rounded-xl pl-10 pr-4 py-2 border border-slate-800 focus:border-blue-500 focus:outline-none placeholder:text-slate-500 font-medium"
          />
        </div>
      </div>

      {/* Payment Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="mockup-card p-16 text-center">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-60" />
          <p className="text-base font-bold text-slate-300">No matching payment workflows</p>
          <p className="text-xs text-slate-400 mt-1">
            {filter || searchTerm ? 'Try clearing your filters or search terms.' : 'Run simulated webhooks to inspect payment recovery.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className={`
                mockup-card transition-all duration-200 overflow-hidden
                ${payment.status === 'pending_approval' ? 'border-amber-500/40 bg-gradient-to-r from-amber-500/5 via-[#0e1526] to-[#0e1526]' : ''}
              `}
            >
              {/* Payment Card Header Row */}
              <div
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                onClick={() => setExpandedId(expandedId === payment.id ? null : payment.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`
                    w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md shrink-0
                    ${payment.status === 'pending_approval'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    }
                  `}>
                    {(payment.customer_name || 'U').charAt(0)}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-extrabold text-white truncate">
                        {payment.customer_name || payment.customer_email || 'Unknown Customer'}
                      </span>
                      <StatusBadge status={payment.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                      <span className="text-slate-200 font-bold">{payment.razorpay_payment_id}</span>
                      <span>•</span>
                      <span className="capitalize">{payment.method || 'card'}</span>
                      <span>•</span>
                      <span className="text-purple-300 font-sans font-semibold">{payment.failure_category.replace(/_/g, ' ')}</span>
                      <span>•</span>
                      <span>Retries: {payment.retry_count}/{payment.max_retries}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 shrink-0">
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-white font-mono">{payment.amountFormatted}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {new Date(payment.created_at).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-800/80 text-slate-400">
                    {expandedId === payment.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Action & Audit Drawer */}
              {expandedId === payment.id && (
                <div className="border-t border-slate-800/80 p-6 bg-[#0b101d] space-y-5">
                  {/* Human-Gate Approval Action Card */}
                  {payment.status === 'pending_approval' && (
                    <div className="p-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                        <div>
                          <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wide">
                            Human Approval Safety Gate Triggered
                          </h4>
                          <p className="text-xs text-amber-200/80 mt-0.5">
                            Transaction value of {payment.amountFormatted} exceeds the merchant threshold (₹5,000). Manual approval is required to initiate recovery.
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
                          {approving === payment.id ? 'Executing Agent...' : 'Approve Recovery Action'}
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

                  {/* Webhook Error Diagnostic Box */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-rose-400" />
                      Razorpay Webhook Diagnostic Payloads
                    </h4>
                    <div className="p-4 rounded-xl bg-[#0e1526] border border-slate-800 font-mono text-xs space-y-1">
                      <p className="text-rose-400 font-bold">{payment.error_code || 'PAYMENT_ERROR'}</p>
                      <p className="text-slate-300">{payment.error_description || 'No error description provided.'}</p>
                    </div>
                  </div>

                  {/* Agent Strategy & Recovery Execution Attempts */}
                  {payment.recoveryAttempts.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        AI Agent Execution Audit Log
                      </h4>

                      <div className="space-y-3">
                        {payment.recoveryAttempts.map((attempt) => (
                          <div key={attempt.id} className="p-4 rounded-xl bg-[#0e1526] border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <span className="text-xs font-extrabold text-white capitalize bg-blue-600/20 px-3 py-1 rounded-lg border border-blue-500/30">
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
                                🧠 <span className="font-bold text-purple-300">AI Diagnosis:</span> {attempt.diagnosis}
                              </p>
                            )}

                            {attempt.reasoning && (
                              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 italic">
                                &quot;{attempt.reasoning}&quot;
                              </div>
                            )}

                            {attempt.payment_link_url && (
                              <div className="pt-1">
                                <a
                                  href={attempt.payment_link_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-cyan-300 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 transition-all shadow-md"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Open Live Razorpay Payment Link ({attempt.payment_link_url})
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
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
