import SearchClient from './SearchClient';

export const metadata = {
  title: 'Find Experts',
  description: 'Browse and connect with experts across categories.',
  alternates: { canonical: '/search' },
};

export default function Page() {
  return <SearchClient />;
}