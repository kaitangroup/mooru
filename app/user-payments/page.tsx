'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { wpFetch } from '@/lib/wpApi';

type Payment = {
  id: number;
  amount: number;
  date: string;
  status: string;
  description: string;
};

export default function UserPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const res = await wpFetch('/wp-json/guroos/v1/user-payments');
        setPayments(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f8f5] text-[#28251d]">
      <Header />

      <div className="max-w-[1100px] mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="mb-10">
          <span className="inline-block text-xs font-semibold bg-[#d7e7e5] text-[#01696f] px-3 py-1 rounded-full uppercase">
            Payments
          </span>

          <h1 className="text-3xl font-semibold mt-3">
            Your payments
          </h1>

          <p className="text-[#6e6a63] mt-2">
            Track all your completed and pending payments.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white border border-[#e5e2dc] rounded-2xl p-6 shadow-sm">

          {loading && (
            <p className="text-[#6e6a63]">Loading payments...</p>
          )}

          {!loading && payments.length === 0 && (
            <p className="text-[#6e6a63]">
              No payments found
            </p>
          )}

          {!loading && payments.length > 0 && (
            <div className="divide-y">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-4"
                >
                  {/* LEFT */}
                  <div>
                    <p className="font-medium">
                      {p.description}
                    </p>
                    <p className="text-sm text-[#6e6a63]">
                      {p.date}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right">
                    <p className="font-semibold">
                      ${p.amount}
                    </p>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        p.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* BACK LINK */}
        <div className="mt-6">
          <Link
            href="/dashboard/student"
            className="text-sm text-[#01696f] hover:underline"
          >
            ← Back to dashboard
          </Link>
        </div>

      </div>

      <Footer />
    </div>
  );
}