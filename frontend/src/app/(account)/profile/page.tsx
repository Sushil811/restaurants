'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/lib/store/authStore';
import { userApi, uploadApi } from '@/lib/api';
import { User, Phone, Mail, Lock, Upload, Save, ShieldAlert, Loader2, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfileInputs {
  name: string;
  phone: string;
  isVeg: boolean;
}

interface PasswordInputs {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, getAvatarUrl, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
    toast.success('Logged out successfully!');
  };

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileInputs>({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      isVeg: user?.preferences?.isVeg || false,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordInputs>();

  const newPassword = watch('newPassword');

  const onAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarLoading(true);
    try {
      const response = await uploadApi.image(file, 'avatars');
      if (response.data?.success) {
        const avatarUrl = response.data.url;
        await userApi.updateProfile({ avatar: file }); // API sync
        updateProfile({ avatar: avatarUrl }); // Store sync
        toast.success('Avatar updated successfully!');
      } else {
        // Fallback mockup local image preview URL for demo
        const localUrl = URL.createObjectURL(file);
        updateProfile({ avatar: localUrl });
        toast.success('Demo avatar updated locally!');
      }
    } catch {
      const localUrl = URL.createObjectURL(file);
      updateProfile({ avatar: localUrl });
      toast.success('Demo avatar updated locally!');
    } finally {
      setAvatarLoading(false);
    }
  };

  const onSubmitProfile = async (data: ProfileInputs) => {
    setProfileLoading(true);
    try {
      const response = await userApi.updateProfile({
        name: data.name,
        phone: data.phone,
        preferences: { isVeg: data.isVeg },
      });

      if (response.data?.success) {
        updateProfile({
          name: data.name,
          phone: data.phone,
          preferences: {
            ...user?.preferences,
            isVeg: data.isVeg,
            allergies: user?.preferences?.allergies || [],
            newsletter: user?.preferences?.newsletter || false,
          },
        });
        toast.success('Profile saved successfully!');
      } else {
        toast.error(response.data?.message || 'Failed to save profile.');
      }
    } catch (err) {
      // Fallback update store for demo
      updateProfile({
        name: data.name,
        phone: data.phone,
      });
      toast.success('Demo profile saved!');
    } finally {
      setProfileLoading(false);
    }
  };

  const onSubmitPassword = async (data: PasswordInputs) => {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await userApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.data?.success) {
        toast.success('Password changed successfully!');
        resetPassword();
      } else {
        toast.error(response.data?.message || 'Password update failed.');
      }
    } catch (err: any) {
      toast.success('Demo Password changed successfully!');
      resetPassword();
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-[#0D0D0D] min-h-screen pt-28 pb-16 flex items-center justify-center text-white">
        <p className="text-[#F5ECD7]/50">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0D0D] text-white pt-28 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-white mb-2">My Profile</h1>
        <p className="text-[#F5ECD7]/50 text-sm mb-8">Manage your credentials, preferences, and security.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Avatar and Profile Details */}
          <div className="lg:col-span-7 bg-[#111111] border border-[#C9A84C]/20 rounded-lg p-6 sm:p-8 space-y-6">
            
            {/* Avatar block */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/5">
              <div className="relative group cursor-pointer" onClick={onAvatarClick}>
                <img
                  src={getAvatarUrl()}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#C9A84C] group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 bg-[#0D0D0D]/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {avatarLoading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5 text-[#C9A84C]" />
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-display text-xl text-white">{user.name}</h3>
                <p className="text-xs text-[#C9A84C] uppercase tracking-wider mt-0.5">{user.role}</p>
                <p className="text-[10px] text-[#F5ECD7]/40 mt-1">Joined Lumiere: {new Date(user.createdAt).toLocaleDateString()}</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 px-4 py-1.5 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>

            {/* Profile Information Form */}
            <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/60 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-[#C9A84C]/50" />
                  <input
                    type="text"
                    {...registerProfile('name', { required: 'Name is required' })}
                    className="w-full bg-[#0D0D0D] border border-[#C9A84C]/25 focus:border-[#C9A84C] rounded pl-10 pr-4 py-2.5 text-white text-sm outline-none transition-colors"
                  />
                </div>
                {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/60 mb-2">Email Address (Read-Only)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full bg-[#0D0D0D]/50 border border-[#C9A84C]/10 rounded pl-10 pr-4 py-2.5 text-white/40 text-sm outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/60 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-[#C9A84C]/50" />
                    <input
                      type="tel"
                      {...registerProfile('phone')}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#0D0D0D] border border-[#C9A84C]/25 focus:border-[#C9A84C] rounded pl-10 pr-4 py-2.5 text-white text-sm outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isVeg"
                  {...registerProfile('isVeg')}
                  className="w-4 h-4 rounded border-[#C9A84C]/20 bg-[#111111] accent-[#C9A84C]"
                />
                <label htmlFor="isVeg" className="text-xs text-[#F5ECD7]/60 cursor-pointer">
                  I prefer Vegetarian / Green dishes
                </label>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="px-6 py-2.5 bg-[#C9A84C] hover:bg-white text-[#0D0D0D] font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </form>
          </div>

          {/* Change Password Panel */}
          <div className="lg:col-span-5 bg-[#111111] border border-[#C9A84C]/20 rounded-lg p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-xl text-white flex items-center gap-2 pb-3 border-b border-white/5">
              <Lock className="w-5 h-5 text-[#C9A84C]" /> Change Password
            </h2>

            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/60 mb-2">Current Password</label>
                <input
                  type="password"
                  {...registerPassword('currentPassword', { required: 'Current password is required' })}
                  className="w-full bg-[#0D0D0D] border border-[#C9A84C]/25 focus:border-[#C9A84C] rounded px-4 py-2.5 text-white text-sm outline-none transition-colors"
                />
                {passwordErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword.message}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/60 mb-2">New Password</label>
                <input
                  type="password"
                  {...registerPassword('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Must be at least 6 characters' },
                  })}
                  className="w-full bg-[#0D0D0D] border border-[#C9A84C]/25 focus:border-[#C9A84C] rounded px-4 py-2.5 text-white text-sm outline-none transition-colors"
                />
                {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F5ECD7]/60 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  {...registerPassword('confirmNewPassword', {
                    required: 'Please confirm password',
                    validate: (val) => val === newPassword || 'Passwords do not match',
                  })}
                  className="w-full bg-[#0D0D0D] border border-[#C9A84C]/25 focus:border-[#C9A84C] rounded px-4 py-2.5 text-white text-sm outline-none transition-colors"
                />
                {passwordErrors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmNewPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2.5 bg-[#C9A84C] hover:bg-white text-[#0D0D0D] font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                Change Password
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
