import ForgotPassword from './ForgotPassword';

export const metadata = {
  title: 'Forgot Password',
  description: 'Reset your password to regain access to your Guroos account.',
  alternates: { canonical: '/auth/forgot-password' },
};

export default function Page() {
  return <ForgotPassword />;
}