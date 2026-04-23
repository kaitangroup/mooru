import MessagesClient from './MessagesClient';

export const metadata = {
  title: 'Messages',
  description: 'View and manage your messages and conversations on Guroos.',
  alternates: { canonical: '/messages' },
};

export default function Page() {
  return <MessagesClient />;
}