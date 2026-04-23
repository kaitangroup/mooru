import ExpertDashboard from './ExpertDashboard';

export const metadata = {
  title: 'Expert Dashboard',
  description: 'Access your Expert Dashboard to manage content, earnings, and account settings.',
  alternates: { canonical: '/dashboard/author' },
};

export default function Page() {
  return <ExpertDashboard />;
}