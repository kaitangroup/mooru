// app/author/dashboard/layout.tsx
'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function AuthorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowed={['author']} redirectTo="/">
      <div className="min-h-screen bg-[#f7f6f2]">
        <Header />
        <main className="py-8 px-4 max-w-[1120px]  mx-auto">
          {children}
        </main>
        <Footer />
      </div>
    </RoleGuard>
  );
}
