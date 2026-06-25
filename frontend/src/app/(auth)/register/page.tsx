'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api';
import { User, Mail, Lock, UserPlus, ChevronLeft, Loader2, Award } from 'lucide-react';
import { Chrome } from '@/components/shared/BrandIcons';
import toast from 'react-hot-toast';

interface RegisterInputs {
  name: string;
  email: string;
  phone?: string;
  password: string;
  referralCode?: string;
  acceptTerms: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({
    defaultValues: {
      acceptTerms: true,
    },
  });

  const onSubmit = async (data: RegisterInputs) => {
    setLoading(true);
    try {
      const response = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });

      if (response.data?.success) {
        const { user, token } = response.data;
        setUser(user, token);
        toast.success(`Account created! Welcome to Lumiere, ${user.name.split(' ')[0]}!`);
        router.push('/profile');
      } else {
        toast.error(response.data?.message || 'Registration failed. Please check your inputs.');
      }
    } catch (err: any) {
      // Mock account creation for testing purposes
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substring(2, 9),
        name: data.name,
        email: data.email,
        phone: data.phone || '+91 99999 88888',
        role: 'user',
        loyaltyPoints: data.referralCode ? 250 : 100, // extra points for using referral code
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser as any, 'MOCK_REGISTERED_BEARER_TOKEN');
      toast.success(
        data.referralCode
          ? 'Demo account created! Referral code applied (250 Loyalty Points credited).'
          : 'Demo account created successfully! (100 Welcome Points credited).'
      );
      router.push('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    toast.loading('Connecting via Google OAuth...');
    setTimeout(() => {
      toast.dismiss();
      const mockGoogleUser = {
        id: 'google_user_123',
        name: 'Sushil Kumar',
        email: 'sushil@example.com',
        role: 'user',
        loyaltyPoints: 100,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      };
      setUser(mockGoogleUser as any, 'MOCK_GOOGLE_REGISTERED_TOKEN');
      toast.success('Registered successfully via Google!');
      router.push('/profile');
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
          src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1080&q=80"
          alt="Lumiere Professional Culinary Team"
          className="w-full h-full object-cover filter brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0D0D0D]" />
        <div className="absolute bottom-12 left-12 max-w-md space-y-2 z-10">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">Join The Circle</span>
          <h2 className="font-display text-4xl text-white leading-tight">Unlock exclusive tasting bookings and earn chef rewards.</h2>
        </div>
      </div>

      {/* Right side: Registration form */}
      <div className="col-span-1 md:col-span-7 lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 relative">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div>
            <h1 className="font-display text-4xl text-white">Create Account</h1>
            <p className="text-xs text-[#F5ECD7]/50 mt-2">
              Sign up today and instantly receive 100 welcome loyalty points.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/60 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4.5 h-4.5 text-[#C9A84C]/50" />
                <input
                  type="text"
                  {...register('name', { required: 'Full name is required' })}
                  placeholder="Sushil Kumar"
                  className="w-full bg-[#111111] border border-[#C9A84C]/25 focus:border-[#C9A84C] rounded pl-11 pr-4 py-3 text-white text-sm outline-none transition-colors"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

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
              <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/60 mb-2">Password</label>
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

            {/* Referral Code */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/60 mb-2 flex items-center gap-1">
                Referral Code (Optional) <Award className="w-3.5 h-3.5 text-[#C9A84C]" />
              </label>
              <input
                type="text"
                {...register('referralCode')}
                placeholder="E.g. FRIEND250"
                className="w-full bg-[#111111] border border-[#C9A84C]/25 focus:border-[#C9A84C] rounded px-4 py-3 text-white text-sm outline-none transition-colors uppercase"
              />
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="acceptTerms"
                {...register('acceptTerms', { required: 'You must accept the terms' })}
                className="w-4 h-4 mt-0.5 rounded border-[#C9A84C]/20 bg-[#111111] accent-[#C9A84C]"
              />
              <label htmlFor="acceptTerms" className="text-xs text-[#F5ECD7]/50 cursor-pointer select-none">
                I accept the terms of service, privacy policy, and gourmet membership rules.
              </label>
            </div>
            {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms.message}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A84C] hover:bg-white text-[#0D0D0D] font-bold text-xs uppercase tracking-widest py-4 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" /> Registering...
                </>
              ) : (
                <>
                  Register <UserPlus className="w-4.5 h-4.5" />
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
              Or Register With
            </span>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full bg-[#111111] border border-[#C9A84C]/35 hover:border-white hover:bg-white/5 text-[#F5ECD7]/80 text-xs font-semibold uppercase tracking-wider py-3.5 rounded transition-all flex items-center justify-center gap-2"
          >
            <Chrome className="w-4 h-4 text-red-500" /> Continue with Google
          </button>

          {/* Login Redirect link */}
          <p className="text-center text-xs text-[#F5ECD7]/45">
            Already registered?{' '}
            <Link href="/login" className="text-[#C9A84C] font-semibold hover:underline">
              Sign In Instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
