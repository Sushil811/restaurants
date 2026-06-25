import React from 'react';

export const metadata = {
  title: 'Terms of Service | Lumiere',
  description: 'Terms of Service for Lumiere Restaurant.',
};

export default function TermsPage() {
  return (
    <div className="bg-[#0D0D0D] text-white pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl md:text-5xl text-[#C9A84C] mb-8 text-center">
          Terms of Service
        </h1>
        <div className="text-sm text-[#F5ECD7]/70 text-center mb-12">
          Last Updated: {new Date().toLocaleDateString()}
        </div>

        <div className="space-y-8 text-neutral-300 leading-relaxed font-sans">
          <section className="space-y-4">
            <h2 className="font-display text-2xl text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Lumiere website (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl text-white">2. Reservations and Policies</h2>
            <p>
              Reservations are subject to availability. We kindly request that you notify us at least 24 hours in advance if you need to cancel or modify your reservation. For large parties or special events, a deposit may be required. We reserve the right to cancel reservations at our discretion.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl text-white">3. Online Ordering</h2>
            <p>
              All online orders are subject to acceptance by Lumiere. Prices and availability of menu items are subject to change without notice. Payment is required at the time of ordering. We strive to fulfill orders promptly, but delivery and pickup times are estimates and not guaranteed.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl text-white">4. Intellectual Property</h2>
            <p>
              All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Lumiere and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without our express written permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl text-white">5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Lumiere shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service. Our total liability to you for any claims arising from your use of the Service shall not exceed the amount you paid us for the applicable service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl text-white">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Any changes will be effective immediately upon posting on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms of Service.
            </p>
          </section>

          <section className="space-y-4 pt-8 border-t border-[#C9A84C]/20">
            <h2 className="font-display text-2xl text-white">Contact Information</h2>
            <p>
              If you have any questions or concerns about these Terms of Service, please contact us at:
              <br />
              <br />
              <strong>Lumiere Restaurant</strong><br />
              123 Rue de la Lumiere, Paris, France<br />
              Email: legal@lumiere.com<br />
              Phone: +33 1 23 45 67 89
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
