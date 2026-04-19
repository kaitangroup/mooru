import AboutClient from './AboutClient';

export const metadata = {
  title: 'About Us',
  description: 'Browse and connect with experts across categories.',
  alternates: { canonical: '/search' },
};

export default function Page() {
  return <AboutClient />;
}