import BooksClient from './BooksClient';

export const metadata = {
  title: 'Books',
  description: 'Browse and manage books available on Guroos.',
  alternates: { canonical: '/books' },
};

export default function Page() {
  return <BooksClient />;
}