'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Search, BookOpen, MessageCircle, Star, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { Cormorant_Garamond } from "next/font/google";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <Header />
      {/* HERO SECTION */}
{/* HERO SECTION */}
<section className="py-24 px-4 bg-[#f7f6f2]">
  <div className="max-w-[1120px] mx-auto grid md:grid-cols-[1.15fr_0.85fr] gap-16 items-center">

    {/* LEFT */}
    <div>
      <span className=" eyebrow inline-block text-xs font-semibold tracking-wide uppercase bg-[#d7e7e5] text-[#01696f] px-4 py-1.5 rounded-full">
        Private video sessions with experts
      </span>

      <h1 className="mt-6">
        Book time with the experts behind the ideas.
      </h1>

      <p className="mt-6 text-gray-600 max-w-xl text-base">
        When a book, podcast, or video leaves you with real questions, you should be able to ask the person who made it.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button className=" btn bg-[#01696f] hover:bg-[#0c4e54] text-white rounded-full px-6">
          Find an expert
        </Button>

        <Button variant="outline" className=" btn rounded-full px-6 border-[#d4d1ca]">
          Become an expert
        </Button>
      </div>

      <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-500">
        <span>One-on-one video calls</span>
        <span>Experts join free</span>
        <span>Transparent user booking fee</span>
      </div>
    </div>

    {/* RIGHT CARD */}
    <div className="relative">
  
  {/* Glow */}
  <div className="absolute -bottom-20 -right-20 w-[220px] h-[220px] rounded-full bg-[#01696f]/10 blur-xl" />

  {/* Card */}
  <div className="relative bg-[#f9f8f5] border border-[#dcd9d5] rounded-2xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">


        <div className="border border-[#e5e2dc] rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="all-bold-text-1 font-semibold">Dr. Maya Bennett</h4>
              <p className="text-sm text-gray-500">
                Expert, host, and policy expert
              </p>
            </div>
            <span className="all-bold-text-1 font-semibold">$120 / 30 min</span>
          </div>

          <p className="text-sm text-gray-600 mt-3">
            Best for follow-up questions after a book, podcast episode,
            interview, or lecture.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-5">
          <div className="border border-[#e5e2dc] rounded-lg p-4 text-sm">
            <strong className='all-bold-text'>85%</strong>
            <p className="text-gray-500">
              of session price goes directly to the expert
            </p>
          </div>

          <div className="border border-[#e5e2dc] rounded-lg p-4 text-sm">
            <strong className='all-bold-text'>+ fee</strong>
            <p className="text-gray-500">
              Small platform charge paid by the user
            </p>
          </div>
        </div>

      </div>
    </div>

  </div>
</section>

{/* HOW IT WORKS */}
<section className="py-20 px-4 bg-[#f7f6f2]">
  <div className="max-w-[1120px] mx-auto">

    {/* Header */}
    <div className="mb-12">
      <h2 className="text-[clamp(1.6rem,2.5vw,2.4rem)] font-[var(--font-display)] tracking-[-0.03em] max-w-[14ch]">
        How it works
      </h2>

    </div>

    {/* Steps */}
    <div className="grid md:grid-cols-3 gap-6">

      {/* Step 1 */}
      <div className="p-6 border border-[#dcd9d5] rounded-xl bg-[#f9f8f5]">
        <div className="w-8 h-8 rounded-full bg-[#d7e7e5] text-[#01696f] flex items-center justify-center text-xs font-bold mb-4">
          1
        </div>
        <h4 className="all-bold-text font-semibold">Choose an expert</h4>
        <p className="text-sm text-[#6e6a63] mt-2">
          Browse experts by topic, book, podcast, or video and find the right person.
        </p>
      </div>

      {/* Step 2 */}
      <div className="p-6 border border-[#dcd9d5] rounded-xl bg-[#f9f8f5]">
        <div className="w-8 h-8 rounded-full bg-[#d7e7e5] text-[#01696f] flex items-center justify-center text-xs font-bold mb-4">
          2
        </div>
        <h4 className="all-bold-text font-semibold">Book a time</h4>
        <p className="text-sm text-[#6e6a63] mt-2">
          Pick a slot, review pricing, and confirm your session with transparent checkout.
        </p>
      </div>

      {/* Step 3 */}
      <div className="p-6 border border-[#dcd9d5] rounded-xl bg-[#f9f8f5]">
        <div className="w-8 h-8 rounded-full bg-[#d7e7e5] text-[#01696f] flex items-center justify-center text-xs font-bold mb-4">
          3
        </div>
        <h4 className="all-bold-text font-semibold">Meet face to face</h4>
        <p className="text-sm text-[#6e6a63] mt-2">
          Join a private video call and get direct answers from the expert.
        </p>
      </div>

    </div>

  </div>
