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
  }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    zipCode: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // Strong password: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return true;
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

  return (
    <div className="min-h-screen bg-[#f7f6f2] relative">
  
      {/* MINIMAL TOP BAR */}
      <div className="absolute top-0 left-0 w-full px-6 py-5 flex justify-between items-center">
        
        {/* LOGO → Guroos */}
        <div className="w-[40px] h-[40px] rounded-lg bg-[#01696f] flex items-center justify-center shadow-sm">
  <svg
    width="22"
    height="22"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 32C20 26 25 22 32 22C36 22 40 24 42 28"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M32 32H44V40"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
</div>
  
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#01696f] to-[#6aa6a3] text-white flex items-center justify-center font-bold">
                  G
                </div>
                <span className="font-semibold">Guroos</span>
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
          <input className="w-full h-[52px] mt-2 px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]" placeholder="https://www.amazon.com/..." />
        </div>

        <div>
          <label className="text-sm font-medium">
            YouTube video link <span className="text-[#9a958d]">(optional)</span>
          </label>
          <input className="w-full h-[52px] mt-2 px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]" placeholder="https://www.youtube.com/..." />
        </div>

        <div>
          <label className="text-sm font-medium">
            Apple Podcasts link <span className="text-[#9a958d]">(optional)</span>
          </label>
          <input className="w-full h-[52px] mt-2 px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]" placeholder="https://podcasts.apple.com/..." />
        </div>
      </div>
    </div>

    {/* CONSENT (MISSING BEFORE) */}
    <div className="flex items-start gap-3 p-4 rounded-lg bg-[#f3f2ee] border border-[#e5e2dc]">
      <input
        type="checkbox"
        className="mt-1 accent-[#01696f]"
        checked={formData.agreeToTerms}
        onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
      />
      <span className="text-sm">
        I agree to the User Agreement <span className="text-[#01696f]">*</span>
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
        type="reset"
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
    </div>
  );
}