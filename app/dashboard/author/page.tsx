'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  MessageCircle,
  Clock,
  Star,
  TrendingUp,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { AuthorDashboard } from '@/lib/types';

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

export default function TutorDashboard() {
  const [loading, setLoading] = useState(true);
  const [authorDashboard, setAuthorDashboard] = useState<AuthorDashboard | null>(null);

  const [wpToken, setWpToken] = useState<string | null>(null);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  const unreadMessages = recentMessages.filter((message) => message.unread);

  const apiUrl = process.env.NEXT_PUBLIC_WP_URL;

  const totalEarnings = authorDashboard?.totalEarnings || 0;
  const monthlyEarnings = authorDashboard?.totalEarnings || 0;
  const totalStudents = authorDashboard?.totalStudents || 0;
  const averageRating = authorDashboard?.averageRating || 0;

  const upcomingBookings =
    authorDashboard?.bookings?.filter((b: any) => b?.status === 'approved') || [];

  const pendingBookings =
    authorDashboard?.bookings?.filter((b: any) => b?.status === 'completed') || [];

  const toLocalDateTime = (startIso?: string) => {
    if (!startIso) return { date: 'N/A', time: 'N/A' };
    const d = new Date(startIso);

    return {
      date: d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: d.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  // Dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('wpToken');

        const res = await fetch(`${apiUrl}wp-json/custom/v1/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setAuthorDashboard(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // token
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setWpToken(localStorage.getItem('wpToken'));
  }, []);

  // messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!wpToken || !apiUrl) return;

      setLoadingMessages(true);
      try {
        const res = await fetch(
          `${apiUrl}/wp-json/authorconnect/v1/recent-messages?limit=2`,
          {
            headers: { Authorization: `Bearer ${wpToken}` },
          }
        );

        const data = await res.json();
        setRecentMessages(data.messages || []);
      } catch (e: any) {
        setMessagesError(e.message);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [wpToken, apiUrl]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-[#6e6a63]">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] py-10 px-4">
      <div className="max-w-[1120px] mx-auto">

        {/* HEADER */}
               {/* HERO */}
               <div className="mb-8">
          <span className="inline-block text-xs font-semibold bg-[#d7e7e5] text-[#01696f] px-3 py-1 rounded-full uppercase tracking-wide">
            Expert dashboard
          </span>
  
          <h1 className="mt-5 font-[var(--font-display)] text-[clamp(2rem,3vw,3.5rem)] max-w-[700px] leading-[1.05]">
            Manage your sessions, availability, and earnings
          </h1>
  
          <p className="text-[#6e6a63] mt-2 max-w-[600px]">
            Everything you need to operate smoothly — bookings, messages, payouts, and profile.
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
  {[
    {
      label: 'Clients',
      value: totalStudents,
      sub: 'People you helped',
      icon: Users,
    },
    {
      label: 'This month',
      value: `$${monthlyEarnings}`,
      sub: 'Earnings this month',
      icon: DollarSign,
    },
    {
      label: 'Upcoming',
      value: upcomingBookings.length,
      sub: 'Sessions scheduled',
      icon: Calendar,
    },
    {
      label: 'Lifetime',
      value: `$${authorDashboard?.totalEarningsLifetime ?? 0}`,
      sub: 'Total earnings',
      icon: DollarSign
    }
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

        <p className="text-xs text-gray-400 mt-0.5">
          {item.sub}
        </p>
      </div>
    </div>
  ))}
</div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">

          {/* MAIN */}
          <div className="space-y-6">

            {/* UPCOMING */}
            <div className="bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition p-6">
              <h2 className="font-semibold mb-4">Upcoming meetings</h2>

              {upcomingBookings.length === 0 ? (
                <p className="text-[#6e6a63]">No upcoming meetings</p>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((b: any) => {
                    const { date, time } = toLocalDateTime(b.start_iso);

                    return (
                      <div key={b.appointment_id} className="border border-[#e5e2dc] rounded-lg p-4 flex justify-between">
                        <div>
                          <p className="font-medium">{b.subject} with {b.name}</p>
                          <p className="text-sm text-[#6e6a63]">{date} · {time}</p>
                          <p className="text-xs text-[#6e6a63]">{b.duration} min</p>

                          <Link href={b.video_link || '/'} className="text-[#01696f] text-sm mt-2 inline-block">
                            Join →
                          </Link>
                        </div>

                        <div className="text-right">
                          <p className="text-sm">{b.status}</p>
                          <p className="font-medium">${b.price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* COMPLETED */}
            {pendingBookings.length > 0 && (
              <div className="bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition p-6">
                <h2 className="font-semibold mb-4">Completed meetings</h2>

                <div className="space-y-4">
                  {pendingBookings.map((b: any) => {
                    const { date, time } = toLocalDateTime(b.start_iso);

                    return (
                      <div key={b.appointment_id} className="border border-[#e5e2dc] rounded-lg p-4 flex justify-between">
                        <div>
                          <p className="font-medium">{b.subject} with {b.name}</p>
                          <p className="text-sm text-[#6e6a63]">{date} · {time}</p>
                        </div>
                        <p className="font-medium">${b.price}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* BOOKS */}
            {(authorDashboard?.books ?? []).length > 0 && (
              <div className="bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition p-6">
                <div className="flex justify-between mb-4">
                  <h2 className="font-semibold">Books</h2>
                  <Link href="/books" className="text-[#01696f] text-sm">
                    Manage →
                  </Link>
                </div>

                <div className="space-y-3">
                  {authorDashboard?.books.slice(0, 4).map((book: any) => (
                    <div key={book.id} className="flex justify-between border border-[#e5e2dc] rounded-lg p-3">
                      <span>{book.title}</span>
                      <a href={book.book_url} target="_blank" className="text-[#01696f] text-sm">
                        View →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EARNINGS */}
            <div className="bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition p-6 text-center">
              <TrendingUp className="mx-auto text-[#a8a29e]" />
              <p className="text-[#6e6a63]">Total earnings</p>
              <p className="text-xl font-semibold">{`$${authorDashboard?.totalEarningsLifetime ?? 0}`}</p>
            </div>

          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">

            {/* ACTIONS */}
     {/* Quick Actions */}
     <div className="bg-white border border-[#e5e2dc] rounded-2xl p-5 shadow-sm">
  <h3 className="font-semibold mb-4">Quick actions</h3>

  <div className="space-y-2">
    {[
      { label: 'Manage books', icon: '📅', href: '/books' },
      { label: 'View messages', icon: '💬', href: '/messages' },
      { label: 'Edit profile', icon: '⚙️', href: '/profile/edit' },
      { label: 'Earnings', icon: '💰', href: '/dashboard/author/earnings' },
      { label: 'Payout settings', icon: '🏦', href: '/dashboard/author/payout-settings' },
    ].map((item, i) => (
      <Link
        key={i}
        href={item.href}
        className="flex items-center gap-3 px-4 h-[42px] rounded-lg border border-[#ece9e4] hover:bg-[#f9f8f5] transition text-sm"
      >
        <span>{item.icon}</span>
        {item.label}
      </Link>
    ))}
  </div>
</div>

            {/* MESSAGES */}
          {/* Recent Messages */}
<div className="bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition p-5">

{/* HEADER */}
<h3 className="font-semibold text-[#28251d] mb-4">
  Recent messages
</h3>

{/* LOADING */}
{loadingMessages && (
  <p className="text-sm text-[#6e6a63]">Loading messages...</p>
)}

{/* ERROR */}
{!loadingMessages && messagesError && (
  <p className="text-sm text-red-600">{messagesError}</p>
)}

{/* EMPTY */}
{!loadingMessages && !messagesError && recentMessages.length === 0 && (
  <div className="text-center py-6">

    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2f1]">
      <MessageCircle className="h-5 w-5 text-[#a8a29e]" />
    </div>

    <p className="text-sm font-medium text-[#28251d]">
      No messages yet
    </p>

    <p className="mt-1 text-xs text-[#6e6a63]">
      When users contact you, messages will appear here.
    </p>
  </div>
)}

{/* LIST */}
{!loadingMessages && !messagesError && recentMessages.length > 0 && (
  <div className="space-y-3">
    {recentMessages.map((message) => (
      <div
        key={message.id}
        className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#fbfbf9] transition"
      >

        {/* AVATAR */}
        <div className="relative">
          <img
            src={message.other_user.avatar}
            alt={message.other_user.name}
            className="h-10 w-10 rounded-full object-cover border border-[#e5e2dc]"
          />

          {/* UNREAD DOT (overlay) */}
          {message.unread && (
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-[#01696f] rounded-full border-2 border-white"></span>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">

          {/* NAME */}
          <p className="text-sm font-medium text-[#28251d]">
            {message.other_user.name}
          </p>

          {/* MESSAGE */}
          <p className="text-xs text-[#6e6a63] mt-0.5 truncate">
            {message.content}
          </p>

          {/* TIME */}
          <p className="text-[11px] text-[#a8a29e] mt-1">
            {message.timestamp}
          </p>
        </div>
      </div>
    ))}
  </div>
)}

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

          </div>

        </div>
      </div>
    </div>
  );
}