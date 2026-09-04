'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  accentColor: 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'cyan';
}

const colorMap = {
  blue: {
    border: 'border-blue-500/25 hover:border-blue-500/50',
    iconBg: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    glow: 'shadow-blue-500/10 hover:shadow-blue-500/25',
    accentText: 'text-blue-400',
  },
  green: {
    border: 'border-emerald-500/25 hover:border-emerald-500/50',
    iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    glow: 'shadow-emerald-500/10 hover:shadow-emerald-500/25',
    accentText: 'text-emerald-400',
  },
  red: {
    border: 'border-rose-500/25 hover:border-rose-500/50',
    iconBg: 'bg-rose-500/15 text-rose-400 border border-rose-500/20',
    glow: 'shadow-rose-500/10 hover:shadow-rose-500/25',
    accentText: 'text-rose-400',
  },
  amber: {
    border: 'border-amber-500/25 hover:border-amber-500/50',
    iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    glow: 'shadow-amber-500/10 hover:shadow-amber-500/25',
    accentText: 'text-amber-400',
  },
  purple: {
    border: 'border-purple-500/25 hover:border-purple-500/50',
    iconBg: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
    glow: 'shadow-purple-500/10 hover:shadow-purple-500/25',
    accentText: 'text-purple-400',
  },
  cyan: {
    border: 'border-cyan-500/25 hover:border-cyan-500/50',
    iconBg: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20',
    glow: 'shadow-cyan-500/10 hover:shadow-cyan-500/25',
    accentText: 'text-cyan-400',
  },
};

export function StatsCard({ title, value, subtitle, icon, trend, trendValue, accentColor }: StatsCardProps) {
  const colors = colorMap[accentColor];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        relative overflow-hidden rounded-2xl p-5 glass-card border backdrop-blur-xl shadow-xl
        ${colors.border} ${colors.glow} group
      `}
    >
      <div className="flex items-start justify-between mb-3.5">
        <div className={`p-3 rounded-xl ${colors.iconBg} shadow-inner`}>
          {icon}
        </div>

        {trend && (
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
            trend === 'up' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : trend === 'down' 
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {trendValue}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-3xl font-extrabold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
          {value}
        </h3>
        <p className="text-xs font-bold text-slate-400 tracking-wide uppercase">{title}</p>
        {subtitle && (
          <p className="text-[11px] font-medium text-slate-500 pt-1 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            {subtitle}
          </p>
        )}
      </div>

      {/* Subtle bottom gradient indicator */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
        accentColor === 'blue' ? 'from-blue-600 to-indigo-600' :
        accentColor === 'green' ? 'from-emerald-500 to-teal-500' :
        accentColor === 'red' ? 'from-rose-600 to-red-600' :
        accentColor === 'amber' ? 'from-amber-500 to-orange-500' :
        'from-purple-600 to-indigo-600'
      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </motion.div>
  );
}
