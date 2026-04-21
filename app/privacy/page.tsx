import PrivacyClient from './PrivacyClient';

export const metadata = {
  title: 'Privacy',
  description: 'Privacy policy of Guroos.',
  alternates: { canonical: '/privacy' },
};

export default function Page() {
  return <PrivacyClient />;
}