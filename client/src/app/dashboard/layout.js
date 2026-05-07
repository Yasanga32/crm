'use client';
import React from 'react';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <main className="animate-in">
          {children}
        </main>
      </div>
    </div>
  );
}
