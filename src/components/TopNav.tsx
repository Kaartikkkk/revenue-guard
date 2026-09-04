'use client';

import { Search, Bell } from 'lucide-react';

export function TopNav() {
  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-slate-800/80 bg-[#070a12] select-none shrink-0">
      {/* Search Input */}
      <div className="relative w-96">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search transactions, payments, merchants..."
          className="w-full bg-[#0e1526] text-xs text-slate-200 rounded-xl pl-10 pr-12 py-2 border border-slate-800 focus:border-blue-500 focus:outline-none placeholder:text-slate-500 font-medium"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
          <span>⌘</span>
          <span>K</span>
        </div>
      </div>

      {/* Right Side Status & User Avatar */}
      <div className="flex items-center gap-4">
        {/* System Online Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Online</span>
          <span className="text-[10px] text-slate-400 font-normal ml-1">All services operational</span>
        </div>

        {/* Bell Icon */}
        <button className="relative p-2 rounded-xl bg-[#0e1526] border border-slate-800 text-slate-300 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-[#0e1526]" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-blue-600/30">
          K
        </div>
      </div>
    </header>
  );
}
