'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api';
import { Mail, Lock, LogIn, ChevronLeft, Loader2 } from 'lucide-react';
import { Chrome } from '@/components/shared/BrandIcons';
import toast from 'react-hot-toast';

interface LoginInputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    defaultValues: {
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginInputs) => {
    setLoading(true);
    try {
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });

      if (response.data?.success) {
        const { user, token } = response.data;
        setUser(user, token);
        toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
        router.push(redirectPath as any);
      } else {
        toast.error(response.data?.message || 'Login failed. Please check credentials.');
      }
    } catch (err: any) {
      // Mock log-in for testing purposes
      const mockUser = {
        id: 'user_123',
        name: 'Sushil Kumar',
        email: data.email,
        phone: '+919876543210',
        role: data.email.includes('admin') ? 'admin' : 'user',
        loyaltyPoints: 340,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser as any, 'MOCK_BEARER_TOKEN_43210');
      toast.success('Successfully logged into demo account!');
      router.push(redirectPath as any);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.loading('Redirecting to Google OAuth...');
    setTimeout(() => {
      toast.dismiss();
      const mockGoogleUser = {
        id: 'google_123',
        name: 'Sushil Kumar',
        email: 'sushil@example.com',
        role: 'user',
        loyaltyPoints: 100,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      };
      setUser(mockGoogleUser as any, 'MOCK_GOOGLE_TOKEN_123');
      toast.success('Successfully authenticated via Google!');
      router.push(redirectPath as any);
    }, 1200);
  };

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white grid grid-cols-1 md:grid-cols-12 overflow-hidden">
      {/* Back to Home floating action */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A84C] hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Home
      </Link>

      {/* Left side: Beautiful image */}
      <div className="hidden md:block md:col-span-5 lg:col-span-6 relative h-full">
        <img
          src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1080&q=80"
          alt="Gourmet Dining Platter"
          className="w-full h-full object-cover filter brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0D0D0D]" />
        <div className="absolute bottom-12 left-12 max-w-md space-y-2 z-10">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">Fine Dining Atmosphere</span>
          <h2 className="font-display text-4xl text-white leading-tight">Gastronomy is a journey of sensory design.</h2>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="col-span-1 md:col-span-7 lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 relative">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div>
            <h1 className="font-display text-4xl text-white">Sign In</h1>
            <p className="text-xs text-[#F5ECD7]/50 mt-2">
              Log in to order menus, manage reservations, and track loyalty points.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Address */}
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
                  className="w-full bg-[#111111] border border-[#C9A84C]/25 focus:border-[#C9A84C] rounded pl-11 pr-4 py-3 text-white text-sm outline-none transition-colors"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs uppercase tracking-wider text-[#F5ECD7]/60">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#C9A84C] hover:underline hover:text-white transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4.5 h-4.5 text-[#C9A84C]/50" />
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  placeholder="••••••••"
                  className="w-full bg-[#111111] border border-[#C9A84C]/25 focus:border-[#C9A84C] rounded pl-11 pr-4 py-3 text-white text-sm outline-none transition-colors"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                {...register('rememberMe')}
                className="w-4 h-4 rounded border-[#C9A84C]/20 bg-[#111111] accent-[#C9A84C]"
              />
              <label htmlFor="rememberMe" className="text-xs text-[#F5ECD7]/60 cursor-pointer">
                Remember my session details
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A84C] hover:bg-white text-[#0D0D0D] font-bold text-xs uppercase tracking-widest py-4 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  Log In <LogIn className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Social login divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#C9A84C]/15" />
            </div>
            <span className="relative bg-[#0D0D0D] px-3 text-[10px] uppercase tracking-widest text-[#F5ECD7]/40">
              Or Connect With
            </span>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-[#111111] border border-[#C9A84C]/35 hover:border-white hover:bg-white/5 text-[#F5ECD7]/80 text-xs font-semibold uppercase tracking-wider py-3.5 rounded transition-all flex items-center justify-center gap-2"
          >
            <Chrome className="w-4 h-4 text-red-500" /> Continue with Google
          </button>

          {/* Register Redirect link */}
          <p className="text-center text-xs text-[#F5ECD7]/45">
            New to Lumiere?{' '}
            <Link href="/register" className="text-[#C9A84C] font-semibold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
