"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import ThemeToggle from "@/components/shared/ThemeToggle";

// ─────────────────────────────────────────────────────────────────────────────
// Nav Links Data
// ─────────────────────────────────────────────────────────────────────────────
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Reservations", href: "/reservation" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Logo Component
// ─────────────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group" aria-label="Lumiere — Home">
      {/* Monogram */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold group-hover:shadow-gold-lg transition-shadow duration-300">
          <span className="font-display font-black text-charcoal text-xl leading-none select-none">
            L
          </span>
        </div>
        <div className="absolute inset-0 rounded-full animate-pulse-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span className="font-display font-bold text-xl tracking-luxury text-gradient-gold-static uppercase">
          Lumiere
        </span>
        <span className="text-[0.55rem] tracking-widest-xl text-text-muted uppercase font-sans font-medium mt-0.5 hidden sm:block">
          Fine Dining
        </span>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Desktop Nav Link
// ─────────────────────────────────────────────────────────────────────────────
function DesktopNavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href as any}
      className={cn(
        "nav-link text-sm font-medium transition-colors duration-200",
        isActive
          ? "text-gold-500 active"
          : "text-charcoal-700 dark:text-cream-300 hover:text-gold-500 dark:hover:text-gold-400"
      )}
    >
      {label}
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cart Button
// ─────────────────────────────────────────────────────────────────────────────
function CartButton() {
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.getTotalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use 0 on server/first-render to avoid SSR ↔ client mismatch
  const displayCount = mounted ? itemCount : 0;

  return (
    <button
      onClick={openCart}
      className="relative p-2 rounded-xl text-charcoal-700 dark:text-cream-300 hover:text-gold-500 dark:hover:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-500/10 transition-all duration-200 group"
      aria-label={`Shopping cart — ${displayCount} item${displayCount !== 1 ? "s" : ""}`}
    >
      <ShoppingBag
        size={20}
        className="transition-transform duration-200 group-hover:scale-110"
        strokeWidth={1.75}
      />
      {displayCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-gold-500 text-charcoal text-[10px] font-bold leading-none tabular-nums animate-scale-in">
          {displayCount > 99 ? "99+" : displayCount}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth Button
// ─────────────────────────────────────────────────────────────────────────────
function AuthButton() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated && user) {
    return (
      <Link
        href="/profile"
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-charcoal-700 dark:text-cream-300 hover:text-gold-500 dark:hover:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-500/10 transition-all duration-200"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover border border-gold-300"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
            <span className="text-charcoal text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="hidden lg:block">{user.name.split(" ")[0]}</span>
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gold-500 text-charcoal hover:bg-gold-400 active:bg-gold-600 shadow-gold hover:shadow-gold-lg transition-all duration-200"
    >
      <User size={15} strokeWidth={2} />
      <span>Login</span>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Menu
// ─────────────────────────────────────────────────────────────────────────────
function MobileMenu({
  isOpen,
  onClose,
  pathname,
}: {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-overlay bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[min(340px,90vw)] z-modal bg-white dark:bg-charcoal-900 shadow-2xl flex flex-col transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
          !isOpen && "pointer-events-none invisible"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cream-300 dark:border-charcoal-700">
          <Logo />
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-600 dark:text-cream-400 hover:text-gold-500 hover:bg-gold-50 dark:hover:bg-gold-500/10 transition-all duration-200"
            aria-label="Close menu"
          >
            <X size={22} strokeWidth={1.75} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-1" role="navigation">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href as any}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200",
                  "animate-slide-in-right",
                  isActive
                    ? "bg-gold-50 dark:bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-200 dark:border-gold-500/20"
                    : "text-charcoal-700 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-charcoal-800 hover:text-gold-500"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-6 border-t border-cream-300 dark:border-charcoal-700 space-y-3">
          {isAuthenticated && user ? (
            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-cream-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-cream-300 font-medium text-sm hover:bg-gold-50 dark:hover:bg-gold-500/10 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
                <span className="text-charcoal text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-charcoal-500 dark:text-cream-500">{user.email}</p>
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-gold text-charcoal font-semibold text-sm hover:opacity-90 transition-opacity duration-200 shadow-gold"
            >
              <User size={16} strokeWidth={2} />
              Login / Register
            </Link>
          )}

          <Link
            href="/reservation"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-gold-400 dark:border-gold-500/40 text-gold-600 dark:text-gold-400 font-semibold text-sm hover:bg-gold-50 dark:hover:bg-gold-500/10 transition-all duration-200"
          >
            <ChefHat size={16} strokeWidth={1.75} />
            Reserve a Table
          </Link>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Navbar (Main Export)
// ─────────────────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const prevScrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(true);

  // Scroll behaviour — glass on scroll + hide on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      // Hide navbar when scrolling down quickly, show when scrolling up
      if (currentScrollY > 80) {
        if (currentScrollY > prevScrollY.current + 5) {
          setIsVisible(false);
        } else if (currentScrollY < prevScrollY.current - 5) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-navbar transition-all duration-300",
          isVisible ? "translate-y-0" : "-translate-y-full",
          isScrolled
            ? "glass-dark shadow-lg border-b border-gold-500/10"
            : "bg-transparent border-b border-transparent"
        )}
        role="banner"
      >
        <div className="container-lumiere">
          <div className="flex items-center justify-between h-18 gap-4">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-7 xl:gap-8"
              role="navigation"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <DesktopNavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isActive={
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href)
                  }
                />
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Cart */}
              <CartButton />

              {/* Auth */}
              <div className="hidden sm:block">
                <AuthButton />
              </div>

              {/* Reservations CTA — desktop only */}
              <Link
                href="/reservation"
                className="hidden xl:flex items-center gap-1.5 px-4 py-2 ml-2 rounded-xl text-sm font-semibold border border-gold-500/50 text-gold-600 dark:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-500/10 hover:border-gold-500 transition-all duration-200"
              >
                <ChefHat size={15} strokeWidth={1.75} />
                Reserve
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-charcoal-700 dark:text-cream-300 hover:text-gold-500 hover:bg-gold-50 dark:hover:bg-gold-500/10 transition-all duration-200 ml-1"
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu size={22} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        pathname={pathname}
      />

      {/* Spacer to prevent content jumping under fixed navbar */}
      <div className="h-18 flex-shrink-0" aria-hidden="true" />
    </>
  );
}
