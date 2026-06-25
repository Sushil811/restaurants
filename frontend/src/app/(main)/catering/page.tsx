'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Calendar, Users, Briefcase, Mail, Phone, User, Check, Upload, HelpCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface CateringFormData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  guestCount: number;
  packageType: string;
  message: string;
  file?: FileList;
}

const packages = [
  {
    name: 'Silver Soirée',
    price: '₹2,500',
    unit: 'per guest',
    description: 'Perfect for intimate gatherings, elegant cocktail parties, and family celebrations.',
    features: [
      '3 Appetizers, 2 Mains & 2 Desserts',
      'Non-alcoholic mocktail bar setup',
      'Professional servers & basic buffet setup',
      'Standard cutlery and tableware',
      'Up to 4 hours of event service',
    ],
    color: 'border-slate-400/30 text-slate-300',
    badge: 'Classic Choice',
  },
  {
    name: 'Gold Gastronomy',
    price: '₹4,500',
    unit: 'per guest',
    description: 'Outstanding culinary excellence for corporate galas and premium wedding receptions.',
    features: [
      '5 Appetizers, 4 Mains & 3 Desserts',
      'Signature cocktail mixology service',
      'Live interactive culinary stations',
      'Premium bone-china plating & setup',
      'Dedicated event coordinator',
    ],
    color: 'border-[#C9A84C]/50 text-[#C9A84C] relative ring-2 ring-[#C9A84C]/50',
    badge: 'Most Popular',
  },
  {
    name: 'Platinum Prestige',
    price: '₹8,500',
    unit: 'per guest',
    description: 'The pinnacle of luxury catering. Michelin-grade private dining experiences.',
    features: [
      'Bespoke 7-course tasting menu',
      'Ultra-premium wine & champagne pairing',
      'Chef-led presentation for each course',
      'Artisanal custom floral arrangements',
      'VIP butler service & luxury linen setups',
    ],
    color: 'border-purple-500/30 text-purple-300',
    badge: 'Luxury Ultimate',
  },
];

const steps = [
  {
    num: '01',
    title: 'Consultation & Tasting',
    desc: 'Meet our Chef and designer to outline your vision and curate custom tasting menus.',
  },
  {
    num: '02',
    title: 'Bespoke Curation',
    desc: 'Finalize recipes, wine pairings, table setting mockups, and logistics.',
  },
  {
    num: '03',
    title: 'Flawless Execution',
    desc: 'Our professional kitchen and service brigades arrive to bring the Lumiere experience to life.',
  },
];

