'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Store,
  Clock,
  Truck,
  Calendar,
  CreditCard,
  Save,
  RotateCcw
} from 'lucide-react';

interface BusinessHourInput {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

interface SettingsFormInputs {
  restaurantName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  businessHours: BusinessHourInput[];
  taxRate: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  maxGuestsPerTable: number;
  slotInterval: number;
  autoConfirmReservations: boolean;
  stripeTestMode: boolean;
  stripeWebhookUrl: string;
}

const defaultSettings: SettingsFormInputs = {
  restaurantName: 'Lumiere',
  tagline: 'A Michelin-Inspired Fine Dining Experience',
  description: 'An elite gastronomic space offering premium french and fusion gourmet delicacies.',
  email: 'contact@lumiere.com',
  phone: '+1 (555) 234-5678',
  street: '123 Gastronomy Lane, Culinary District',
  city: 'New York',
  state: 'NY',
  pincode: '10001',
  country: 'United States',
  businessHours: [
    { day: 'Monday', open: '12:00', close: '23:00', isClosed: false },
    { day: 'Tuesday', open: '12:00', close: '23:00', isClosed: false },
    { day: 'Wednesday', open: '12:00', close: '23:00', isClosed: false },
    { day: 'Thursday', open: '12:00', close: '23:00', isClosed: false },
    { day: 'Friday', open: '12:00', close: '23:30', isClosed: false },
    { day: 'Saturday', open: '11:30', close: '23:30', isClosed: false },
    { day: 'Sunday', open: '11:30', close: '22:30', isClosed: false },
  ],
  taxRate: 18,
  deliveryFee: 250,
  freeDeliveryThreshold: 5000,
  maxGuestsPerTable: 10,
  slotInterval: 30,
  autoConfirmReservations: true,
  stripeTestMode: true,
  stripeWebhookUrl: 'https://api.lumiere.com/v1/payments/stripe/webhook',
};

type ActiveTab = 'profile' | 'hours' | 'delivery' | 'reservations' | 'payments';

export default function AdminSettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SettingsFormInputs>({
    defaultValues: defaultSettings,
  });

  const { fields: hoursFields } = useFieldArray({
    control,
    name: 'businessHours',
  });

