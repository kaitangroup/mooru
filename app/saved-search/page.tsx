'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { wpFetch } from '@/lib/wpApi';
import Link from 'next/link';
import { Heart } from 'lucide-react';

// ---- Helpers (same as search page) ----
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('wpToken');
};

const isLoggedIn = () => !!getToken();

const getGuestSaved = (): number[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('guestSavedExperts');
  return data ? JSON.parse(data) : [];
};

const setGuestSaved = (ids: number[]) => {
  localStorage.setItem('guestSavedExperts', JSON.stringify(ids));
};

// ---- Types ----
type Tutor = {
  id: number;
  name: string;
  avatar: string;
  bio: string;
  subjects: string[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  location: string;
};

// ---- Page ----
export default function SavedExpertsPage() {
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  // 1) Load saved IDs
  useEffect(() => {
    const loadSaved = async () => {
      try {
        if (isLoggedIn()) {
          const data = await wpFetch('/wp-json/guroos/v1/saved-experts');
          setSavedIds(data.data.map((d: any) => Number(d.expert_id)));
        } else {
          setSavedIds(getGuestSaved());
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadSaved();
  }, []);

  // 2) Fetch tutors (based on savedIds)
  useEffect(() => {
    const fetchSavedTutors = async () => {
      if (!savedIds.length) {
        setTutors([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const base = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, '');

        // 👉 If your API supports filtering by IDs (recommended)
        const url = `${base}/wp-json/authorpro/v1/users?ids=${savedIds.join(',')}`;

        const res = await fetch(url);
        const json = await res.json();

        const data = json.users ?? json;

        const mapped: Tutor[] = data.map((u: any) => ({
          id: Number(u.id),
          name: u.name,
          avatar: u.avatar ?? '/default-avatar.png',
          bio: u.description ?? '',
          subjects: Array.isArray(u.subjects)
            ? u.subjects
            : u.subjects
            ? [u.subjects]
            : [],
          hourlyRate: u.hourly_rate ? parseFloat(u.hourly_rate) : 0,
          rating: u.rating ?? 0,
          reviewCount: u.reviewCount ?? 0,
          location: u.location ?? '',
        }));

        const supportsIds = false; // ⚠️ set false for now

let tutorsData = mapped;

if (!supportsIds) {
  tutorsData = mapped.filter(t => savedIds.includes(t.id));
}

setTutors(tutorsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedTutors();
  }, [savedIds]);

  // 3) Toggle save (remove only here)
  const toggleSave = async (expertId: number) => {
    const loggedIn = isLoggedIn();

    if (loggedIn) {
      try {
        await wpFetch('/wp-json/guroos/v1/unsave-expert', {
          method: 'POST',
          body: JSON.stringify({ expert_id: expertId }),
        });
      } catch (err) {
        console.error(err);
        return;
      }
    }

    const updated = savedIds.filter((id) => id !== expertId);
    setSavedIds(updated);

    if (!loggedIn) {
      setGuestSaved(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#28251d]">
      <Header />

      <div className="px-6 py-16 max-w-[1200px] mx-auto">

        {/* HERO */}
        <div className="mb-10">
          <span className="inline-block text-xs font-semibold bg-[#d7e7e5] text-[#01696f] px-3 py-1 rounded-full uppercase tracking-wide">
            Saved
          </span>

          <h1 className="font-[var(--font-display)] text-[clamp(2.2rem,3vw,3rem)] mt-3">
            Your saved experts
          </h1>

          <p className="text-[#6e6a63] mt-2 max-w-[600px]">
            Keep track of experts you’re interested in and come back anytime.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[200px] bg-[#eae8e3] rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && tutors.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#eae8e3] flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 text-[#6e6a63]" />
            </div>

            <h3 className="font-semibold text-lg">
              No saved experts yet
            </h3>

            <p className="text-[#6e6a63] mt-2 mb-6">
              Start exploring and save experts you like.
            </p>

            <Link
              href="/search"
              className="inline-flex items-center justify-center bg-[#01696f] text-white px-6 h-[44px] rounded-full text-sm font-medium hover:bg-[#0c4e54]"
            >
              Browse experts
            </Link>
          </div>
        )}

        {/* GRID */}
        {!loading && tutors.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-sm text-[#6e6a63]">
                        {t.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-[#6e6a63] mt-3 line-clamp-3">
                    {t.bio}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">

                  {/* VIEW */}
                  <Link
                    href={`/tutors/${t.id}`}
                    className="flex-1 inline-flex items-center justify-center bg-[#01696f] text-white h-[40px] rounded-full text-sm font-medium hover:bg-[#0c4e54]"
                  >
                    View profile
                  </Link>

                  {/* REMOVE */}
                  <button
                    onClick={() => toggleSave(t.id)}
                    className="px-4 h-[40px] rounded-full border border-[#01696f] text-[#01696f] text-sm hover:bg-[#01696f] hover:text-white transition"
                  >
                    Saved ✓
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}