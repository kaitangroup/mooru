import StudentDashboard from './StudentDashboard';

export const metadata = {
  title: 'Student Dashboard',
  description: 'Access your student dashboard to manage your courses, activities, and account information.',
  alternates: { canonical: '/dashboard/student' },
};

export default function Page() {
  return <StudentDashboard />;
}