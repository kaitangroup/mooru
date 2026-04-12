import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#28251d]">
      <Header />

      {/* HERO */}
      <section className="px-6 py-20 border-b border-[#e5e2dc]">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-[#6b665d] mb-4">
            Effective Date: April 12, 2026
          </p>

          <h1 className="text-5xl md:text-6xl font-serif leading-tight tracking-tight">
            Terms of Use
          </h1>

          <p className="mt-6 text-lg text-[#6b665d] leading-relaxed">
            These Terms govern your use of Guroos. Please read them carefully before using the platform.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto space-y-14">

          {/* 1 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              By using Guroos, you agree to these Terms and our Privacy Policy.
              If you do not agree, you may not access or use the Service.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              2. Description of Service
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              Guroos connects readers with authors through live video sessions.
              We provide the platform but do not guarantee outcomes or endorse participants.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              3. Eligibility
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              You must be at least 18 years old and legally capable of entering
              into binding agreements.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              4. Accounts & Security
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-[#4b463f]">
              <li>You are responsible for your account credentials</li>
              <li>Provide accurate information</li>
              <li>Notify us of unauthorized access</li>
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              5. User Roles
            </h2>

            <div className="space-y-4 text-[#4b463f]">
              <p><strong>Readers:</strong> Book sessions and interact with authors.</p>
              <p><strong>Authors:</strong> Provide sessions and set pricing.</p>
            </div>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              6. Payments & Fees
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-[#4b463f]">
              <li>Payments are processed via third-party providers</li>
              <li>Fees are displayed at booking</li>
              <li>Refunds follow platform policy</li>
            </ul>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              7. Prohibited Activities
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-[#4b463f]">
              <li>Harassment or abuse</li>
              <li>Illegal or harmful content</li>
              <li>Impersonation</li>
              <li>System misuse or scraping</li>
            </ul>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              8. Sessions & Recording
            </h2>
            <p className="text-[#4b463f] leading-relaxed mb-4">
              Sessions may be recorded for quality, safety, and support purposes.
              By continuing participation, you consent to recording.
            </p>

            <ul className="list-disc pl-6 space-y-3 text-[#4b463f]">
              <li>Unauthorized recording is prohibited</li>
              <li>Users must comply with applicable laws</li>
            </ul>
          </div>

          {/* 9 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              9. Intellectual Property
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              All platform content and branding belong to Guroos or its licensors.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              10. Disclaimers
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              The Service is provided “as is” without warranties. We do not guarantee
              results or session quality.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              11. Limitation of Liability
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              Guroos is not liable for indirect damages or losses arising from platform use.
            </p>
          </div>

          {/* 12 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              12. Termination
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              We may suspend or terminate accounts that violate these Terms.
            </p>
          </div>

          {/* 13 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              13. Changes to Terms
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              Continued use after updates means acceptance of revised Terms.
            </p>
          </div>

          {/* 14 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              14. Governing Law
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              These Terms are governed by the laws of Delaware, USA.
            </p>
          </div>

          {/* 15 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              15. Contact
            </h2>

            <div className="bg-white border border-[#e5e2dc] rounded-xl p-6 text-[#4b463f]">
              <p>Email: support@guroos.net</p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}