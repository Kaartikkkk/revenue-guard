'use client';

import { useState, useEffect, useRef } from 'react';
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
  Activity,
  Send,
  ExternalLink,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from 'lucide-react';

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'soft' | 'hard' | 'safety'>('all');
  const [simScenario, setSimScenario] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-advance step in live preview widget
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlayingVideo) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlayingVideo(!isPlayingVideo);
    }
  };

  const flowSteps = [
    {
      step: '01',
      title: 'Failed Payment Ingested',
      status: 'Received',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      description: 'Razorpay webhook payment.failed received (pay_Hk9x8291, ₹4,999)',
      detail: 'Error: BAD_REQUEST_ERROR / Transient 3DS network timeout',
      icon: Radio,
    },
    {
      step: '02',
      title: 'Google Gemini AI Diagnosis',
      status: 'Diagnosing...',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      description: 'Payload evaluated against historical merchant patterns',
      detail: 'Result: Network Latency (Confidence: 96%). Strategy: Immediate Retry',
      icon: Cpu,
    },
    {
      step: '03',
      title: 'Smart Strategy Engine',
      status: 'Executing',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      description: 'Safety check passed (₹4,999 < ₹5,000 human-gate threshold)',
      detail: 'Action: Executed exponential backoff retry via Razorpay API',
      icon: RefreshCw,
    },
    {
      step: '04',
      title: 'Revenue Recovered!',
      status: 'Captured',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Payment captured successfully in 2.4s. Customer notified.',
      detail: 'Recovered: ₹4,999.00 • Audit Logged ID #AUD-9821',
      icon: CheckCircle2,
    },
  ];

  const scenarios = [
    {
      id: 'network',
      type: 'soft',
      title: '🌐 Network Timeout',
      category: 'Transient Gateway Error',
      action: 'Immediate Exponential Backoff Retry',
      time: '< 2.5s',
      desc: 'Resolves temporary network drops without requiring any customer action.',
    },
    {
      id: 'declined',
      type: 'hard',
      title: '💳 Card Declined',
      category: 'Bank Decline',
      action: 'Generate Razorpay Payment Link',
      time: '< 1.8s',
      desc: 'Creates a secure payment link sent via SMS/Email for alternative methods.',
    },
    {
      id: 'funds',
      type: 'soft',
      title: '💸 Insufficient Funds',
      category: 'Soft Balance Issue',
      action: 'Scheduled Retry (Payday Nudge)',
      time: '< 3.0s',
      desc: 'Intelligent delay schedule paired with polite notification reminders.',
    },
    {
      id: 'expired',
      type: 'hard',
      title: '🔒 Expired Card',
      category: 'Card Detail Update',
      action: 'Dynamic Payment Portal Link',
      time: '< 1.5s',
      desc: 'Directs customer to update card details securely via Razorpay Checkout.',
    },
    {
      id: 'highvalue',
      type: 'safety',
      title: '🛡️ High-Value Transaction',
      category: 'Human Safety Gate',
      action: 'Escalate to Merchant Approval',
      time: 'Instant',
      desc: 'Transactions over ₹5,000 require explicit merchant operator approval.',
    },
    {
      id: 'budget',
      type: 'safety',
      title: '📊 Daily Budget Cap',
      category: 'Cap Enforcement',
      action: 'Halt Automation & Log Limit',
      time: 'Instant',
      desc: 'Prevents runaway retries by halting automation when budget limits are met.',
    },
    {
      id: 'auth',
      type: 'soft',
      title: '🔐 Auth Failed',
      category: '3DS Failure',
      action: 'Customer Authentication Nudge',
      time: '< 2.1s',
      desc: 'Triggers customer authentication retry prompt without double-charging.',
    },
    {
      id: 'bank',
      type: 'soft',
      title: '🏦 Bank Server Down',
      category: 'Issuer Outage',
      action: 'Delayed Retry with Bank Monitor',
      time: '< 2.8s',
      desc: 'Monitors bank API health and triggers retry as soon as systems recover.',
    },
  ];

  const filteredScenarios = activeTab === 'all'
    ? scenarios
    : scenarios.filter((s) => s.type === activeTab);

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col relative bg-[#070a12]">
      {/* Top Header Navbar overlaying video */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-[#070a12]/20 backdrop-blur-sm border-b border-white/10 px-6 py-4 transition-all">
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
              <span className="text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5">
                Revenue<span className="gradient-text-cyan">Guard</span>{' '}
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-500/40">
                  AI AGENT
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Razorpay Payment Recovery Engine</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#demo" className="hover:text-cyan-400 transition-colors">Live Demo</a>
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
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Video Background */}
      <section className="relative flex flex-col justify-center items-center px-6 pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden border-b border-slate-800/80">
        {/* Background Video Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60 filter saturate-130 contrast-115 brightness-110 scale-105 transition-opacity duration-500"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Balanced Dark Gradient Overlay for Crisp Text & Video Vibrancy */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070a12]/50 via-[#070a12]/70 to-[#070a12]" />
          <div className="bg-cyber-grid absolute inset-0 opacity-25" />
        </div>

        {/* Floating Video Control Button (Top Right of Hero) */}
        <button
          onClick={toggleVideo}
          className="absolute top-6 right-6 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-mono text-slate-300 backdrop-blur-md transition-all shadow-lg"
          title={isPlayingVideo ? 'Pause ambient video' : 'Play ambient video'}
        >
          {isPlayingVideo ? (
            <>
              <Pause className="w-3 h-3 text-cyan-400" />
              <span>Pause Video</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-emerald-400" />
              <span>Play Video</span>
            </>
          )}
        </button>

        {/* Hero Content Header */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-7">
          {/* Pulsating Buildathon Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/35 text-blue-200 text-xs font-semibold shadow-lg shadow-blue-500/10 backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Razorpay AI Buildathon 2026</span>
            <span className="text-slate-500">•</span>
            <span className="gradient-text-cyan font-extrabold">Track 3: AI Revenue Recovery</span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12] max-w-4xl mx-auto"
          >
            Turn Failed Razorpay Payments into{' '}
            <span className="gradient-text-cyan inline-block pb-1 border-b-2 border-cyan-400/40">
              Recovered Revenue
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto font-medium leading-relaxed"
          >
            RevenueGuard AI autonomously detects failed payment webhooks, diagnoses root causes using Google Gemini,
            and executes smart retry strategies with human-gated safety controls and complete audit trails.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl shadow-2xl shadow-blue-600/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border border-blue-400/30"
            >
              <span>Enter Merchant Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/simulate"
              className="w-full sm:w-auto px-8 py-4 text-sm font-extrabold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-2xl border border-slate-700/80 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 backdrop-blur-md"
            >
              <FlaskConical className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>Test 8 Live Simulation Scenarios</span>
            </Link>
          </motion.div>
        </div>

        {/* Live Interactive Workflow Preview Widget */}
        <div id="demo" className="relative z-10 w-full max-w-5xl mx-auto mt-14 lg:mt-16">
          <div className="mockup-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden text-left space-y-6 bg-[#0b101d]/85 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                </div>
                <span className="text-xs text-slate-400 font-mono">Live AI Agent Recovery Pipeline Demo</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Autonomous Engine Active
              </span>
            </div>

            {/* Stepper Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {flowSteps.map((s, idx) => {
                const Icon = s.icon;
                const isActive = activeStep === idx;
                const isPassed = activeStep > idx;

                return (
                  <button
                    key={s.step}
                    onClick={() => setActiveStep(idx)}
                    className={`p-4 rounded-2xl text-left transition-all border relative overflow-hidden ${
                      isActive
                        ? 'bg-blue-600/25 border-blue-500/70 shadow-lg shadow-blue-500/20 scale-102 z-10'
                        : isPassed
                        ? 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                        : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">Step {s.step}</span>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
                    </div>
                    <p className={`text-xs font-extrabold leading-snug ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {s.title}
                    </p>
                    {isActive && (
                      <motion.div layoutId="stepper-indicator" className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Step Details Panel */}
            <div className="bg-[#070a12] rounded-2xl p-5 border border-slate-800 space-y-3 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pipeline Execution Phase:</span>
                <span className={`px-2.5 py-0.5 rounded-full border font-bold text-[11px] ${flowSteps[activeStep].badgeColor}`}>
                  {flowSteps[activeStep].status}
                </span>
              </div>
              <div className="text-slate-200 font-sans text-sm font-semibold">
                {flowSteps[activeStep].description}
              </div>
              <div className="text-slate-300 text-xs bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-cyan-300/90 flex items-center justify-between">
                <span>⚡ {flowSteps[activeStep].detail}</span>
                <span className="text-[10px] text-slate-500 font-mono">Real-time telemetry</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Impact Metrics Counter Banner */}
      <section className="border-b border-slate-800/80 bg-[#080d19]/80 backdrop-blur-md py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight text-cyan-400">₹48.5L+</span>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Revenue Recovered</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight text-emerald-400">89.4%</span>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Autonomous Recovery Rate</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight text-purple-400">&lt; 3.2s</span>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Gemini AI Diagnosis Time</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight text-amber-400">100%</span>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Audit & Safety Compliance</p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto w-full space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">Merchant-Grade Engine</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built for High-Volume Razorpay Merchants
          </h3>
          <p className="text-slate-400 text-sm sm:text-base font-medium leading-relaxed">
            RevenueGuard AI combines cutting-edge generative AI failure analysis with robust risk management controls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="mockup-card p-7 space-y-4 hover:border-cyan-500/40">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white">Google Gemini AI Diagnostor</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Parses raw Razorpay webhook error codes and metadata to pinpoint root causes with prompt-engineered contextual precision.
            </p>
          </div>

          {/* Card 2 */}
          <div className="mockup-card p-7 space-y-4 hover:border-purple-500/40">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white">Smart Recovery Strategy Engine</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Selects the optimal recovery pathway: exponential backoff retries, dynamic Razorpay payment links, or scheduled customer nudges.
            </p>
          </div>

          {/* Card 3 */}
          <div className="mockup-card p-7 space-y-4 hover:border-amber-500/40">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white">Human-in-the-Loop Safety Gate</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              High-value transactions (&gt; ₹5,000) require explicit operator approval before execution, enforcing complete control over revenue operations.
            </p>
          </div>

          {/* Card 4 */}
          <div className="mockup-card p-7 space-y-4 hover:border-emerald-500/40">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-white">Immutable Audit Trail & Budget Caps</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Logs every prompt, diagnostic confidence, retry timestamp, and merchant action with strict daily and weekly budget caps.
            </p>
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section id="architecture" className="py-24 px-6 bg-[#080d19]/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-purple-400">Architecture & Workflow</h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              End-to-End Autonomous Pipeline
            </h3>
            <p className="text-slate-400 text-sm sm:text-base font-medium">
              How RevenueGuard AI processes webhooks, queries Gemini, and executes recovery safely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {/* Step 1 */}
            <div className="mockup-card p-6 space-y-3 text-center border-blue-500/30">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center font-extrabold text-sm">1</div>
              <h5 className="text-xs font-extrabold text-white">Webhook Ingest</h5>
              <p className="text-[11px] text-slate-400 font-mono">Razorpay payment.failed payload ingested & signature verified.</p>
            </div>

            {/* Step 2 */}
            <div className="mockup-card p-6 space-y-3 text-center border-purple-500/30">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center font-extrabold text-sm">2</div>
              <h5 className="text-xs font-extrabold text-white">Gemini AI</h5>
              <p className="text-[11px] text-slate-400 font-mono">Diagnoses failure code, error source, & recovery confidence.</p>
            </div>

            {/* Step 3 */}
            <div className="mockup-card p-6 space-y-3 text-center border-indigo-500/30">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center font-extrabold text-sm">3</div>
              <h5 className="text-xs font-extrabold text-white">Strategy Engine</h5>
              <p className="text-[11px] text-slate-400 font-mono">Selects optimal retry pattern or payment link generation.</p>
            </div>

            {/* Step 4 */}
            <div className="mockup-card p-6 space-y-3 text-center border-amber-500/30">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-extrabold text-sm">4</div>
              <h5 className="text-xs font-extrabold text-white">Safety Gate</h5>
              <p className="text-[11px] text-slate-400 font-mono">Verifies budget caps & human approval thresholds (&gt; ₹5,000).</p>
            </div>

            {/* Step 5 */}
            <div className="mockup-card p-6 space-y-3 text-center border-emerald-500/30">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-extrabold text-sm">5</div>
              <h5 className="text-xs font-extrabold text-white">Recovery Complete</h5>
              <p className="text-[11px] text-slate-400 font-mono">Payment recaptured, customer notified, audit trail logged.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulation Lab Showcase */}
      <section id="scenarios" className="py-24 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Interactive Simulation Lab</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">8 Pre-Built Failure Scenarios</h3>
            <p className="text-slate-400 text-sm font-medium">Test real-world payment edge cases safely with full diagnostic output.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                All (8)
              </button>
              <button
                onClick={() => setActiveTab('soft')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'soft' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Soft Failures
              </button>
              <button
                onClick={() => setActiveTab('hard')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'hard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Hard Failures
              </button>
              <button
                onClick={() => setActiveTab('safety')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'safety' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Safety & Caps
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredScenarios.map((sc) => (
            <div
              key={sc.id}
              className="mockup-card p-5 space-y-3 hover:scale-102 transition-all cursor-pointer group"
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

      {/* Safety & Compliance Section */}
      <section id="safety" className="py-20 px-6 bg-[#080d19]/80 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Enterprise Control</h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">Merchant Safety & Governance</h3>
            <p className="text-slate-400 text-sm font-medium">Never worry about runaway retries or unauthorized automated charges.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="mockup-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-white">Human Gate Approval (&gt; ₹5,000)</h4>
              <p className="text-xs text-slate-400 font-medium">High-value transactions automatically trigger a manual review request before any recovery action is initiated.</p>
            </div>

            <div className="mockup-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-white">Daily & Weekly Budget Caps</h4>
              <p className="text-xs text-slate-400 font-medium">Define maximum allowable automated recovery attempts per day to strictly control operational costs.</p>
            </div>

            <div className="mockup-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-white">Webhook HMAC Verification</h4>
              <p className="text-xs text-slate-400 font-medium">Every incoming webhook is verified against the `X-Razorpay-Signature` HMAC secret to ensure 100% payload integrity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="mockup-hero-card p-10 sm:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
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
              <p className="text-[10px] text-slate-500">Razorpay AI Buildathon 2026 • Track 3: AI Revenue Recovery</p>
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
            © 2026 RevenueGuard AI. Built for Razorpay AI Buildathon.
          </p>
        </div>
      </footer>
    </div>
  );
}
