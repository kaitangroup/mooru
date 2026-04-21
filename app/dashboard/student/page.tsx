'use client';
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, DollarSign, Calendar, MessageCircle, CreditCard, 
  Clock, Star, Search, Plus
} from 'lucide-react';
import Link from 'next/link';
import { mockBookings, mockMessages } from '@/lib/mockData';
import { AuthorDashboard } from '@/lib/types';
import { RoleGuard } from '@/components/auth/RoleGuard';



// ... baki imports same

type RecentMessage = {
  id: number;
  content: string;
  timestamp: string;
  unread: boolean;
  other_user: {
    id: number;
    name: string;
    avatar: string;
  };
};


export default function StudentDashboard() {
 
  const pendingBookings = mockBookings.filter(booking => booking.status === 'pending');
  const unreadMessages = mockMessages.filter(msg => msg.unread);
  const apiUrl = process.env.NEXT_PUBLIC_WP_URL;

    const [wpToken, setWpToken] = useState<string | null>(null);
    const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [messagesError, setMessagesError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [authorDashboard, setAuthorDashboard] = useState<AuthorDashboard | null>();
  const totalBookings = authorDashboard?.bookings
  ? Object.keys(authorDashboard.bookings).length
  : 0;
  const upcomingBookings = authorDashboard && Array.isArray(authorDashboard.bookings)
  ? authorDashboard.bookings.filter((booking: any) => booking?.status === 'approved')
  : [];

  const toLocalDateTime = (startIso?: string) => {
    if (!startIso) return { date: 'N/A', time: 'N/A' }; // fallback
  
    const d = new Date(startIso); // browser converts from site offset → user local time
  
    const date = d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  
    const time = d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  
    return { date, time };
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('wpToken');
        const res = await fetch(`${apiUrl}wp-json/custom/v1/dashboard-student`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setAuthorDashboard(data);
       
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  // page load hole ekbar localStorage theke wpToken niye asho
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('wpToken');
    setWpToken(token);
    console.log('Dashboard wpToken from localStorage =>', token);
  }, []);



    useEffect(() => {
    const fetchRecentMessages = async () => {
      if (!wpToken || !apiUrl) {
        console.log('No token or apiUrl, skipping fetch');
        return;
      }

      setLoadingMessages(true);
      setMessagesError(null);

      try {
        const res = await fetch(
          `${apiUrl}/wp-json/authorconnect/v1/recent-messages?limit=2`,
          {
            headers: {
              Authorization: `Bearer ${wpToken}`,
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          }
        );

        console.log('recent-messages status =>', res.status);
        const data = await res.json().catch(() => ({}));
        console.log('recent-messages body =>', data);

        if (!res.ok) {
          throw new Error(data?.message || 'Failed to load recent messages');
        }

        setRecentMessages(data.messages || []);
      } catch (e: any) {
        console.error('Recent messages error', e);
        setMessagesError(e.message || 'Failed to load messages');
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchRecentMessages();
  }, [apiUrl, wpToken]);

  return (
    <RoleGuard allowed={['subscriber']} redirectTo="/">
      <div className="min-h-screen bg-[#f7f6f2]">
        <Header />
  
        <div className="py-10 px-4">
          <div className="max-w-[1120px] mx-auto">
  
            {/* HEADER */}
            <div className="mb-8">
  <span className="inline-block text-xs font-semibold bg-[#d7e7e5] text-[#01696f] px-3 py-1 rounded-full uppercase tracking-wide">
    User dashboard
  </span>

  <h1 className="font-[var(--font-display)] text-[clamp(2rem,3vw,3rem)] mt-3">
    Manage your bookings and conversations
  </h1>

  <p className="text-[#6e6a63] mt-2 max-w-[600px]">
    View upcoming sessions, revisit past bookings, message experts, and continue learning — all in one place.
  </p>
</div>
  
            {/* STATS */}
            <div className="grid md:grid-cols-4 gap-6 mb-10">
  {[
    {
      label: 'Total Meetings',
      value: totalBookings,
      sub: 'Sessions booked',
      icon: BookOpen,
    },
    {
      label: 'Upcoming',
      value: upcomingBookings.length,
      sub: 'Scheduled sessions',
      icon: Calendar,
    },
    {
      label: 'Total Spent',
      value: `$${authorDashboard?.total_spent ?? 0}`,
      sub: 'Across all bookings',
      icon: DollarSign,
    },
    {
      label: 'Saved Experts',
      value: authorDashboard?.saved_count ?? 0,
      sub: 'Ready to revisit',
      icon: Star,
    },
  ].map((item, i) => (
    <div
      key={i}
      className="bg-white border border-[#e5e2dc] rounded-2xl p-6 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#f3f7f6] flex items-center justify-center">
          <item.icon className="h-5 w-5 text-[#01696f]" />
        </div>
      </div>

      <div>
        <p className="text-xl font-semibold text-[#28251d]">
          {item.value}
        </p>

        <p className="text-sm text-[#6e6a63] mt-1">
          {item.label}
        </p>

        <p className="text-xs text-[#9ca3af] mt-0.5">
          {item.sub}
        </p>
      </div>
    </div>
  ))}
</div>
  
            <div className="grid lg:grid-cols-[1fr_300px] gap-8">
  
              {/* ================= MAIN ================= */}
              <div className="space-y-6">
  
                {/* UPCOMING */}
                <div className="bg-white border border-[#e5e2dc] rounded-2xl p-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="font-semibold">Upcoming meetings</h2>
                    <Link href="/search" className="text-[#01696f] text-sm">
                      Book new →
                    </Link>
                  </div>
  
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => {
                        const { date, time } = toLocalDateTime(booking.start_iso);
  
                        return (
                          <div
                            key={booking?.appointment_id}
                            className="border border-[#e5e2dc] rounded-lg p-4 flex justify-between"
                          >
                            <div className="flex gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={booking.avatar} />
                                <AvatarFallback>{booking.name}</AvatarFallback>
                              </Avatar>
  
                              <div>
                                <p className="font-medium">
                                  {booking.subject} with {booking.name}
                                </p>
  
                                <p className="text-sm text-[#6e6a63]">
                                  {date} · {time}
                                </p>
  
                                <p className="text-xs text-[#6e6a63]">
                                  {booking.duration} minutes
                                </p>
  
                                <Link
                                  href={booking.video_link ?? "/room/demo"}
                                  className="text-[#01696f] text-sm mt-2 inline-block"
                                >
                                  Join →
                                </Link>
                              </div>
                            </div>
  
                            <div className="text-right">
                              <p className="text-sm">{booking.status}</p>
                              <p className="font-medium">${booking.price}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-[#6e6a63] mb-4">No upcoming meetings</p>
                      <Link href="/search" className="text-[#01696f]">
                        Find an author →
                      </Link>
                    </div>
                  )}
                </div>
  
                {/* ACTIVITY */}
                {/* <div className="bg-white border border-[#e5e2dc] rounded-2xl p-6">
                  <h2 className="font-semibold mb-4">Recent activity</h2>
  
                  <div className="space-y-3 text-sm text-[#6e6a63]">
                    <div>Lesson completed with Sarah Johnson</div>
                    <div>New message received</div>
                    <div>Payment processed</div>
                  </div>
                </div> */}
  
              </div>
  
              {/* ================= SIDEBAR ================= */}
              <div className="space-y-6">
  
{/* QUICK ACTIONS */}
<div className="bg-white border border-[#e5e2dc] rounded-2xl p-5">
  <h3 className="font-semibold text-[#28251d] mb-4">
    Quick actions
  </h3>

  <div className="space-y-3">
    
    <Link
      href="/search"
      className="flex items-center justify-between px-4 h-[44px] rounded-xl border border-[#e5e2dc] bg-[#fbfbf9] hover:bg-white transition"
    >
      <span className="flex items-center gap-2 text-sm font-medium text-[#28251d]">
        🔍 Find Experts
      </span>
      <span className="text-[#9ca3af]">→</span>
    </Link>

    <Link
      href="/messages"
      className="flex items-center justify-between px-4 h-[44px] rounded-xl border border-[#e5e2dc] bg-[#fbfbf9] hover:bg-white transition"
    >
      <span className="flex items-center gap-2 text-sm font-medium text-[#28251d]">
        💬 View Messages
      </span>
      <span className="text-[#9ca3af]">→</span>
    </Link>

    <Link
      href="/saved-search"
      className="flex items-center justify-between px-4 h-[44px] rounded-xl border border-[#e5e2dc] bg-[#fbfbf9] hover:bg-white transition"
    >
      <span className="flex items-center gap-2 text-sm font-medium text-[#28251d]">
        ⭐ Saved Experts
      </span>
      <span className="text-[#9ca3af]">→</span>
    </Link>

    {/* NEW: PAYMENTS */}
    <Link
      href="/user-payments"
      className="flex items-center justify-between px-4 h-[44px] rounded-xl border border-[#e5e2dc] bg-[#fbfbf9] hover:bg-white transition"
    >
      <span className="flex items-center gap-2 text-sm font-medium text-[#28251d]">
        💳 Payments
      </span>
      <span className="text-[#9ca3af]">→</span>
    </Link>

  </div>
</div>
  
                {/* RECENT MESSAGES */}
                <div className="bg-white border border-[#e5e2dc] rounded-2xl p-5">
                  <h3 className="font-semibold mb-4">Recent messages</h3>
  
                  {recentMessages.map((m) => (
                    <div key={m.id} className="flex gap-3 mb-3">
                      <img
                        src={m.other_user.avatar}
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="text-sm">
                        <p className="font-medium">{m.other_user.name}</p>
                        <p className="text-[#6e6a63]">{m.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* FOOTER LINK */}
                  <div className="mt-5">
                    <Link
                      href="/messages"
                      className="text-sm text-[#01696f] hover:underline"
                    >
                      View all messages →
                    </Link>
                  </div>
                </div>

                {/* PAYMENTS */}
<div className="bg-white border border-[#e5e2dc] rounded-2xl p-5">
  <h3 className="font-semibold mb-4">Payments</h3>

  {authorDashboard?.payments?.length > 0 ? (
    authorDashboard?.payments.slice(0, 4).map((p: { id: Key | null | undefined; description: any; date: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; amount: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; status: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | PromiseLikeOfReactNode | null | undefined; }) => (
      <div
        key={p.id}
        className="flex items-center justify-between mb-3 last:mb-0"
      >
        {/* LEFT */}
        <div className="text-sm">
          <p className="font-medium text-[#28251d]">
            {p.description || 'Session payment'}
          </p>
          <p className="text-[#6e6a63] text-xs">
            {p.date}
          </p>
        </div>

        {/* RIGHT */}
        <div className="text-right">
          <p className="text-sm font-semibold text-[#28251d]">
            ${p.amount}
          </p>

          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              p.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : 'bg-[#f3f4f6] text-[#6e6a63]'
            }`}
          >
            {p.status}
          </span>
        </div>
      </div>
    ))
  ) : (
    <p className="text-sm text-[#6e6a63]">
      No payments yet
    </p>
  )}

  {/* FOOTER LINK */}
  <div className="mt-5">
    <Link
      href="/user-payments"
      className="text-sm text-[#01696f] hover:underline"
    >
      View all payments →
    </Link>
  </div>
</div>
  
                {/* PROGRESS */}
                {/* <div className="bg-white border border-[#e5e2dc] rounded-2xl p-5">
                  <h3 className="font-semibold mb-4">Learning progress</h3>
  
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Science Fiction</span>
                        <span>85%</span>
                      </div>
                      <div className="h-2 bg-[#e5e2dc] rounded-full">
                        <div className="h-2 bg-[#01696f] rounded-full w-[85%]" />
                      </div>
                    </div>
  
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Romance</span>
                        <span>72%</span>
                      </div>
                      <div className="h-2 bg-[#e5e2dc] rounded-full">
                        <div className="h-2 bg-[#01696f] rounded-full w-[72%]" />
                      </div>
                    </div>
                  </div>
                </div> */}
  
              </div>
  
            </div>
          </div>
        </div>
  
        <Footer />
      </div>
    </RoleGuard>
  );
}