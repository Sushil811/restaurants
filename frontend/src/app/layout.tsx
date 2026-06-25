import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";

// ─────────────────────────────────────────────────────────────────────────────
// Fonts
// ─────────────────────────────────────────────────────────────────────────────
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

// ─────────────────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://lumiere.restaurant"
  ),
  title: {
    default: "Lumiere — A Michelin-Inspired Fine Dining Experience",
    template: "Lumiere | %s",
  },
  description:
    "Experience culinary artistry at Lumiere — Hyderabad's premier fine dining destination. Exquisite cuisine, impeccable service, and an unforgettable ambiance await you.",
  keywords: [
    "Lumiere restaurant",
    "fine dining Hyderabad",
    "Michelin star restaurant",
    "luxury restaurant",
    "French cuisine",
    "Banjara Hills restaurant",
    "fine dining",
    "tasting menu",
    "chef's table",
    "restaurant reservations",
  ],
  authors: [{ name: "Lumiere Restaurant" }],
  creator: "Lumiere Restaurant",
  publisher: "Lumiere Restaurant",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://lumiere.restaurant",
    siteName: "Lumiere Restaurant",
    title: "Lumiere — A Michelin-Inspired Fine Dining Experience",
    description:
      "Experience culinary artistry at Lumiere — Hyderabad's premier fine dining destination.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lumiere Fine Dining Restaurant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumiere — Fine Dining Restaurant",
    description:
      "Experience culinary artistry at Lumiere — Hyderabad's premier fine dining destination.",
    images: ["/og-image.jpg"],
    creator: "@lumiererestaurant",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://lumiere.restaurant",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Viewport
// ─────────────────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ─────────────────────────────────────────────────────────────────────────────
// Root Layout
// ─────────────────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="font-sans antialiased bg-white dark:bg-charcoal text-charcoal-950 dark:text-cream transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="lumiere_theme"
        >
          <ReactQueryProvider>
            {/* Skip to content — accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-gold-500 focus:text-charcoal focus:rounded-lg focus:font-semibold focus:text-sm"
            >
              Skip to main content
            </a>

            {/* Navigation */}
            <Navbar />

            {/* Cart Drawer */}
            <CartDrawer />

            {/* Main Content */}
            <main id="main-content" className="min-h-screen">
              {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Toast Notifications */}
            <Toaster
              position="bottom-right"
              reverseOrder={false}
              gutter={12}
              containerStyle={{
                bottom: "1.5rem",
                right: "1.5rem",
              }}
              toastOptions={{
                duration: 4000,
                style: {
                  background: "var(--bg-card)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "0.75rem",
                  boxShadow: "var(--shadow-lg)",
                  fontSize: "0.875rem",
                  fontFamily: "Inter, sans-serif",
                  padding: "0.875rem 1.25rem",
                  maxWidth: "380px",
                },
                success: {
                  iconTheme: {
                    primary: "#c9a84c",
                    secondary: "#0d0d0d",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#ffffff",
                  },
                },
              }}
            />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
