import React from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import MobileHeader from './MobileHeader';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen font-sans">
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <Sidebar />
      </div>

      <MobileHeader />

      {/* The main content area now needs top padding on mobile to not be obscured by the fixed MobileHeader.
          Header height is roughly 132px. pt-36 (144px) should be safe.
      */}
      <main className="flex-1 pt-36 pb-16 md:pt-0 md:pb-0 md:ml-64 bg-gray-50 overflow-y-auto">
        <div className="p-4 md:p-8">
            {children}
        </div>
      </main>
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
