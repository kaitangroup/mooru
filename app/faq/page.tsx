import FaqClient from './FaqClient';

export const metadata = {
  title: 'FAQ',
  description: 'Find answers to common questions about using Guroos.',
  alternates: { canonical: '/faq' },
};

export default function Page() {
  return <FaqClient />;
}