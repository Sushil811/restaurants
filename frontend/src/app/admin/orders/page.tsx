'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Eye,
  X,
  ChevronDown,
  Calendar,
  Package,
  CreditCard,
  User,
} from 'lucide-react';

type OrderStatus = 'All' | 'Pending' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
type PaymentStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed';

interface Order {
  id: string;
  orderNo: string;
  customer: string;
  email: string;
  phone: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  tax: number;
  total: number;
  payment: PaymentStatus;
  status: OrderStatus;
  date: string;
  address: string;
  notes?: string;
}

const mockOrders: Order[] = [
  { id: '1', orderNo: '#ORD-1048', customer: 'Arjun Mehta', email: 'arjun@example.com', phone: '+91 98765 43210', items: [{ name: 'Black Truffle Risotto', qty: 1, price: 1800 }, { name: 'Red Wine (Bordeaux)', qty: 1, price: 2400 }], subtotal: 4200, tax: 756, total: 4956, payment: 'Paid', status: 'Delivered', date: 'Jun 5, 2026 – 7:45 PM', address: '42, Juhu Beach Rd, Mumbai', notes: 'Please keep it extra spicy' },
  { id: '2', orderNo: '#ORD-1047', customer: 'Priya Sharma', email: 'priya@example.com', phone: '+91 87654 32109', items: [{ name: 'Lobster Bisque', qty: 2, price: 1200 }, { name: 'Chocolate Soufflé', qty: 2, price: 800 }], subtotal: 4000, tax: 720, total: 4720, payment: 'Paid', status: 'Preparing', date: 'Jun 5, 2026 – 7:30 PM', address: '15, Bandra West, Mumbai' },
  { id: '3', orderNo: '#ORD-1046', customer: 'Rahul Gupta', email: 'rahul@example.com', phone: '+91 76543 21098', items: [{ name: 'Foie Gras Terrine', qty: 1, price: 3200 }, { name: 'Champagne (Dom Pérignon)', qty: 1, price: 6200 }], subtotal: 9400, tax: 1692, total: 11092, payment: 'Paid', status: 'Confirmed', date: 'Jun 5, 2026 – 7:15 PM', address: '8, Pedder Road, Mumbai' },
  { id: '4', orderNo: '#ORD-1045', customer: 'Ananya Singh', email: 'ananya@example.com', phone: '+91 65432 10987', items: [{ name: 'Duck Confit', qty: 2, price: 2200 }, { name: 'Crème Brûlée', qty: 2, price: 600 }], subtotal: 5600, tax: 1008, total: 6608, payment: 'Paid', status: 'Delivered', date: 'Jun 5, 2026 – 6:50 PM', address: '23, Colaba Causeway, Mumbai' },
  { id: '5', orderNo: '#ORD-1044', customer: 'Vikram Nair', email: 'vikram@example.com', phone: '+91 54321 09876', items: [{ name: 'Wagyu Beef Tenderloin', qty: 1, price: 8400 }, { name: 'Tiramisu', qty: 2, price: 700 }], subtotal: 9800, tax: 1764, total: 11564, payment: 'Refunded', status: 'Cancelled', date: 'Jun 5, 2026 – 6:20 PM', address: '5, Malabar Hill, Mumbai', notes: 'Allergy concern - refunded' },
  { id: '6', orderNo: '#ORD-1043', customer: 'Sneha Iyer', email: 'sneha@example.com', phone: '+91 43210 98765', items: [{ name: 'Pasta Truffle', qty: 1, price: 1600 }, { name: 'Lemon Sorbet', qty: 1, price: 500 }], subtotal: 2100, tax: 378, total: 2478, payment: 'Paid', status: 'Delivered', date: 'Jun 5, 2026 – 5:45 PM', address: '11, Worli Sea Face, Mumbai' },
  { id: '7', orderNo: '#ORD-1042', customer: 'Deepak Verma', email: 'deepak@example.com', phone: '+91 32109 87654', items: [{ name: 'Scallops Provençale', qty: 2, price: 1800 }, { name: 'French Onion Soup', qty: 2, price: 750 }], subtotal: 5100, tax: 918, total: 6018, payment: 'Paid', status: 'Delivered', date: 'Jun 5, 2026 – 5:10 PM', address: '18, Churchgate, Mumbai' },
  { id: '8', orderNo: '#ORD-1041', customer: 'Kavya Reddy', email: 'kavya@example.com', phone: '+91 21098 76543', items: [{ name: 'Ratatouille', qty: 1, price: 1400 }, { name: 'Cheese Platter', qty: 1, price: 2200 }], subtotal: 3600, tax: 648, total: 4248, payment: 'Pending', status: 'Pending', date: 'Jun 5, 2026 – 4:55 PM', address: '30, Andheri East, Mumbai' },
  { id: '9', orderNo: '#ORD-1040', customer: 'Rohan Banerjee', email: 'rohan@example.com', phone: '+91 10987 65432', items: [{ name: 'Bouillabaisse', qty: 1, price: 2800 }], subtotal: 2800, tax: 504, total: 3304, payment: 'Paid', status: 'Delivered', date: 'Jun 4, 2026 – 8:30 PM', address: '7, Salt Lake, Kolkata' },
  { id: '10', orderNo: '#ORD-1039', customer: 'Ishaan Chopra', email: 'ishaan@example.com', phone: '+91 98123 45678', items: [{ name: 'Beef Wellington', qty: 2, price: 4500 }, { name: 'Profiteroles', qty: 2, price: 600 }], subtotal: 10200, tax: 1836, total: 12036, payment: 'Paid', status: 'Delivered', date: 'Jun 4, 2026 – 7:45 PM', address: '22, Connaught Place, Delhi' },
  { id: '11', orderNo: '#ORD-1038', customer: 'Nandini Rao', email: 'nandini@example.com', phone: '+91 87234 56789', items: [{ name: 'Mushroom Vol-au-vent', qty: 3, price: 900 }], subtotal: 2700, tax: 486, total: 3186, payment: 'Paid', status: 'Delivered', date: 'Jun 4, 2026 – 7:00 PM', address: '14, Indiranagar, Bengaluru' },
  { id: '12', orderNo: '#ORD-1037', customer: 'Aarav Shah', email: 'aarav@example.com', phone: '+91 76345 67890', items: [{ name: 'Grilled Sea Bass', qty: 1, price: 3200 }, { name: 'Asparagus Velouté', qty: 1, price: 1100 }], subtotal: 4300, tax: 774, total: 5074, payment: 'Paid', status: 'Confirmed', date: 'Jun 4, 2026 – 6:30 PM', address: '9, Navrangpura, Ahmedabad' },
  { id: '13', orderNo: '#ORD-1036', customer: 'Tanvi Joshi', email: 'tanvi@example.com', phone: '+91 65456 78901', items: [{ name: 'Lamb Rack', qty: 2, price: 3800 }], subtotal: 7600, tax: 1368, total: 8968, payment: 'Failed', status: 'Cancelled', date: 'Jun 4, 2026 – 5:50 PM', address: '33, Koregaon Park, Pune' },
  { id: '14', orderNo: '#ORD-1035', customer: 'Manav Khanna', email: 'manav@example.com', phone: '+91 54567 89012', items: [{ name: 'Bourgignon', qty: 1, price: 2600 }, { name: 'Croissant Basket', qty: 1, price: 400 }], subtotal: 3000, tax: 540, total: 3540, payment: 'Paid', status: 'Delivered', date: 'Jun 4, 2026 – 5:00 PM', address: '6, Defence Colony, Delhi' },
  { id: '15', orderNo: '#ORD-1034', customer: 'Riya Malhotra', email: 'riya@example.com', phone: '+91 43678 90123', items: [{ name: 'Duck à l\'Orange', qty: 1, price: 2900 }, { name: 'Tarte Tatin', qty: 2, price: 750 }], subtotal: 4400, tax: 792, total: 5192, payment: 'Paid', status: 'Preparing', date: 'Jun 5, 2026 – 8:10 PM', address: '21, Lajpat Nagar, Delhi' },
  { id: '16', orderNo: '#ORD-1033', customer: 'Siddharth Patel', email: 'sid@example.com', phone: '+91 32789 01234', items: [{ name: 'Soupe à l\'oignon', qty: 2, price: 750 }, { name: 'Baguette', qty: 2, price: 300 }], subtotal: 2100, tax: 378, total: 2478, payment: 'Paid', status: 'Delivered', date: 'Jun 3, 2026 – 8:00 PM', address: '12, SG Highway, Ahmedabad' },
  { id: '17', orderNo: '#ORD-1032', customer: 'Divya Krishnan', email: 'divya@example.com', phone: '+91 21890 12345', items: [{ name: 'Nicoise Salad', qty: 1, price: 900 }, { name: 'Pan-Seared Salmon', qty: 1, price: 2800 }], subtotal: 3700, tax: 666, total: 4366, payment: 'Paid', status: 'Delivered', date: 'Jun 3, 2026 – 7:20 PM', address: '4, Anna Nagar, Chennai' },
  { id: '18', orderNo: '#ORD-1031', customer: 'Karan Gill', email: 'karan@example.com', phone: '+91 10901 23456', items: [{ name: 'Black Truffle Risotto', qty: 2, price: 1800 }], subtotal: 3600, tax: 648, total: 4248, payment: 'Pending', status: 'Pending', date: 'Jun 5, 2026 – 8:30 PM', address: '16, Sector 29, Gurgaon' },
  { id: '19', orderNo: '#ORD-1030', customer: 'Simran Bedi', email: 'simran@example.com', phone: '+91 99012 34567', items: [{ name: 'Coq au Vin', qty: 2, price: 2200 }, { name: 'Macaron Tower', qty: 1, price: 1500 }], subtotal: 5900, tax: 1062, total: 6962, payment: 'Paid', status: 'Out for Delivery', date: 'Jun 5, 2026 – 8:00 PM', address: '28, Chandigarh Sector 17' },
  { id: '20', orderNo: '#ORD-1029', customer: 'Aakash Tiwari', email: 'aakash@example.com', phone: '+91 88123 45670', items: [{ name: 'Escargot', qty: 2, price: 1400 }, { name: 'Champagne (Moët)', qty: 1, price: 4800 }], subtotal: 7600, tax: 1368, total: 8968, payment: 'Paid', status: 'Delivered', date: 'Jun 3, 2026 – 6:45 PM', address: '3, Hazratganj, Lucknow' },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Preparing: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Confirmed: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Pending: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  Cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
  'Out for Delivery': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
};

