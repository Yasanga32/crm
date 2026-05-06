"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, LogOut, Users, Target, CheckCircle, XCircle, DollarSign, Briefcase } from 'lucide-react';
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const StatCard = ({ label, value, icon: Icon, color, subValue }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          <Icon className={`${color.replace('bg-', 'text-')} w-6 h-6`} />
        </div>
      </div>
      <div className="h-1 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: '60%' }}></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-slate-400 animate-pulse font-medium">Gathering insights...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="text-indigo-500 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-slate-400 text-sm font-medium">Welcome back, <span className="text-indigo-400">{userInfo?.name}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/leads"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all font-semibold shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Users className="w-4 h-4" />
            <span>Manage Leads</span>
          </Link>
          <button 
            onClick={logout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-3 rounded-xl transition-all font-semibold border border-red-500/20 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
          <XCircle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Leads" 
          value={stats?.totalLeads || 0} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          label="New Leads" 
          value={stats?.statusCounts?.New || 0} 
          icon={Target} 
          color="bg-indigo-500" 
        />
        <StatCard 
          label="Qualified" 
          value={stats?.statusCounts?.Qualified || 0} 
          icon={Briefcase} 
          color="bg-amber-500" 
        />
        <StatCard 
          label="Won Deals" 
          value={stats?.statusCounts?.Won || 0} 
          icon={CheckCircle} 
          color="bg-emerald-500" 
        />
        <StatCard 
          label="Lost Deals" 
          value={stats?.statusCounts?.Lost || 0} 
          icon={XCircle} 
          color="bg-red-500" 
        />
        <div className="md:col-span-1 lg:col-span-2">
           <StatCard 
            label="Total Deal Value" 
            value={formatCurrency(stats?.totalValue || 0)} 
            icon={DollarSign} 
            color="bg-blue-600" 
            subValue="Total pipeline value from all leads"
          />
        </div>
        <StatCard 
          label="Won Revenue" 
          value={formatCurrency(stats?.wonValue || 0)} 
          icon={CheckCircle} 
          color="bg-emerald-600" 
          subValue="Revenue from closed-won deals"
        />
      </div>
    </div>
  );
}
