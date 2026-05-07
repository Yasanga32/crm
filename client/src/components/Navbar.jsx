'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  
  const isActive = (path) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-12">
            <Link href="/dashboard" className="flex items-center gap-2 group transition-all">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                <LayoutDashboard className="text-white" size={22} />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter">
                Lead<span className="text-indigo-600">Flow</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link 
                href="/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname === '/dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link 
                href="/dashboard/leads"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname.startsWith('/dashboard/leads') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                <Users size={18} />
                Leads
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-bold text-sm active:scale-95"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
