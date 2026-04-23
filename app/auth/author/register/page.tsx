import RegisterClient from './RegisterClient';

export const metadata = {
  title: 'Expert Register',
  description: 'Create a new author account on Guroos to start managing your content, bookings, and earnings.',
  alternates: { canonical: '/auth/author/register' },
};

export default function Page() {
  return <RegisterClient />;
}