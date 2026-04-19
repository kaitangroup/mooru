'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchFilters } from '@/components/search/SearchFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import Link from "next/link"; 
import { useSearchParams } from 'next/navigation';
import { TutorCard } from '@/components/tutors/TutorCard';
import { useDebounce } from 'react-use';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';
import { wpFetch } from '@/lib/wpApi';


type Filters = {
  subjects: string[];
  priceRange: [number, number];
  ageRange: [number, number];
  rating: number;
  credentials: {
    backgroundCheck: false;
    ixlCertified: false;
    licensedTeacher: false;
  };
  availability: string;
  instantBook: boolean;
  inPerson: boolean;
};

type WPUser = {
  id: number;
  name: string;
  slug: string;
  roles: string[];
  description?: string;
  avatar?: string;
  hourly_rate?: string;
  subjects?: string[] | string;
  books?: string[] | string;
  education?: string;
  experience?: string;
  availability?: string[] | string;
  teaching_experience?: string;
  languages?: string;
  location?: string;
  rating?: number;
  responseTime?: string;
  reviewCount?: number;
};

type Tutor = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  subjects: string[];
  books?: string[] | string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  location: string;
  responseTime: string;
  availability: string;
  education: string;
  experience: string;
  languages: string[];
  reviews: { reviewer: string; comment: string; rating: number }[];
};



export default function SearchClient() {

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
  const searchParams = useSearchParams();
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    subjects: [],
    priceRange: [0, 100],
    ageRange: [18, 80],
    rating: 0,
    availability: '',
    credentials: {
      backgroundCheck: false,
      ixlCertified: false,
      licensedTeacher: false,
    },
    instantBook: false,
    inPerson: false,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [totalAutors, setTotalAutors] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [savingSearch, setSavingSearch] = useState(false);
  const [searchTypes, setSearchTypes] = useState<string[]>([]);
  const [emailError, setEmailError] = useState('');
  

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setSearchTerm(q);
  }, [searchParams]);

  const decodeHTML = (str: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  };

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  useEffect(() => {
  const abortCtrl = new AbortController();

  async function fetchUsers() {
    setLoading(true);
    try {
      const base = (process.env.NEXT_PUBLIC_WP_URL ?? '').replace(/\/+$/, '');
      const url = `${base}/wp-json/authorpro/v1/users?per_page=6&page=${page}&role=author`;
      const params = new URLSearchParams();

      if (searchTerm) params.append('search', debounceSearchTerm);
      if (filters.subjects.length > 0) {
        filters.subjects.forEach((s) => params.append('subject[]', s));
      }
      params.append('min_rate', String(filters.priceRange[0]));
      params.append('max_rate', String(filters.priceRange[1]));
      params.append('min_age', String(filters.ageRange[0]));
      params.append('max_age', String(filters.ageRange[1]));

      if (filters.rating > 0) params.append('rating', String(filters.rating));
      if (filters.credentials.backgroundCheck) params.append('background_check', '1');
      if (filters.credentials.ixlCertified) params.append('ixl_certified', '1');
      if (filters.credentials.licensedTeacher) params.append('licensed_teacher', '1');
      if (filters.instantBook) params.append('instant_book', '1');
      if (filters.inPerson) params.append('in_person', '1');
      if (filters.availability && filters.availability !== 'any') {
        params.append('availability', filters.availability);
      }

      const fullUrl = url + '&' + params.toString();

      const res = await fetch(fullUrl, { signal: abortCtrl.signal });
      if (!res.ok) {
        throw new Error(`Fetch error ${res.status}`);
      }

      const json = await res.json();
      const data = (json.users ?? json) as WPUser[];
      const totalPagesFromApi = json.total_pages ?? json.total_pages;  // adjust if different
      setTotalAutors(json.total || 0);
      setTotalPages(totalPagesFromApi || 1);

      const mapped: Tutor[] = data.map((u) => ({
        id: String(u.id),
        name: u.name,
        avatar: u.avatar ?? '/default-avatar.png',
        bio: u.description ?? '',
        subjects: Array.isArray(u.subjects)
          ? u.subjects.map((s) => decodeHTML(s))
          : u.subjects
          ? [decodeHTML(u.subjects as string)]
          : [],
        hourlyRate: u.hourly_rate ? parseFloat(u.hourly_rate) : 0,
        // Use backend-returned dynamic rating & reviews if present:
        avg_rating: (u as any).avg_rating ?? undefined,
        total_reviews: (u as any).reviewCount ?? undefined,
        // fallback older fields if needed:
        rating: u.rating ?? 0,
        reviewCount: u.reviewCount ?? 0,

        location: u.location ?? '',
        books: u.books ?? [],
        responseTime: u.responseTime ?? '',
        availability: Array.isArray(u.availability)
          ? u.availability.join(', ')
          : (u.availability as string) ?? '',
        education: u.education ?? '',
        experience: u.experience ?? '',
        languages: u.languages
          ? (u.languages as string).split(',').map((l) => l.trim())
          : [],
        reviews: [],
      }));

      setTutors(mapped);
    } catch (err: any) {
      if (!abortCtrl.signal.aborted) {
        console.error('Error fetching users:', err);
        // Optionally set an error state here
      }
    } finally {
      if (!abortCtrl.signal.aborted) {
        setLoading(false);
      }
    }
  }

  fetchUsers();
  // console.log("API response:", JSON);


  return () => {
    abortCtrl.abort();
  };
}, [debounceSearchTerm, filters, page]);

