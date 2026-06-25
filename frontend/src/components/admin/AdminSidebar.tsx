'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  UtensilsCrossed,
  Users,
  Star,
  Tag,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Layers,
  List,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
  children?: { label: string; href: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag, badge: 8, badgeColor: 'bg-orange-500' },
  { label: 'Reservations', href: '/admin/reservations', icon: CalendarDays, badge: 5, badgeColor: 'bg-blue-500' },
  {
    label: 'Menu',
    icon: UtensilsCrossed,
    children: [
      { label: 'Menu Items', href: '/admin/menu', icon: List },
      { label: 'Categories', href: '/admin/menu/categories', icon: Layers },
    ],
  },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
}

export default function AdminSidebar({ collapsed, onToggleCollapse, isMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, getAvatarUrl } = useAuthStore();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Menu']);

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isGroupActive = (item: NavItem) => {
    if (item.href) return isActive(item.href);
    return item.children?.some((child) => isActive(child.href)) ?? false;
  };

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div
      className={`h-screen flex flex-col bg-[#0D0D0D] border-r border-white/10 sticky top-0 transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="text-[#C9A84C] font-['Playfair_Display'] font-bold text-xl tracking-wide">
                Lumiere
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">
                Admin
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <div className="w-full flex justify-center">
            <span className="text-[#C9A84C] font-['Playfair_Display'] font-bold text-xl">L</span>
          </div>
        )}

        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors ${
              collapsed ? 'mx-auto' : ''
            }`}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}

        {isMobile && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-white/10">
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isGroupActive(item);
            const hasChildren = !!item.children;
            const isExpanded = expandedGroups.includes(item.label);

            if (hasChildren) {
              return (
                <li key={item.label}>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      active
                        ? 'text-[#C9A84C] bg-[#C9A84C]/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} className="shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-1 flex items-center justify-between"
                        >
                          <span className="font-medium">{item.label}</span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>

                  <AnimatePresence>
                    {isExpanded && !collapsed && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden ml-4 mt-0.5 space-y-0.5"
                      >
                        {item.children?.map((child) => {
                          const ChildIcon = child.icon;
                          const childActive = isActive(child.href);
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href as any}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                                  childActive
                                    ? 'text-[#C9A84C] bg-[#C9A84C]/10 font-medium'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <ChildIcon size={15} className="shrink-0" />
                                <span>{child.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              );
            }

            return (
              <li key={item.label}>
                <Link
                  href={item.href! as any}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative ${
                    active
                      ? 'text-[#C9A84C] bg-[#C9A84C]/10 font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} className="shrink-0" />

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex items-center justify-between"
                      >
                        <span>{item.label}</span>
                        {item.badge != null && item.badge > 0 && (
                          <span
                            className={`${item.badgeColor ?? 'bg-gray-600'} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Collapsed badge */}
                  {collapsed && item.badge != null && item.badge > 0 && (
                    <span
                      className={`absolute top-1 right-1 w-4 h-4 ${item.badgeColor ?? 'bg-gray-600'} text-white text-[9px] font-bold rounded-full flex items-center justify-center`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Active indicator */}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#C9A84C] rounded-r" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info + logout */}
      <div className="shrink-0 border-t border-white/10 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img
                src={getAvatarUrl()}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-amber-700 flex items-center justify-center text-black font-bold text-sm shrink-0">
                {user?.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@lumiere.com'}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {user?.avatar ? (
              <img
                src={getAvatarUrl()}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border border-white/10"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-amber-700 flex items-center justify-center text-black font-bold text-sm">
                {user?.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
              </div>
            )}
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
