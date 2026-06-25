import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  loyaltyPoints: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  referralCode?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  clearError: () => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
}

const mockUser: User = {
  id: 'usr_001',
  name: 'Alexandre Dubois',
  email: 'alexandre@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  role: 'customer',
  loyaltyPoints: 2450,
  loyaltyTier: 'silver',
  referralCode: 'ALEX2024',
  createdAt: '2024-01-15T10:00:00Z',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, _password: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          if (email && _password) {
            set({
              user: mockUser,
              token: 'mock_jwt_token_' + Date.now(),
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (err: unknown) {
          set({
            error: err instanceof Error ? err.message : 'Login failed',
            isLoading: false,
          });
          throw err;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const newUser: User = {
            ...mockUser,
            id: 'usr_' + Date.now(),
            name: data.name,
            email: data.email,
            loyaltyPoints: 100,
            loyaltyTier: 'bronze',
            referralCode: data.referralCode,
            createdAt: new Date().toISOString(),
          };
          set({
            user: newUser,
            token: 'mock_jwt_token_' + Date.now(),
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: unknown) {
          set({
            error: err instanceof Error ? err.message : 'Registration failed',
            isLoading: false,
          });
          throw err;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateProfile: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'lumiere-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