export default function CateringPage() {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CateringFormData>({
    defaultValues: {
      packageType: 'Gold Gastronomy',
      eventType: 'Corporate Gala',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
    }
  };

  const onSubmit = async (data: CateringFormData) => {
    setLoading(true);
    // Mock upload and API send
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Catering inquiry submitted successfully! Our event coordinator will call you within 24 hours.');
      reset();
      setFileName(null);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0D0D0D] text-white pt-24 pb-16 min-h-screen">
      {/* Hero */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555244162-803834f70033?w=1920&q=80"
            alt="Luxury Catering Table"
            className="w-full h-full object-cover brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D0D0D]/60 to-[#0D0D0D]" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-[#C9A84C] uppercase tracking-[0.2em] text-xs font-semibold">Exquisite Events</span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-white mt-3 leading-tight">
            Lumiere <span className="text-[#C9A84C]">Catering</span>
          </h1>
          <p className="text-[#F5ECD7]/60 text-lg mt-4 max-w-2xl mx-auto">
            Bringing Michelin-inspired fine dining, bespoke hospitality, and artistic presentation to your private home or selected venues.
          </p>
        </div>
      </section>

      {/* Packages Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl text-white">Our Curated Packages</h2>
          <div className="w-16 h-0.5 bg-[#C9A84C] mx-auto mt-4" />
          <p className="text-[#F5ECD7]/50 mt-4 max-w-lg mx-auto">
            Select an base blueprint for your event. All packages are fully customizable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`bg-[#111111] border rounded-lg p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 ${
                pkg.name === 'Gold Gastronomy' ? 'border-[#C9A84C]' : 'border-[#C9A84C]/20'
              }`}
            >
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C9A84C] font-semibold bg-[#C9A84C]/10 px-3 py-1 rounded-full">
                  {pkg.badge}
                </span>
                <h3 className="font-display text-2xl text-white mt-4">{pkg.name}</h3>
                <p className="text-[#F5ECD7]/50 text-sm mt-2">{pkg.description}</p>

                <div className="my-6">
                  <span className="text-4xl font-display text-[#C9A84C] font-bold">{pkg.price}</span>
                  <span className="text-[#F5ECD7]/40 text-sm ml-2">/ {pkg.unit}</span>
                </div>

                <ul className="space-y-3 border-t border-[#C9A84C]/10 pt-6">
                  {pkg.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm text-[#F5ECD7]/80">
                      <Check className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setValue('packageType', pkg.name);
                  document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-8 w-full py-3 border border-[#C9A84C] text-[#C9A84C] font-medium hover:bg-[#C9A84C] hover:text-[#0D0D0D] transition-colors rounded"
              >
                Inquire For Package
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Execution Process Steps */}
      <section className="bg-[#111111] border-y border-[#C9A84C]/10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl text-white">How We Craft Perfection</h2>
            <div className="w-16 h-0.5 bg-[#C9A84C] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((st) => (
              <div key={st.num} className="text-center relative">
                <div className="font-display text-8xl text-[#C9A84C]/10 font-bold absolute top-[-60px] left-1/2 -translate-x-1/2 select-none">
                  {st.num}
                </div>
                <h3 className="font-display text-xl text-white relative z-10 mb-3">{st.title}</h3>
                <p className="text-[#F5ECD7]/60 text-sm leading-relaxed max-w-sm mx-auto">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-[#111111] border border-[#C9A84C]/25 rounded-lg p-8 sm:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl text-white">Plan Your Grand Event</h2>
            <p className="text-[#F5ECD7]/50 text-sm mt-2">
              Share details about your upcoming gathering, and let us shape a culinary masterpiece for you.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Contact Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/70 font-semibold mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-[#C9A84C]/50" />
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="E.g. Sushil Kumar"
                    className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded pl-10 pr-4 py-2.5 text-white text-sm outline-none transition-colors"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/70 font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-[#C9A84C]/50" />
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                    })}
                    placeholder="E.g. sushil@example.com"
                    className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded pl-10 pr-4 py-2.5 text-white text-sm outline-none transition-colors"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/70 font-semibold mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-[#C9A84C]/50" />
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone is required' })}
                    placeholder="E.g. +91 98765 43210"
                    className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded pl-10 pr-4 py-2.5 text-white text-sm outline-none transition-colors"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/70 font-semibold mb-2">
                  Date of Event
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-[#C9A84C]/50" />
                  <input
                    type="date"
                    {...register('date', { required: 'Event date is required' })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded pl-10 pr-4 py-2.5 text-white text-sm outline-none transition-colors"
                  />
                </div>
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Event Type */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/70 font-semibold mb-2">
                  Event Type
                </label>
                <select
                  {...register('eventType')}
                  className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded px-4 py-2.5 text-white text-sm outline-none transition-colors"
                >
                  <option value="Corporate Gala">Corporate Gala</option>
                  <option value="Wedding Banquet">Wedding Banquet</option>
                  <option value="Private Dinner">Private Dinner</option>
                  <option value="Cocktail Soirée">Cocktail Soirée</option>
                  <option value="Other">Other Occasion</option>
                </select>
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/70 font-semibold mb-2">
                  Guest Count
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-4 h-4 text-[#C9A84C]/50" />
                  <input
                    type="number"
                    {...register('guestCount', {
                      required: 'Guest count is required',
                      min: { value: 10, message: 'Minimum 10 guests required' },
                    })}
                    placeholder="Min 10"
                    className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded pl-10 pr-4 py-2.5 text-white text-sm outline-none transition-colors"
                  />
                </div>
                {errors.guestCount && <p className="text-red-500 text-xs mt-1">{errors.guestCount.message}</p>}
              </div>

              {/* Package Select */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/70 font-semibold mb-2">
                  Initial Package Tier
                </label>
                <select
                  {...register('packageType')}
                  className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded px-4 py-2.5 text-white text-sm outline-none transition-colors"
                >
                  <option value="Silver Soirée">Silver Soirée</option>
                  <option value="Gold Gastronomy">Gold Gastronomy</option>
                  <option value="Platinum Prestige">Platinum Prestige</option>
                  <option value="Bespoke Design">Bespoke Custom Plan</option>
                </select>
              </div>
            </div>

            {/* Event Details Message */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/70 font-semibold mb-2">
                Additional Details / Dietaries / Layout Notes
              </label>
              <textarea
                {...register('message')}
                rows={4}
                placeholder="Mention any custom dishes, allergy protocols, theme color choices, or custom bars..."
                className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded p-4 text-white text-sm outline-none transition-colors resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/70 font-semibold mb-2">
                Upload Floor Plans / Inspirations / Invitations (Optional)
              </label>
              <div className="border border-dashed border-[#C9A84C]/30 hover:border-[#C9A84C] rounded bg-[#0D0D0D] p-6 text-center cursor-pointer transition-colors relative">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  {fileName ? (
                    <>
                      <FileText className="w-8 h-8 text-[#C9A84C]" />
                      <span className="text-[#C9A84C] text-sm font-medium">{fileName}</span>
                      <span className="text-xs text-[#F5ECD7]/30">Click or drag to change file</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-[#C9A84C]/50" />
                      <span className="text-sm text-[#F5ECD7]/70">Choose a file or drag it here</span>
                      <span className="text-xs text-[#F5ECD7]/35">PDF, PNG, JPG (Max 5MB)</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A84C] text-[#0D0D0D] font-semibold tracking-wider text-sm py-4 uppercase rounded hover:bg-white hover:text-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting Your Inquiry...' : 'Submit Event Proposal Request'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
