import TutorApplicationPage from './TutorApplicationPage';

export const metadata = {
  title: 'Update Profile',
  description: 'Update your expert profile, subjects, and availability on Guroos.',
  alternates: { canonical: '/profile/edit' },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <TutorApplicationPage />;
}