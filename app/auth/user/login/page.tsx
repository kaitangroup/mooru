"use client";

import { useEffect, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { toast } from "sonner";
// import { useRouter } from "next/navigation";
import { useRouter, useSearchParams } from "next/navigation"; // ⬅️ added useSearchParams

// social icons
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";

export default function StudentLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect"); // ⬅️ jekhane theke esecho
  const apiUrl = process.env.NEXT_PUBLIC_WP_URL;

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<null | "google" | "apple" | "facebook">(null);


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem("wpToken");
  
    if (!token) return;
  
    // if user already logged in → redirect away from login page
    const checkProfile = async () => {
      try {
        const res = await fetch(`${apiUrl}wp-json/custom/v1/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const profile = await res.json();
  
        if (!res.ok) return;
  
        // save in localStorage for Header use
        localStorage.setItem("wpUserdata", JSON.stringify(profile));
  
        if (profile.role === "author") {
          if (profile.profile_completed == "100") {
            router.replace("/dashboard/author");
          } else {
            router.replace("/apply");
          }
        } else if (profile.role === "subscriber" || profile.role === "student") {
          router.replace("/dashboard/student");
        } else {
          router.replace("/");
        }
      } catch (e) {
        console.error("Auto-redirect failed:", e);
      }
    };
  
    checkProfile();
  }, []);
  

  // ✅ Social Login (NextAuth + WP API)
  // const handleSocialLogin = async (provider: "google" | "apple" | "facebook") => {
  //   try {
  //     setSocialLoading(provider);
  //     console.log("🔹 Social Login Start:", provider);
  
  //     // NextAuth signIn (no redirect yet)
  //     await signIn(provider, { callbackUrl: "/dashboard/student" });


  
  
  //   } catch (err) {
  //     console.error(`❌ Login with ${provider} failed:`, err);
  //     toast.error(`Login with ${provider} failed`);
  //   } finally {
  //     setSocialLoading(null);
  //   }
  // };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      setSocialLoading(provider);
  
      // FULL REDIRECT FLOW
      await signIn(provider, {
        callbackUrl: "/auth/social/callback", // We will process everything here
      });
  
    } catch (err) {
      console.error("Social login error:", err);
      toast.error("Login failed");
    } finally {
      setSocialLoading(null);
    }
  };
  
  
  
  

  // ✅ WordPress Username/Password Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${apiUrl}wp-json/jwt-auth/v1/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json();
      console.log("🔹 WP JWT Login Response:", data);

      if (!res.ok) {
        toast.error(
          <div dangerouslySetInnerHTML={{ __html: data?.message || "Login failed" }} />
        );
      } else {
        localStorage.setItem("wpToken", data.token);
        localStorage.setItem("wpUser", data.user_display_name || formData.username);
        const token = data.token;
        const response = await fetch(`${apiUrl}wp-json/custom/v1/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
       
        const profiledata = await response.json();
        if (!response.ok) {
          toast.error(profiledata?.message || "Login failed");
          console.log("❌ Profile Fetch Error:", profiledata);
        } 
        
        localStorage.setItem("wpUserdata",  JSON.stringify(profiledata));
        toast.success("Login successful!");
        if(profiledata.role == 'author'){
          console.log("profiledata.profile_completed",profiledata.profile_completed);
          if(profiledata.profile_completed == '100'){
            router.push("/dashboard/author");
          
          }else{
            router.push("/apply");
          
          }
          
        }else{
          router.push("/dashboard/student");
        }

        if(redirect){
          router.push(redirect);
        }
        
      }
    } catch (err) {
      console.error("❌ WP JWT Error:", err);
      toast.error("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] relative">
  
      {/* MINIMAL TOP BAR */}
      <div className="absolute top-0 left-0 w-full px-6 py-5 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-3">
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
</Link>
  
        <Link href="/" className="text-sm text-[#6e6a63] hover:text-[#28251d]">
          ← Back to home
        </Link>
      </div>
  
      {/* MAIN */}
      <div className="flex items-center justify-center min-h-screen px-4 py-10">
        <div className="w-full max-w-[1080px] grid md:grid-cols-[0.95fr_1.05fr] gap-8">
  
          {/* LEFT PANEL */}
          <div className="bg-[#f9f8f5]/90 border border-[#dcd9d5] rounded-2xl p-10 shadow-[0_18px_50px_rgba(0,0,0,0.08)] flex flex-col justify-between">
  
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#01696f] to-[#6aa6a3] text-white flex items-center justify-center font-bold">
                  G
                </div>
                <span className="font-semibold">Guroos</span>
              </div>
  
              <span className="inline-block mt-6 text-xs font-bold uppercase tracking-[0.06em] bg-[#d7e7e5] text-[#01696f] px-3 py-1 rounded-full">
                Welcome back
              </span>
  
              <h1 className="mt-6 font-[var(--font-display)] text-[clamp(2.4rem,4vw,4rem)] leading-[1.05] tracking-[-0.03em] max-w-[10ch]">
                Continue your conversations.
              </h1>
  
              <p className="mt-5 text-[#6e6a63] max-w-[54ch]">
                Log in to connect with experts, book sessions, and ask meaningful questions.
              </p>
  
              <div className="mt-8 space-y-4">
                <div className="p-4 rounded-lg border border-[#e5e2dc] bg-[#fbfbf9]">
                  <strong>Access your sessions.</strong> Continue where you left off.
                </div>
                <div className="p-4 rounded-lg border border-[#e5e2dc] bg-[#fbfbf9]">
                  <strong>Reconnect with experts.</strong> Build ongoing conversations.
                </div>
                <div className="p-4 rounded-lg border border-[#e5e2dc] bg-[#fbfbf9]">
                  <strong>Discover more insights.</strong> Keep learning and exploring.
                </div>
              </div>
            </div>
  
            <p className="text-sm text-[#9a958d] mt-6">
              Your knowledge journey continues here.
            </p>
          </div>
  
          {/* RIGHT PANEL */}
          <div className="bg-[#f9f8f5]/90 border border-[#dcd9d5] rounded-2xl p-10 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
  
            <div className="mb-8">
              <h2 className="font-[var(--font-display)] text-[clamp(1.6rem,2.5vw,2.4rem)]">
                Log in to your account
              </h2>
              <p className="text-[#6e6a63] mt-2">
                Enter your credentials to continue.
              </p>
            </div>
  
            {/* SOCIAL LOGIN */}
            {/* <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialLogin("google")}
                className="w-full h-[48px] rounded-full border border-[#d4d1ca] bg-[#fbfbf9] flex items-center justify-center"
                disabled={!!socialLoading}
              >
                {socialLoading === "google" ? "Please wait…" : "Continue with Google"}
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
  
              <div className="space-y-2">
                <label className="text-sm font-semibold">Username</label>
                <input
                  type="text"
                  className="w-full h-[52px] px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                />
              </div>
  
              <div className="space-y-2">
                <label className="text-sm font-semibold">Password</label>
                <input
                  type="password"
                  className="w-full h-[52px] px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
              </div>
  
              <button
                type="submit"
                className="w-full h-[48px] rounded-full bg-[#01696f] text-white font-semibold"
                disabled={submitting}
              >
                {submitting ? "Signing in..." : "Log in"}
              </button>
  
            </form>
  
            {/* LINKS */}
            <div className="mt-6 text-sm text-center space-y-2">
              <Link href="/auth/forgot-password" className="text-[#01696f] hover:underline">
                Forgot password?
              </Link>
  
              <div className="text-[#6e6a63]">
                Don’t have an account?{" "}
                <Link href="/auth/user/register" className="text-[#01696f] hover:underline">
                  Sign up
                </Link>
              </div>
            </div>
  
          </div>
  
        </div>
      </div>
    </div>
  );
}






