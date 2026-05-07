'use client';
import React from 'react';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <main className="animate-in">
          {children}
        </main>
      </div>
    </div>
  );
}
