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

function formatDetailValue(val: unknown): string {
  if (val === null || val === undefined) return 'None';
  if (typeof val === 'object') {
    try {
      return Object.entries(val as Record<string, unknown>)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' • ');
    } catch {
      return String(val);
    }
  }
  return String(val);
}

function cleanReasoning(text: string | null): string | null {
  if (!text) return null;
  return text.replace(/^\[.*?\]\s*/g, '').replace(/^\[.*?\]\s*/g, '').trim();
}

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
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-20 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Audit Trail</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
              Governance Log
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Complete transparent log of AI failure diagnoses, retry attempts, and human gating decisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
            {logs.length} Entries Logged
          </span>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="mockup-card p-4 flex items-center gap-4 bg-slate-900/60 border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">AI Diagnoses Completed</p>
            <p className="text-xl font-extrabold text-white font-mono">
              {logs.filter(l => l.action === 'diagnosis_complete').length}
            </p>
          </div>
        </div>

        <div className="mockup-card p-4 flex items-center gap-4 bg-slate-900/60 border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Human Safety Triggers</p>
            <p className="text-xl font-extrabold text-amber-400 font-mono">
              {logs.filter(l => l.action.includes('human')).length}
            </p>
          </div>
        </div>

        <div className="mockup-card p-4 flex items-center gap-4 bg-slate-900/60 border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Successful Actions</p>
            <p className="text-xl font-extrabold text-emerald-400 font-mono">
              {logs.filter(l => l.action.includes('success') || l.action.includes('approved')).length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-900/80 text-slate-200 text-xs font-semibold rounded-xl px-4 py-2 border border-slate-800 focus:border-purple-500 focus:outline-none w-full sm:w-60"
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
            className="bg-slate-900/80 text-slate-200 text-xs font-mono rounded-xl pl-10 pr-4 py-2 border border-slate-800 focus:border-purple-500 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Stream of Audit Logs */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-900/80 rounded-2xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="mockup-card p-12 text-center space-y-2">
          <ClipboardList className="w-8 h-8 text-slate-500 mx-auto opacity-50" />
          <p className="text-sm font-bold text-slate-300">No audit logs matching criteria</p>
          <p className="text-xs text-slate-500">Actions triggered by the recovery agent will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const config = actionConfig[log.action] || {
              label: log.action,
              icon: Zap,
              color: 'text-slate-300',
              bgColor: 'bg-slate-800',
              border: 'border-slate-700',
            };
            const Icon = config.icon;
            const cleanedReasoning = cleanReasoning(log.ai_reasoning);

            return (
              <div key={log.id} className="mockup-card p-4 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${config.bgColor} ${config.border} border`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <span className={`text-xs font-bold ${config.color}`}>
                      {config.label}
                    </span>

                    {log.confidence_score !== null && (
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                        AI Confidence: {(log.confidence_score * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                {/* Details Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {Object.entries(log.details).map(([key, value]) => (
                    <div key={key} className="space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{key.replace(/_/g, ' ')}</p>
                      <p className="text-slate-300 font-mono text-[11px] truncate">
                        {formatDetailValue(value)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* AI Reasoning */}
                {cleanedReasoning && (
                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5" /> AI Diagnosis Reasoning
                    </span>
                    <p className="leading-relaxed">{cleanedReasoning}</p>
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
