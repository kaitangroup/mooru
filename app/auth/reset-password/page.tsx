import ResetPassword from './ResetPassword';

export const metadata = {
  title: 'Reset Password',
  description: 'Reset your password to regain access to your Guroos account.',
  alternates: { canonical: '/auth/forgot-password' },
};

export default function Page() {
  return <ResetPassword />;
}