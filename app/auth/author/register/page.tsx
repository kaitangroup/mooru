'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

export default function TutorRegisterPage() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_WP_URL;
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    zipCode: string;
    agreeToTerms: boolean;
    amazonLink: string;
    youtubeLink: string;
    podcastLink: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    zipCode: '',
    agreeToTerms: false,
    amazonLink: '',
    youtubeLink: '',
    podcastLink: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);


  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // Strong password: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return true;
  };

  const handleAgreementToggle = () => {
    if (formData.agreeToTerms) {
      // already agreed → uncheck
      setFormData((prev) => ({ ...prev, agreeToTerms: false }));
    } else {
      // not agreed → open modal (do NOT check yet)
      setShowTerms(true);
      setHasScrolled(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    
    // Reset errors
    setErrors({ email: '', password: '', confirmPassword: '' });
    
    let hasErrors = false;
    const newErrors = { email: '', password: '', confirmPassword: '' };

    // Validate email
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      hasErrors = true;
    }

    // Validate password
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
      hasErrors = true;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${apiUrl}/wp-json/custom/v1/register-author`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("📌 API Response:", data);

      if (!res.ok || !data.success) {
        toast.error(data?.message || "Signup failed");
      } else {
        toast.success("🎉 Signup successful! Please log in.");
        router.push("/auth/user/login");
      }
    } catch (err) {
      console.error("❌ Signup Error:", err);
      toast.error("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  

  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific error when user starts typing
    if (field === 'email' && errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
    if (field === 'password' && errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
    if (field === 'confirmPassword' && errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      zipCode: '',
      agreeToTerms: false,
      amazonLink: '',
      youtubeLink: '',
      podcastLink: '',
    });
  
    setErrors({
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] relative">
  
      {/* MINIMAL TOP BAR */}
      <div className="absolute top-0 left-0 w-full px-6 py-5 flex justify-between items-center">
        
        {/* LOGO → Guroos */}
        <Link href="/" className="flex items-center gap-3">
        <div className="w-[42px] h-[42px] rounded-xl bg-[#01696f] flex items-center justify-center shadow-sm">
        <span className="text-white text-[20px] font-bold leading-none">
          G
        </span>
      </div>
</Link>
  
        {/* BACK LINK */}
        <Link
          href="/"
          className="text-sm text-[#6e6a63] hover:text-[#28251d] transition"
        >
          ← Back to home
        </Link>
      </div>
  
      {/* MAIN CONTENT */}
      <div className="flex items-center justify-center min-h-screen px-4 py-10">
        <div className="w-full max-w-[1080px] grid md:grid-cols-[0.95fr_1.05fr] gap-8">
  
          {/* LEFT PANEL */}
          <div className="bg-[#f9f8f5]/90 border border-[#dcd9d5] rounded-2xl p-10 shadow-[0_18px_50px_rgba(0,0,0,0.08)] flex flex-col justify-between">
  
            <div>
              {/* BRAND */}
              <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#01696f] to-[#6aa6a3] text-white flex items-center justify-center font-bold">
                  G
                </div>
                <span className="font-semibold">Guroos</span>
                </Link>
              </div>
  
              {/* EYEBROW */}
              <span className="inline-block mt-6 text-xs font-bold uppercase tracking-[0.06em] bg-[#d7e7e5] text-[#01696f] px-3 py-1 rounded-full">
                Expert registration
              </span>
  
              {/* TITLE */}
              <h1 className="mt-6 font-[var(--font-display)] text-[clamp(2.4rem,4vw,4rem)] leading-[1.05] tracking-[-0.03em] max-w-[10ch]">
                Join Guroos and start taking questions.
              </h1>
  
              {/* DESCRIPTION */}
              <p className="mt-5 text-[#6e6a63] max-w-[54ch]">
                Keep it simple. Add your name, email, and links to the content people already know you for.
              </p>
  
              {/* BENEFITS */}
              <div className="mt-8 space-y-4">
                <div className="p-4 rounded-lg border border-[#e5e2dc] bg-[#fbfbf9]">
                  <strong>Free to join.</strong> Users pay when they book you.
                </div>
                <div className="p-4 rounded-lg border border-[#e5e2dc] bg-[#fbfbf9]">
                  <strong>Fast setup.</strong> No long profile required.
                </div>
                <div className="p-4 rounded-lg border border-[#e5e2dc] bg-[#fbfbf9]">
                  <strong>One link is enough.</strong> Start with a single content link.
                </div>
              </div>
            </div>
  
            <p className="text-sm text-[#9a958d] mt-6">
              You can update your profile later.
            </p>
          </div>
  
          {/* RIGHT FORM */}
          <div className="bg-[#f9f8f5]/90 border border-[#dcd9d5] rounded-2xl p-10 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">

  {/* HEADER */}
  <div className="flex justify-between items-start mb-8">
    <div>
      <h2 className="font-[var(--font-display)] text-[clamp(1.6rem,2.5vw,2.4rem)]">
        Create your expert profile
      </h2>
      <p className="text-[#6e6a63] mt-2">
        Only the essentials are required.
      </p>
    </div>
  </div>

  {/* FORM */}
  <form onSubmit={handleSubmit} className="space-y-5">

    {/* FULL NAME */}
    <div className="space-y-2">
      <label className="text-sm font-semibold">
        Full name <span className="text-[#01696f]">*</span>
      </label>
      <input
        type="text"
        placeholder="Jane Smith"
        className="w-full h-[52px] px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9] focus:outline-none focus:ring-2 focus:ring-[#01696f]/30"
        value={formData.firstName}
        onChange={(e) => handleInputChange("firstName", e.target.value)}
      />
    </div>

    {/* EMAIL */}
    <div className="space-y-2">
      <label className="text-sm font-semibold">
        Email <span className="text-[#01696f]">*</span>
      </label>
      <input
        type="email"
        placeholder="jane@example.com"
        className="w-full h-[52px] px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
      />
    </div>

    {/* PASSWORD */}
<div className="space-y-2">
  <label className="text-sm font-semibold">
    Password <span className="text-[#01696f]">*</span>
  </label>
  <input
    type="password"
    placeholder="Enter your password"
    className="w-full h-[52px] px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
    value={formData.password}
    onChange={(e) => handleInputChange("password", e.target.value)}
  />
  {errors.password && (
    <p className="text-xs text-red-500">{errors.password}</p>
  )}
</div>

{/* CONFIRM PASSWORD */}
<div className="space-y-2">
  <label className="text-sm font-semibold">
    Confirm password <span className="text-[#01696f]">*</span>
  </label>
  <input
    type="password"
    placeholder="Confirm your password"
    className="w-full h-[52px] px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
    value={formData.confirmPassword}
    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
  />
  {errors.confirmPassword && (
    <p className="text-xs text-red-500">{errors.confirmPassword}</p>
  )}
</div>

    {/* CONTENT LINKS GROUP (IMPORTANT FIX) */}
    <div className="p-5 rounded-lg border border-[#e5e2dc] bg-[#fbfbf9]">
      <h3 className="font-semibold text-lg mb-2">Content links</h3>
      <p className="text-sm text-[#6e6a63] mb-4">
        Add any links that show your work.
      </p>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">
            Amazon book link <span className="text-[#9a958d]">(optional)</span>
          </label>
          <input
            className="w-full h-[52px] mt-2 px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
            placeholder="https://www.amazon.com/..."
            value={formData.amazonLink}
            onChange={(e) => handleInputChange("amazonLink", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            YouTube video link <span className="text-[#9a958d]">(optional)</span>
          </label>
          <input
            className="w-full h-[52px] mt-2 px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
            placeholder="https://www.youtube.com/..."
            value={formData.youtubeLink}
            onChange={(e) => handleInputChange("youtubeLink", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Apple Podcasts link <span className="text-[#9a958d]">(optional)</span>
          </label>
          <input
            className="w-full h-[52px] mt-2 px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
            placeholder="https://podcasts.apple.com/..."
            value={formData.podcastLink}
            onChange={(e) => handleInputChange("podcastLink", e.target.value)}
          />
        </div>
      </div>
    </div>

    {/* User agreement */}
    <div className="flex items-start gap-2 text-sm">
  <input
    type="checkbox"
    checked={formData.agreeToTerms}
    onChange={handleAgreementToggle}
    className="mt-1 cursor-pointer"
  />

  <span>
    I agree to the{" "}
    <button
      type="button"
      onClick={() => {
        setShowTerms(true);
        setHasScrolled(false);
      }}
      className="text-[#01696f] underline"
    >
      User Agreement
    </button>
  </span>
</div>

    {/* BUTTONS (IMPORTANT DIFFERENCE) */}
    <div className="flex gap-3">
      <button
        type="submit"
        className="flex-1 h-[48px] rounded-full bg-[#01696f] text-white font-semibold"
        disabled={submitting}
      >
        {submitting ? "Signing up..." : "Register as expert"}
      </button>

      <button
  type="button"
  onClick={resetForm}
  className="flex-1 h-[48px] rounded-full border border-[#d4d1ca] bg-[#f9f8f5]"
>
  Clear form
</button>
    </div>

  </form>

  {/* FOOTNOTE */}
  <p className="text-xs text-[#9a958d] mt-6">
    Required fields are marked clearly to reduce errors.
  </p>

</div>
  
        </div>
      </div>

      {showTerms && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">

    <div className="bg-white rounded-2xl max-w-[700px] w-full max-h-[80vh] flex flex-col">

      {/* HEADER */}
      <div className="p-5 border-b border-[#e5e2dc]">
        <h2 className="font-semibold text-lg">User Agreement</h2>
      </div>

      {/* SCROLL CONTENT */}
      <div
        className="p-5 overflow-y-auto text-sm text-[#6e6a63] leading-relaxed"
        onScroll={(e) => {
          const el = e.currentTarget;
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
            setHasScrolled(true);
          }
        }}
      >
        {/* LONG CONTENT */}
        <section className="px-6 py-5 border-b border-[#e5e2dc]">
        <div className="max-w-[1120px] mx-auto">
        {!hasScrolled && (
  <p className="text-xs text-gray-400 mt-2">
    Scroll to the bottom to enable agreement
  </p>
)}
        <span className="inline-block text-xs font-semibold tracking-wide uppercase bg-[#d7e7e5] text-[#01696f] px-3 py-1 rounded-full">
          Terms of Use
        </span>

          <h1 className="mt-5 font-[var(--font-display)] text-[clamp(2rem,3vw,3.5rem)] max-w-[700px] leading-[1.05]">
            Terms of Use
          </h1>

        

          <p className="text-[#6e6a63] mt-4 max-w-[600px] text-base leading-relaxed">
            These Terms govern your use of Guroos.net. Please read them carefully before using the platform.
          </p>
        </div>
      </section>



      {/* CONTENT */}
      <section className="px-6 py-16">
        <div className="max-w-[1120px] mx-auto space-y-14">

          {/* 1 */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              By using Guroos, you agree to these Terms and our Privacy Policy.
              If you do not agree, you may not access or use the Service.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              2. Description of Service
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              Guroos connects readers with Experts through live video sessions.
              We provide the platform but do not guarantee outcomes or endorse participants.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              3. Eligibility
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              You must be at least 18 years old and legally capable of entering
              into binding agreements.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
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
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              5. User Roles
            </h2>

            <div className="space-y-4 text-[#4b463f]">
              <p><strong>Readers:</strong> Book sessions and interact with Experts.</p>
              <p><strong>Experts:</strong> Provide sessions and set pricing.</p>
            </div>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
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
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
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
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
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
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              9. Intellectual Property
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              All platform content and branding belong to Guroos or its licensors.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              10. Disclaimers
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              The Service is provided “as is” without warranties. We do not guarantee
              results or session quality.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              11. Limitation of Liability
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              Guroos is not liable for indirect damages or losses arising from platform use.
            </p>
          </div>

          {/* 12 */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              12. Termination
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              We may suspend or terminate accounts that violate these Terms.
            </p>
          </div>

          {/* 13 */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              13. Changes to Terms
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              Continued use after updates means acceptance of revised Terms.
            </p>
          </div>

          {/* 14 */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              14. Governing Law
            </h2>
            <p className="text-[#4b463f] leading-relaxed">
              These Terms are governed by the laws of Delaware, USA.
            </p>
          </div>

          {/* 15 */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif leading-tight tracking-tight mb-4">
              15. Contact
            </h2>

            <div className="bg-white border border-[#e5e2dc] rounded-xl p-6 text-[#4b463f]">
              <p>Email: support@guroos.net</p>
            </div>
          </div>

        </div>
      </section>

      </div>

      {/* FOOTER */}
      <div className="p-5 border-t border-[#e5e2dc] flex justify-end gap-3">

        <button
          onClick={() => setShowTerms(false)}
          className="px-4 py-2 text-sm"
        >
          Cancel
        </button>

        <button
  disabled={!hasScrolled}
  onClick={() => {
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: true, // single source of truth
    }));
    setShowTerms(false);
  }}
  className={`px-5 py-2 rounded-full text-white ${
    hasScrolled ? "bg-[#01696f]" : "bg-gray-300 cursor-not-allowed"
  }`}
>
  I Agree
</button>

      </div>
    </div>
  </div>
)}
    </div>

    
  );
}