import EditOnboardingPage from '@/components/pages/portal/onboarding/edit/[id]/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Maintenance',
  description: 'Request maintenance page for user management portal',
};

export default function RequestMaintenance() {
  return <EditOnboardingPage />;
}
