'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export default function ContactPageClient() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      // Simulated API request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Your message has been received! Our concierge team will reply shortly.');
      reset();
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    {
      icon: Phone,
      title: 'Reservations & Inquiries',
      value: '+91 40 2330 1234',
      link: 'tel:+914023301234',
    },
    {
      icon: Mail,
      title: 'Concierge Desk',
      value: 'concierge@lumiere.restaurant',
      link: 'mailto:concierge@lumiere.restaurant',
    },
    {
      icon: MapPin,
      title: 'Our Location',
      value: 'Road No. 12, Banjara Hills, Hyderabad, 500034',
      link: 'https://maps.google.com',
    },
  ];

  return (
    <div className="bg-[#0D0D0D] text-white pt-28 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#C9A84C] uppercase tracking-[0.25em] text-xs font-semibold">Get in Touch</span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white mt-3">Contact Us</h1>
          <div className="w-16 h-0.5 bg-[#C9A84C] mx-auto mt-4" />
          <p className="text-[#F5ECD7]/50 text-sm mt-4 max-w-md mx-auto">
            Whether booking an exclusive chef table, planning catering, or giving feedback, our team is at your service.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactDetails.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <motion.a
                key={detail.title}
                href={detail.link}
                target={detail.icon === MapPin ? '_blank' : undefined}
                rel={detail.icon === MapPin ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#111111] border border-[#C9A84C]/20 hover:border-[#C9A84C] rounded-lg p-6 flex flex-col items-center text-center transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <h3 className="font-display text-lg text-white mb-2">{detail.title}</h3>
                <p className="text-sm text-[#F5ECD7]/70 font-semibold group-hover:text-[#C9A84C] transition-colors">
                  {detail.value}
                </p>
              </motion.a>
            );
          })}
        </div>

        {/* Form & Business Hours Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Contact Form */}
          <div className="lg:col-span-8 bg-[#111111] border border-[#C9A84C]/25 rounded-lg p-8 sm:p-10 shadow-2xl">
            <h2 className="font-display text-2xl text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#C9A84C]" /> Send a Message
            </h2>
            <p className="text-xs text-[#F5ECD7]/50 mb-6">
              Complete the details below, and a Lumiere representative will get back to you.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/70 font-semibold mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Sushil Kumar"
                    className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded px-4 py-2.5 text-white text-sm outline-none transition-colors"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/70 font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                    })}
                    placeholder="sushil@example.com"
                    className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded px-4 py-2.5 text-white text-sm outline-none transition-colors"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/70 font-semibold mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded px-4 py-2.5 text-white text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/70 font-semibold mb-2">
                    Subject
                  </label>
                  <select
                    {...register('subject', { required: 'Subject is required' })}
                    className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded px-4 py-2.5 text-white text-sm outline-none transition-colors"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Private Event Booking">Private Dining & Events</option>
                    <option value="Chef Table Reservations">Chef’s Table Request</option>
                    <option value="Feedback & Press">Media & Press</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/70 font-semibold mb-2">
                  Message Details
                </label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  rows={5}
                  placeholder="Share details of your request or dining experience feedback..."
                  className="w-full bg-[#0D0D0D] border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded p-4 text-white text-sm outline-none transition-colors resize-none"
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-[#C9A84C] hover:bg-white text-[#0D0D0D] font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Sending Message...' : 'Send Message'} <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Business Hours Sidebar */}
          <div className="lg:col-span-4 bg-[#111111] border border-[#C9A84C]/20 rounded-lg p-6 space-y-6 shadow-xl">
            <h3 className="font-display text-xl text-white flex items-center gap-2 pb-3 border-b border-[#C9A84C]/10">
              <Clock className="w-5 h-5 text-[#C9A84C]" /> Business Hours
            </h3>
            <div className="space-y-3 text-sm text-[#F5ECD7]/70">
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="font-semibold text-white">Monday - Thursday</span>
                <span>12:00 PM - 11:00 PM</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="font-semibold text-white">Friday - Saturday</span>
                <span>12:00 PM - 12:00 AM</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="font-semibold text-white">Sunday Brunch</span>
                <span>11:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between text-amber-500">
                <span className="font-semibold">Sunday Dinner</span>
                <span>Closed</span>
              </div>
            </div>

            <div className="bg-[#0D0D0D] border border-[#C9A84C]/20 p-4 rounded text-xs leading-relaxed space-y-2">
              <p className="font-semibold text-[#C9A84C] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Dress Code Policy
              </p>
              <p className="text-[#F5ECD7]/50">
                Smart casual / Formal evening attire. We kindly request guests avoid athletic wear, slippers, or beachwear.
              </p>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="h-96 rounded-lg overflow-hidden border border-[#C9A84C]/25 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.0396492348334!2d78.43126781530932!3d17.410521906709825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb972551cf16c9%3A0xe54e66d9361664d9!2sRoad%20No.%2012%2C%20Banjara%20Hills%2C%20Hyderabad%2C%20Telangana%20500034!5e0!3m2!1sen!2sin!4v1622904892440!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}
            allowFullScreen={false}
            loading="lazy"
          ></iframe>
        </div>

      </div>
    </div>
  );
}
