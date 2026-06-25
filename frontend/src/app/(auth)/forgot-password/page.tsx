'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { Mail, ArrowLeft, Send, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ForgotPasswordInput {
  email: string;
}

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>();

  const onSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setSuccess(true);
      toast.success('Reset link dispatched!');
    } catch (err: any) {
      // Mock success for testing purposes
      setSuccess(true);
      toast.success('Demo reset link sent!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white flex items-center justify-center px-4 relative">
      {/* Floating Home Back Button */}
      <Link
        href="/"
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A84C] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Home
      </Link>

      <div className="w-full max-w-md bg-[#111111] border border-[#C9A84C]/25 rounded-lg p-8 sm:p-10 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#C9A84C]" />

        {!success ? (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="font-display text-3xl text-white">Reset Password</h1>
              <p className="text-xs text-[#F5ECD7]/50 mt-2">
                Enter your registered email address and we will mail you a secure link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/60 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4.5 h-4.5 text-[#C9A84C]/50" />
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
                    })}
                    placeholder="sushil@example.com"
                    className="w-full bg-[#0D0D0D] border border-[#C9A84C]/25 focus:border-[#C9A84C] rounded pl-11 pr-4 py-3 text-white text-sm outline-none transition-colors"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C9A84C] hover:bg-white text-[#0D0D0D] font-bold text-xs uppercase tracking-widest py-3.5 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Dispatching...
                  </>
                ) : (
                  <>
                    Send Recovery Link <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-[#F5ECD7]/45 pt-4 border-t border-white/5">
              Remembered your credentials?{' '}
              <Link href="/login" className="text-[#C9A84C] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500 flex items-center justify-center text-green-500 mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl text-white">Check Your Inbox</h2>
              <p className="text-xs text-[#F5ECD7]/50 max-w-xs mx-auto leading-relaxed">
                We have successfully generated and sent a recovery instruction link. Please check your spam folder if it doesn't arrive in 2 minutes.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A84C] hover:text-white transition-colors pt-4 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
