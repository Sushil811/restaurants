'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import { reservationsApi } from '@/lib/api';
import { Reservation } from '@/types';
import { Calendar, Check, X, UserPlus, RefreshCw, Eye, MessageSquare, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ManualBookingForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  occasion?: string;
  specialRequests?: string;
}

const mockSlots = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'
];

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualBookingForm>({
    defaultValues: { guests: 2 },
  });

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await reservationsApi.getAll();
      if (response.data?.success && response.data.reservations) {
        setReservations(response.data.reservations);
      }
    } catch (err) {
      // Mock fallback data for rendering
      setReservations([
        {
          id: 'res_1',
          confirmationCode: 'RES-482015',
          name: 'Rajesh Sharma',
          email: 'rajesh@example.com',
          phone: '+91 98765 09876',
          date: '2026-06-10',
          time: '8:30 PM',
          guests: 4,
          occasion: 'anniversary',
          specialRequests: 'Window table requested.',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'res_2',
          confirmationCode: 'RES-110985',
          name: 'Nora Al-Subaei',
          email: 'nora@example.com',
          phone: '+91 88998 77665',
          date: '2026-06-11',
          time: '7:00 PM',
          guests: 2,
          occasion: 'birthday',
          specialRequests: 'Gluten-free menu cards required.',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ] as unknown as Reservation[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await reservationsApi.updateStatus(id, newStatus);
      toast.success(`Reservation status set to ${newStatus}.`);
      fetchReservations();
    } catch {
      // Offline fallback simulator
      setReservations((prev) =>
        prev.map((res) => (res.id === id ? { ...res, status: newStatus as any } : res))
      );
      toast.success(`Demo status updated to ${newStatus}.`);
    }
  };

  const handleManualBooking = async (data: ManualBookingForm) => {
    setSubmitting(true);
    try {
      const response = await reservationsApi.create(data);
      if (response.data?.success) {
        toast.success('Manual booking added successfully!');
        setModalOpen(false);
        reset();
        fetchReservations();
      }
    } catch {
      // Mock insert local state for demo
      const mockRes: Reservation = {
        id: 'res_new_' + Math.random(),
        confirmationCode: 'RES-' + Math.floor(100000 + Math.random() * 900000),
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: data.date,
        time: data.time,
        guests: Number(data.guests),
        occasion: data.occasion as any,
        specialRequests: data.specialRequests,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setReservations((prev) => [mockRes, ...prev]);
      toast.success('Demo booking added successfully!');
      setModalOpen(false);
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Reservation>[] = [
    { key: 'confirmationCode', label: 'Code', sortable: true },
    { key: 'name', label: 'Guest Name', sortable: true },
    { key: 'phone', label: 'Contact Number' },
    {
      key: 'date',
      label: 'Date & Time',
      sortable: true,
      render: (_, row) => (
        <span className="flex items-center gap-1.5 text-xs">
          <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" /> {row.date} @ {row.time}
        </span>
      ),
    },
    { key: 'guests', label: 'Guests', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => {
        const status = String(val);
        return (
          <span
            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
              status === 'confirmed'
                ? 'text-green-400 bg-green-500/10 border-green-500/20'
                : status === 'cancelled'
                ? 'text-red-400 bg-red-500/10 border-red-500/20'
                : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Moderation Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          {row.status === 'pending' && (
            <button
              onClick={() => handleUpdateStatus(row.id, 'confirmed')}
              className="p-1 text-green-400 hover:bg-green-500/10 rounded transition-colors"
              title="Confirm Booking"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          {row.status !== 'cancelled' && (
            <button
              onClick={() => handleUpdateStatus(row.id, 'cancelled')}
              className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
              title="Cancel Booking"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Reservations Desk</h1>
          <p className="text-xs text-gray-400">View and moderate all table bookings and walk-ins.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchReservations}
            className="p-2.5 border border-white/10 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Refresh List"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#C9A84C] text-black font-semibold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-white transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" /> Manual Booking
          </button>
        </div>
      </div>

      <div className="bg-[#111111] p-6 rounded-xl border border-white/10">
        <DataTable columns={columns} data={reservations} loading={loading} />
      </div>

      {/* Manual Booking Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 w-full max-w-lg rounded-lg overflow-hidden shadow-2xl relative">
            <div className="px-6 py-4 bg-[#0D0D0D] border-b border-white/10 flex justify-between items-center">
              <h3 className="font-display text-lg text-white">Add Walk-in Booking</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleManualBooking)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1.5">Guest Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                  />
                  {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone is required' })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1.5">Date</label>
                  <input
                    type="date"
                    {...register('date', { required: 'Date required' })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-[10px] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1.5">Time</label>
                  <select
                    {...register('time')}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-[10px] outline-none"
                  >
                    {mockSlots.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-400 mb-1.5">Guests</label>
                  <input
                    type="number"
                    {...register('guests', { required: 'Guests count required' })}
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-[10px] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-1.5">Special Requests</label>
                <textarea
                  {...register('specialRequests')}
                  rows={3}
                  className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded p-3 text-white text-xs outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
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
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
