'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Brain,
  ArrowRight,
  Shield,
  IndianRupee,
  Wifi,
  CreditCard,
  Building2,
  Lock,
  Wallet,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  description: string;
  failureType: string;
  amount: number;
  amountFormatted: string;
  method: string;
  errorCode: string;
}

interface SimulationResult {
  scenario: Scenario;
  mockPayment: {
    id: string;
    email: string | null;
    contact: string | null;
    amountFormatted: string;
    notes?: { customer_name?: string };
  };
  result: {
    success: boolean;
    paymentId: string;
    strategy: string;
    message: string;
    details: Record<string, unknown>;
    requiresApproval: boolean;
  };
  processingTimeMs: number;
}

const scenarioIcons: Record<string, any> = {
  network_error: Wifi,
  insufficient_funds: Wallet,
  card_declined: CreditCard,
  expired_card: CreditCard,
  high_value: Shield,
  budget_cap: IndianRupee,
  auth_failed: Lock,
  bank_error: Building2,
};

const scenarioGradients: Record<string, string> = {
  network_error: 'from-blue-600/20 to-indigo-600/20 border-blue-500/30 hover:border-blue-500/60',
  insufficient_funds: 'from-amber-600/20 to-orange-600/20 border-amber-500/30 hover:border-amber-500/60',
  card_declined: 'from-rose-600/20 to-red-600/20 border-rose-500/30 hover:border-rose-500/60',
  expired_card: 'from-orange-600/20 to-amber-600/20 border-orange-500/30 hover:border-orange-500/60',
  high_value: 'from-purple-600/20 to-indigo-600/20 border-purple-500/30 hover:border-purple-500/60',
  budget_cap: 'from-cyan-600/20 to-blue-600/20 border-cyan-500/30 hover:border-cyan-500/60',
  auth_failed: 'from-pink-600/20 to-purple-600/20 border-pink-500/30 hover:border-pink-500/60',
  bank_error: 'from-teal-600/20 to-emerald-600/20 border-teal-500/30 hover:border-teal-500/60',
};

export default function SimulatePage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningScenario, setRunningScenario] = useState<string | null>(null);
  const [results, setResults] = useState<SimulationResult[]>([]);

  useEffect(() => {
    fetch('/api/simulate')
      .then((res) => res.json())
      .then((data) => {
        setScenarios(data.scenarios || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const runSimulation = async (scenarioId: string) => {
    setRunningScenario(scenarioId);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scenarioId }),
      });
      const data = await res.json();
      setResults((prev) => [data, ...prev]);
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setRunningScenario(null);
    }
  };

  const runAllScenarios = async () => {
    for (const scenario of scenarios) {
      await runSimulation(scenario.id);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-amber-950/20 to-slate-900/90">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Interactive Simulation Environment
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Simulation <span className="gradient-text-amber">Lab</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inject mock Razorpay payment failure webhooks and observe the agent&apos;s real-time diagnosis & recovery pipeline.
          </p>
        </div>

        <button
          onClick={runAllScenarios}
          disabled={!!runningScenario}
          className="flex items-center gap-2.5 px-5 py-3 text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 rounded-xl shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
        >
          <Play className="w-4 h-4" />
          Run All 8 Failure Scenarios
        </button>
      </div>

      {/* Agent Workflow Explanation Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
        <Brain className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-200">How the Agent Processing Pipeline Works</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            1. Inject Payment Failure Webhook &rarr; 2. Run AI/Rules Diagnostic Engine &rarr; 3. Select Bounded Strategy &rarr; 4. Create Live Razorpay Payment Link or Trigger Human Approval &rarr; 5. Record Immutable Audit Trail.
          </p>
        </div>
      </div>

      {/* Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-slate-900/40 rounded-2xl animate-pulse" />
          ))
        ) : (
          scenarios.map((scenario) => {
            const Icon = scenarioIcons[scenario.id] || Zap;
            const gradientClass = scenarioGradients[scenario.id] || 'from-slate-800 to-slate-900 border-slate-700';
            const isRunning = runningScenario === scenario.id;

            return (
              <motion.div
                key={scenario.id}
                whileHover={{ y: -3 }}
                className={`glass-card rounded-2xl border p-5 flex flex-col justify-between space-y-4 bg-gradient-to-b ${gradientClass}`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center shadow-md">
                      <Icon className="w-5 h-5 text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold text-white">{scenario.name}</h3>
                      <p className="text-[11px] font-mono text-slate-400">{scenario.amountFormatted} • {scenario.method}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {scenario.description}
                  </p>
                </div>

                <button
                  onClick={() => runSimulation(scenario.id)}
                  disabled={!!runningScenario}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-extrabold text-white bg-slate-950/80 hover:bg-slate-900 rounded-xl border border-slate-700/80 transition-all shadow-md disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      Processing Agent...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-amber-400" />
                      Simulate Failure
                    </>
                  )}
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Live Simulation Results */}
      {results.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Live Simulation Execution Log
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                {results.length} Executed
              </span>
            </h2>
          </div>

          <AnimatePresence>
            {results.map((result, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl border border-slate-800/80 p-6 space-y-4"
              >
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      result.result.requiresApproval 
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                        : result.result.success 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}>
                      {result.result.requiresApproval ? (
                        <Shield className="w-5 h-5" />
                      ) : result.result.success ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-white">
                        {result.scenario.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                        <span className="text-slate-200 font-bold">{result.mockPayment.amountFormatted}</span>
                        <span>•</span>
                        <span>{result.mockPayment.notes?.customer_name || result.mockPayment.email}</span>
                        <span>•</span>
                        <span className="text-indigo-400">{result.mockPayment.id}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                    Latency: {result.processingTimeMs}ms
                  </span>
                </div>

                {/* Node Pipeline Visualizer */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300 whitespace-nowrap">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    1. Webhook Received
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 whitespace-nowrap">
                    <Brain className="w-3.5 h-3.5" />
                    2. AI Diagnosed
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300 capitalize whitespace-nowrap">
                    <Zap className="w-3.5 h-3.5" />
                    3. Strategy: {result.result.strategy.replace(/_/g, ' ')}
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap ${
                    result.result.requiresApproval 
                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300' 
                      : result.result.success 
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' 
                      : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                  }`}>
                    {result.result.requiresApproval ? (
                      <>
                        <Shield className="w-3.5 h-3.5" />
                        4. Human Gate Active (Pending Approval)
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        4. Payment Link Created
                      </>
                    )}
                  </div>
                </div>

                {/* Outcome Message & Live Link */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <p className="text-xs text-slate-300 font-medium">{result.result.message}</p>
                  
                  {typeof result.result.details?.paymentLinkUrl === 'string' && (
                    <a
                      href={result.result.details.paymentLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-extrabold text-indigo-300 hover:text-indigo-200 bg-indigo-500/15 px-3.5 py-2 rounded-xl border border-indigo-500/30 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Razorpay Payment Link: {result.result.details.paymentLinkUrl}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
