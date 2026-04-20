import Link from "next/link";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: "FAQ",
  description: "Find answers to common questions about using Guroos.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  const faqs = [
    {
      q: "What is Guroos?",
      a: "Guroos is a platform that connects you with experts and content creators for meaningful one-on-one conversations.",
    },
    {
      q: "How do I book an expert?",
      a: "You can search for experts, view their profiles, and book a session directly through the platform.",
    },
    {
      q: "Can I message an expert before booking?",
      a: "Yes, you can message experts to ask questions before confirming a booking.",
    },
    {
      q: "How are payments handled?",
      a: "All payments are securely processed through the platform. You can view your transactions in your dashboard.",
    },
    {
      q: "Can I become an expert?",
      a: "Yes, you can apply to join as an expert and start offering sessions to users.",
    },
  ];

  return (

<div className="min-h-screen bg-[#f7f6f2]">
    <Header />

    <main className="px-4 py-10">

      {/* HERO */}
      <section className=" px-4">
        <div className="max-w-[1100px] mx-auto">

          <span className="inline-block text-xs font-semibold tracking-wide uppercase bg-[#d7e7e5] text-[#01696f] px-3 py-1 rounded-full">
            Help center
          </span>

          <h1 className="font-[var(--font-display)] text-[clamp(2.5rem,4vw,3.5rem)] mt-4 leading-tight text-[#28251d] max-w-[700px]">
            Frequently asked questions
          </h1>

          <p className="text-[#6e6a63] mt-4 max-w-[600px] leading-relaxed">
            Find quick answers to common questions about using Guroos.
          </p>

        </div>
      </section>

      {/* FAQ LIST */}
      <section className="px-4 pb-20">
        <div className="max-w-[800px] mx-auto space-y-4">

          {faqs.map((item, i) => (
            <details
              key={i}
              className="group bg-white border border-[#e5e2dc] rounded-2xl p-5 cursor-pointer"
            >
              <summary className="flex justify-between items-center font-medium text-[#28251d] list-none">
                {item.q}

                <span className="text-[#01696f] transition group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="text-[#6e6a63] mt-3 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 border-t border-[#e5e2dc] bg-[#f9f8f5]">
        <div className="max-w-[700px] mx-auto text-center">

          <h2 className="font-[var(--font-display)] text-[28px] mb-4 text-[#28251d]">
            Still have questions?
          </h2>

          <p className="text-[#6e6a63] mb-6">
            Contact our team and we’ll help you get the answers you need.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 h-[44px] rounded-full bg-[#01696f] text-white hover:bg-[#0c4e54] transition"
          >
            Contact support
          </Link>

        </div>
      </section>

    </main>

    <Footer />

    </div>
  );
}