useEffect(() => {
  const loadSaved = async () => {
    try {
      if (isLoggedIn()) {
        const data = await wpFetch('/wp-json/guroos/v1/saved-experts');

        setSavedIds(
          data.data.map((d: any) => Number(d.expert_id))
        );
      } else {
        setSavedIds(getGuestSaved());
      }
    } catch (err) {
      console.error('Load saved error:', err);
    }
  };

  loadSaved();
}, []);


const toggleSave = async (expertId: number) => {
  const loggedIn = isLoggedIn();
  const isSaved = savedIds.includes(expertId);

  // 🔹 Logged in → API call
  if (loggedIn) {
    const endpoint = isSaved
      ? '/wp-json/guroos/v1/unsave-expert'
      : '/wp-json/guroos/v1/save-expert';

    try {
      await wpFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ expert_id: expertId }),
      });
    } catch (err) {
      console.error('Save API error:', err);
      return;
    }
  }

  // 🔹 Update UI instantly
  const updated = isSaved
    ? savedIds.filter(id => id !== expertId)
    : [...savedIds, expertId];

  setSavedIds(updated);

  // 🔹 Guest → store locally
  if (!loggedIn) {
    setGuestSaved(updated);
  }
};


return (
  <div className="min-h-screen bg-[#f7f6f2]">
    <Header />

    <main className="px-4 py-10">
      <div className="max-w-[1120px] mx-auto">

        {/* HERO (NEW) */}
        <div className="mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.05em] bg-[#d7e7e5] text-[#01696f] px-3 py-1 rounded-full">
            Search and compare
          </span>

          <h1 className="mt-5 font-[var(--font-display)] text-[clamp(2rem,3vw,3.5rem)] max-w-[12ch] leading-[1.05]">
            Find the right expert before you book.
          </h1>

          <p className="mt-4 text-[#6e6a63] max-w-[60ch]">
            Search by topic, author, book, or podcast. Filter results and compare experts before booking.
          </p>
        </div>

        {/* SEARCH SHELL */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">

          {/* SIDEBAR (FIXED STYLE) */}
          <aside className="bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition p-6 shadow-md h-fit sticky top-24">
            <h2 className="font-semibold text-lg">Filters</h2>
            <p className="text-sm text-[#6e6a63] mt-2">
              Refine results without losing context.
            </p>

            <div className="mt-6 space-y-4">
              <SearchFilters
                filters={filters}
                onFiltersChange={(nf) => {
                  setFilters(nf);
                  setPage(1);
                }}
              />
            </div>
          </aside>

          {/* RIGHT SIDE */}
          <div>

            {/* SEARCH BAR (IMPORTANT FIX) */}
            <div className="bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition p-5 shadow-md mb-6">

              <div className="grid md:grid-cols-[1fr_180px_180px_auto] gap-3">

                <input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search experts..."
                  className="h-[48px] px-4 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]"
                />

                <select className="h-[48px] px-3 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]">
                  <option>Best match</option>
                  <option>Lowest price</option>
                </select>

                <select className="h-[48px] px-3 rounded-md border border-[#d4d1ca] bg-[#fbfbf9]">
                  <option>Any availability</option>
                  <option>Today</option>
                </select>

                <button className="h-[48px] px-5 rounded-full bg-[#01696f] text-white font-semibold">
                  Search
                </button>
              </div>
            </div>

            {/* META INFO */}
            <div className="flex justify-between items-center mb-4">

              <div className="text-sm">
                <strong>{totalAutors}</strong>{" "}
                <span className="text-[#6e6a63]">results</span>
              </div>

              <div className="flex gap-2">
              
                <span className="text-xs bg-[#d7e7e5] text-[#01696f] px-2 py-1 rounded-full">
                  Book in 2 steps
                </span>
              </div>
            </div>

            {/* RESULTS */}
            <div className="space-y-4">

            {tutors.map((t) => (
  <div
    key={t.id}
    className="bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition p-6 flex gap-5 justify-between"
  >

    {/* LEFT */}
    <div className="flex gap-4">

      {/* ✅ AVATAR */}
      <img
        src={t.avatar || "/default-avatar.png"}
        alt={t.name}
        className="w-16 h-16 rounded-full object-cover border"
      />

      <div>
        {/* SUBJECT TAGS */}
        <div className="flex flex-wrap gap-2 text-xs mb-2">
          {t.subjects.slice(0, 3).map((s, i) => (
            <span
              key={i}
              className="bg-[#d7e7e5] text-[#01696f] px-2 py-1 rounded-full"
            >
              {s}
            </span>
          ))}
        </div>

        {/* NAME */}
        <h3 className="font-semibold text-lg">{t.name}</h3>

        {/* BIO */}
        <p className="text-sm text-[#6e6a63] mt-1 max-w-[60ch]">
          {t.bio || "Expert in their field."}
        </p>

        {/* META */}
        <div className="flex gap-4 text-sm text-[#6e6a63] mt-2">
          <span>{t.rating} rating</span>
          <span>{t.responseTime || "Fast response"}</span>
          <span>{t.location}</span>
        </div>
      </div>
    </div>

    {/* RIGHT CTA */}
    <div className="flex flex-col items-end gap-3 min-w-[180px]">

      {/* PRICE */}
      <div className="font-semibold text-lg">
        
        ${(Number(t.hourlyRate) / 2).toFixed(2)}
        <span className="text-sm text-gray-500"> / 30 min</span>
      </div>

      {/* VIEW PROFILE (PRIMARY CTA) */}
      <Link
  href={`/tutors/${t.id}`}
  className="inline-flex items-center justify-center whitespace-nowrap bg-[#01696f] hover:bg-[#0c4e54] text-white px-5 h-[40px] rounded-full text-sm font-medium transition"
>
  View profile
</Link>



<button
  onClick={() => toggleSave(Number(t.id))}
  className={`inline-flex items-center gap-2 justify-center whitespace-nowrap px-5 h-[40px] rounded-full text-sm font-medium transition border ${
    savedIds.includes(Number(t.id))
      ? 'bg-[#01696f] text-white border-[#01696f]'
      : 'border-[#01696f] text-[#01696f] hover:bg-[#01696f] hover:text-white'
  }`}
>
  <Heart
    className={`h-4 w-4 ${
      savedIds.includes(Number(t.id)) ? 'fill-white' : ''
    }`}
  />
  {savedIds.includes(Number(t.id)) ? 'Saved' : 'Save'}
</button>

    </div>
  </div>
))}

{/* No results + Save search */}
{!loading && tutors.length === 0 && (
  <div className="bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition p-10 text-center">

    {/* TITLE */}
    <h3 className="font-[var(--font-display)] text-[clamp(1.4rem,2vw,1.8rem)]">
      No results found
    </h3>

    {/* SUBTEXT */}
    <p className="text-[#6e6a63] mt-3 max-w-md mx-auto">
      We couldn’t find any experts for “{searchTerm}”. Try adjusting your filters or search terms.
    </p>

    {/* ACTIONS */}
    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">

      {/* RESET */}
      <button
        onClick={() => {
          setSearchTerm('');
          setFilters({
            subjects: [],
            priceRange: [0, 100],
            ageRange: [18, 80],
            rating: 0,
            availability: '',
            credentials: {
              backgroundCheck: false,
              ixlCertified: false,
              licensedTeacher: false,
            },
            instantBook: false,
            inPerson: false,
          });
        }}
        className="px-5 h-[44px] rounded-full border border-[#d4d1ca] bg-[#fbfbf9] text-sm"
      >
        Reset filters
      </button>

    </div>

    {/* SAVE SEARCH (CLEAN VERSION) */}
    {searchTerm && (
      <div className="mt-8 max-w-md mx-auto text-left">

        <div className="p-5 border border-[#e5e2dc] rounded-lg bg-[#fbfbf9]">
          <p className="font-semibold mb-2">Get notified</p>
          <p className="text-sm text-[#6e6a63] mb-4">
            Save this search and we’ll notify you when experts become available.
          </p>

          <input
            type="email"
            placeholder="Your email address"
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value);
              setEmailError('');
            }}
            className="w-full h-[48px] px-4 rounded-md border border-[#d4d1ca] bg-white mb-3"
          />

          {emailError && (
            <p className="text-red-500 text-xs mb-2">{emailError}</p>
          )}

          <button
            onClick={async () => {
              if (!userEmail) {
                setEmailError('Email is required');
                return;
              }

              setSavingSearch(true);

              try {
                const base = (
                  process.env.NEXT_PUBLIC_WP_URL ?? ''
                ).replace(/\/+$/, '');

                const res = await fetch(
                  `${base}/wp-json/authorpro/v1/save-search`,
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: searchTerm,
                      term: searchTerm,
                      email: userEmail,
                    }),
                  }
                );

                if (!res.ok) throw new Error();

                toast.success('Search saved successfully');
                setUserEmail('');
              } catch {
                toast.error('Failed to save search');
              } finally {
                setSavingSearch(false);
              }
            }}
            className="w-full h-[44px] rounded-full bg-[#01696f] text-white text-sm font-medium"
          >
            {savingSearch ? 'Saving...' : 'Notify me'}
          </button>
        </div>

      </div>
    )}

  </div>
)}

            </div>

            {/* PAGINATION */}
            <div className="flex justify-center gap-4 mt-10">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border rounded-md"
              >
                Previous
              </button>

              <span className="text-[#6e6a63]">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border rounded-md"
              >
                Next
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
);
}
function setSavedIds(arg0: any) {
  throw new Error('Function not implemented.');
}

