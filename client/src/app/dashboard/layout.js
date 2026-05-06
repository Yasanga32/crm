'use client';
import React from 'react';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}
