'use client';

import { useState } from 'react';
import { Search, Bell, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TopNav() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-cyan-500/25 bg-[#091124]/40 backdrop-blur-md select-none shrink-0 z-10 shadow-md">
      {/* Search Input */}
      <div className="relative w-96 group">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-400 transition-colors" />
        <input
          type="text"
          placeholder="Search transactions, payments, merchants..."
          className="w-full bg-[#0d1527] text-xs text-slate-200 rounded-xl pl-10 pr-12 py-2 border border-slate-800 focus:border-blue-500 focus:outline-none placeholder:text-slate-500 font-medium transition-all shadow-inner"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
          <span>⌘</span>
          <span>K</span>
        </div>
      </div>

      {/* Right Side Status & User Avatar */}
      <div className="flex items-center gap-4">
        {/* Live System Online Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-400 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>System Online</span>
          <span className="text-[10px] text-slate-400 font-medium ml-1">All services operational</span>
        </div>

        {/* Bell Notification Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-[#0d1527] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-[#0d1527] animate-pulse" />
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl mockup-card p-4 space-y-3 shadow-2xl z-50 border border-slate-700/80"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Agent Notifications
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Live Webhooks</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
                    <p className="font-bold text-white flex items-center justify-between">
                      <span>Payment Recovered</span>
                      <span className="text-[10px] font-mono text-emerald-400">Just now</span>
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">₹75,000.00 via Razorpay Payment Link</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
                    <p className="font-bold text-white flex items-center justify-between">
                      <span>Human Gate Active</span>
                      <span className="text-[10px] font-mono text-amber-400">2m ago</span>
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">Vikram Singh • ₹75,000 pending approval</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-xs text-white shadow-md shadow-blue-600/30">
          K
        </div>
      </div>
    </header>
  );
}