const paymentColors: Record<string, string> = {
  Paid: 'text-emerald-400',
  Pending: 'text-amber-400',
  Refunded: 'text-blue-400',
  Failed: 'text-red-400',
};

const ALL_STATUSES: OrderStatus[] = ['All', 'Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
const PAGE_SIZE = 8;

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('All');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState(mockOrders);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchSearch =
      !search ||
      o.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const exportCSV = () => {
    const rows = [
      ['Order#', 'Customer', 'Email', 'Total', 'Payment', 'Status', 'Date'],
      ...filtered.map((o) => [o.orderNo, o.customer, o.email, `₹${o.total}`, o.payment, o.status, o.date]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lumiere_orders.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Playfair_Display']">Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} orders found</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] rounded-lg hover:bg-[#C9A84C]/20 transition-colors text-sm font-medium"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search order # or customer…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={15} className="text-gray-400 shrink-0" />
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                statusFilter === s
                  ? 'bg-[#C9A84C] border-[#C9A84C] text-black'
                  : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-[#C9A84C] text-xs font-semibold">{order.orderNo}</td>
                  <td className="px-4 py-3">
                    <p className="text-white font-medium">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs max-w-[160px]">
                    {order.items.map((it) => `${it.qty}× ${it.name}`).join(', ')}
                  </td>
                  <td className="px-4 py-3 text-white font-medium">₹{order.total.toLocaleString()}</td>
                  <td className={`px-4 py-3 text-xs font-medium ${paymentColors[order.payment]}`}>{order.payment}</td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className={`appearance-none pr-6 pl-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer bg-transparent focus:outline-none ${statusColors[order.status]}`}
                      >
                        {ALL_STATUSES.filter((s) => s !== 'All').map((s) => (
                          <option key={s} value={s} className="bg-[#1a1a1a] text-gray-200">{s}</option>
                        ))}
                      </select>
                      <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-current" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={11} />
                      {order.date}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            <Package size={36} className="mx-auto mb-3 text-gray-600" />
            <p>No orders match your filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === p ? 'bg-[#C9A84C] text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-lg font-bold text-white font-['Playfair_Display']">{selectedOrder.orderNo}</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{selectedOrder.date}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Customer info */}
                <div className="bg-white/[0.03] rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <User size={15} className="text-[#C9A84C]" />
                    <h3 className="text-sm font-semibold text-white">Customer</h3>
                  </div>
                  <p className="text-white font-medium">{selectedOrder.customer}</p>
                  <p className="text-sm text-gray-400">{selectedOrder.email}</p>
                  <p className="text-sm text-gray-400">{selectedOrder.phone}</p>
                  <p className="text-sm text-gray-400">{selectedOrder.address}</p>
                  {selectedOrder.notes && (
                    <p className="text-xs text-amber-400 bg-amber-400/10 rounded-lg px-3 py-2 mt-2">Note: {selectedOrder.notes}</p>
                  )}
                </div>

                {/* Items */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Package size={15} className="text-[#C9A84C]" />
                    <h3 className="text-sm font-semibold text-white">Order Items</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-4 py-2.5">
                        <span className="text-sm text-gray-300">{item.qty}× {item.name}</span>
                        <span className="text-sm text-white font-medium">₹{(item.qty * item.price).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-white/[0.03] rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard size={15} className="text-[#C9A84C]" />
                    <h3 className="text-sm font-semibold text-white">Payment</h3>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Tax (18% GST)</span>
                      <span>₹{selectedOrder.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold border-t border-white/10 pt-1.5 mt-1.5">
                      <span>Total</span>
                      <span>₹{selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs text-gray-500">Payment Status:</span>
                    <span className={`text-xs font-semibold ${paymentColors[selectedOrder.payment]}`}>{selectedOrder.payment}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
