'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.success) {
        toast.success('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: '',
          message: '',
        });
      } else {
        toast.error('Failed to send message.');
      }
    } catch {
      toast.error('Something went wrong.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <Header />

      {/* HERO */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-[800px] mx-auto">
          <h1 className="font-[var(--font-display)] text-[clamp(2.5rem,4vw,4rem)]">
            Get in touch
          </h1>
          <p className="text-[#6e6a63] mt-4">
            We usually respond within a few hours.
          </p>
        </div>
      </section>

      <div className="px-4 pb-20">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-3 gap-10">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-6">
              <h3 className="font-semibold mb-4">Contact</h3>

              <div className="space-y-4 text-sm text-[#6e6a63]">

                <div className="flex gap-3 items-center">
                  <Mail className="w-5 h-5 text-[#01696f]" />
                  <span>rgj@rolandjones.com</span>
                </div>

                <div className="flex gap-3 items-center">
                  <Phone className="w-5 h-5 text-[#01696f]" />
                  <span>(347) 862-9254</span>
                </div>

                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-[#01696f]" />
                  <span>
                    1325 Avenue of the Americas, 28th Floor,<br />
                    New York, NY 10019
                  </span>
                </div>

                <div className="flex gap-3 items-start">
                  <Clock className="w-5 h-5 text-[#01696f]" />
                  <span>
                    Mon–Fri: 9:00–6:00<br />
                    Sat–Sun: 10:00–4:00
                  </span>
                </div>

              </div>
            </div>

            <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-6">
              <h3 className="font-semibold mb-3">Quick help</h3>

              <ul className="text-sm text-[#6e6a63] space-y-2">
                <li>• How do I book a session?</li>
                <li>• How do payments work?</li>
                <li>• Can I reschedule?</li>
                <li>• How do I become an expert?</li>
              </ul>

              <Link
                href="/faq"
                className="inline-block mt-4 text-[#01696f] text-sm hover:underline"
              >
                Visit FAQ →
              </Link>
            </div>

          </div>

          {/* FORM */}
          <div className="lg:col-span-2 bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-8">

            <h2 className="font-[var(--font-display)] text-2xl mb-6">
              Send a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full name *"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="h-[48px] px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
                />

                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="h-[48px] px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="h-[48px] px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
                >
                  <option value="">Select category</option>
                  <option value="general">General Inquiry</option>
                  <option value="student-support">Student Support</option>
                  <option value="tutor-support">Expert Support</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership</option>
                </select>

                <input
                  type="text"
                  placeholder="Subject *"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                  className="h-[48px] px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
                />
              </div>

              <textarea
                placeholder="Your message *"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
              />

              <button
                type="submit"
                className="w-full h-[48px] rounded-full bg-[#01696f] text-white font-medium hover:bg-[#0c4e54]"
              >
                Send message
              </button>

            </form>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}