'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  Cpu,
  RefreshCw,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  AlertTriangle,
  FileText,
  BarChart3,
  ChevronRight,
  FlaskConical,
  CreditCard,
  Layers,
  Database,
  Radio,
  Server,
  Terminal,
  Activity,
  Send,
  ExternalLink,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [simScenario, setSimScenario] = useState(0);

  // Auto-advance simulation flow demo card
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const flowSteps = [
    {
      title: 'Failed Payment Ingested',
      status: 'Received',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      description: 'Razorpay webhook payment.failed received (pay_Hk9x8291, ₹4,999)',
      detail: 'Error: BAD_REQUEST_ERROR / Network timeout during 3DS processing',
      icon: Radio,
    },
    {
      title: 'Google Gemini AI Diagnosis',
      status: 'Diagnosing...',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      description: 'Prompt sent to Gemini 1.5 Flash with raw webhook payload & history context',
      detail: 'Result: Transient network latency (Confidence: 96%). Recommendation: Immediate exponential backoff retry.',
      icon: Cpu,
    },
    {
      title: 'Smart Strategy Orchestration',
      status: 'Executing',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      description: 'Engine evaluates safety rules (₹4,999 < ₹5,000 gate threshold)',
      detail: 'Selected Action: Immediate Retry (Attempt 1 of 3) via Razorpay API',
      icon: RefreshCw,
    },
    {
      title: 'Revenue Recovered!',
      status: 'Success',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Payment status updated to captured. Customer received confirmation.',
      detail: 'Recovered Amount: ₹4,999.00 in 2.4 seconds • Audit ID #AUD-9821',
      icon: CheckCircle2,
    },
  ];

  const scenarios = [
    {
      id: 'network',
      title: '🌐 Network Timeout',
      category: 'Transient Error',
      action: 'Immediate Exponential Backoff Retry',
      time: '< 2.5s',
      desc: 'Temporary gateway glitch resolved with smart zero-friction retry.',
    },
    {
      id: 'declined',
      title: '💳 Card Declined',
      category: 'Hard Failure',
      action: 'Generate Razorpay Payment Link',
      time: '< 1.8s',
      desc: 'Creates a secure payment link sent via SMS/Email for alternative payment methods.',
    },
    {
      id: 'funds',
      title: '💸 Insufficient Funds',
      category: 'Soft Failure',
      action: 'Schedule Delayed Retry (Payday Nudge)',
      time: '< 3.0s',
      desc: 'Intelligent delay schedule paired with polite notification reminder.',
    },
    {
      id: 'expired',
      title: '🔒 Expired Card',
      category: 'Customer Action Required',
      action: 'Dynamic Payment Portal Link',
      time: '< 1.5s',
      desc: 'Directs customer to update card details securely via Razorpay UI.',
    },
    {
      id: 'highvalue',
      title: '🛡️ High-Value Transaction',
      category: 'Safety Control',
      action: 'Escalate to Human-in-the-Loop Gate',
      time: 'Instant',
      desc: 'Transactions over ₹5,000 require explicit merchant operator approval.',
    },
    {
      id: 'budget',
      title: '📊 Daily Budget Cap',
      category: 'Risk Control',
      action: 'Enforce Cap & Log Exceeded State',
      time: 'Instant',
      desc: 'Prevents runaway retries by halting automation when budget limits are reached.',
    },
    {
      id: 'auth',
      title: '🔐 Auth Failed',
      category: 'Security Failure',
      action: 'Customer Notification Nudge',
      time: '< 2.1s',
      desc: 'Triggers customer authentication retry prompt without double-charging.',
    },
    {
      id: 'bank',
      title: '🏦 Bank Server Down',
      category: 'Issuer Outage',
      action: 'Delayed Retry with Bank Status Monitor',
      time: '< 2.8s',
      desc: 'Monitors bank uptime and triggers retry as soon as bank APIs recover.',
    },
  ];

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Landing Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#070a12]/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/revenueguard-logo-256.png"
                alt="RevenueGuard Logo"
                className="w-10 h-10 rounded-xl object-contain shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>
            <div>
              <span className="text-lg font-extrabold text-white tracking-tight flex items-center gap-1">
                Revenue<span className="gradient-text-cyan">Guard</span> <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Razorpay Payment Recovery Engine</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#architecture" className="hover:text-cyan-400 transition-colors">Architecture</a>
            <a href="#scenarios" className="hover:text-cyan-400 transition-colors">Simulation Lab</a>
            <a href="#safety" className="hover:text-cyan-400 transition-colors">Safety Controls</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/simulate"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-all"
            >
              <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
              <span>Simulation Lab</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto w-full text-center space-y-10">
        {/* Track Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold shadow-lg shadow-blue-500/10"
        >
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Razorpay AI Buildathon 2026</span>
          <span className="text-slate-500">•</span>
          <span className="text-cyan-300 font-extrabold">Track 3: AI Revenue Recovery</span>
        </motion.div>

        {/* Main Headline */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Turn Failed Razorpay Payments into{' '}
            <span className="gradient-text-cyan underline decoration-cyan-500/30 underline-offset-8">
              Recovered Revenue
            </span>{' '}
            with Autonomous AI
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto font-medium leading-relaxed">
            RevenueGuard AI detects payment failures in real time, diagnoses root causes using Google Gemini,
            and executes smart retry strategies with human-gated safety controls and full audit transparency.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl shadow-xl shadow-blue-600/30 transition-all hover:scale-105 flex items-center justify-center gap-3"
          >
            <LayoutDashboardIcon className="w-4 h-4" />
            <span>Enter Merchant Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/simulate"
            className="w-full sm:w-auto px-8 py-4 text-sm font-extrabold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-2xl border border-slate-700/80 transition-all hover:scale-105 flex items-center justify-center gap-3"
          >
            <FlaskConical className="w-4 h-4 text-amber-400" />
            <span>Test 8 Live Simulation Scenarios</span>
          </Link>
        </div>

        {/* Interactive Live Preview Mockup Card */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="mockup-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden text-left space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-400 font-mono ml-2">Live AI Agent Pipeline Demo</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Autonomous Engine Active
              </span>
            </div>

            {/* Step Progress Tracker */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {flowSteps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeStep === idx;
                const isPassed = activeStep > idx;

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`p-3.5 rounded-2xl text-left transition-all border ${
                      isActive
                        ? 'bg-blue-600/20 border-blue-500/60 shadow-lg shadow-blue-500/20 scale-102'
                        : isPassed
                        ? 'bg-slate-800/40 border-slate-700/50 text-slate-300'
                        : 'bg-slate-900/30 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">Step 0{idx + 1}</span>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
                    </div>
                    <p className={`text-xs font-extrabold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {step.title}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Active Step Details Panel */}
            <div className="bg-[#0b101d] rounded-2xl p-5 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Action Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full border font-bold text-[11px] ${flowSteps[activeStep].badgeColor}`}>
                  {flowSteps[activeStep].status}
                </span>
              </div>
              <div className="text-slate-200 font-sans text-sm font-semibold">
                {flowSteps[activeStep].description}
              </div>
              <div className="text-slate-400 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-cyan-300/90">
                ⚡ {flowSteps[activeStep].detail}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Metrics Banner */}
      <section className="border-y border-slate-800/80 bg-[#080d19]/60 backdrop-blur-md py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight text-cyan-400">₹48.5L+</span>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Revenue Recovered</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight text-emerald-400">89.4%</span>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Autonomous Recovery Rate</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight text-purple-400">&lt; 3.2s</span>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Gemini AI Diagnosis Time</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight text-amber-400">100%</span>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Audit & Safety Compliance</p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-14">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">Engineered for Merchant Success</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Top Merchants Trust RevenueGuard AI
          </h3>
          <p className="text-slate-400 text-sm font-medium">
            Built from the ground up for Razorpay test & production integrations, combining generative AI precision with strict enterprise safety controls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="mockup-card p-6 space-y-4 hover:border-cyan-500/40">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-white">Google Gemini AI Failure Diagnostor</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Analyzes raw Razorpay webhook error codes and metadata to pinpoint failure causes with prompt-engineered contextual precision.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="mockup-card p-6 space-y-4 hover:border-purple-500/40">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-white">Smart Recovery Strategy Engine</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Automatically selects the optimal path: exponential backoff retries, dynamic Razorpay payment links, or scheduled customer nudges.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="mockup-card p-6 space-y-4 hover:border-amber-500/40">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-white">Human-in-the-Loop Safety Gate</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              High-value transactions (&gt; ₹5,000) require operator approval before execution, enforcing complete control over revenue operations.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="mockup-card p-6 space-y-4 hover:border-emerald-500/40">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-white">Immutable Audit Trail & Budget Caps</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Logs every prompt, diagnostic confidence, retry timestamp, and merchant action with strict daily and weekly budget caps.
            </p>
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section id="architecture" className="py-20 px-6 bg-[#080d19]/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-purple-400">Under The Hood</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              End-to-End Autonomous Pipeline
            </h3>
            <p className="text-slate-400 text-sm font-medium">
              How RevenueGuard AI processes webhooks, queries Gemini, and executes recovery safely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {/* Step 1 */}
            <div className="mockup-card p-5 space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center font-bold">1</div>
              <h5 className="text-xs font-extrabold text-white">Webhook Ingest</h5>
              <p className="text-[11px] text-slate-400 font-mono">Razorpay payment.failed payload ingested & authenticated.</p>
            </div>

            {/* Step 2 */}
            <div className="mockup-card p-5 space-y-2 text-center border-purple-500/30">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center font-bold">2</div>
              <h5 className="text-xs font-extrabold text-white">Gemini AI</h5>
              <p className="text-[11px] text-slate-400 font-mono">Diagnoses failure code, error source, & recovery confidence.</p>
            </div>

            {/* Step 3 */}
            <div className="mockup-card p-5 space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center font-bold">3</div>
              <h5 className="text-xs font-extrabold text-white">Strategy Engine</h5>
              <p className="text-[11px] text-slate-400 font-mono">Selects optimal retry pattern or payment link generation.</p>
            </div>

            {/* Step 4 */}
            <div className="mockup-card p-5 space-y-2 text-center border-amber-500/30">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-bold">4</div>
              <h5 className="text-xs font-extrabold text-white">Safety Check</h5>
              <p className="text-[11px] text-slate-400 font-mono">Verifies budget caps & human approval thresholds (&gt; ₹5k).</p>
            </div>

            {/* Step 5 */}
            <div className="mockup-card p-5 space-y-2 text-center border-emerald-500/30">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold">5</div>
              <h5 className="text-xs font-extrabold text-white">Recovery Done</h5>
              <p className="text-[11px] text-slate-400 font-mono">Payment recaptured, customer notified, audit logged.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simulation Lab Showcase */}
      <section id="scenarios" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Interactive Testing</h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">8 Pre-Built Simulation Scenarios</h3>
            <p className="text-slate-400 text-sm font-medium">Test real-world payment edge cases safely with full diagnostic output.</p>
          </div>
          <Link
            href="/simulate"
            className="flex items-center gap-2 px-6 py-3 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all self-start md:self-auto"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Launch Simulation Lab</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scenarios.map((sc, idx) => (
            <div
              key={sc.id}
              className="mockup-card p-5 space-y-3 hover:scale-102 transition-all cursor-pointer group"
              onClick={() => setSimScenario(idx)}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white">{sc.title}</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  {sc.time}
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-400">{sc.category}</p>
              <p className="text-xs text-slate-300 font-medium leading-snug">{sc.desc}</p>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-purple-300 font-mono flex items-center justify-between group-hover:text-purple-200">
                <span>Action: {sc.action}</span>
                <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="mockup-hero-card p-10 sm:p-14 text-center space-y-8 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to Recover Lost Razorpay Revenue?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base font-medium">
              Start diagnosing failed transactions automatically and track your recovery rates live in the dashboard.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-xl shadow-blue-600/40 transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Dashboard Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/simulate"
                className="w-full sm:w-auto px-8 py-4 text-sm font-extrabold text-slate-200 hover:text-white bg-slate-800/90 rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <FlaskConical className="w-4 h-4 text-amber-300" />
                <span>Explore Simulation Lab</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#060913] py-10 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/revenueguard-logo-128.png" alt="RevenueGuard Logo" className="w-7 h-7 rounded-lg" />
            <div>
              <span className="font-extrabold text-white">RevenueGuard AI</span>
              <p className="text-[10px] text-slate-500">Razorpay AI Buildathon 2026 • Track 3</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/recovery" className="hover:text-white transition-colors">Recovery Hub</Link>
            <Link href="/simulate" className="hover:text-white transition-colors">Simulation Lab</Link>
            <Link href="/audit" className="hover:text-white transition-colors">Audit Trail</Link>
            <Link href="/settings" className="hover:text-white transition-colors">Settings</Link>
          </div>

          <p className="text-[10px] text-slate-400 font-mono">
            © 2026 RevenueGuard AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function LayoutDashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}
