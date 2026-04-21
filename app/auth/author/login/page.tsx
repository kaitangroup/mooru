import LoginClient from './LoginClient';

export const metadata = {
  title: 'Login',
  description: 'Login to your account',
  alternates: { canonical: '/login' },
};

export default function Page() {
  return <LoginClient />;
}