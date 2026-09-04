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
  CreditCard,
  BarChart3,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, badge: null },
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

      <div className="space-y-4 pt-4">
        {/* Bottom Interactive Promo Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="mockup-promo-card p-4 relative overflow-hidden text-white shadow-2xl cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          </div>
          <h3 className="text-sm font-extrabold leading-snug tracking-tight">
            Smarter<br />
            Recoveries<br />
            Higher Revenue
          </h3>
          <p className="text-[10px] text-purple-200/80 font-bold mt-2 flex items-center gap-1">
            <span>Detect • Resolve • Grow</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </p>

          {/* Animated Background Wave */}
          <svg className="absolute bottom-0 right-0 w-32 h-16 opacity-35 pointer-events-none group-hover:scale-110 transition-transform" viewBox="0 0 100 50">
            <path d="M0 30 Q 25 10, 50 30 T 100 20 L 100 50 L 0 50 Z" fill="url(#sidebarWave)" />
            <defs>
              <linearGradient id="sidebarWave" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* User Profile Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-xs text-white shadow-md shadow-blue-600/30">
              K
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-200 group-hover:text-white transition-colors">Kartik Lamba</p>
              <p className="text-[10px] text-slate-400 font-semibold">Operator • Admin</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </aside>
  );
}