  // Client-side initialization to retrieve settings from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('lumiere_restaurant_settings');
    if (saved) {
      try {
        reset(JSON.parse(saved));
      } catch {
        reset(defaultSettings);
      }
    }
  }, [reset]);

  const onSubmit = (data: SettingsFormInputs) => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('lumiere_restaurant_settings', JSON.stringify(data));
      toast.success('Restaurant configurations updated successfully!');
      setSaving(false);
    }, 800);
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to revert to default system configurations?')) {
      reset(defaultSettings);
      localStorage.removeItem('lumiere_restaurant_settings');
      toast.success('Settings restored to default presets.');
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs: { id: ActiveTab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Restaurant Profile', icon: Store },
    { id: 'hours', label: 'Business Hours', icon: Clock },
    { id: 'delivery', label: 'Delivery Rules', icon: Truck },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'payments', label: 'Stripe Config', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Restaurant Settings</h1>
          <p className="text-xs text-gray-400 font-medium">Configure profile info, operating hours, delivery thresholds, and transaction rules.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2 border border-white/10 hover:border-white text-gray-400 hover:text-white rounded-lg text-xs font-semibold uppercase transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Revert Defaults
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-left shrink-0 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#C9A84C] text-black'
                    : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="flex-1 bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                    <Store className="w-4 h-4" /> General Business Profile
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-1">Restaurant Name</label>
                      <input
                        type="text"
                        {...register('restaurantName', { required: 'Name is required' })}
                        className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                      />
                      {errors.restaurantName && <p className="text-red-500 text-[10px] mt-1">{errors.restaurantName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-1">Brand Tagline</label>
                      <input
                        type="text"
                        {...register('tagline')}
                        className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-1">Restaurant Description</label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded p-3 text-white text-xs outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-1">Public Contact Email</label>
                      <input
                        type="email"
                        {...register('email', { required: 'Email required' })}
                        className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                      />
                      {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-1">Public Phone Number</label>
                      <input
                        type="text"
                        {...register('phone', { required: 'Phone required' })}
                        className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-1">Street Address</label>
                      <input
                        type="text"
                        {...register('street', { required: 'Street required' })}
                        className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase text-gray-400 mb-1">City</label>
                        <input
                          type="text"
                          {...register('city')}
                          className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-2 py-2 text-white text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-gray-400 mb-1">State</label>
                        <input
                          type="text"
                          {...register('state')}
                          className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-2 py-2 text-white text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-gray-400 mb-1">Zipcode</label>
                        <input
                          type="text"
                          {...register('pincode')}
                          className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-2 py-2 text-white text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'hours' && (
                <motion.div
                  key="hours"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Weekly Operating Hours
                  </h3>

                  <div className="space-y-3 bg-[#0D0D0D] p-4 rounded border border-white/5">
                    {hoursFields.map((field, index) => (
                      <div key={field.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <span className="text-xs font-semibold text-white w-24">{field.day}</span>
                        
                        <div className="flex flex-1 sm:justify-end items-center gap-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              disabled={hoursFields[index].isClosed}
                              {...register(`businessHours.${index}.open` as const)}
                              className="bg-[#111111] border border-white/10 text-white rounded px-2 py-1 text-xs outline-none disabled:opacity-20"
                            />
                            <span className="text-gray-500 text-xs">to</span>
                            <input
                              type="time"
                              disabled={hoursFields[index].isClosed}
                              {...register(`businessHours.${index}.close` as const)}
                              className="bg-[#111111] border border-white/10 text-white rounded px-2 py-1 text-xs outline-none disabled:opacity-20"
                            />
                          </div>

                          <div className="flex items-center gap-1.5 ml-4">
                            <input
                              type="checkbox"
                              id={`hours-closed-${index}`}
                              {...register(`businessHours.${index}.isClosed` as const)}
                              className="w-3.5 h-3.5 rounded accent-[#C9A84C]"
                            />
                            <label htmlFor={`hours-closed-${index}`} className="text-[10px] uppercase font-bold text-gray-400 select-none">Closed</label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'delivery' && (
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Tax Rules & Delivery Thresholds
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-1">Standard Tax Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('taxRate', { required: true, min: 0 })}
                        className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-1">Base Delivery Fee (INR)</label>
                      <input
                        type="number"
                        {...register('deliveryFee', { required: true, min: 0 })}
                        className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-1">Free Delivery Min. Order</label>
                      <input
                        type="number"
                        {...register('freeDeliveryThreshold', { required: true, min: 0 })}
                        className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none font-mono"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reservations' && (
                <motion.div
                  key="reservations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Guest & Reservation Slot Configurations
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-1">Max Guests Per Table</label>
                      <input
                        type="number"
                        {...register('maxGuestsPerTable', { required: true, min: 1 })}
                        className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-1">Table Reservation Slot (Mins)</label>
                      <select
                        {...register('slotInterval')}
                        className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none"
                      >
                        <option value="15">15 Minutes</option>
                        <option value="30">30 Minutes</option>
                        <option value="45">45 Minutes</option>
                        <option value="60">60 Minutes (1 Hour)</option>
                        <option value="120">120 Minutes (2 Hours)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-[#0D0D0D] p-4 border border-white/5 rounded flex items-center justify-between text-xs pt-3 mt-2">
                    <div>
                      <p className="text-gray-300 font-medium">Auto-confirm Bookings</p>
                      <p className="text-[10px] text-gray-500">Automatically set reservation status to "confirmed" upon customer booking.</p>
                    </div>
                    <input type="checkbox" id="autoConfirm" {...register('autoConfirmReservations')} className="w-4 h-4 rounded accent-[#C9A84C]" />
                  </div>
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Stripe Checkout Transactions
                  </h3>

                  <div className="bg-[#0D0D0D] p-4 border border-white/5 rounded flex items-center justify-between text-xs">
                    <div>
                      <p className="text-gray-300 font-medium">Stripe Sandbox / Test Mode</p>
                      <p className="text-[10px] text-gray-500">Disable live charges and trigger mock credit card processing keys.</p>
                    </div>
                    <input type="checkbox" id="testMode" {...register('stripeTestMode')} className="w-4 h-4 rounded accent-[#C9A84C]" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-1">Stripe Webhook Target Endpoint</label>
                    <input
                      type="text"
                      {...register('stripeWebhookUrl')}
                      className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded px-3 py-2 text-white text-xs outline-none font-mono"
                      placeholder="https://..."
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-6 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#C9A84C] text-black font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg hover:bg-white transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving Configurations...' : 'Save Configurations'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
