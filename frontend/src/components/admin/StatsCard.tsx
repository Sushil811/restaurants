'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: number; // percent change, positive = up, negative = down
  trendLabel?: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-[#C9A84C]',
  iconBg = 'bg-[#C9A84C]/10',
  trend,
  trendLabel = 'vs yesterday',
  prefix = '',
  suffix = '',
  delay = 0,
}: StatsCardProps) {
  const trendPositive = trend !== undefined && trend >= 0;
  const trendNegative = trend !== undefined && trend < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#1a1a1a] border border-white/10 rounded-xl p-5 hover:border-[#C9A84C]/30 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1.5 font-['Playfair_Display']">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
        </div>
        <div
          className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon size={20} className={iconColor} />
        </div>
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1.5">
          <div
            className={`flex items-center gap-0.5 text-xs font-semibold ${
              trendPositive ? 'text-emerald-400' : trendNegative ? 'text-red-400' : 'text-gray-400'
            }`}
          >
            {trendPositive && <TrendingUp size={13} />}
            {trendNegative && <TrendingDown size={13} />}
            <span>
              {trendPositive ? '+' : ''}
              {trend.toFixed(1)}%
            </span>
          </div>
          <span className="text-xs text-gray-500">{trendLabel}</span>
        </div>
      )}
    </motion.div>
  );
}
