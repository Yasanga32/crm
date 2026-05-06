"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, LogOut, Users } from 'lucide-react';
import Link from 'next/link';
import { getDashboardStats } from '@/api/dashboard';

export default function Dashboard() {
  const { userInfo, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading stats...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="text-indigo-500 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 text-sm">Welcome back, {userInfo?.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/leads"
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl transition-all font-medium shadow-lg shadow-indigo-500/20"
          >
            <Users className="w-4 h-4" />
            <span>Manage Leads</span>
          </Link>
          <button 
            onClick={logout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-5 py-2.5 rounded-xl transition-all font-medium border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Simple Stats Cards */}
        {[
          { label: 'Total Leads', value: '124', color: 'bg-blue-500' },
          { label: 'Active Deals', value: '45', color: 'bg-emerald-500' },
          { label: 'Tasks Due', value: '12', color: 'bg-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            <div className={`h-1.5 w-12 ${stat.color} rounded-full mt-4`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
