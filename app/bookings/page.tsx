import BookingsClient from './BookingsClient';

export const metadata = {
  title: 'Bookings',
  description: 'View and manage your bookings, appointments, and reservations on Guroos.',
  alternates: { canonical: '/bookings' },
};

export default function Page() {
  return <BookingsClient />;
}