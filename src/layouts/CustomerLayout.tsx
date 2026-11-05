import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavBar } from '../components/common/TopNavBar';
import { Footer } from '../components/common/Footer';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col font-sans">
      <TopNavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
