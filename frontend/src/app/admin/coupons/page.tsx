'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import { couponsApi } from '@/lib/api';
import { Coupon } from '@/types';
import { Plus, Trash2, ToggleLeft, ToggleRight, RefreshCw, X, Calendar, Ticket } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface CouponFormInputs {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  expiresAt: string;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CouponFormInputs>({
    defaultValues: {
      discountType: 'percentage',
      minOrderValue: 0,
      isActive: true,
    },
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await couponsApi.getAll();
      if (response.data?.success && response.data.coupons) {
        setCoupons(response.data.coupons);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Mock coupon records fallback
      setCoupons([
        {
          id: 'c1',
          code: 'LUMIERE15',
          discountType: 'percentage',
          discountValue: 15,
          minOrderValue: 1500,
          maxDiscount: 500,
          expiresAt: '2026-12-31T23:59:59.000Z',
          isActive: true,
          usedCount: 45,
          usageLimit: 200,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'c2',
          code: 'WELCOME300',
          discountType: 'fixed',
          discountValue: 300,
          minOrderValue: 2000,
          maxDiscount: 300,
          expiresAt: '2026-08-30T23:59:59.000Z',
          isActive: true,
          usedCount: 88,
          usageLimit: 500,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ] as unknown as Coupon[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggleActive = async (id: string) => {
    try {
      const coupon = coupons.find((c) => c.id === id);
      if (!coupon) return;
      await couponsApi.update(id, { isActive: !coupon.isActive });
      toast.success('Coupon status updated.');
      fetchCoupons();
    } catch {
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
      );
      toast.success('Demo: coupon state switched.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon code?')) return;
    try {
      await couponsApi.delete(id);
      toast.success('Coupon deleted.');
      fetchCoupons();
    } catch {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success('Demo: coupon deleted.');
    }
  };

  const onSubmit = async (data: CouponFormInputs) => {
    setSubmitting(true);
    try {
      const response = await couponsApi.create(data);
      if (response.data?.success) {
        toast.success('Coupon code created!');
        setModalOpen(false);
        reset();
        fetchCoupons();
      }
    } catch {
      // Mock create local state
      const mockCoupon: Coupon = {
        id: 'c_new_' + Math.random(),
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: Number(data.discountValue),
        minOrderValue: Number(data.minOrderValue),
        maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : undefined,
        expiresAt: new Date(data.expiresAt).toISOString(),
        isActive: data.isActive,
        usedCount: 0,
        usageLimit: Number(data.usageLimit),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCoupons((prev) => [mockCoupon, ...prev]);
      toast.success('Demo coupon created successfully!');
      setModalOpen(false);
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Coupon>[] = [
    {
      key: 'code',
      label: 'Promo Code',
      sortable: true,
      render: (val) => (
        <span className="flex items-center gap-1.5 font-bold text-white tracking-wide">
          <Ticket className="w-4 h-4 text-[#C9A84C]" /> {String(val)}
        </span>
      ),
    },
    {
      key: 'discountValue',
      label: 'Discount Value',
      sortable: true,
      render: (val, row) => (row.discountType === 'percentage' ? `${Number(val)}% Off` : `₹${Number(val)} Off`),
    },
    { key: 'minOrderValue', label: 'Min order (₹)', sortable: true, render: (val) => `₹${Number(val).toLocaleString()}` },
    {
      key: 'usageLimit',
      label: 'Code Usage',
      render: (_, row) => (
        <span className="text-xs text-gray-400 font-semibold">
          {row.usedCount} / {row.usageLimit} Redeemed
        </span>
      ),
    },
    {
      key: 'expiresAt',
      label: 'Expires On',
      sortable: true,
      render: (val) => (
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar className="w-3.5 h-3.5 text-red-400" /> {new Date(String(val)).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Active status',
      render: (val, row) => (
        <button onClick={() => handleToggleActive(row.id)} className="text-gray-400 hover:text-white transition-colors">
          {val ? <ToggleRight className="w-6 h-6 text-[#C9A84C]" /> : <ToggleLeft className="w-6 h-6 text-gray-600" />}
        </button>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="p-1.5 border border-red-500/20 text-red-500 hover:bg-red-500/5 rounded transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Promo Coupons</h1>
          <p className="text-xs text-gray-400">Create discount campaigns, manage coupon thresholds, and track redemptions.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchCoupons}
            className="p-2.5 border border-white/10 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#C9A84C] text-black font-semibold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-white transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>
      </div>

      <div className="bg-[#111111] p-6 rounded-xl border border-white/10">
        <DataTable columns={columns} data={coupons} loading={loading} />
      </div>

      {/* Add Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 w-full max-w-lg rounded-lg overflow-hidden shadow-2xl relative">
            <div className="px-6 py-4 bg-[#0D0D0D] border-b border-white/10 flex justify-between items-center">
              <h3 className="font-display text-lg text-white">Create Promo Coupon</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    {...register('code', { required: 'Code is required' })}
                    placeholder="E.g. GOLDEN20"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none uppercase"
                  />
                  {errors.code && <p className="text-red-500 text-[10px] mt-1">{errors.code.message}</p>}
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Discount Type</label>
                  <select
                    {...register('discountType')}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat (INR)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Val (Amt/%)</label>
                  <input
                    type="number"
                    {...register('discountValue', { required: 'Value required', min: 1 })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    {...register('minOrderValue')}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Max Disc (₹)</label>
                  <input
                    type="number"
                    {...register('maxDiscount')}
                    placeholder="Optional"
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    {...register('usageLimit', { required: true, min: 1 })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1">Expiration Date</label>
                  <input
                    type="date"
                    {...register('expiresAt', { required: true })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-[10px] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isActive" {...register('isActive')} className="rounded accent-[#C9A84C]" />
                <label htmlFor="isActive" className="text-xs text-gray-300">Set active immediately</label>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-white/10 hover:border-white rounded text-white text-xs font-semibold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#C9A84C] hover:bg-white text-black font-semibold text-xs uppercase rounded transition-colors"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
