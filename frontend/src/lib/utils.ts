import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ─────────────────────────────────────────────────────────────────────────────
// cn — Merge Tailwind classes safely
// ─────────────────────────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────────────────────────────────────
// formatPrice — Format a numeric amount to a locale currency string
// ─────────────────────────────────────────────────────────────────────────────
export function formatPrice(
  amount: number,
  currency: string = "INR",
  locale: string = "en-IN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ─────────────────────────────────────────────────────────────────────────────
// formatDate — Human-readable date formatting
// ─────────────────────────────────────────────────────────────────────────────
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-IN", options).format(dateObj);
}

// ─────────────────────────────────────────────────────────────────────────────
// formatDateTime — Date + time combined
// ─────────────────────────────────────────────────────────────────────────────
export function formatDateTime(date: Date | string): string {
  return formatDate(date, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// formatRelativeTime — "2 hours ago", "3 days ago", etc.
// ─────────────────────────────────────────────────────────────────────────────
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;
  return `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`;
}

// ─────────────────────────────────────────────────────────────────────────────
// getInitials — Extract initials from a name for avatar display
// ─────────────────────────────────────────────────────────────────────────────
export function getInitials(name: string): string {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// slugify — Convert a string to a URL-safe slug
// ─────────────────────────────────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD") // decompose accented chars
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^\w\s-]/g, "") // remove non-word chars
    .replace(/[\s_-]+/g, "-") // replace spaces/underscores/hyphens with single dash
    .replace(/^-+|-+$/g, ""); // strip leading/trailing dashes
}

// ─────────────────────────────────────────────────────────────────────────────
// truncate — Shorten a string to a maximum length with ellipsis
// ─────────────────────────────────────────────────────────────────────────────
export function truncate(str: string, length: number): string {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "…";
}

// ─────────────────────────────────────────────────────────────────────────────
// calculateReadTime — Estimate reading time for a block of content
// ─────────────────────────────────────────────────────────────────────────────
export function calculateReadTime(content: string, wordsPerMinute: number = 225): string {
  if (!content) return "1 min read";
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// ─────────────────────────────────────────────────────────────────────────────
// generateStars — Build an array representing star values for a rating display
// Each element is: 'full' | 'half' | 'empty'
// ─────────────────────────────────────────────────────────────────────────────
export type StarType = "full" | "half" | "empty";

export function generateStars(rating: number, total: number = 5): StarType[] {
  const clampedRating = Math.min(Math.max(rating, 0), total);
  return Array.from({ length: total }, (_, i) => {
    const position = i + 1;
    if (clampedRating >= position) return "full";
    if (clampedRating >= position - 0.5) return "half";
    return "empty";
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// formatOrderNumber — Format order number with hash prefix
// ─────────────────────────────────────────────────────────────────────────────
export function formatOrderNumber(orderNumber: string | number): string {
  return `#${String(orderNumber).padStart(6, "0")}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// isValidEmail — Simple email validation
// ─────────────────────────────────────────────────────────────────────────────
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─────────────────────────────────────────────────────────────────────────────
// isValidPhone — Simple Indian phone number validation
// ─────────────────────────────────────────────────────────────────────────────
export function isValidPhone(phone: string): boolean {
  return /^(\+91[\-\s]?)?[6-9]\d{9}$/.test(phone.replace(/\s/g, ""));
}

// ─────────────────────────────────────────────────────────────────────────────
// clamp — Clamp a number between min and max
// ─────────────────────────────────────────────────────────────────────────────
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ─────────────────────────────────────────────────────────────────────────────
// debounce — Debounce a function call
// ─────────────────────────────────────────────────────────────────────────────
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// throttle — Throttle a function call
// ─────────────────────────────────────────────────────────────────────────────
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// generateConfirmationCode — Random alphanumeric confirmation code
// ─────────────────────────────────────────────────────────────────────────────
export function generateConfirmationCode(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

// ─────────────────────────────────────────────────────────────────────────────
// getRatingLabel — Convert numeric rating to label
// ─────────────────────────────────────────────────────────────────────────────
export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return "Exceptional";
  if (rating >= 4.0) return "Excellent";
  if (rating >= 3.5) return "Very Good";
  if (rating >= 3.0) return "Good";
  if (rating >= 2.0) return "Fair";
  return "Poor";
}

// ─────────────────────────────────────────────────────────────────────────────
// parseQueryString — Parse a URL query string into an object
// ─────────────────────────────────────────────────────────────────────────────
export function parseQueryString(query: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(query));
}

// ─────────────────────────────────────────────────────────────────────────────
// buildQueryString — Build a URL query string from an object
// ─────────────────────────────────────────────────────────────────────────────
export function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  ) as [string, string][];
  return new URLSearchParams(filtered).toString();
}

// ─────────────────────────────────────────────────────────────────────────────
// capitalize — Capitalize first letter of each word
// ─────────────────────────────────────────────────────────────────────────────
export function capitalize(str: string): string {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
}

// ─────────────────────────────────────────────────────────────────────────────
// groupBy — Group an array of objects by a key
// ─────────────────────────────────────────────────────────────────────────────
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) result[groupKey] = [];
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

// ─────────────────────────────────────────────────────────────────────────────
// copyToClipboard — Copy text to clipboard with fallback
// ─────────────────────────────────────────────────────────────────────────────
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getColorForStatus — Map order/reservation status to Tailwind color classes
// ─────────────────────────────────────────────────────────────────────────────
export function getStatusColor(status: string): {
  bg: string;
  text: string;
  border: string;
} {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    pending: {
      bg: "bg-warning-50",
      text: "text-warning-600",
      border: "border-warning-500",
    },
    confirmed: {
      bg: "bg-success-50",
      text: "text-success-600",
      border: "border-success-500",
    },
    preparing: {
      bg: "bg-info-50",
      text: "text-info-600",
      border: "border-info-500",
    },
    ready: {
      bg: "bg-success-50",
      text: "text-success-700",
      border: "border-success-500",
    },
    delivered: {
      bg: "bg-success-50",
      text: "text-success-600",
      border: "border-success-500",
    },
    cancelled: {
      bg: "bg-danger-50",
      text: "text-danger-600",
      border: "border-danger-500",
    },
    default: {
      bg: "bg-charcoal-100",
      text: "text-charcoal-600",
      border: "border-charcoal-300",
    },
  };
  return map[status.toLowerCase()] ?? map["default"];
}
