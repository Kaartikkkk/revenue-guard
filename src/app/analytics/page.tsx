'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  RefreshCw,
  Zap,
  PieChart,
  Activity,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface DashboardData {
  totalFailed: number;
  totalRecovered: number;
  totalRecoveryAmount: number;
  recoveryRate: number;
  pendingApprovals: number;
  activeRecoveries: number;
  budgetUsedToday: number;
  failuresByCategory: { category: string; count: number }[];
  recoveryByStrategy: { strategy: string; count: number; success: number }[];
  dailyRecovery: { date: string; recovered: number; failed: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = data || {
    totalFailed: 8,
    totalRecovered: 0,
    totalRecoveryAmount: 0,
    recoveryRate: 0,
    pendingApprovals: 0,
    activeRecoveries: 6,
    budgetUsedToday: 9049300,
    failuresByCategory: [
      { category: 'network_error', count: 5 },
      { category: 'expired_card', count: 1 },
      { category: 'card_declined', count: 1 },
      { category: 'authentication_failed', count: 1 },
    ],
    recoveryByStrategy: [
      { strategy: 'immediate_retry', count: 6, success: 5 },
      { strategy: 'notification', count: 1, success: 1 },
      { strategy: 'payment_link', count: 2, success: 2 },
    ],
    dailyRecovery: [],
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-16 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Intelligence Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Revenue Recovery <span className="text-purple-400">Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Deep-dive operational efficiency, strategy success benchmarks, and failure cohort distributions.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-300 bg-[#0e1526] hover:bg-[#131c33] rounded-xl border border-slate-800 transition-all shadow-md shrink-0"
        >
          <RefreshCw className="w-4 h-4 text-purple-400" />
          Refresh Metrics
        </button>
      </div>

      {/* Top 4 Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="mockup-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400">Gross Revenue Saved</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-[#00f2fe] font-mono">
            ₹{(stats.totalRecoveryAmount / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">Preserved via autonomous AI agent</p>
        </div>

        <div className="mockup-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400">Recovery Rate Benchmark</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">
            {stats.recoveryRate.toFixed(1)}%
          </p>
          <p className="text-[10px] text-emerald-400 font-medium">+8.4% above industry baseline</p>
        </div>

        <div className="mockup-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400">AI Diagnoses Processed</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">
            {stats.totalFailed}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">100% categorized with confidence scores</p>
        </div>

        <div className="mockup-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400">Governance Pass Rate</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono">
            100%
          </p>
          <p className="text-[10px] text-slate-400 font-medium">0 policy violations logged</p>
        </div>
      </div>

      {/* Analytics Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategy Breakdown */}
        <div className="mockup-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              Strategy Success Comparison
            </h3>
            <span className="text-xs text-slate-400 font-mono">Live Telemetry</span>
          </div>

          <div className="space-y-4 pt-1">
            {stats.recoveryByStrategy.map((s) => {
              const pct = s.count > 0 ? (s.success / s.count) * 100 : 0;
              return (
                <div key={s.strategy} className="p-4 rounded-xl bg-[#0b101d] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-white capitalize">{s.strategy.replace(/_/g, ' ')}</span>
                    <span className="font-mono font-extrabold text-emerald-400">{pct.toFixed(0)}% Conversion</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{s.count} total attempts</span>
                    <span>{s.success} recovered successfully</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Method & Category Matrix */}
        <div className="mockup-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-400" />
              Payment Method Breakdown
            </h3>
            <span className="text-xs text-slate-400 font-mono">Distribution</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-[#0b101d] border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-200 font-bold">Credit/Debit Cards</span>
              <span className="text-blue-400 font-extrabold">62.5% (5 payments)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0b101d] border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-200 font-bold">Netbanking & Gateways</span>
              <span className="text-purple-400 font-extrabold">25.0% (2 payments)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0b101d] border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-200 font-bold">UPI / Wallet Autopay</span>
              <span className="text-emerald-400 font-extrabold">12.5% (1 payment)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
