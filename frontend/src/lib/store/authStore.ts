import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ─────────────────────────────────────────────────────────────────────────────
// User Type
// ─────────────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin" | "staff";
  avatar?: string;
  loyaltyPoints: number;
  isEmailVerified: boolean;
  preferences?: {
    isVeg: boolean;
    allergies: string[];
    newsletter: boolean;
  };
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth Store Types
// ─────────────────────────────────────────────────────────────────────────────
export interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialised: boolean;

  // Actions
  setUser: (user: User, token?: string) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addLoyaltyPoints: (points: number) => void;
  setInitialised: (value: boolean) => void;

  // Computed
  isAdmin: () => boolean;
  isStaff: () => boolean;
  getDisplayName: () => string;
  getAvatarUrl: () => string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default avatar fallback
// ─────────────────────────────────────────────────────────────────────────────
function buildAvatarUrl(user: User | null): string {
  if (!user) return "";
  if (user.avatar) return user.avatar;
  // Gravatar-style fallback using initials
  const initials = user.name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=c9a84c&color=0d0d0d&size=128&bold=true`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────────────────────────
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      isInitialised: false,

      // ── setUser ────────────────────────────────────────────────────────────
      setUser: (user, token) => {
        if (typeof window !== "undefined" && token) {
          localStorage.setItem("lumiere_token", token);
        }
        set({
          user,
          token: token ?? get().token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      // ── setToken ───────────────────────────────────────────────────────────
      setToken: (token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("lumiere_token", token);
        }
        set({ token });
      },

      // ── setLoading ─────────────────────────────────────────────────────────
      setLoading: (loading) => set({ isLoading: loading }),

      // ── logout ─────────────────────────────────────────────────────────────
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("lumiere_token");
          localStorage.removeItem("lumiere_user");
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // ── updateProfile ──────────────────────────────────────────────────────
      updateProfile: (updates) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({ user: { ...currentUser, ...updates } });
      },

      // ── addLoyaltyPoints ───────────────────────────────────────────────────
      addLoyaltyPoints: (points) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: {
            ...currentUser,
            loyaltyPoints: (currentUser.loyaltyPoints ?? 0) + points,
          },
        });
      },

      // ── setInitialised ─────────────────────────────────────────────────────
      setInitialised: (value) => set({ isInitialised: value }),

      // ── isAdmin ────────────────────────────────────────────────────────────
      isAdmin: () => get().user?.role === "admin",

      // ── isStaff ────────────────────────────────────────────────────────────
      isStaff: () =>
        get().user?.role === "admin" || get().user?.role === "staff",

      // ── getDisplayName ─────────────────────────────────────────────────────
      getDisplayName: () => {
        const user = get().user;
        if (!user) return "Guest";
        return user.name.split(" ")[0]; // First name only
      },

      // ── getAvatarUrl ───────────────────────────────────────────────────────
      getAvatarUrl: () => buildAvatarUrl(get().user),
    }),
    {
      name: "lumiere_auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (null as never)
      ),
      // Persist user + token, but not loading/initialised state
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// Selector hooks
// ─────────────────────────────────────────────────────────────────────────────
export const useUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useIsLoading = () => useAuthStore((s) => s.isLoading);
export const useAuthToken = () => useAuthStore((s) => s.token);
export const useIsAdmin = () => useAuthStore((s) => s.user?.role === "admin");
export const useIsStaff = () =>
  useAuthStore((s) => s.user?.role === "admin" || s.user?.role === "staff");
export const useLoyaltyPoints = () =>
  useAuthStore((s) => s.user?.loyaltyPoints ?? 0);
