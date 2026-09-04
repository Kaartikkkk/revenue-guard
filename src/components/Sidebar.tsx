'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  RefreshCw,
  ClipboardList,
  Settings,
  Zap,
  Shield,
  CreditCard,
  BarChart3,
  ChevronRight,
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
    <aside className="w-64 h-screen flex flex-col justify-between bg-[#0b101d] border-r border-slate-800/80 p-4 select-none shrink-0 overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-2 pt-1 flex items-center gap-3">
          <img
            src="/revenueguard-logo-256.png"
            alt="RevenueGuard Logo"
            className="w-10 h-10 rounded-xl object-contain shadow-lg shadow-blue-500/20"
          />
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight">RevenueGuard</h1>
            <p className="text-[11px] text-slate-400 font-medium">Razorpay Recovery Engine</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href && (idx === 0 || (idx !== 2 && idx !== 4));
            const Icon = item.icon;

            return (
              <Link
                key={item.label + idx}
                href={item.href}
                className={`
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4 pt-4">
        {/* Bottom Promo Card */}
        <div className="mockup-promo-card p-4 relative overflow-hidden text-white shadow-xl">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-3">
            <Zap className="w-4 h-4 text-purple-300 fill-purple-300" />
          </div>
          <h3 className="text-sm font-extrabold leading-snug">
            Smarter<br />
            Recoveries<br />
            Higher Revenue
          </h3>
          <p className="text-[10px] text-purple-200/70 font-medium mt-2">
            Detect • Resolve • Grow
          </p>

          {/* Background Decorative Wave SVG */}
          <svg className="absolute bottom-0 right-0 w-32 h-16 opacity-30 pointer-events-none" viewBox="0 0 100 50">
            <path d="M0 30 Q 25 10, 50 30 T 100 20 L 100 50 L 0 50 Z" fill="url(#waveGrad)" />
            <defs>
              <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* User Profile Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
              K
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Kartik Lamba</p>
              <p className="text-[10px] text-slate-400 font-medium">Operator</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </aside>
  );
}
