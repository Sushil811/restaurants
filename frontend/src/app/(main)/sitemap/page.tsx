import Link from 'next/link';

export const metadata = {
  title: 'Sitemap | Lumiere',
  description: 'Sitemap for Lumiere Restaurant.',
};

export default function SitemapPage() {
  const sections = [
    {
      title: 'Main',
      links: [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Our Menu', href: '/menu' },
        { name: 'Reservations', href: '/reservation' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'Reviews', href: '/reviews' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Catering', href: '/catering' },
        { name: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Ordering',
      links: [
        { name: 'Cart', href: '/cart' },
        { name: 'Checkout', href: '/checkout' },
      ],
    },
    {
      title: 'Account',
      links: [
        { name: 'Login', href: '/login' },
        { name: 'Register', href: '/register' },
        { name: 'Profile', href: '/profile' },
        { name: 'My Orders', href: '/orders' },
        { name: 'Favorites', href: '/favorites' },
        { name: 'Loyalty', href: '/loyalty' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'FAQ', href: '/faq' },
      ],
    },
  ];

  return (
    <div className="bg-[#0D0D0D] text-white pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl md:text-5xl text-[#C9A84C] mb-4 text-center">
          Sitemap
        </h1>
        <p className="text-[#F5ECD7]/60 text-center mb-12 text-sm font-sans">
          Find your way around the Lumiere website.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h2 className="font-display text-xl text-white border-b border-[#C9A84C]/30 pb-2">
                {section.title}
              </h2>
              <ul className="space-y-2 font-sans text-sm">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href as any}
                      className="text-neutral-400 hover:text-[#C9A84C] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
