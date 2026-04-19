import ContactPage from './ContactPage';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Guroos team for support, inquiries, or feedback.',
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return <ContactPage />;
}