export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import ContactPageView from '@/components/contact/ContactPageView';

export default async function ContactPage() {
  return <ContactPageView />;
}
