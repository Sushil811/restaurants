'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { DollarSign, ShoppingBag, CalendarDays, Users, Clock, CheckCircle, UtensilsCrossed, Star, Tag, FileText, BarChart3, Settings, List } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

// ─── Quick Links Data ─────────────────────────────────────────────────────────

const quickLinks = [
  { name: 'Menu Items', href: '/admin/menu', icon: List, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { name: 'Reservations', href: '/admin/reservations', icon: CalendarDays, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { name: 'Users', href: '/admin/users', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { name: 'Reviews', href: '/admin/reviews', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { name: 'Coupons', href: '/admin/coupons', icon: Tag, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  { name: 'Blog', href: '/admin/blog', icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { name: 'Settings', href: '/admin/settings', icon: Settings, color: 'text-gray-400', bg: 'bg-gray-400/10' },
];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const revenueData = [
  { day: 'May 07', revenue: 4200 },
  { day: 'May 08', revenue: 5800 },
  { day: 'May 09', revenue: 3900 },
  { day: 'May 10', revenue: 6700 },
  { day: 'May 11', revenue: 7200 },
  { day: 'May 12', revenue: 8100 },
  { day: 'May 13', revenue: 5400 },
  { day: 'May 14', revenue: 6300 },
  { day: 'May 15', revenue: 7800 },
  { day: 'May 16', revenue: 9200 },
  { day: 'May 17', revenue: 6100 },
  { day: 'May 18', revenue: 7400 },
  { day: 'May 19', revenue: 8900 },
  { day: 'May 20', revenue: 10200 },
  { day: 'May 21', revenue: 11500 },
  { day: 'May 22', revenue: 9800 },
  { day: 'May 23', revenue: 8600 },
  { day: 'May 24', revenue: 7300 },
  { day: 'May 25', revenue: 9100 },
  { day: 'May 26', revenue: 10800 },
  { day: 'May 27', revenue: 12300 },
  { day: 'May 28', revenue: 11200 },
  { day: 'May 29', revenue: 9700 },
  { day: 'May 30', revenue: 8400 },
  { day: 'May 31', revenue: 10500 },
  { day: 'Jun 01', revenue: 13200 },
  { day: 'Jun 02', revenue: 14100 },
  { day: 'Jun 03', revenue: 12800 },
  { day: 'Jun 04', revenue: 11600 },
  { day: 'Jun 05', revenue: 9320 },
];

const orderStatusData = [
  { name: 'Delivered', value: 148, color: '#10b981' },
  { name: 'Preparing', value: 32, color: '#f59e0b' },
  { name: 'Confirmed', value: 21, color: '#3b82f6' },
  { name: 'Pending', value: 8, color: '#8b5cf6' },
  { name: 'Cancelled', value: 14, color: '#ef4444' },
];

const recentOrders = [
  { id: '#ORD-1048', customer: 'Arjun Mehta', items: 'Truffle Risotto, Red Wine', total: '₹4,200', status: 'Delivered', time: '12 min ago' },
  { id: '#ORD-1047', customer: 'Priya Sharma', items: 'Lobster Bisque, Soufflé', total: '₹6,800', status: 'Preparing', time: '28 min ago' },
  { id: '#ORD-1046', customer: 'Rahul Gupta', items: 'Foie Gras, Champagne', total: '₹9,400', status: 'Confirmed', time: '45 min ago' },
  { id: '#ORD-1045', customer: 'Ananya Singh', items: 'Duck Confit, Crème Brûlée', total: '₹5,600', status: 'Delivered', time: '1 hr ago' },
  { id: '#ORD-1044', customer: 'Vikram Nair', items: 'Wagyu Beef, Tiramisu', total: '₹11,200', status: 'Cancelled', time: '1.5 hr ago' },
  { id: '#ORD-1043', customer: 'Sneha Iyer', items: 'Pasta Truffle, Sorbet', total: '₹3,800', status: 'Delivered', time: '2 hr ago' },
];

const todayReservations = [
  { id: 1, name: 'Rajiv Kapoor', time: '7:00 PM', guests: 4, status: 'Confirmed', occasion: 'Anniversary' },
  { id: 2, name: 'Meera Patel', time: '7:30 PM', guests: 2, status: 'Pending', occasion: 'Birthday' },
  { id: 3, name: 'Aditya Roy', time: '8:00 PM', guests: 6, status: 'Confirmed', occasion: '' },
  { id: 4, name: 'Pooja Desai', time: '8:30 PM', guests: 3, status: 'Confirmed', occasion: 'Date Night' },
  { id: 5, name: 'Suresh Kumar', time: '9:00 PM', guests: 8, status: 'Pending', occasion: 'Corporate' },
];

const topDishes = [
  { rank: 1, name: 'Black Truffle Risotto', category: 'Mains', orders: 284, revenue: '₹1,42,000' },
  { rank: 2, name: 'Lobster Bisque', category: 'Soups', orders: 231, revenue: '₹1,04,950' },
  { rank: 3, name: 'Wagyu Beef Tenderloin', category: 'Mains', orders: 198, revenue: '₹1,98,000' },
  { rank: 4, name: 'Chocolate Soufflé', category: 'Desserts', orders: 176, revenue: '₹70,400' },
  { rank: 5, name: 'Duck Confit', category: 'Mains', orders: 154, revenue: '₹92,400' },
];

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Delivered: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Preparing: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    Confirmed: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    Pending: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    Cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/20'}`}>
      {status}
    </span>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-[#C9A84C]">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-['Playfair_Display']">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Welcome back! Here&apos;s what&apos;s happening at Lumiere today.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Revenue Today"
          value="9,320"
          prefix="₹"
          icon={DollarSign}
          iconColor="text-[#C9A84C]"
          iconBg="bg-[#C9A84C]/10"
          trend={12.4}
          delay={0}
        />
        <StatsCard
          title="Total Orders"
          value={223}
          icon={ShoppingBag}
          iconColor="text-blue-400"
          iconBg="bg-blue-400/10"
          trend={7.2}
          delay={0.05}
        />
        <StatsCard
          title="Reservations Today"
          value={18}
          icon={CalendarDays}
          iconColor="text-purple-400"
          iconBg="bg-purple-400/10"
          trend={-3.1}
          delay={0.1}
        />
        <StatsCard
          title="Total Users"
          value="1,284"
          icon={Users}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-400/10"
          trend={5.8}
          delay={0.15}
        />
      </div>

      {/* Quick Links Row */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {quickLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  href={link.href as any}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#1a1a1a] border border-white/10 hover:border-[#C9A84C]/50 hover:bg-white/[0.02] transition-all group"
                >
                  <div className={`p-3 rounded-lg ${link.bg} ${link.color} mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{link.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="xl:col-span-2 bg-[#1a1a1a] border border-white/10 rounded-xl p-5"
        >
          <h2 className="text-base font-semibold text-white mb-4">Revenue — Last 30 Days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#6b7280', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#C9A84C"
                strokeWidth={2}
                fill="url(#goldGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#C9A84C' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders by Status Pie */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-[#1a1a1a] border border-white/10 rounded-xl p-5"
        >
          <h2 className="text-base font-semibold text-white mb-4">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
              >
                {orderStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#9ca3af' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-2 space-y-1.5">
            {orderStatusData.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-gray-400">{s.name}</span>
                </div>
                <span className="font-semibold text-white">{s.value}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h2 className="text-base font-semibold text-white">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-[#C9A84C] hover:underline">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Order</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-[#C9A84C] font-mono text-xs">{order.id}</td>
                    <td className="px-5 py-3 text-white font-medium">{order.customer}</td>
                    <td className="px-5 py-3 text-gray-300">{order.total}</td>
                    <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Today's Reservations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h2 className="text-base font-semibold text-white">Today&apos;s Reservations</h2>
            <a href="/admin/reservations" className="text-xs text-[#C9A84C] hover:underline">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Guest</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Guests</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todayReservations.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-white font-medium text-sm">{r.name}</p>
                        {r.occasion && <p className="text-[10px] text-gray-500">{r.occasion}</p>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-300 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-gray-500" />
                        {r.time}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-300 text-sm">{r.guests} pax</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <button className="px-2 py-0.5 text-xs rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                          <CheckCircle size={12} />
                        </button>
                        <button className="px-2 py-0.5 text-xs rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Top Dishes */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="text-base font-semibold text-white">Top 5 Best-Selling Dishes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-12">#</th>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Dish</th>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Orders</th>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Revenue</th>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Share</th>
              </tr>
            </thead>
            <tbody>
              {topDishes.map((dish) => (
                <tr key={dish.rank} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-[#C9A84C] font-bold">{dish.rank}</td>
                  <td className="px-5 py-3 text-white font-medium">{dish.name}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{dish.category}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-300">{dish.orders}</td>
                  <td className="px-5 py-3 text-gray-300">{dish.revenue}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/10 rounded-full h-1.5 w-24">
                        <div
                          className="h-1.5 rounded-full bg-[#C9A84C]"
                          style={{ width: `${(dish.orders / 284) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{Math.round((dish.orders / 284) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
