'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, XCircle, Loader2, Lock } from 'lucide-react';

export default function NewsletterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('loading');

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate success
    setStatus('success');
    setMessage("Welcome to the inner circle! Check your inbox for a special welcome gift.");
    setEmail('');
    setTimeout(() => setStatus('idle'), 6000);
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#1a1400] to-[#0D0D0D]" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A84C] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#C9A84C] rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Icon */}
          <div className="w-16 h-16 bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-7 h-7 text-[#C9A84C]" />
          </div>

          {/* Labels */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] uppercase tracking-[0.3em] text-xs font-medium">
              Newsletter
            </span>
            <div className="h-px w-8 bg-[#C9A84C]" />
          </div>

          <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">
            Join Our Inner Circle
          </h2>
          <p className="text-[#F5ECD7]/60 text-base mb-10 leading-relaxed">
            Be the first to receive exclusive offers, new menu previews, chef
            table invitations, and private event access. The finest dining
            experiences, delivered to your inbox.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              disabled={status === 'loading' || status === 'success'}
              className="flex-1 px-5 py-4 bg-white/5 border border-white/10 text-white placeholder-[#F5ECD7]/30 focus:outline-none focus:border-[#C9A84C]/60 focus:bg-white/8 transition-all duration-200 disabled:opacity-50"
            />
            <motion.button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              whileHover={{ scale: status === 'idle' ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-[#C9A84C] text-[#0D0D0D] font-semibold text-sm uppercase tracking-widest hover:bg-[#F5ECD7] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px]"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subscribing...
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Subscribed!
                </>
              ) : (
                'Subscribe'
              )}
            </motion.button>
          </form>

          {/* Toast-style message */}
          <AnimatePresence>
            {(status === 'success' || status === 'error') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center gap-2 justify-center p-4 rounded text-sm mb-4 ${
                  status === 'success'
                    ? 'bg-green-900/40 border border-green-600/30 text-green-300'
                    : 'bg-red-900/40 border border-red-600/30 text-red-300'
                }`}
              >
                {status === 'success' ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                )}
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-2 text-[#F5ECD7]/30 text-xs">
            <Lock className="w-3 h-3" />
            We respect your privacy. Unsubscribe at any time. No spam, ever.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
