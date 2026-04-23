import UpdateProfile from './UpdateProfile';

export const metadata = {
  title: 'Update Profile',
  description: 'Update your profile information, personal details, and account settings on Guroos.',
  alternates: { canonical: '/profile/edit' },
};

export default function Page() {
  return <UpdateProfile />;
}