import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#28251d]">
      <Header />

      {/* HERO */}
      <section className="px-6 py-20 border-b border-[#e5e2dc]">
        <div className="max-w-[1120px] mx-auto">
          <span className="inline-block text-xs font-semibold tracking-wide uppercase bg-[#d7e7e5] text-[#01696f] px-3 py-1 rounded-full">
            Privacy Policy
          </span>

          <h1 className="mt-5 font-[var(--font-display)] text-[clamp(2rem,3vw,3.5rem)] max-w-[700px] leading-[1.05]">
            Privacy Policy
          </h1>

          <p className="text-[#6e6a63] mt-4 max-w-[600px] text-base leading-relaxed">
            This Privacy Policy explains how Guroos collects, uses, and protects
            your information when you use our platform.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 py-16">
        <div className="max-w-[1120px] mx-auto space-y-14">

          {/* SECTION */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              1. Introduction
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              Guroos (“we”, “us”, or “our”) collects and processes information
              to provide a seamless experience connecting users with experts.
              By using our Service, you agree to this Privacy Policy.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              2. Information We Collect
            </h2>

            <div className="space-y-6 text-[#4b463f]">

              <div>
                <h3 className="font-medium mb-2">Account Information</h3>
                <p>
                  Name, email, profile details, and login credentials.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Session Data</h3>
                <p>
                  Booking details, conversations, and interactions on the platform.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Usage Data</h3>
                <p>
                  Pages visited, features used, and general interaction data.
                </p>
              </div>

            </div>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              3. How We Use Information
            </h2>

            <ul className="space-y-3 text-[#4b463f] list-disc pl-6">
              <li>Provide and maintain the Service</li>
              <li>Process bookings and payments</li>
              <li>Improve user experience</li>
              <li>Communicate updates and support</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              4. Sessions & Communication
            </h2>

            <p className="text-[#4b463f] leading-relaxed">
              Sessions may include audio, video, and messaging. Some sessions may
              be recorded for safety and quality purposes. Users will be notified
              when recording is active.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              5. Data Security
            </h2>

            <p className="text-[#4b463f] leading-relaxed">
              We implement appropriate safeguards to protect your data, but no
              system is completely secure.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              6. Your Rights
            </h2>

            <ul className="space-y-3 text-[#4b463f] list-disc pl-6">
              <li>Access your data</li>
              <li>Request corrections</li>
              <li>Request deletion</li>
              <li>Withdraw consent</li>
            </ul>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              7. Contact Us
            </h2>

            <div className="bg-white border border-[#e5e2dc] rounded-xl p-6 text-[#4b463f]">
              <p>Email: support@guroos.com</p>
            
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}