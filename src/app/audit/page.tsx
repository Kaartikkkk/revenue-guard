'use client';

import { useState, useEffect } from 'react';
import {
  ClipboardList,
  RefreshCw,
  Filter,
  Brain,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shield,
  Zap,
  Link2,
  Bell,
  Bug,
  ArrowDownCircle,
  Search,
  Lock,
  Activity,
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  failed_payment_id: string | null;
  recovery_attempt_id: string | null;
  action: string;
  details: Record<string, unknown>;
  ai_reasoning: string | null;
  confidence_score: number | null;
  created_at: string;
}

const actionConfig: Record<string, { label: string; icon: any; color: string; bgColor: string; border: string }> = {
  payment_failed_received: { label: 'Webhook Ingested', icon: AlertTriangle, color: 'text-rose-400', bgColor: 'bg-rose-500/15', border: 'border-rose-500/30' },
  diagnosis_complete: { label: 'AI Diagnosis Complete', icon: Brain, color: 'text-purple-400', bgColor: 'bg-purple-500/15', border: 'border-purple-500/30' },
  strategy_selected: { label: 'Strategy Selected', icon: Zap, color: 'text-blue-400', bgColor: 'bg-blue-500/15', border: 'border-blue-500/30' },
  retry_initiated: { label: 'Retry Initiated', icon: RefreshCw, color: 'text-cyan-400', bgColor: 'bg-cyan-500/15', border: 'border-cyan-500/30' },
  retry_success: { label: 'Payment Recovered', icon: CheckCircle2, color: 'text-emerald-400', bgColor: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
  retry_failed: { label: 'Retry Failed', icon: XCircle, color: 'text-rose-400', bgColor: 'bg-rose-500/15', border: 'border-rose-500/30' },
  payment_link_created: { label: 'Razorpay Payment Link Created', icon: Link2, color: 'text-blue-400', bgColor: 'bg-blue-500/15', border: 'border-blue-500/30' },
  notification_sent: { label: 'Notification Nudge Sent', icon: Bell, color: 'text-amber-400', bgColor: 'bg-amber-500/15', border: 'border-amber-500/30' },
  human_gate_triggered: { label: 'Human Gate Triggered', icon: Shield, color: 'text-amber-400', bgColor: 'bg-amber-500/15', border: 'border-amber-500/30' },
  human_approved: { label: 'Merchant Approved', icon: CheckCircle2, color: 'text-emerald-400', bgColor: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
  human_rejected: { label: 'Merchant Rejected', icon: XCircle, color: 'text-rose-400', bgColor: 'bg-rose-500/15', border: 'border-rose-500/30' },
  budget_cap_hit: { label: 'Budget Policy Enforced', icon: AlertTriangle, color: 'text-amber-400', bgColor: 'bg-amber-500/15', border: 'border-amber-500/30' },
  agent_error: { label: 'Agent Exception', icon: Bug, color: 'text-rose-400', bgColor: 'bg-rose-500/15', border: 'border-rose-500/30' },
  fallback_activated: { label: 'Rule Engine Fallback', icon: ArrowDownCircle, color: 'text-amber-400', bgColor: 'bg-amber-500/15', border: 'border-amber-500/30' },
};

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>('');
  const [searchPaymentId, setSearchPaymentId] = useState('');

  const fetchLogs = async () => {
    try {
      let url = '/api/audit?limit=200';
      if (actionFilter) url += `&action=${actionFilter}`;
      if (searchPaymentId) url += `&payment_id=${searchPaymentId}`;
      const res = await fetch(url);
      const json = await res.json();
      setLogs(json.logs || []);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 4000);
    return () => clearInterval(interval);
  }, [actionFilter, searchPaymentId]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-16 font-sans select-none">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Auditing & Governance
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Autonomous <span className="text-purple-400">Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Immutable log of every AI agent decision, webhook payload, and human approval step.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-mono font-bold text-slate-300 bg-[#0e1526] px-3.5 py-2 rounded-xl border border-slate-800">
            {logs.length} Log Entries
          </span>
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-300 bg-[#0e1526] hover:bg-[#131c33] rounded-xl border border-slate-800 transition-all shadow-md"
          >
            <RefreshCw className="w-4 h-4 text-purple-400" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="mockup-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400">Total Audit Logs</p>
            <p className="text-2xl font-extrabold text-white font-mono">{logs.length}</p>
          </div>
        </div>

        <div className="mockup-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400">AI Diagnoses</p>
            <p className="text-2xl font-extrabold text-white font-mono">
              {logs.filter(l => l.action === 'diagnosis_complete').length}
            </p>
          </div>
        </div>

        <div className="mockup-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400">Human Gate Events</p>
            <p className="text-2xl font-extrabold text-amber-400 font-mono">
              {logs.filter(l => l.action.includes('human')).length}
            </p>
          </div>
        </div>

        <div className="mockup-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400">Successful Actions</p>
            <p className="text-2xl font-extrabold text-emerald-400 font-mono">
              {logs.filter(l => l.action.includes('success') || l.action.includes('approved')).length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-[#0e1526] text-slate-200 text-xs font-semibold rounded-xl px-4 py-2.5 border border-slate-800 focus:border-purple-500 focus:outline-none w-full sm:w-60 shadow-sm"
          >
            <option value="">All Action Types</option>
            {Object.entries(actionConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Payment ID..."
            value={searchPaymentId}
            onChange={(e) => setSearchPaymentId(e.target.value)}
            className="bg-[#0e1526] text-slate-200 text-xs font-mono rounded-xl pl-10 pr-4 py-2.5 border border-slate-800 focus:border-purple-500 focus:outline-none w-full shadow-sm"
          />
        </div>
      </div>

      {/* Stream of Audit Logs */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="mockup-card p-16 text-center">
          <ClipboardList className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-60" />
          <p className="text-base font-bold text-slate-300">No audit logs matching query</p>
          <p className="text-xs text-slate-400 mt-1">Actions triggered by the agent will be recorded here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => {
            const config = actionConfig[log.action] || {
              label: log.action,
              icon: Zap,
              color: 'text-slate-300',
              bgColor: 'bg-slate-800',
              border: 'border-slate-700',
            };
            const Icon = config.icon;

            return (
              <div key={log.id} className="mockup-card p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bgColor} ${config.border} border`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <span className={`text-xs font-extrabold ${config.color}`}>
                      {config.label}
                    </span>

                    {log.confidence_score !== null && (
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                        🤖 Confidence: {(log.confidence_score * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Details Data Box */}
                <div className="p-3.5 rounded-xl bg-[#0b101d] border border-slate-800/80 font-mono text-xs text-slate-300 space-y-1.5">
                  {Object.entries(log.details).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2">
                      <span className="text-slate-400 font-semibold min-w-[120px]">{key}:</span>
                      <span className="text-slate-200 break-all">
                        {typeof value === 'object' ? JSON.stringify(value, null, 1) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* AI Reasoning Section */}
                {log.ai_reasoning && (
                  <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-purple-400">
                      <Brain className="w-3.5 h-3.5" />
                      <span className="text-xs font-extrabold uppercase tracking-wide">AI Agent Reasoning</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {log.ai_reasoning}
                    </p>
                  </div>
                )}

                {/* Reference ID */}
                {log.failed_payment_id && (
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 pt-1">
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>Payment Reference ID:</span>
                    <span className="text-blue-400 font-bold">{log.failed_payment_id}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