</section>
 
<section className="py-20 px-4 bg-[#f7f6f2]">
  <div className="max-w-[1120px] mx-auto grid md:grid-cols-2 gap-12">
    
    <div>
      <h2 className="text-3xl font-serif mb-4">Why users book</h2>
    
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="p-6 border border-[#e5e2dc] rounded-xl bg-[#f9f8f5]">
          <h4 className="all-bold-text all-bold-text font-semibold mb-2">Clarity</h4>
          <p className="text-sm text-gray-600">
          Move beyond notes and highlights. Get direct answers from the people behind the ideas.
          </p>
        </div>

        <div className="p-6 border border-[#e5e2dc] rounded-xl bg-[#f9f8f5]">
          <h4 className="all-bold-text font-semibold mb-2">Access</h4>
          <p className="text-sm text-gray-600">
            Reach the expert directly instead of waiting.
          </p>
        </div>

        <div className="p-6 border border-[#e5e2dc] rounded-xl bg-[#f9f8f5]">
          <h4 className="all-bold-text font-semibold mb-2">Depth</h4>
          <p className="text-sm text-gray-600">
            Turn ideas into real conversations.
          </p>
        </div>
      </div>
    </div>

    {/* Pricing Card */}
    <div className="bg-[#f9f8f5] border border-[#e5e2dc] rounded-2xl p-8">
      <span className="text-xs uppercase tracking-wide text-[#01696f] bg-[#d7e7e5] px-3 py-1 rounded-full">
        Simple pricing
      </span>

      <h4 className="all-bold-text mt-4 font-semibold">
        You pay for access, the expert gets paid for insight.
      </h4>

      <p className="text-gray-600 mt-3">
        Users pay the expert’s rate plus a small platform fee.
      </p>

      <ul className="mt-5 text-gray-600 space-y-2 text-sm">
        <li>• No subscriptions required</li>
        <li>• No sign-up fee for experts</li>
        <li>• Transparent checkout</li>
      </ul>

      <div className="mt-6">
        <Button className="bg-[#01696f] hover:bg-[#0c4e54] text-white rounded-full">
          See common questions
        </Button>
      </div>
    </div>

  </div>
</section>

<section className="py-20 px-4 bg-[#f7f6f2]">
  <div className="max-w-[1120px] mx-auto">
    
    <h2 className="text-3xl font-serif mb-6">Why experts join</h2>


    <div className="  grid md:grid-cols-2 gap-6">
      {[
        "Free to join",
        "Earn from your expertise",
        "Keep control",
        "We handle logistics",
      ].map((title, i) => (
        <div key={i} className="p-6 border border-[#e5e2dc] rounded-xl bg-[#f9f8f5]">
          <h4 className="all-bold-text font-semibold">{title}</h4>
          <p className="text-sm text-gray-600 mt-2">
            Set your availability, pricing, and focus on conversations.
          </p>
        </div>
      ))}
    </div>

  </div>
</section>

<section className="py-20 px-4 bg-[#f7f6f2]">
  <div className="max-w-[1120px] mx-auto">

    <h2 className="text-3xl font-serif mb-6">Common questions</h2>


    <div className="grid md:grid-cols-2 gap-6">
      {[
        "Who is this for?",
        "How do experts get paid?",
        "Can experts set their own rates?",
        "Is the video call private?",
      ].map((q, i) => (
        <div key={i} className="p-6 border border-[#e5e2dc] rounded-xl bg-[#f9f8f5]">
          <h4 className="all-bold-text-1 font-semibold">{q}</h4>
          <p className="text-sm text-gray-600 mt-2">
            Direct one-on-one conversations with experts.
          </p>
        </div>
      ))}
    </div>

  </div>
</section>

<section className="py-20 px-4">
  <div className="max-w-[1120px] mx-auto">

    <div className="bg-[#01696f] text-white rounded-2xl p-10 flex flex-col md:flex-row justify-between items-center gap-6">
      
      <div>
        <h2 className="text-3xl font-serif max-w-md">
          A better way to ask better questions.
        </h2>
        <p className="text-white/80 mt-3">
          Give users direct access to insight.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/auth/author/register">
        <Button className="btn-join-as-an-expert bg-white text-[#01696f] rounded-full">
          Join as an expert
        </Button>
        </Link>

         <Link href="/auth/user/register">
        <Button variant="outline" className=" btn-book-an-expert border-white text-white rounded-full">
          Book an expert
        </Button>
        </Link>
      </div>

    </div>

  </div>
</section>
     

      <Footer />
    </div>
  );
}
