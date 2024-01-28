import RequestOnboardingPage from '@/components/pages/portal/onboarding/request/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Maintenance',
  description: 'Request maintenance page for user management portal',
};

export default function RequestMaintenance() {
  return <RequestOnboardingPage />;
}
