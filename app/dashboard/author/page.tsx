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
        <div className="mb-10">
          <h1 className="font-[var(--font-display)] text-[clamp(2rem,3vw,3rem)]">
            Your dashboard
          </h1>
          <p className="text-[#6e6a63] mt-2">
            Manage sessions, books, messages and earnings.
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-5 mb-10">
          {[
            { label: 'Students', value: totalStudents, icon: Users },
            { label: 'This month', value: `$${monthlyEarnings}`, icon: DollarSign },
            { label: 'Upcoming', value: upcomingBookings.length, icon: Calendar },
            { label: 'Rating', value: averageRating, icon: Star },
          ].map((item, i) => (
            <div key={i} className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-5 flex gap-3">
              <item.icon className="h-5 w-5 text-[#01696f]" />
              <div>
                <p className="font-semibold">{item.value}</p>
                <p className="text-sm text-[#6e6a63]">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">

          {/* MAIN */}
          <div className="space-y-6">

            {/* UPCOMING */}
            <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-6">
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
              <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-6">
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
              <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-6">
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
            <div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-6 text-center">
              <TrendingUp className="mx-auto text-[#a8a29e]" />
              <p className="text-[#6e6a63]">Total earnings</p>
              <p className="text-xl font-semibold">${totalEarnings}</p>
            </div>

          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">

            {/* ACTIONS */}
     {/* Quick Actions */}
<div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-5">

{/* HEADER */}
<h3 className="font-semibold text-[#28251d] mb-4">
  Quick actions
</h3>

<div className="space-y-2">

  {/* MANAGE BOOKS */}
  <Link
    href="/books"
    className="flex items-center gap-3 px-3 h-[42px] rounded-lg border border-[#e5e2dc] bg-white hover:bg-[#f3f2ef] transition"
  >
    <Calendar className="h-4 w-4 text-[#6e6a63]" />
    <span className="text-sm text-[#28251d]">Manage books</span>
  </Link>

  {/* MESSAGES */}
  <Link
    href="/messages"
    className="flex items-center gap-3 px-3 h-[42px] rounded-lg border border-[#e5e2dc] bg-white hover:bg-[#f3f2ef] transition"
  >
    <MessageCircle className="h-4 w-4 text-[#6e6a63]" />
    <span className="text-sm text-[#28251d]">View messages</span>

    {unreadMessages.length > 0 && (
      <span className="ml-auto text-xs px-2 py-[2px] rounded-full bg-[#01696f] text-white">
        {unreadMessages.length}
      </span>
    )}
  </Link>

  {/* EDIT PROFILE */}
  <Link
    href="/profile/edit"
    className="flex items-center gap-3 px-3 h-[42px] rounded-lg border border-[#e5e2dc] bg-white hover:bg-[#f3f2ef] transition"
  >
    <Settings className="h-4 w-4 text-[#6e6a63]" />
    <span className="text-sm text-[#28251d]">Edit profile</span>
  </Link>

  {/* EARNINGS */}
  <Link
    href="/dashboard/author/earnings"
    className="flex items-center gap-3 px-3 h-[42px] rounded-lg border border-[#e5e2dc] bg-white hover:bg-[#f3f2ef] transition"
  >
    <span className="text-sm">💰</span>
    <span className="text-sm text-[#28251d]">Earnings</span>
  </Link>

  {/* PAYOUT */}
  <Link
    href="/dashboard/author/payout-settings"
    className="flex items-center gap-3 px-3 h-[42px] rounded-lg border border-[#e5e2dc] bg-white hover:bg-[#f3f2ef] transition"
  >
    <span className="text-sm">🏦</span>
    <span className="text-sm text-[#28251d]">Payout settings</span>
  </Link>

</div>

</div>

            {/* MESSAGES */}
          {/* Recent Messages */}
<div className="bg-[#f9f8f5] border border-[#dcd9d5] rounded-xl p-5">

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
  <div className="space-y-4">
    {recentMessages.map((message) => (
      <div
        key={message.id}
        className="flex items-start gap-3"
      >

        {/* AVATAR */}
        <img
          src={message.other_user.avatar}
          alt={message.other_user.name}
          className="h-9 w-9 rounded-full object-cover border border-[#e5e2dc]"
        />

        {/* CONTENT */}
        <div className="flex-1 min-w-0">

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#28251d]">
              {message.other_user.name}
            </p>

            {message.unread && (
              <span className="h-2 w-2 bg-[#01696f] rounded-full"></span>
            )}
          </div>

          <p className="text-xs text-[#6e6a63] truncate">
            {message.content}
          </p>

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