import EditMaintenancePage from "@/components/pages/portal/system-maintenance/edit/[id]/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AFFIN BANK Onboarding",
  description: "Edit maintenance page for user management portal",
};

export default function ViewMaintenance() {
  return <EditMaintenancePage />;
}
