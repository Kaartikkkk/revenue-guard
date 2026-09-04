'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  payment_failed_received: { label: 'Webhook Received', icon: AlertTriangle, color: 'text-rose-400', bgColor: 'bg-rose-500/15', border: 'border-rose-500/30' },
  diagnosis_complete: { label: 'AI Diagnosis Complete', icon: Brain, color: 'text-purple-400', bgColor: 'bg-purple-500/15', border: 'border-purple-500/30' },
  strategy_selected: { label: 'Strategy Formulated', icon: Zap, color: 'text-blue-400', bgColor: 'bg-blue-500/15', border: 'border-blue-500/30' },
  retry_initiated: { label: 'Payment Retry Triggered', icon: RefreshCw, color: 'text-cyan-400', bgColor: 'bg-cyan-500/15', border: 'border-cyan-500/30' },
  retry_success: { label: 'Payment Recovered', icon: CheckCircle2, color: 'text-emerald-400', bgColor: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
  retry_failed: { label: 'Retry Attempt Failed', icon: XCircle, color: 'text-rose-400', bgColor: 'bg-rose-500/15', border: 'border-rose-500/30' },
  payment_link_created: { label: 'Razorpay Payment Link Created', icon: Link2, color: 'text-indigo-400', bgColor: 'bg-indigo-500/15', border: 'border-indigo-500/30' },
  notification_sent: { label: 'Customer Nudge Sent', icon: Bell, color: 'text-amber-400', bgColor: 'bg-amber-500/15', border: 'border-amber-500/30' },
  human_gate_triggered: { label: 'Human Gate Triggered (Safety Threshold)', icon: Shield, color: 'text-amber-400', bgColor: 'bg-amber-500/15', border: 'border-amber-500/30' },
  human_approved: { label: 'Merchant Approved', icon: CheckCircle2, color: 'text-emerald-400', bgColor: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
  human_rejected: { label: 'Merchant Rejected', icon: XCircle, color: 'text-rose-400', bgColor: 'bg-rose-500/15', border: 'border-rose-500/30' },
  budget_cap_hit: { label: 'Budget Cap Enforced', icon: AlertTriangle, color: 'text-amber-400', bgColor: 'bg-amber-500/15', border: 'border-amber-500/30' },
  agent_error: { label: 'Agent Exception', icon: Bug, color: 'text-rose-400', bgColor: 'bg-rose-500/15', border: 'border-rose-500/30' },
  fallback_activated: { label: 'Rule Fallback Used', icon: ArrowDownCircle, color: 'text-amber-400', bgColor: 'bg-amber-500/15', border: 'border-amber-500/30' },
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
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              Auditing & Governance
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Autonomous <span className="gradient-text-blue">Audit Log</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            100% transparent execution trail documenting AI agent decisions, confidence levels, and human actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            {logs.length} Log Entries
          </span>
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 shadow-md transition-all"
          >
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-900/80 text-slate-200 text-xs font-semibold rounded-xl px-4 py-2.5 border border-slate-800 focus:border-indigo-500 focus:outline-none w-full sm:w-60 shadow-sm"
          >
            <option value="">All Action Types</option>
            {Object.entries(actionConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Payment ID..."
            value={searchPaymentId}
            onChange={(e) => setSearchPaymentId(e.target.value)}
            className="bg-slate-900/80 text-slate-200 text-xs font-mono rounded-xl pl-10 pr-4 py-2.5 border border-slate-800 focus:border-indigo-500 focus:outline-none w-full shadow-sm"
          />
        </div>
      </div>

      {/* Timeline Stream */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-900/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="glass-card rounded-3xl border border-slate-800/80 p-16 text-center">
          <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-60" />
          <p className="text-base font-bold text-slate-300">No audit logs matching query</p>
          <p className="text-xs text-slate-500 mt-1">Actions triggered by the agent or simulation engine will be recorded here.</p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-4">
          {/* Vertical Glowing Timeline Wire */}
          <div className="absolute left-3 sm:left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500/40 to-slate-800" />

          {logs.map((log, idx) => {
            const config = actionConfig[log.action] || {
              label: log.action,
              icon: Zap,
              color: 'text-slate-300',
              bgColor: 'bg-slate-800',
              border: 'border-slate-700',
            };
            const Icon = config.icon;

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="relative group"
              >
                {/* Timeline Node Dot */}
                <div className={`
                  absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full ${config.bgColor} border ${config.border}
                  flex items-center justify-center shadow-lg ring-4 ring-slate-950 z-10
                `}>
                  <Icon className={`w-3 h-3 ${config.color}`} />
                </div>

                <div className="glass-card rounded-2xl border border-slate-800/80 p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-xl border ${config.bgColor} ${config.color} ${config.border}`}>
                        {config.label}
                      </span>

                      {log.confidence_score !== null && (
                        <span className="text-[11px] font-mono text-purple-300 bg-purple-500/15 px-2.5 py-0.5 rounded-lg border border-purple-500/30">
                          🤖 Confidence: {(log.confidence_score * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-slate-500">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>

                  {/* Details Data Grid */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-1.5">
                    {Object.entries(log.details).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2">
                        <span className="text-slate-500 font-semibold min-w-[120px]">{key}:</span>
                        <span className="text-slate-200 break-all">
                          {typeof value === 'object' ? JSON.stringify(value, null, 1) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* AI Reasoning Section */}
                  {log.ai_reasoning && (
                    <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-1">
                      <div className="flex items-center gap-1.5 text-purple-400">
                        <Brain className="w-3.5 h-3.5" />
                        <span className="text-xs font-extrabold uppercase tracking-wide">AI Agent Reasoning</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {log.ai_reasoning}
                      </p>
                    </div>
                  )}

                  {/* References */}
                  {log.failed_payment_id && (
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 pt-1">
                      <Lock className="w-3 h-3 text-slate-600" />
                      <span>Payment Reference ID:</span>
                      <span className="text-indigo-400">{log.failed_payment_id}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
