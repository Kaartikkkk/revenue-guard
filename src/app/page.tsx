'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/StatsCard';
import { StatusBadge } from '@/components/StatusBadge';
import {
  AlertTriangle,
  CheckCircle2,
  IndianRupee,
  TrendingUp,
  Clock,
  ShieldCheck,
  Activity,
  ArrowRight,
  Zap,
  RefreshCw,
  Sparkles,
  PieChart,
  Bot,
} from 'lucide-react';
import Link from 'next/link';

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
  recentFailures: Array<{
    id: string;
    razorpay_payment_id: string;
    amount: number;
    customer_email: string | null;
    customer_name: string | null;
    failure_category: string;
    status: string;
    method: string | null;
    created_at: string;
  }>;
}

const categoryLabels: Record<string, string> = {
  network_error: 'Network Error',
  insufficient_funds: 'Insufficient Funds',
  card_declined: 'Card Declined',
  expired_card: 'Expired Card',
  authentication_failed: 'Auth Failed',
  bank_error: 'Bank Error',
  invalid_details: 'Invalid Details',
  unknown: 'Unknown',
};

const categoryGradients: Record<string, string> = {
  network_error: 'from-blue-500 to-indigo-500',
  insufficient_funds: 'from-amber-500 to-orange-500',
  card_declined: 'from-rose-500 to-red-600',
  expired_card: 'from-orange-500 to-amber-600',
  authentication_failed: 'from-purple-500 to-pink-500',
  bank_error: 'from-cyan-500 to-blue-500',
  invalid_details: 'from-pink-500 to-rose-500',
  unknown: 'from-slate-500 to-slate-600',
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-72 bg-slate-800/60 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 bg-slate-800/40 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = data || {
    totalFailed: 0,
    totalRecovered: 0,
    totalRecoveryAmount: 0,
    recoveryRate: 0,
    pendingApprovals: 0,
    activeRecoveries: 0,
    budgetUsedToday: 0,
    failuresByCategory: [],
    recoveryByStrategy: [],
    dailyRecovery: [],
    recentFailures: [],
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-16">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-indigo-950/20 to-slate-900/90 shadow-2xl relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
              <Bot className="w-3.5 h-3.5" />
              Autonomous Payment Guard
            </span>
            <span className="text-xs text-slate-400 font-medium">• Razorpay AI Buildathon</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 pt-1">
            Revenue Recovery <span className="gradient-text-blue">Control Center</span>
          </h1>
          <p className="text-sm text-slate-400 font-medium max-w-xl">
            Real-time telemetry, automated failure diagnosis, and bounded human-in-the-loop recovery workflows.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 shadow-lg transition-all"
          >
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            Refresh Telemetry
          </button>
          <Link
            href="/simulate"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <Zap className="w-4 h-4" />
            Launch Simulation Lab
          </Link>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Failed Payments"
          value={stats.totalFailed}
          icon={<AlertTriangle className="w-5 h-5" />}
          accentColor="red"
          subtitle="Detected via webhooks"
        />
        <StatsCard
          title="Recovered Successfully"
          value={stats.totalRecovered}
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="green"
          trend={stats.recoveryRate > 40 ? 'up' : 'neutral'}
          trendValue={`${stats.recoveryRate.toFixed(1)}% recovery rate`}
        />
        <StatsCard
          title="Revenue Preserved"
          value={`₹${(stats.totalRecoveryAmount / 100).toLocaleString('en-IN')}`}
          icon={<IndianRupee className="w-5 h-5" />}
          accentColor="blue"
          subtitle="Total value recovered"
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<ShieldCheck className="w-5 h-5" />}
          accentColor="amber"
          subtitle={`${stats.activeRecoveries} active agent workflows`}
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Failure Categories Breakdown */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <PieChart className="w-4 h-4 text-rose-400" />
              Failure Categorization
            </h2>
            <span className="text-[11px] font-mono text-slate-500">AI Diagnosed</span>
          </div>

          {stats.failuresByCategory.length === 0 ? (
            <div className="text-center py-10">
              <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-400 font-medium">No failure telemetry detected yet.</p>
              <Link href="/simulate" className="text-xs text-indigo-400 hover:underline mt-1 inline-block">Run a simulation →</Link>
            </div>
          ) : (
            <div className="space-y-3.5 pt-2">
              {stats.failuresByCategory.map((item) => {
                const total = stats.failuresByCategory.reduce((s, i) => s + i.count, 0);
                const pct = total > 0 ? (item.count / total) * 100 : 0;
                return (
                  <div key={item.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-300 font-semibold">{categoryLabels[item.category] || item.category}</span>
                      <span className="text-slate-400 font-mono">{item.count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r ${categoryGradients[item.category] || 'from-slate-500 to-slate-600'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recovery Strategies Matrix */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Recovery Strategy Efficacy
            </h2>
            <span className="text-[11px] font-mono text-slate-500">Autonomous Selection</span>
          </div>

          {stats.recoveryByStrategy.length === 0 ? (
            <div className="text-center py-10">
              <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-400 font-medium">No recovery attempts logged yet.</p>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {stats.recoveryByStrategy.map((item) => {
                const successRate = item.count > 0 ? (item.success / item.count) * 100 : 0;
                return (
                  <div key={item.strategy} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white capitalize">
                        {item.strategy.replace(/_/g, ' ')}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {item.count} executed • {item.success} successful
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        {successRate.toFixed(0)}% success
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bounded Safety & Daily Budget Tracker */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Daily Budget Bounding
            </h2>
            <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Bounded Safety</span>
          </div>

          <div className="text-center py-2">
            <div className="relative w-36 h-36 mx-auto mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" fill="none" stroke="#1e293b" strokeWidth="10" />
                <motion.circle
                  cx="60" cy="60" r="48" fill="none"
                  stroke="url(#budgetGradient)" strokeWidth="10"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 301" }}
                  animate={{ strokeDasharray: `${Math.min((stats.budgetUsedToday / 10000000) * 301, 301)} 301` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="budgetGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-white">
                  {((stats.budgetUsedToday / 10000000) * 100).toFixed(0)}%
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Cap Used</span>
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-300">
              ₹{(stats.budgetUsedToday / 100).toLocaleString('en-IN')} <span className="text-slate-500">/ ₹1,00,000 Cap</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 leading-relaxed font-medium">
            🛡️ Bounded Control: Transactions above ₹5,000 auto-pause for human approval.
          </div>
        </div>
      </div>

      {/* Live Stream of Recent Failed Transactions */}
      <div className="glass-card rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Live Failed Payment Stream
              </h2>
              <p className="text-xs text-slate-400">
                Automatic webhook ingestion and AI recovery trigger
              </p>
            </div>
          </div>

          <Link
            href="/recovery"
            className="text-xs font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 transition-all"
          >
            Open Recovery Hub <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentFailures.length === 0 ? (
          <div className="p-12 text-center">
            <Zap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No failed payments detected</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">Run simulated webhooks to test the AI agent pipeline</p>
            <Link
              href="/simulate"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30"
            >
              <Zap className="w-3.5 h-3.5" />
              Launch Simulator
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {stats.recentFailures.map((payment, idx) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 flex items-center justify-between hover:bg-slate-900/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-indigo-400 text-sm">
                    {(payment.customer_name || 'U').charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-sm font-bold text-white">
                        {payment.customer_name || payment.customer_email || 'Unknown Customer'}
                      </span>
                      <StatusBadge status={payment.status} />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <span>{payment.razorpay_payment_id}</span>
                      <span>•</span>
                      <span className="capitalize">{payment.method || 'card'}</span>
                      <span>•</span>
                      <span className="text-slate-300 font-semibold">{categoryLabels[payment.failure_category] || payment.failure_category}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-base font-extrabold text-white">
                    ₹{(payment.amount / 100).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {new Date(payment.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
