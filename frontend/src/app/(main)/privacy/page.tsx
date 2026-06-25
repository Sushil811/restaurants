import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Lumiere',
  description: 'Privacy Policy and data handling practices for Lumiere Restaurant.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#0D0D0D] text-white pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl md:text-5xl text-[#C9A84C] mb-8 text-center">
          Privacy Policy
        </h1>
        <div className="text-sm text-[#F5ECD7]/70 text-center mb-12">
          Last Updated: {new Date().toLocaleDateString()}
        </div>

        <div className="space-y-8 text-neutral-300 leading-relaxed font-sans">
          <section className="space-y-4">
            <h2 className="font-display text-2xl text-white">1. Information We Collect</h2>
            <p>
              At Lumiere, we respect your privacy and are committed to protecting your personal data. We collect information you provide directly to us when you make a reservation, place an order online, sign up for our newsletter, or contact us. This may include your name, email address, phone number, dietary preferences, and payment information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl text-white">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and manage your reservations and online orders.</li>
              <li>Communicate with you regarding your bookings, orders, or inquiries.</li>
              <li>Send you marketing communications, such as newsletters and special offers (if you have opted in).</li>
              <li>Improve our website, services, and overall dining experience.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl text-white">3. Information Sharing</h2>
            <p>
              We do not sell or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, processing payments, or delivering services to you, provided they agree to keep this information confidential.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl text-white">4. Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl text-white">5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. If you wish to exercise these rights or have any questions about our privacy practices, please contact us using the information provided below.
            </p>
          </section>

          <section className="space-y-4 pt-8 border-t border-[#C9A84C]/20">
            <h2 className="font-display text-2xl text-white">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <br />
              <strong>Lumiere Restaurant</strong><br />
              123 Rue de la Lumiere, Paris, France<br />
              Email: privacy@lumiere.com<br />
              Phone: +33 1 23 45 67 89
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
