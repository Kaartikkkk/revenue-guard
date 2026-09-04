'use client';

import { useState, useEffect } from 'react';
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
    <div className="p-8 max-w-5xl mx-auto space-y-6 pb-16 font-sans select-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Agent Control Center
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Governance & <span className="text-blue-400">Settings</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Configure safety thresholds, human approval limits, and maximum budget caps.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`
            flex items-center gap-2.5 px-6 py-3 text-xs font-extrabold rounded-xl transition-all shadow-lg shrink-0
            ${saved
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'text-white bg-blue-600 hover:bg-blue-500 shadow-blue-600/30 hover:scale-105 active:scale-95'
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
              Saving Settings...
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
            <div key={i} className="h-24 bg-slate-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {configs.map((config) => {
            const meta = configMeta[config.key];
            if (!meta) return null;
            const Icon = meta.icon;

            return (
              <div key={config.key} className="mockup-card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400 shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white">{meta.label}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{config.description}</p>

                      {meta.unit === 'paise' && editedValues[config.key] && (
                        <p className="text-xs font-mono font-bold text-blue-400 mt-1.5 bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/20 inline-block">
                          Formatted Value: {formatPaiseDisplay(editedValues[config.key])}
                        </p>
                      )}
                      {meta.unit === 'ms' && editedValues[config.key] && (
                        <p className="text-xs font-mono font-bold text-blue-400 mt-1.5 bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/20 inline-block">
                          Formatted Value: {formatMsDisplay(editedValues[config.key])}
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
                        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#0b101d] border border-slate-800"
                      >
                        {editedValues[config.key] === 'true' ? (
                          <ToggleRight className="w-8 h-8 text-emerald-400" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-slate-500" />
                        )}
                        <span className={`text-xs font-extrabold ${editedValues[config.key] === 'true' ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {editedValues[config.key] === 'true' ? 'Active' : 'Disabled'}
                        </span>
                      </button>
                    ) : (
                      <input
                        type="number"
                        value={editedValues[config.key] || ''}
                        onChange={(e) =>
                          setEditedValues((prev) => ({
                            ...prev,
                            [config.key]: e.target.value,
                          }))
                        }
                        className="w-44 bg-[#0b101d] text-white text-sm font-mono font-bold rounded-xl px-4 py-2.5 border border-slate-800 focus:border-blue-500 focus:outline-none text-right shadow-inner"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Safety Banner */}
          <div className="mockup-card p-5 flex items-start gap-4 bg-gradient-to-r from-amber-500/10 via-[#0e1526] to-[#0e1526] border border-amber-500/30">
            <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wide">
                Safety & Human Approval Boundaries
              </h4>
              <p className="text-xs text-amber-200/80 leading-relaxed font-medium">
                Changes saved here take immediate effect across all live Razorpay webhooks. Transactions exceeding the Human Gate Threshold (default ₹5,000) will automatically pause for merchant approval.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
