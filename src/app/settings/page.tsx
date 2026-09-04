'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Save,
  RefreshCw,
  IndianRupee,
  Shield,
  Clock,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface ConfigItem {
  id: string;
  key: string;
  value: string;
  description: string;
  updated_at: string;
}

const configMeta: Record<string, { label: string; icon: any; unit?: string; type: 'number' | 'boolean' }> = {
  max_retry_attempts: { label: 'Max Retry Attempts', icon: RotateCcw, type: 'number' },
  human_gate_threshold: { label: 'Human Gate Threshold (Safety Limit)', icon: Shield, unit: 'paise', type: 'number' },
  daily_budget_cap: { label: 'Daily Budget Cap', icon: IndianRupee, unit: 'paise', type: 'number' },
  weekly_budget_cap: { label: 'Weekly Budget Cap', icon: IndianRupee, unit: 'paise', type: 'number' },
  monthly_budget_cap: { label: 'Monthly Budget Cap', icon: IndianRupee, unit: 'paise', type: 'number' },
  cooldown_period_ms: { label: 'Cooldown Period (Between Retries)', icon: Clock, unit: 'ms', type: 'number' },
  auto_recovery_enabled: { label: 'Autonomous Recovery Engine', icon: ToggleLeft, type: 'boolean' },
};

export default function SettingsPage() {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setConfigs(data.configs || []);
      const values: Record<string, string> = {};
      for (const c of data.configs || []) {
        values[c.key] = c.value;
      }
      setEditedValues(values);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const settings = Object.entries(editedValues).map(([key, value]) => ({ key, value }));
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await fetchSettings();
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatPaiseDisplay = (paise: string) => {
    const num = parseInt(paise);
    if (isNaN(num)) return paise;
    return `₹${(num / 100).toLocaleString('en-IN')}`;
  };

  const formatMsDisplay = (ms: string) => {
    const num = parseInt(ms);
    if (isNaN(num)) return ms;
    if (num >= 3600000) return `${(num / 3600000).toFixed(1)} hours`;
    if (num >= 60000) return `${(num / 60000).toFixed(0)} minutes`;
    return `${(num / 1000).toFixed(0)} seconds`;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              Policy & Safety Configuration
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Agent <span className="gradient-text-blue">Settings & Governance</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure safety boundaries, human-in-the-loop thresholds, and daily budget caps.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`
            flex items-center gap-2.5 px-6 py-3 text-xs font-extrabold rounded-xl transition-all shadow-lg
            ${saved
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-indigo-500/30 hover:scale-105 active:scale-95'
            } disabled:opacity-50
          `}
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Settings Updated!
            </>
          ) : saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Saving Configuration...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Governance Settings
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-900/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pt-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Bounded Control & Risk Controls
            </h2>
          </div>

          {configs.map((config, idx) => {
            const meta = configMeta[config.key];
            if (!meta) return null;
            const Icon = meta.icon;

            return (
              <motion.div
                key={config.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="glass-card rounded-2xl border border-slate-800/80 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-indigo-400 shadow-inner">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white">{meta.label}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{config.description}</p>

                      {meta.unit === 'paise' && editedValues[config.key] && (
                        <p className="text-xs font-mono font-bold text-indigo-400 mt-1.5 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20 inline-block">
                          Value: {formatPaiseDisplay(editedValues[config.key])}
                        </p>
                      )}
                      {meta.unit === 'ms' && editedValues[config.key] && (
                        <p className="text-xs font-mono font-bold text-indigo-400 mt-1.5 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20 inline-block">
                          Value: {formatMsDisplay(editedValues[config.key])}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 sm:ml-4">
                    {meta.type === 'boolean' ? (
                      <button
                        onClick={() =>
                          setEditedValues((prev) => ({
                            ...prev,
                            [config.key]: prev[config.key] === 'true' ? 'false' : 'true',
                          }))
                        }
                        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800"
                      >
                        {editedValues[config.key] === 'true' ? (
                          <ToggleRight className="w-8 h-8 text-emerald-400" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-slate-600" />
                        )}
                        <span className={`text-xs font-extrabold ${editedValues[config.key] === 'true' ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {editedValues[config.key] === 'true' ? 'Active' : 'Disabled'}
                        </span>
                      </button>
                    ) : (
                      <div className="relative">
                        <input
                          type="number"
                          value={editedValues[config.key] || ''}
                          onChange={(e) =>
                            setEditedValues((prev) => ({
                              ...prev,
                              [config.key]: e.target.value,
                            }))
                          }
                          className="w-44 bg-slate-900 text-white text-sm font-mono font-bold rounded-xl px-4 py-2.5 border border-slate-800 focus:border-indigo-500 focus:outline-none text-right shadow-inner"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Safety Notice Card */}
          <div className="glass-card rounded-2xl border border-amber-500/30 p-5 flex items-start gap-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent mt-6">
            <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wide">
                Safety & Bounded Execution Policy
              </h4>
              <p className="text-xs text-amber-200/80 leading-relaxed font-medium">
                Every policy modification is immediately stored in SQLite and enforced on live Razorpay webhooks.
                Transactions exceeding the Human Gate Threshold (default ₹5,000) are automatically halted until manual approval is granted.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
