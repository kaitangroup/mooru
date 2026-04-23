import LoginClient from './LoginClient';

export const metadata = {
  title: 'Login',
  description: 'Log in to your Guroos account to access your dashboard, bookings, messages, and account settings.',
  alternates: { canonical: '/auth/author/login' },
};

export default function Page() {
  return <LoginClient />;
}