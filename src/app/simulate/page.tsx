'use client';

import { useState, useEffect } from 'react';
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
  FlaskConical,
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
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-16 font-sans select-none">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">
              <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
              Interactive Simulation Environment
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Simulation <span className="text-purple-400">Lab</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Test the AI agent by injecting simulated Razorpay webhook payment failure scenarios in real time.
          </p>
        </div>

        <button
          onClick={runAllScenarios}
          disabled={!!runningScenario}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 hover:scale-105 active:scale-95 shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Run All 8 Failure Scenarios</span>
        </button>
      </div>

      {/* Info Card Banner */}
      <div className="mockup-card p-4 flex items-start gap-3 bg-[#0e1526] border border-blue-500/30">
        <Brain className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-extrabold text-white">How the Agent Processing Pipeline Operates</h4>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            1. Webhook Ingestion &rarr; 2. Diagnostic Reasoning &rarr; 3. Strategy Selection &rarr; 4. Razorpay Payment Link Creation / Bounded Approval Gate &rarr; 5. Audit Logging.
          </p>
        </div>
      </div>

      {/* Scenario Cards Grid (8 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-slate-900 rounded-2xl animate-pulse" />
          ))
        ) : (
          scenarios.map((scenario) => {
            const Icon = scenarioIcons[scenario.id] || Zap;
            const isRunning = runningScenario === scenario.id;

            return (
              <div
                key={scenario.id}
                className="mockup-card p-5 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold text-white">{scenario.name}</h3>
                      <p className="text-[11px] font-mono text-slate-400">{scenario.amountFormatted} • {scenario.method}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {scenario.description}
                  </p>
                </div>

                <button
                  onClick={() => runSimulation(scenario.id)}
                  disabled={!!runningScenario}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-extrabold text-white bg-[#0b101d] hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-all shadow-md disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                      Running Agent...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                      Simulate Failure
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Execution Results */}
      {results.length > 0 && (
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Live Simulation Execution Stream
            <span className="text-xs font-mono text-slate-400 bg-[#0e1526] px-2.5 py-0.5 rounded-full border border-slate-800">
              {results.length} Executed
            </span>
          </h2>

          <div className="space-y-4">
            {results.map((result, idx) => (
              <div key={idx} className="mockup-card p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      result.result.requiresApproval
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : result.result.success
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
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
                      <h3 className="text-sm font-extrabold text-white">{result.scenario.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                        <span className="text-slate-200 font-bold">{result.mockPayment.amountFormatted}</span>
                        <span>•</span>
                        <span>{result.mockPayment.notes?.customer_name || result.mockPayment.email}</span>
                        <span>•</span>
                        <span className="text-blue-400">{result.mockPayment.id}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-500 bg-[#0b101d] px-3 py-1 rounded-xl border border-slate-800">
                    Latency: {result.processingTimeMs}ms
                  </span>
                </div>

                {/* Flow Pipeline */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-bold whitespace-nowrap">
                    1. Webhook Received
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-bold whitespace-nowrap">
                    2. AI Diagnosed
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="px-3 py-1.5 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/30 text-xs font-bold capitalize whitespace-nowrap">
                    3. Strategy: {result.result.strategy.replace(/_/g, ' ')}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  {result.result.requiresApproval ? (
                    <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-extrabold whitespace-nowrap">
                      4. Human Gate Active
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold whitespace-nowrap">
                      4. Payment Link Created
                    </span>
                  )}
                </div>

                {/* Outcome Box */}
                <div className="p-4 rounded-xl bg-[#0b101d] border border-slate-800 space-y-2">
                  <p className="text-xs text-slate-300 font-medium">{result.result.message}</p>
                  {typeof result.result.details?.paymentLinkUrl === 'string' && (
                    <a
                      href={result.result.details.paymentLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-extrabold text-cyan-300 hover:text-cyan-200 bg-cyan-500/20 px-4 py-2 rounded-xl border border-cyan-500/30 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Razorpay Payment Link ({result.result.details.paymentLinkUrl})
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
