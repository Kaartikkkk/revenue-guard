'use client';

import { useState, useEffect } from 'react';
import {
  AlertCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  Bell,
  Link2,
  ArrowRight,
  FlaskConical,
  CreditCard,
  TrendingUp,
  Database,
  Radio,
  Cpu,
  Server,
  Zap,
  CheckCircle2,
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

const categoryColors: Record<string, string> = {
  network_error: '#3b82f6',
  expired_card: '#a855f7',
  card_declined: '#f43f5e',
  authentication_failed: '#f59e0b',
  insufficient_funds: '#10b981',
  bank_error: '#06b6d4',
  invalid_details: '#ec4899',
  unknown: '#64748b',
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
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-72 bg-slate-900 rounded-xl" />
          <div className="h-44 bg-slate-900 rounded-2xl" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-slate-900 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
    recentFailures: [],
  };

  const DAILY_CAP_PAISE = 10000000;
  const budgetPercent = Math.min((stats.budgetUsedToday / DAILY_CAP_PAISE) * 100, 100);

  // SVG Donut Calculations
  const totalFailuresCount = stats.failuresByCategory.reduce((acc, curr) => acc + curr.count, 0) || 8;
  let cumulativePercent = 0;
  const donutSegments = (stats.failuresByCategory.length > 0 ? stats.failuresByCategory : [
    { category: 'network_error', count: 5 },
    { category: 'expired_card', count: 1 },
    { category: 'card_declined', count: 1 },
    { category: 'authentication_failed', count: 1 },
  ]).map((item) => {
    const pct = totalFailuresCount > 0 ? (item.count / totalFailuresCount) : 0;
    const strokeDasharray = `${pct * 283} 283`;
    const strokeDashoffset = -cumulativePercent * 283;
    cumulativePercent += pct;
    return {
      ...item,
      pct,
      pctFormatted: (pct * 100).toFixed(0),
      color: categoryColors[item.category] || '#3b82f6',
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-16 font-sans select-none">
      {/* Greeting Header & Simulation Lab CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Good evening, Kartik! <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Here&apos;s what&apos;s happening with your revenue today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <p className="hidden lg:block text-[11px] italic text-slate-400 text-right leading-tight max-w-xs font-serif">
            &ldquo;Every recovered payment is a business opportunity saved.&rdquo;<br />
            <span className="not-italic text-slate-500 font-sans font-semibold">— RevenueGuard</span>
          </p>

          <Link
            href="/simulate"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <FlaskConical className="w-4 h-4 fill-white/20" />
            <span>Simulation Lab</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Main Hero Card: TODAY'S REVENUE PRESERVED */}
      <div className="mockup-hero-card p-7 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-300">
                Today&apos;s Revenue Preserved
              </span>
              <span className="text-xs text-slate-400">ⓘ</span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-extrabold tracking-tight text-[#00f2fe] font-mono drop-shadow-[0_0_20px_rgba(6,242,254,0.3)]">
                ₹{(stats.totalRecoveryAmount / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Recovered
              </span>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              Recovered automatically from failed payment webhooks
            </p>
          </div>

          {/* Right Metrics */}
          <div className="flex items-center gap-8 border-t lg:border-t-0 lg:border-l border-slate-700/60 pt-4 lg:pt-0 lg:pl-8">
            <div className="space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Recovery Rate</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white font-mono">{stats.recoveryRate.toFixed(1)}%</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +0% vs yesterday
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total Recovered</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-extrabold text-white font-mono">{stats.totalRecovered}</span>
                <span className="text-xs text-slate-400 font-medium">transactions</span>
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Subtle Wave SVG Background */}
        <svg className="absolute bottom-0 right-0 w-full h-32 opacity-25 pointer-events-none" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,20 1200,60 L1200,120 L0,120 Z" fill="url(#heroWaveGrad)" />
          <defs>
            <linearGradient id="heroWaveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Middle Metric Cards Row (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Failed Payments Detected */}
        <div className="mockup-card p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-md">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              +12%
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">Failed Payments Detected</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold text-white font-mono">{stats.totalFailed}</span>
              <div className="text-right text-[10px] text-slate-500 font-medium">
                <p>Via Webhook</p>
                <p className="text-slate-400 font-semibold">Auto-Diagnosed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Pending Approvals */}
        <div className="mockup-card p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Safety Gate
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">Pending Approvals</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold text-white font-mono">{stats.pendingApprovals}</span>
              <span className="text-[10px] text-slate-400 font-medium">&gt; ₹5,000 threshold</span>
            </div>
          </div>
        </div>

        {/* Card 3: Daily Budget Cap Risk */}
        <div className="mockup-card p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">Daily Budget Cap Risk</p>
            <span className="text-3xl font-extrabold text-white font-mono mt-1 block">
              {budgetPercent.toFixed(0)}%
            </span>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mt-2 border border-slate-800">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${budgetPercent}%` }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1.5">
              <span>₹{(stats.budgetUsedToday / 100).toLocaleString('en-IN')} used</span>
              <span>₹1,00,000 limit</span>
            </div>
          </div>
        </div>

        {/* Card 4: System Health */}
        <div className="mockup-card p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
              All Healthy
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">System Health</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold text-white font-mono">6/6</span>
              <span className="text-[10px] text-slate-400 font-medium">Services operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Visualization Row (2 Cards side by side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Failure Diagnosis Proportions Donut Chart */}
        <div className="mockup-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white">Failure Diagnosis Proportions</h3>
              <span className="text-xs text-slate-400">ⓘ</span>
            </div>
            <select className="bg-[#0b101d] text-slate-300 text-xs font-semibold rounded-lg px-3 py-1.5 border border-slate-800 focus:outline-none">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            {/* SVG Donut Chart */}
            <div className="relative w-44 h-44 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="10" />
                {donutSegments.map((segment, idx) => (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="10"
                    strokeDasharray={segment.strokeDasharray}
                    strokeDashoffset={segment.strokeDashoffset}
                    className="transition-all duration-500"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-white font-mono">{totalFailuresCount}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Failures</span>
              </div>
            </div>

            {/* Segment Legend */}
            <div className="space-y-2.5 w-full sm:w-auto">
              {donutSegments.map((item) => (
                <div key={item.category} className="flex items-center justify-between sm:justify-start gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-300">{categoryLabels[item.category] || item.category}</span>
                  </div>
                  <span className="font-mono text-slate-400">{item.count} ({item.pctFormatted}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Recovery Strategy Efficacy Bars */}
        <div className="mockup-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white">Recovery Strategy Efficacy</h3>
              <span className="text-xs text-slate-400">ⓘ</span>
            </div>
            <select className="bg-[#0b101d] text-slate-300 text-xs font-semibold rounded-lg px-3 py-1.5 border border-slate-800 focus:outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>

          <div className="space-y-5 pt-2">
            {/* Strategy 1: Immediate Retry */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-extrabold text-white">Immediate Retry</p>
                    <p className="text-[10px] text-slate-400 font-mono">6 attempts • 5 successful</p>
                  </div>
                </div>
                <span className="font-mono font-extrabold text-white text-sm">83%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '83%' }} />
              </div>
            </div>

            {/* Strategy 2: Notification */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-extrabold text-white">Notification</p>
                    <p className="text-[10px] text-slate-400 font-mono">1 attempts • 1 successful</p>
                  </div>
                </div>
                <span className="font-mono font-extrabold text-white text-sm">100%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Strategy 3: Payment Link */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-extrabold text-white">Payment Link</p>
                    <p className="text-[10px] text-slate-400 font-mono">2 attempts • 2 successful</p>
                  </div>
                </div>
                <span className="font-mono font-extrabold text-white text-sm">100%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row (2 Cards side by side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Failed Payment Ingestions Table */}
        <div className="mockup-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">Recent Failed Payment Ingestions</h3>
            <Link href="/recovery" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-semibold">
                  <th className="py-2.5 px-2">Time</th>
                  <th className="py-2.5 px-2">Payment ID</th>
                  <th className="py-2.5 px-2">Reason</th>
                  <th className="py-2.5 px-2 text-right">Amount</th>
                  <th className="py-2.5 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {stats.recentFailures.length > 0 ? (
                  stats.recentFailures.slice(0, 3).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-2 text-slate-400">{new Date(p.created_at).toLocaleTimeString()}</td>
                      <td className="py-3 px-2 font-bold text-slate-200">{p.razorpay_payment_id.slice(0, 11)}...</td>
                      <td className="py-3 px-2 text-slate-300">{categoryLabels[p.failure_category] || p.failure_category}</td>
                      <td className="py-3 px-2 text-right font-bold text-white">₹{(p.amount / 100).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-2 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                          ♦ Failed
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-2 text-slate-400">09:42:17</td>
                      <td className="py-3 px-2 font-bold text-slate-200">pay_1Hk9x3...</td>
                      <td className="py-3 px-2 text-slate-300">Network Error</td>
                      <td className="py-3 px-2 text-right font-bold text-white">₹2,499</td>
                      <td className="py-3 px-2 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                          ♦ Failed
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-2 text-slate-400">09:40:03</td>
                      <td className="py-3 px-2 font-bold text-slate-200">pay_1Hk9x2...</td>
                      <td className="py-3 px-2 text-slate-300">Card Declined</td>
                      <td className="py-3 px-2 text-right font-bold text-white">₹1,299</td>
                      <td className="py-3 px-2 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                          ♦ Failed
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-2 text-slate-400">09:38:45</td>
                      <td className="py-3 px-2 font-bold text-slate-200">pay_1Hk9x1...</td>
                      <td className="py-3 px-2 text-slate-300">Auth Failed</td>
                      <td className="py-3 px-2 text-right font-bold text-white">₹799</td>
                      <td className="py-3 px-2 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                          ♦ Failed
                        </span>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: System Components Grid (6 items) */}
        <div className="mockup-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">System Components</h3>
            <Link href="/settings" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
              View Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Component 1 */}
            <div className="p-3.5 rounded-xl bg-[#0b101d] border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Webhook Listener</p>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Healthy
                </span>
              </div>
            </div>

            {/* Component 2 */}
            <div className="p-3.5 rounded-xl bg-[#0b101d] border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Recovery Engine</p>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Healthy
                </span>
              </div>
            </div>

            {/* Component 3 */}
            <div className="p-3.5 rounded-xl bg-[#0b101d] border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Notification Service</p>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Healthy
                </span>
              </div>
            </div>

            {/* Component 4 */}
            <div className="p-3.5 rounded-xl bg-[#0b101d] border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Database</p>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Healthy
                </span>
              </div>
            </div>

            {/* Component 5 */}
            <div className="p-3.5 rounded-xl bg-[#0b101d] border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Payment API</p>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Healthy
                </span>
              </div>
            </div>

            {/* Component 6 */}
            <div className="p-3.5 rounded-xl bg-[#0b101d] border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Simulation Engine</p>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Healthy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
