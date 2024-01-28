'use client';

// Components
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import DashboardPage from '@/components/pages/dashboard/page';

export default function Home() {
  // usePermission();
  return (
    <>
      <div className="flex">
        <Sidebar />
        <main className="flex-grow overflow-x-hidden bg-[#f5f7fb] h-screen bg-forgotten">
          <Topbar />
          <DashboardPage />
        </main>
      </div>
    </>
  );
}
