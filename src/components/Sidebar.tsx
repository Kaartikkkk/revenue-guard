'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  RefreshCw,
  ClipboardList,
  Settings,
  Zap,
  Shield,
  Activity,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { href: '/recovery', label: 'Recovery Hub', icon: RefreshCw, badge: 'Live' },
  { href: '/audit', label: 'Audit Trail', icon: ClipboardList, badge: null },
  { href: '/simulate', label: 'Simulation Lab', icon: Zap, badge: '8 Scenarios' },
  { href: '/settings', label: 'Settings', icon: Settings, badge: null },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen flex flex-col border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-2xl z-20 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/60">
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/45 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                Revenue<span className="gradient-text-blue">Guard</span>
              </h1>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-1">
              <span>Razorpay AI Agent</span>
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Core Navigation</p>
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative group block"
            >
              <div
                className={`
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold
                  transition-all duration-200
                  ${isActive
                    ? 'text-white bg-indigo-600/15 border border-indigo-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 hover:border hover:border-slate-800/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isActive 
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div layoutId="sidebar-active-indicator">
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                    </motion.div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Live Agent Status Widget */}
      <div className="p-4 border-t border-slate-800/60">
        <div className="rounded-2xl p-3.5 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">Agent Active</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">v2.4-AI</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Autonomous failure detection & payment link recovery online.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <p className="text-[10px] font-semibold text-slate-600 text-center tracking-tight">
          Track 01 • Razorpay AI Buildathon 2026
        </p>
      </div>
    </aside>
  );
}
