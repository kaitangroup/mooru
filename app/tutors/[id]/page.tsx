'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BookingModal } from '@/components/booking/BookingModal';
import { useSession } from 'next-auth/react';

export default function TutorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const abortCtrl = new AbortController();

    async function fetchAuthor() {
      try {
        const base = (process.env.NEXT_PUBLIC_WP_URL ?? '').replace(/\/+$/, '');
        const res = await fetch(
          `${base}/wp-json/custom/v1/author?id=${params.id}`,
          { signal: abortCtrl.signal }
        );
        const json = await res.json();
        setAuthor(json.data ?? json);
      } catch {}
      finally {
        setLoading(false);
      }
    }

    fetchAuthor();
    return () => abortCtrl.abort();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f2]">
        <Header />
        <div className="max-w-[1120px] mx-auto py-12 px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-40 bg-[#eceae5] rounded-xl" />
            <div className="h-60 bg-[#eceae5] rounded-xl" />
            <div className="h-60 bg-[#eceae5] rounded-xl" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-[#f7f6f2]">
        <Header />
        <div className="text-center py-20">
          <h1 className="text-xl font-semibold">Author not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <Header />

      <main className="py-10 px-4">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-[1fr_320px] gap-8">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* PROFILE HEADER */}
            <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-6">
              <div className="flex gap-6 items-start">

                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-24 h-24 rounded-full object-cover border"
                />

                <div className="flex-1">
                  <h1 className="font-[var(--font-display)] text-[clamp(1.8rem,2.5vw,2.8rem)]">
                    {author.name}
                  </h1>

                  <div className="flex flex-wrap gap-4 text-sm text-[#6e6a63] mt-2">
                    <span>{author.average_rating} rating</span>
                    <span>{author.reviews_count} reviews</span>
                    <span>{author.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {author.subjects?.map((s: string) => (
                      <span
                        key={s}
                        className="text-xs bg-[#d7e7e5] text-[#01696f] px-2 py-1 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ABOUT */}
            <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-6">
              <h2 className="font-[var(--font-display)] text-xl mb-3">
                About
              </h2>
              <p className="text-[#6e6a63] leading-relaxed">
                {author.bio}
              </p>
            </div>

            {/* BOOKS */}
            {author.books?.length > 0 && (
              <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-6">
                <h2 className="font-[var(--font-display)] text-xl mb-4">
                  Books
                </h2>

                <div className="space-y-3">
                  {author.books.slice(0, 4).map((book: any) => (
                    <div key={book.id} className="flex gap-3 items-center">
                      {book.featured_image && (
                        <img
                          src={book.featured_image}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{book.title}</p>
                        {book.book_url && (
                          <a
                            href={book.book_url}
                            target="_blank"
                            className="text-sm text-[#01696f] hover:underline"
                          >
                            View book →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXPERIENCE */}
            <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-6">
              <h2 className="font-[var(--font-display)] text-xl mb-4">
                Experience & Education
              </h2>

              <div className="space-y-3 text-[#6e6a63]">
                <p><strong>Education:</strong> {author.education}</p>
                <p><strong>Experience:</strong> {author.teaching_experience}</p>
                <p><strong>Languages:</strong> {author.languages}</p>
              </div>
            </div>

            {/* REVIEWS */}
            <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-6">
              <h2 className="font-[var(--font-display)] text-xl mb-4">
                Reviews ({author.reviews_count})
              </h2>

              {author.reviews?.length > 0 ? (
                <div className="space-y-4">
                  {author.reviews.map((r: any) => (
                    <div key={r.id} className="border-b pb-4 last:border-none">
                      <p className="font-medium">{r.studentName}</p>
                      <p className="text-sm text-[#6e6a63]">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#6e6a63]">No reviews yet</p>
              )}
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-6 sticky top-24">

              <div className="text-center mb-6">
                <div className="text-2xl font-semibold">
                  ${author.hourly_rate}
                  <span className="text-sm text-[#6e6a63]"> / 30 min</span>
                </div>
              </div>

              <button
                className="w-full h-[44px] rounded-full bg-[#01696f] text-white"
                onClick={() => {
                  if (status === 'loading') return;

                  const token = localStorage.getItem('wpToken');
                  if (!token && !session) {
                    router.push(`/auth/user/login?redirect=/tutors/${author.id}`);
                  } else {
                    setShowBookingModal(true);
                  }
                }}
              >
                Book session
              </button>

              <button
                className="w-full h-[44px] mt-3 rounded-full border border-[#d4d1ca]"
                onClick={() => router.push(`/messages?to=${author.id}`)}
              >
                Message
              </button>

            </div>
          </div>

        </div>
      </main>

      {author && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          tutor={author}
        />
      )}

      <Footer />
    </div>
  );
}