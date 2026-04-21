'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send, MoreVertical, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import {
  acGetMessages,
  acSendMessage,
  ACMessage,
  ConversationItem,
  buildConversationFromMessages,
  WP_API_BASE,
} from '@/lib/authorconnect';

/* ================= Utils ================= */
type WPUserLite = { id: number; name: string; avatar?: string , role?: string, thread_id: number; };
type ConvWithPresence = ConversationItem & {
  isActive: boolean;
  hasMessages?: boolean;
  unread?: boolean;
  role?: string;
};

function initials(name?: string) {
  if (!name) return '?';
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase() || name[0]?.toUpperCase() || '?';
}

/* ======== Local API helpers ======== */
async function ensureOk(res: Response, label: string) {
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`${label} (${res.status}): ${t || res.statusText}`);
  }
}

async function updateMessageAPI(id: number, content: string, token: string, otherUserId: number) {
  const url = `${WP_API_BASE}/authorconnect/v1/messages/${id}?other_user=${otherUserId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ content }),
  });
  await ensureOk(res, 'Update message failed');
  return res.json() as Promise<{ status: string; id: number; content: string }>;
}

async function deleteMessageAPI(id: number, token: string, otherUserId: number) {
  const url = `${WP_API_BASE}/authorconnect/v1/messages/${id}?other_user=${otherUserId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  await ensureOk(res, 'Delete message failed');
  return res.json() as Promise<{ status: string; id: number }>;
}

function onComposerKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
  if (e.nativeEvent?.isComposing) return;
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
  }
}

