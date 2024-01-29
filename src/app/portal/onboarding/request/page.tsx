import RequestOnboardingPage from "@/components/pages/portal/onboarding/request/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AFFIN BANK Onboarding",
  description: "Request maintenance page for user management portal",
};

export default function RequestMaintenance() {
  return <RequestOnboardingPage />;
}
