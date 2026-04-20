"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";

export default function StudentRegisterPage() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_WP_URL;
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: '',
    lastName: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<null | "google" | "apple" | "facebook">(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ WordPress Custom Register REST API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    console.log("📌 Submitting Register Form:", formData);

    try {
      const res = await fetch(`${apiUrl}/wp-json/custom/v1/register`, {
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

  // ✅ Social signup (NextAuth + WP)
  const handleSocialSignup = async (provider: "google" | "apple" | "facebook") => {
    try {
      setSocialLoading(provider);
      console.log("📌 Social Signup with:", provider);
      await signIn(provider, { callbackUrl: "/dashboard/student" });
    } catch (err) {
      console.error("❌ Social signup failed:", err);
      toast.error("Social signup failed");
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] relative">
  
      {/* MINIMAL TOP BAR */}
      <div className="absolute top-0 left-0 w-full px-6 py-5 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">

{/* ICON */}
<div className="w-[42px] h-[42px] rounded-xl bg-[#01696f] flex items-center justify-center shadow-sm">
        <span className="text-white text-[20px] font-bold leading-none">
          G
        </span>
      </div>

{/* TEXT */}
{/* <div className="flex flex-col leading-tight">
  <span className="font-semibold text-[#28251d] text-[18px] tracking-tight">
    Guroos
  </span>
  <span className="text-xs text-[#6e6a63] leading-none">
    Read. Listen. Watch. Ask
  </span>
</div> */}

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
              <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#01696f] to-[#6aa6a3] text-white flex items-center justify-center font-bold">
                  G
                </div>
                <span className="font-semibold">Guroos</span>
              </Link>
              </div>
  
              <span className="inline-block mt-6 text-xs font-bold uppercase tracking-[0.06em] bg-[#d7e7e5] text-[#01696f] px-3 py-1 rounded-full">
                User registration
              </span>
  
              <h1 className="mt-6 font-[var(--font-display)] text-[clamp(2.4rem,4vw,4rem)] leading-[1.05] tracking-[-0.03em] max-w-[10ch]">
                Discover experts and ask better questions.
              </h1>
  
              <p className="mt-5 text-[#6e6a63] max-w-[54ch]">
                Sign up to connect with authors, creators, and experts.
              </p>
  
              <div className="mt-8 space-y-4">
                <div className="p-4 rounded-lg border border-[#e5e2dc] bg-[#fbfbf9]">
                  <strong>Find real experts.</strong> Connect with trusted voices.
                </div>
                <div className="p-4 rounded-lg border border-[#e5e2dc] bg-[#fbfbf9]">
                  <strong>Book instantly.</strong> Simple scheduling.
                </div>
                <div className="p-4 rounded-lg border border-[#e5e2dc] bg-[#fbfbf9]">
                  <strong>Ask anything.</strong> Get real answers.
                </div>
              </div>
            </div>
  
            <p className="text-sm text-[#9a958d] mt-6">
              Create your account in seconds.
            </p>
          </div>
  
          {/* RIGHT FORM */}
          <div className="bg-[#f9f8f5]/90 border border-[#dcd9d5] rounded-2xl p-10 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
  
            <div className="mb-8">
              <h2 className="font-[var(--font-display)] text-[clamp(1.6rem,2.5vw,2.4rem)]">
                Create your account
              </h2>
              <p className="text-[#6e6a63] mt-2">
                Quick signup with minimal details.
              </p>
            </div>
  
            {/* SOCIAL */}
            {/* <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialSignup("google")}
                className="w-full h-[48px] rounded-full border border-[#d4d1ca] bg-[#fbfbf9] flex items-center justify-center"
              >
                Continue with Google
              </button>
            </div> */}
  
            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#dcd9d5]" />
              <span className="text-xs text-[#9a958d]">or</span>
              <div className="flex-1 h-px bg-[#dcd9d5]" />
            </div>
  
            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
  
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="First name"
                  className="h-[52px] px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
                <input
                  placeholder="Last name"
                  className="h-[52px] px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              </div>
  
              <input
                type="email"
                placeholder="Email"
                className="w-full h-[52px] px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
  
              <input
                type="password"
                placeholder="Password"
                className="w-full h-[52px] px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
  
              <button
                type="submit"
                className="w-full h-[48px] rounded-full bg-[#01696f] text-white font-semibold"
                disabled={submitting}
              >
                {submitting ? "Signing up..." : "Create account"}
              </button>
            </form>
  
            {/* LOGIN LINK */}
            <p className="text-sm text-[#6e6a63] mt-6 text-center">
              Already have an account?{" "}
              <Link href="/auth/user/login" className="text-[#01696f] hover:underline">
                Login
              </Link>
            </p>
  
          </div>
  
        </div>
      </div>
    </div>
  );
}

