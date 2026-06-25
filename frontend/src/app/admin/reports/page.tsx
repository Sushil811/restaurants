'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, ShoppingBag, Calendar, ArrowUpRight, Download, Users, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface TopCustomer {
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
}

interface CategorySale {
  category: string;
  orders: number;
  revenue: number;
  percentage: number;
}

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(false);

  const kpis = [
    { title: 'Total Revenue', value: '₹2,48,950', change: '+12.4%', icon: TrendingUp, positive: true },
    { title: 'Online Orders', value: '142', change: '+8.2%', icon: ShoppingBag, positive: true },
    { title: 'Average Order Value', value: '₹1,753', change: '-2.1%', icon: BarChart3, positive: false },
    { title: 'Table Reservations', value: '58', change: '+15.5%', icon: Calendar, positive: true },
  ];

  const topCustomers: TopCustomer[] = [
    { name: 'Sushil Kumar', email: 'sushil@example.com', totalOrders: 18, totalSpent: 35400, loyaltyPoints: 340 },
    { name: 'Aditya Birla', email: 'aditya@example.com', totalOrders: 12, totalSpent: 26800, loyaltyPoints: 240 },
    { name: 'Rohit Sharma', email: 'rohit@example.com', totalOrders: 10, totalSpent: 19500, loyaltyPoints: 180 },
    { name: 'Sneha Reddy', email: 'sneha@example.com', totalOrders: 8, totalSpent: 14200, loyaltyPoints: 120 },
  ];

  const categorySales: CategorySale[] = [
    { category: 'Main Course', orders: 185, revenue: 161200, percentage: 65 },
    { category: 'Starters / Soups', orders: 95, revenue: 49600, percentage: 20 },
    { category: 'Desserts', orders: 74, revenue: 24800, percentage: 10 },
    { category: 'Beverages / Wine', orders: 40, revenue: 13350, percentage: 5 },
  ];

  const handleExport = (format: 'CSV' | 'PDF') => {
    toast.loading(`Compiling financial datasets...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Export successful! Lumiere_Analytics_${new Date().toISOString().slice(0,10)}.${format.toLowerCase()} downloaded.`);
    }, 1500);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Analytics dashboards synchronized.');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Analytics & Reports</h1>
          <p className="text-xs text-gray-400">Track restaurant revenue, category popularity, and top loyal customer metrics.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="p-2.5 border border-white/10 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <RefreshCw className={`w-4.5 h-4.5 ${loading ? 'animate-spin text-[#C9A84C]' : ''}`} />
          </button>
          <button
            onClick={() => handleExport('CSV')}
            className="border border-[#C9A84C]/30 text-[#C9A84C] font-semibold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:border-[#C9A84C] hover:bg-[#C9A84C]/5 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="bg-[#C9A84C] text-black font-semibold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-white transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="bg-[#111111] border border-white/5 p-6 rounded-xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-400 font-medium">{kpi.title}</span>
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[#C9A84C]">
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-display text-white">{kpi.value}</span>
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${kpi.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {kpi.change} <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales and Customers Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales by Category breakdown */}
        <div className="lg:col-span-5 bg-[#111111] p-6 rounded-xl border border-white/5 space-y-6">
          <div>
            <h3 className="font-display text-lg text-white">Sales by Section</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Category share by monthly volume</p>
          </div>

          <div className="space-y-4">
            {categorySales.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-white">{item.category}</span>
                  <span className="text-gray-400">₹{item.revenue.toLocaleString()} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-[#0D0D0D] h-2 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="bg-[#C9A84C] h-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Spending Customers */}
        <div className="lg:col-span-7 bg-[#111111] p-6 rounded-xl border border-white/5 space-y-4">
          <div>
            <h3 className="font-display text-lg text-white">VIP Customers</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Top guest spenders and loyalty balances</p>
          </div>

          <div className="overflow-x-auto rounded border border-white/5 text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/10 text-gray-400 font-semibold uppercase">
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3 text-center">Orders</th>
                  <th className="px-4 py-3 text-center">Points</th>
                  <th className="px-4 py-3 text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topCustomers.map((c) => (
                  <tr key={c.email} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{c.name}</p>
                      <p className="text-[10px] text-gray-500">{c.email}</p>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-300 font-medium">{c.totalOrders}</td>
                    <td className="px-4 py-3 text-center text-[#C9A84C] font-semibold">{c.loyaltyPoints} PTS</td>
                    <td className="px-4 py-3 text-right text-green-400 font-bold">₹{c.totalSpent.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
