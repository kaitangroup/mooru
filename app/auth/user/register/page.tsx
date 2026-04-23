import RegisterUser from './RegisterUser';

export const metadata = {
  title: 'User Register',
  description: 'Create a new author account on Guroos to start managing your content, bookings, and earnings.',
  alternates: { canonical: '/auth/user/register' },
};

export default function Page() {
  return <RegisterUser />;
}