"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, Users, Target, CheckCircle, XCircle, DollarSign, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getDashboardStats } from '@/api/dashboard';

export default function Dashboard() {
  const { userInfo } = useAuth();
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

  const StatCard = ({ label, value, icon: Icon, color, subValue, percentage = 60 }) => (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.replace('bg-', '')} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Live Data <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-bold mb-1 uppercase tracking-tight">{label}</p>
        <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
        {subValue && <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">{subValue}</p>}
      </div>
      <div className="h-1.5 w-full bg-slate-50 rounded-full mt-6 overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-50 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-slate-900">Synchronizing Workspace</h3>
          <p className="text-slate-500 font-medium animate-pulse">Aggregating your sales intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-100">
            <Sparkles size={12} />
            Command Center
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Hello, <span className="text-indigo-600">{userInfo?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 font-medium">Here's a strategic overview of your sales performance today.</p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-5 rounded-2xl flex items-center gap-4 animate-in">
          <div className="p-2 bg-rose-100 rounded-xl">
            <XCircle size={20} />
          </div>
          <p className="font-bold">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Prospects"
          value={stats?.totalLeads || 0}
          icon={Users}
          color="bg-indigo-600"
          percentage={100}
        />
        <StatCard
          label="New Leads"
          value={stats?.statusCounts?.New || 0}
          icon={Target}
          color="bg-amber-500"
          percentage={(stats?.statusCounts?.New / stats?.totalLeads * 100) || 0}
        />
        <StatCard
          label="Qualified"
          value={stats?.statusCounts?.Qualified || 0}
          icon={Sparkles}
          color="bg-violet-500"
          percentage={(stats?.statusCounts?.Qualified / stats?.totalLeads * 100) || 0}
        />
        <StatCard
          label="Won Deals"
          value={stats?.statusCounts?.Won || 0}
          icon={CheckCircle}
          color="bg-emerald-500"
          percentage={(stats?.statusCounts?.Won / stats?.totalLeads * 100) || 0}
        />
        <StatCard
          label="Lost Deals"
          value={stats?.statusCounts?.Lost || 0}
          icon={XCircle}
          color="bg-rose-500"
          percentage={(stats?.statusCounts?.Lost / stats?.totalLeads * 100) || 0}
        />
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:text-slate-100/50 transition-colors pointer-events-none">
              <DollarSign size={120} strokeWidth={1} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global Pipeline Value</h3>
                  <p className="text-3xl font-extrabold text-slate-900 mt-1">Rs. {stats?.totalValue || 0}</p>
                </div>
              </div>
              <p className="text-slate-500 font-medium max-w-md leading-relaxed">
                Aggregated valuation of all active and historical opportunities across your organizational ecosystem.
              </p>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qualified Value</p>
                  <p className="text-lg font-bold text-indigo-600">Rs. {(stats?.statusCounts?.Qualified || 0) * 1000}*</p>
                </div>
                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Projection</p>
                  <p className="text-lg font-bold text-emerald-600">+12%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10 space-y-4">
            <div className="p-3 bg-white/20 rounded-2xl w-fit">
              <Sparkles size={24} />
            </div>
            <h3 className="text-lg font-bold tracking-tight">Revenue Realized</h3>
            <div className="space-y-1">
              <p className="text-4xl font-black">Rs. {stats?.wonValue || 0}</p>
              <p className="text-indigo-100/60 text-xs font-bold uppercase tracking-widest">Confirmed Growth</p>
            </div>
          </div>
          <Link
            href="/dashboard/leads?status=Won"
            className="relative z-10 mt-8 flex items-center justify-between group/btn"
          >
            <span className="font-bold text-sm">View closed deals</span>
            <div className="p-2 bg-white/10 rounded-lg group-hover/btn:bg-white/20 transition-colors">
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