/* ================= Page ================= */
export default function MessagesPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const onlyUserParam = searchParams.get('to'); // /messages?to=123
  const onlyUserId = onlyUserParam ? Number(onlyUserParam) : null;

  // আমার ইউজার (/me)
  const [myId, setMyId] = useState<number | null>(null);
  const [myName, setMyName] = useState<string>('');
  const [myAvatar, setMyAvatar] = useState<string>('');

  // লেফট সাইড
  const [users, setUsers] = useState<WPUserLite[]>([]);
  const [conversations, setConversations] = useState<ConvWithPresence[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // রাইট সাইড (চ্যাট)
  const [messages, setMessages] = useState<ACMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const composeRef = useRef<HTMLTextAreaElement | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // মেনু/এডিট স্টেট
  const [menuFor, setMenuFor] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // unread ট্র্যাকিং
  const [lastSeenAt, setLastSeenAt] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem('ac_last_seen') || '{}'); } catch { return {}; }
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ac_last_seen', JSON.stringify(lastSeenAt));
    }
  }, [lastSeenAt]);

  useEffect(() => {
    setToken(localStorage.getItem('wpToken'));
  }, [session, status]);

  /* ===== /me ===== */
  useEffect(() => {
    let alive = true;
    if (!token) { setMyId(null); setMyName(''); setMyAvatar(''); return () => { alive = false; }; }

    (async () => {
      try {
        const res = await fetch(`${WP_API_BASE}/authorconnect/v1/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await ensureOk(res, '/me failed');
        const me = await res.json();
        if (!alive) return;
        setMyId(me?.id ?? null);
        setMyName(me?.name ?? '');
        setMyAvatar(me?.avatar ?? '');
      } catch (err: any) {
        if (!alive) return;
        console.error(err);
        toast.error(err?.message || 'Failed to load current user');
      }
    })();

    return () => { alive = false; };
  }, [token]);

  /* ===== Users (sidebar) ===== */
useEffect(() => {
  if (!token) return;
  let mounted = true;

  (async () => {
    try {
      // Build URL and include ?to=<id> when present
      const usersUrl = new URL(`${WP_API_BASE}/authorconnect/v1/users`);
      if (onlyUserId) usersUrl.searchParams.set('to', String(onlyUserId));

      const res = await fetch(usersUrl.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      await ensureOk(res, '/users failed');
      const data = await res.json();
      const list: WPUserLite[] = (data?.users || []).map((u: any) => ({
        id: u.id, name: u.name, avatar: u.avatar,role: u.role,
      }));

      if (!mounted) return;

      if (onlyUserId) {
        const target = list.find(u => u.id === onlyUserId);
        const merged: WPUserLite[] = target
          ? [target, ...list.filter(u => u.id !== onlyUserId)]
          : [{ id: onlyUserId, name: '(loading...)', avatar: '', thread_id: 0 }, ...list];
        setUsers(merged);
        setSelectedUserId(prev => prev ?? onlyUserId);
      } else {
        setUsers(list);
        setSelectedUserId(prev => prev ?? (list[0]?.id ?? null));
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Failed to load users');
    }
  })();

  return () => { mounted = false; };
}, [token, onlyUserId]);


  /* ===== Conversations (only with messages) ===== */
  /* ===== Conversations (sidebar metadata; no message fetching here) ===== */
useEffect(() => {
  if (!token || users.length === 0) return;

  // Build shallow list from users only (no per-user message fetch).
  const list: ConvWithPresence[] = users.map((u) => ({
    // The ConversationItem fields that buildConversationFromMessages would set
    thread_id: u.thread_id, // Include thread_id to satisfy the ConversationItem type
    userId: u.id,
    participant: u.name,
    role: u.role,
    avatar: u.avatar || '',
    lastMessage: '',       // unknown until thread is opened
    timestamp: '',         // unknown until thread is opened
    // Presence/flags we can best-effort guess (or leave false)
    isActive: false,
    hasMessages: undefined,
    unread: false,
  }));

  // Optional: if URL param points to a user not in the fetched list yet,
  // ensure they still appear at the top (already handled in your users effect).
  setConversations(list);
}, [token, users]);

/* ===== After messages load, backfill that conversation's preview/unread ===== */
useEffect(() => {
  if (!selectedUserId) return;
  if (!messages.length) {
    // If empty, still mark unread=false & clear preview
    setConversations((prev) =>
      prev.map((c) =>
        c.userId === selectedUserId
          ? { ...c, lastMessage: '', timestamp: '', unread: false, hasMessages: false }
          : c
      )
    );
    return;
  }

  const selUser = users.find((u) => u.id === selectedUserId);
  if (!selUser) return;

  // Build preview from the messages we *just* fetched for this user
  const conv = buildConversationFromMessages(
    selUser.thread_id,
    selUser.id,
    selUser.name,
    selUser.role ?? '', 
    selUser.avatar,
    messages
  );



  // Compute unread for the selected user based on lastSeenAt
  const last = messages[messages.length - 1];
  const seenISO = lastSeenAt[String(selectedUserId)];
  let unread = false;
  if (last && myId != null && last.from !== myId && last.timestamp) {
    if (!seenISO || new Date(seenISO) < new Date(last.timestamp)) unread = true;
  }

  setConversations((prev) =>
    prev.map((c) =>
      c.userId === selectedUserId
        ? { ...c, ...conv, hasMessages: true, unread }
        : c
    )
  );
}, [messages, selectedUserId, users, myId, lastSeenAt]);



  /* ===== Thread load + polling ===== */
  useEffect(() => {
    if (selectedUserId == null || !token) return;
    const userId = selectedUserId;
    let mounted = true;

    const loadThread = async (initial = false) => {
      try {
        if (initial) setLoading(true);
        const data = await acGetMessages(userId, 'ASC', token);
        if (!mounted) return;
        setMessages(data.messages || []);
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message || 'Failed to load messages');
      } finally {
        if (initial) setLoading(false);
      }
    };

    loadThread(true);

    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => loadThread(false), 5000);

    return () => {
      mounted = false;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [selectedUserId, token]);

  

  /* ===== unread → read ===== */
  useEffect(() => {
    if (!selectedUserId) return;
    if (!messages.length) return;
    const last = messages[messages.length - 1];
    if (!last?.timestamp) return;

    setLastSeenAt((prev) => ({ ...prev, [String(selectedUserId)]: last.timestamp ?? '' }));

    setConversations((prev) =>
      prev.map((c) => (c.userId === selectedUserId ? { ...c, unread: false } : c))
    );
  }, [messages, selectedUserId]);

  /* ===== Send / Update ===== */
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUserId || !token || myId == null) return;

    const text = newMessage.trim();
    if (!text) return;

    if (editingId) {
      try {
        setSending(true);
        const r = await updateMessageAPI(editingId, text, token, selectedUserId);
        setMessages(prev => prev.map(m => (m.id === editingId ? { ...m, id: r.id, content: r.content } : m)));
        setEditingId(null);
        setNewMessage('');
        toast.success('Message updated');
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message || 'Update failed');
      } finally {
        setSending(false);
      }
      return;
    }

    setSending(true);
    const tempId = Date.now();
    const optimistic: ACMessage = {
      id: tempId,
      from: myId,
      to: selectedUserId,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await acSendMessage(selectedUserId, newMessage, token);
      setNewMessage('');
      toast.success('Message sent!');
      const convData = await acGetMessages(selectedUserId, 'ASC', token);
      setMessages(convData.messages || []);
    } catch (e: any) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      console.error(e);
      toast.error(e?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  }

  /* ===== Delete ===== */
  async function handleDelete(messageId: number) {
    if (!token || !selectedUserId) return;
    try {
      await deleteMessageAPI(messageId, token, selectedUserId);
      const data = await acGetMessages(selectedUserId, 'ASC', token);
      setMessages(data.messages || []);
      setMenuFor(null);
      toast.success('Message deleted');
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Delete failed');
    }
  }

  /* ===== Edit helpers ===== */
  function startEdit(m: ACMessage) {
    setEditingId(m.id);
    const plain = m.content.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
    setNewMessage(plain);
    setMenuFor(null);
    setTimeout(() => composeRef.current?.focus(), 0);
  }
  function cancelEdit() { setEditingId(null); setNewMessage(''); }

  /* ===== UI niceties ===== */
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = e.target as HTMLElement;
      if (!el.closest?.('[data-msg-menu]')) setMenuFor(null);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);




  

  const filteredConversations = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const base = conversations;
    if (!q) return base;
    return base.filter((c) => c.participant.toLowerCase().includes(q));
  }, [conversations, searchTerm]);

  const selectedConv = conversations.find(c => c.userId === selectedUserId);
  const selectedName = selectedConv?.participant || users.find(u => u.id === selectedUserId)?.name || '';
  const selectedAvatar = selectedConv?.avatar || users.find(u => u.id === selectedUserId)?.avatar || '';

  useEffect(() => {
    if (!selectedConv || !token) return;
  
    fetch(`${WP_API_BASE}/authorconnect/v1/thread/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        thread_id: selectedConv.thread_id, // ✅ correct
      }),
    }).catch(() => {});
  }, [selectedConv?.thread_id]);

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <Header />
  
      <div className="py-6 px-3 sm:py-10 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
  
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="font-[var(--font-display)] text-[clamp(1.8rem,2.5vw,2.4rem)] text-[#28251d]">
              Messages
            </h1>
            <p className="text-[#6e6a63] text-sm">
              Communicate with your experts and users.
            </p>
          </div>
  
          {/* MAIN GRID */}
          <div className="  grid lg:grid-cols-3 gap-5">
  
            {/* ================= LEFT: CONVERSATIONS ================= */}
            <div className={`${selectedUserId ? 'hidden lg:block' : ''}`}>
  
              <div className="h-full flex flex-col bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition">
  
                {/* HEADER */}
                <div className="p-4 border-b border-[#e5e2dc]">
                  <h3 className="font-semibold text-[#28251d] mb-3">
                    Conversations
                  </h3>
  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a29e] h-4 w-4" />
                    <input
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 h-[40px] rounded-lg border border-[#e5e2dc] bg-white text-sm outline-none focus:ring-1 focus:ring-[#01696f]"
                    />
                  </div>
                </div>
  
                {/* LIST */}
                <div className="flex-1 overflow-y-auto">
  
                  {filteredConversations.map((item) => {
                    const isUnread = !!item.unread;
  
                    return (
                      <button
                        key={item.userId}
                        onClick={() => setSelectedUserId(item.userId)}
                        className={`w-full text-left px-4 py-3 border-b border-[#eee] transition ${
                          selectedUserId === item.userId
                            ? 'bg-[#eef4f3]'
                            : 'hover:bg-[#f3f2ef]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
  
                          <img
                            src={item.avatar}
                            className="h-10 w-10 rounded-full object-cover border border-[#e5e2dc]"
                          />
  
                          <div className="flex-1 min-w-0">
  
                            <div className="flex justify-between items-center">
                              <p className={`text-sm ${
                                isUnread ? 'font-semibold text-[#28251d]' : 'text-[#28251d]'
                              }`}>
                                {item.participant}
                              </p>
  
                              <span className="text-xs text-[#a8a29e]">
                                {item.timestamp}
                              </span>
                            </div>
  
                            <p className={`text-xs truncate mt-1 ${
                              isUnread
                                ? 'text-[#28251d] font-medium'
                                : 'text-[#6e6a63]'
                            }`}>
                              {item.lastMessage}
                            </p>
  
                          </div>
  
                          {isUnread && (
                            <span className="h-2 w-2 bg-[#01696f] rounded-full mt-2" />
                          )}
                        </div>
                      </button>
                    );
                  })}
  
                  {filteredConversations.length === 0 && (
                    <div className="p-5 text-sm text-[#6e6a63]">
                      No conversations found.
                    </div>
                  )}
  
                </div>
              </div>
            </div>
  
            {/* ================= RIGHT: CHAT ================= */}
            <div className={`${selectedUserId ? '' : 'hidden lg:block'} lg:col-span-2`}>
  
              <div className="h-full flex flex-col bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition">
  
                {selectedUserId ? (
                  <>
                    {/* HEADER */}
                    <div className="border-b border-[#e5e2dc] p-4 flex items-center justify-between">
  
                      <div className="flex items-center gap-3">
  
                        <button
                          onClick={() => setSelectedUserId(null)}
                          className="lg:hidden p-2 rounded hover:bg-[#f3f2ef]"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </button>
  
                        <img
                          src={selectedAvatar}
                          className="h-10 w-10 rounded-full border border-[#e5e2dc]"
                        />
  
                        <div>
                          <p className="font-medium text-[#28251d]">
                            {selectedName || 'Loading...'}
                          </p>
                          <p className="text-xs text-[#6e6a63]">
                            {selectedConv?.role || 'Active'}
                          </p>
                        </div>
                      </div>
  
                      <MoreVertical className="h-4 w-4 text-[#6e6a63]" />
                    </div>
  
                    {/* MESSAGES */}
                    <div
                      ref={scrollRef}
                       className="flex-1 overflow-y-auto p-4 space-y-1"
                    >
                      {loading ? (
                        <p className="text-sm text-[#6e6a63]">
                          Loading messages...
                        </p>
                      ) : (
                        <>
                         {messages.map((m, index) => {
  const isMine = myId != null && m.from === myId;

  const prev = messages[index - 1];
  const next = messages[index + 1];

  const isFirst = !prev || prev.from !== m.from;
  const isLast = !next || next.from !== m.from;

  return (
    <div
      key={m.id}
      className={`flex ${isMine ? 'justify-end' : 'justify-start'} ${
        isFirst ? 'mt-3' : 'mt-1'
      }`}
    >
      <div className="max-w-[78%] flex flex-col">

        {/* BUBBLE */}
        <div
          className={`px-4 py-2 text-sm leading-relaxed shadow-sm ${
            isMine
  ? `bg-[#0f766e] text-white shadow-md 
     px-4 py-2 min-w-[80px] max-w-[75%]
     rounded-2xl rounded-br-sm`
              : `bg-white border border-[#e5e2dc] text-[#28251d] ${
                  isFirst
                    ? 'rounded-2xl rounded-bl-md'
                    : 'rounded-2xl rounded-bl-sm'
                }`
          }`}
        >
          <p
  className={`whitespace-pre-wrap break-words ${
    isMine ? 'text-white' : 'text-[#28251d]'
  }`}
  dangerouslySetInnerHTML={{ __html: m.content }}
/>
        </div>

        {/* TIMESTAMP (only last in group) */}
        {isLast && (
          <span
            className={`text-[11px] mt-1 ${
              isMine ? 'text-right' : 'text-left'
            } text-[#a8a29e]`}
          >
            {m.timestamp
              ? new Date(m.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </span>
        )}
      </div>
    </div>
  );
})}
  
                          {messages.length === 0 && (
                            <div className="text-center text-[#6e6a63] text-sm">
                              No messages yet. Say hello 👋
                            </div>
                          )}
                        </>
                      )}
                    </div>
  
                    {/* INPUT */}
                    <div className="border-t border-[#e5e2dc] px-4 py-3 bg-[#f9f8f5] flex items-center">
                      {token ? (
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full">
<div className="flex items-center w-full border border-[#01696f] rounded-full px-4 h-[48px]">
<textarea
  value={newMessage}
  ref={composeRef}
  onKeyDown={onComposerKeyDown}
  onChange={(e) => setNewMessage(e.target.value)}
  className="
    w-full 
    bg-transparent 
    outline-none 
    resize-none 
    text-sm 
    leading-normal
  "
  rows={1}
  placeholder={editingId ? 'Edit your message…' : 'Type your message...'}
/>
</div>
                      
<button
  type="submit"
  disabled={!newMessage.trim() || sending}
  className="bg-[#01696f] text-white h-[40px] w-[40px] rounded-full flex items-center justify-center shadow-sm"
>
  <Send className="h-4 w-4" />
</button>
                      
                      </form>
                      ) : (
                        <p className="text-sm text-[#6e6a63]">
                          Please sign in to send messages.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div>
                      <p className="text-[#28251d] font-medium">
                        No conversation selected
                      </p>
                      <p className="text-sm text-[#6e6a63]">
                        Choose a conversation to start messaging.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
  
          </div>
        </div>
      </div>
  
      <Footer />
    </div>
  );
}
