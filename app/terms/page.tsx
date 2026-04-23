import TermsClient from './TermsClient';

export const metadata = {
  title: 'Terms',
  description: 'Read the terms and conditions for using Guroos, including user responsibilities, policies, and service guidelines.',
  alternates: { canonical: '/terms' }, // also fix this
};

export default function Page() {
  return <TermsClient />;
}