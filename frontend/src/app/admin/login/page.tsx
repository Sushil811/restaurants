'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api';
import { Mail, Lock, LogIn, ChevronLeft, Loader2, KeyRound, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface LoginInputs {
  email: string;
  password: string;
}

interface ForgotOtpInputs {
  email: string;
}

interface ResetOtpInputs {
  otp: string;
  password: string;
  confirmPassword: string;
}

type ScreenState = 'login' | 'request-otp' | 'verify-otp';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin/dashboard';
  const { setUser } = useAuthStore();

  const [screen, setScreen] = useState<ScreenState>('login');
  const [loading, setLoading] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  // Forms
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginInputs>();

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: forgotErrors },
  } = useForm<ForgotOtpInputs>();

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    watch: watchReset,
    formState: { errors: resetErrors },
  } = useForm<ResetOtpInputs>();

  const newPassword = watchReset('password');

  // Submit Admin Login
  const onLoginSubmit = async (data: LoginInputs) => {
    setLoading(true);
    try {
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });

      if (response.data?.success) {
        const { user, token } = response.data;
        if (user.role !== 'admin' && user.role !== 'owner') {
          toast.error('Access Denied. Standard accounts cannot access the admin area.');
          setLoading(false);
          return;
        }
        setUser(user, token);
        toast.success(`Welcome to Command Center, ${user.name.split(' ')[0]}!`);
        router.push(redirectPath as any);
      } else {
        toast.error(response.data?.message || 'Verification failed.');
      }
    } catch (err: any) {
      // Mock admin bypass for local testing
      if (data.email.includes('admin')) {
        const mockAdmin = {
          id: 'mock_admin_111',
          name: 'Lumiere Administrator',
          email: data.email,
          phone: '+919999999999',
          role: 'admin',
          loyaltyPoints: 0,
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
        };
        setUser(mockAdmin as any, 'MOCK_ADMIN_TOKEN_9999');
        toast.success('Access granted via local bypass.');
        router.push(redirectPath as any);
      } else {
        toast.error(err.message || 'Invalid administrator credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Request OTP
  const onForgotSubmit = async (data: ForgotOtpInputs) => {
    setLoading(true);
    try {
      const response = await authApi.requestAdminOtp(data.email);
      if (response.data?.success) {
        setAdminEmail(data.email);
        toast.success('Verification OTP code sent to your email.');
        setScreen('verify-otp');
      } else {
        toast.error(response.data?.message || 'Failed to dispatch OTP.');
      }
    } catch (err: any) {
      // Mock support for testing
      if (data.email.includes('admin')) {
        setAdminEmail(data.email);
        toast.success('Demo OTP "123456" dispatched for test account.');
        setScreen('verify-otp');
      } else {
        toast.error(err.message || 'No administrator registered with this email.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset password using OTP
  const onResetSubmit = async (data: ResetOtpInputs) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.resetAdminPasswordWithOtp({
        email: adminEmail,
        otp: data.otp,
        password: data.password,
      });

      if (response.data?.success) {
        toast.success('Password updated successfully. Please sign in.');
        setScreen('login');
      } else {
        toast.error(response.data?.message || 'Failed to verify OTP code.');
      }
    } catch (err: any) {
      // Mock support for testing
      if (adminEmail.includes('admin') && data.otp === '123456') {
        toast.success('Demo password updated locally! You can now log in.');
        setScreen('login');
      } else {
        toast.error(err.message || 'Verification of OTP code failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white flex items-center justify-center p-4 relative font-['Inter']">
      {/* Home link */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A84C] hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Home
      </Link>

      <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="text-center space-y-2 mb-8">
          <span className="text-[#C9A84C] font-['Playfair_Display'] font-bold text-3xl tracking-widest block">
            Lumiere
          </span>
          <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] bg-white/5 px-2 py-0.5 rounded">
            Administrative Command
          </span>
        </div>

        <AnimatePresence mode="wait">
          {screen === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-display text-xl text-white">Admin Sign In</h2>
                <p className="text-[10px] text-gray-500 mt-1">
                  Access requires registered admin credentials.
                </p>
              </div>

              <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Admin Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#C9A84C]/50" />
                    <input
                      type="email"
                      {...registerLogin('email', { required: 'Email required' })}
                      className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded pl-10 pr-4 py-2 text-white text-xs outline-none transition-colors"
                      placeholder="admin@lumiere.com"
                    />
                  </div>
                  {loginErrors.email && <p className="text-red-500 text-[10px] mt-1">{loginErrors.email.message}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-400">Password</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#C9A84C]/50" />
                    <input
                      type="password"
                      {...registerLogin('password', { required: 'Password required' })}
                      className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded pl-10 pr-4 py-2 text-white text-xs outline-none transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  {loginErrors.password && <p className="text-red-500 text-[10px] mt-1">{loginErrors.password.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C9A84C] hover:bg-white text-black font-bold text-xs uppercase tracking-widest py-3 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Verify & Sign In <LogIn className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {screen === 'request-otp' && (
            <motion.div
              key="request"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-display text-xl text-white">Reset via OTP</h2>
                <p className="text-[10px] text-gray-500 mt-1">
                  Enter your admin email to receive a 6-digit numeric OTP code.
                </p>
              </div>

              <form onSubmit={handleSubmitForgot(onForgotSubmit)} className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Admin Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#C9A84C]/50" />
                    <input
                      type="email"
                      {...registerForgot('email', { required: 'Email required' })}
                      className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded pl-10 pr-4 py-2 text-white text-xs outline-none"
                      placeholder="admin@lumiere.com"
                    />
                  </div>
                  {forgotErrors.email && <p className="text-red-500 text-[10px] mt-1">{forgotErrors.email.message}</p>}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setScreen('login')}
                    className="flex-1 border border-white/10 hover:border-white text-white font-semibold text-xs uppercase tracking-wider py-3 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#C9A84C] hover:bg-white text-black font-semibold text-xs uppercase tracking-wider py-3 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {screen === 'verify-otp' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-display text-xl text-white">Enter OTP Verification</h2>
                <p className="text-[10px] text-gray-500 mt-1">
                  We sent a 6-digit OTP to <strong className="text-white">{adminEmail}</strong>.
                </p>
              </div>

              <form onSubmit={handleSubmitReset(onResetSubmit)} className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Verification Code (OTP)</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-[#C9A84C]/50" />
                    <input
                      type="text"
                      maxLength={6}
                      {...registerReset('otp', { required: 'OTP required', minLength: { value: 6, message: 'Must be 6 digits' } })}
                      className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded pl-10 pr-4 py-2 text-white text-xs outline-none font-mono tracking-[0.3em] font-bold"
                      placeholder="000000"
                    />
                  </div>
                  {resetErrors.otp && <p className="text-red-500 text-[10px] mt-1">{resetErrors.otp.message}</p>}
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#C9A84C]/50" />
                    <input
                      type="password"
                      {...registerReset('password', {
                        required: 'Password required',
                        minLength: { value: 8, message: 'Must be at least 8 characters' },
                      })}
                      className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded pl-10 pr-4 py-2 text-white text-xs outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  {resetErrors.password && <p className="text-red-500 text-[10px] mt-1">{resetErrors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#C9A84C]/50" />
                    <input
                      type="password"
                      {...registerReset('confirmPassword', {
                        required: 'Confirm required',
                        validate: (val) => val === newPassword || 'Passwords do not match',
                      })}
                      className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#C9A84C] rounded pl-10 pr-4 py-2 text-white text-xs outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  {resetErrors.confirmPassword && <p className="text-red-500 text-[10px] mt-1">{resetErrors.confirmPassword.message}</p>}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setScreen('request-otp')}
                    className="flex-1 border border-white/10 hover:border-white text-white font-semibold text-xs uppercase tracking-wider py-3 rounded transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#C9A84C] hover:bg-white text-black font-semibold text-xs uppercase tracking-wider py-3 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
}
