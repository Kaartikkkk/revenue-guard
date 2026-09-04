'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  LayoutDashboard,
  RefreshCw,
  ClipboardList,
  Settings,
  Zap,
  CreditCard,
  BarChart3,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home, badge: null },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { href: '/recovery', label: 'Recovery Hub', icon: RefreshCw, badge: 'Live' },
  { href: '/transactions', label: 'Transactions', icon: CreditCard, badge: null },
  { href: '/audit', label: 'Audit Trail', icon: ClipboardList, badge: null },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, badge: null },
  { href: '/simulate', label: 'Simulation Lab', icon: Zap, badge: null },
  { href: '/settings', label: 'Settings', icon: Settings, badge: null },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen flex flex-col justify-between bg-[#080d19]/85 backdrop-blur-xl border-r border-slate-800/80 p-4 select-none shrink-0 overflow-y-auto z-20">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-2 pt-1 flex items-center gap-3">
          <div className="relative group">
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
            <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1">
              Revenue<span className="gradient-text-cyan">Guard</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Razorpay Recovery Engine</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="relative group block"
              >
                <div
                  className={`
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/35 border border-blue-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div layoutId="sidebar-active-pill" className="absolute right-2 w-1.5 h-4 bg-white rounded-full shadow-md" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        {/* System Status Pill */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">AI Engine</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Gemini Active
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Gateway</span>
            <span className="text-blue-400 font-bold">Razorpay API</span>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="pt-1 flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-xs text-white shadow-md">
              K
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">Kartik Lamba</p>
              <p className="text-[10px] text-slate-400 font-medium">Operator • Admin</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </aside>
  );
}
